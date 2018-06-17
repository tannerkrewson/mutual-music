function getListOfMutualSongs(spotifyApi, friendsUserID, setLoadingStatus) {
	let loadingStatus = getInitialLoadingStatus([
		/* PHASE LIST */
		/* 0 */ "Getting all of the songs on your playlists...",
		/* 1 */ "Scanning all of your saved tracks...",
		/* 2 */ "Loading all of the songs on your friend's public playlists...",
		/* 3 */ "Finding mutual songs..."
	]);
	setLoadingStatus(loadingStatus);

	// get all of the songs from spotify, and find the mutuals
	let playlistSongSet, savedSongSet, thisUsersSongsSet, friendsSongsSet;
	let promise = Promise.resolve();
	return promise
		.then(() =>
			/* PHASE 0 */
			getThisUsersPlaylistSongs(
				spotifyApi,
				getPhaseLoadingStatusFuncs(0, loadingStatus, setLoadingStatus)
			)
		)
		.then(songsFromSpotify => {
			playlistSongSet = songsFromSpotify;
		})
		.then(() =>
			/* PHASE 1 */
			getThisUsersSavedTracks(
				spotifyApi,
				getPhaseLoadingStatusFuncs(1, loadingStatus, setLoadingStatus)
			)
		)
		.then(songsFromSpotify => {
			savedSongSet = songsFromSpotify;
		})
		.then(() =>
			/* PHASE 2 */
			getFriendsPlaylistSongs(
				spotifyApi,
				friendsUserID,
				getPhaseLoadingStatusFuncs(2, loadingStatus, setLoadingStatus)
			)
		)
		.then(songsFromSpotify => {
			friendsSongsSet = songsFromSpotify;
		})
		.then(data => {
			/* PHASE 3 */
			let loading = getPhaseLoadingStatusFuncs(
				3,
				loadingStatus,
				setLoadingStatus
			);
			let status = loading.get();

			status.isActive = true;
			status.noBar = true;
			loading.update();

			// combine all of the songs into one set
			thisUsersSongsSet = concatSets(playlistSongSet, savedSongSet);

			status.progress = 50;
			loading.update();

			// find the mutual songs
			let mutualSet = getMutualSet(thisUsersSongsSet, friendsSongsSet);

			status.isDone = true;
			status.isActive = false;
			status.progress = 100;
			loading.update();

			return mutualSet;
		});
}

function getThisUsersPlaylistSongs(spotifyApi, loading) {
	return getPlaylistSongsByUserID(spotifyApi, null, loading);
}

function getFriendsPlaylistSongs(spotifyApi, userIDofFriend, loading) {
	return getPlaylistSongsByUserID(spotifyApi, userIDofFriend, loading);
}

function getPlaylistSongsByUserID(spotifyApi, otherUserID, loading) {
	let status = loading.get();

	status.isActive = true;
	loading.update();

	return spotifyApi
		.getUserPlaylists(otherUserID)
		.then(function(dataFromSpotify) {
			let totalSet = new Set();
			let nextPromise = Promise.resolve();
			let allPlaylists = dataFromSpotify.items;

			let numPlaylists = allPlaylists.length;
			let numSongsInAllPlaylists = getTotalNumberOfSongs(allPlaylists);

			status.songsSoFar = 0;
			status.songsTotal = numSongsInAllPlaylists;
			loading.update();

			for (let i = 0; i < numPlaylists; i++) {
				let pl = allPlaylists[i];
				//const wasCreatedByThisUser = pl.owner.id === otherUserID || pl.owner.id === spotifyApi.id;
				nextPromise = nextPromise
					.then(() => {
						status.subtitle = "Checking " + pl.name;
						loading.update();

						let progress = numNewlyCompletedSongs => {
							status.songsSoFar += numNewlyCompletedSongs;
							loading.update();
						};

						// get a set of all of the songs in the playlist
						return getSongsOfPlaylist(
							pl.owner.id,
							pl.id,
							pl.tracks.total,
							spotifyApi,
							progress
						);
					})
					.then(plSet => {
						// add all of those songs to the totalSet
						concatSets(totalSet, plSet);
					});
			}
			return nextPromise.then(() => {
				status.isActive = false;
				status.isDone = true;
				loading.update();

				return totalSet;
			});
		});
}

function getSongsOfPlaylist(
	userId,
	playlistId,
	playlistLength,
	spotifyApi,
	progress
) {
	// the limit of 100 is the max the API allows for getPlaylistTracks
	return getTrackSet(
		options => spotifyApi.getPlaylistTracks(userId, playlistId, options),
		100,
		playlistLength,
		progress
	);
}

function getThisUsersSavedTracks(spotifyApi, loading) {
	let status = loading.get();

	status.isActive = true;
	loading.update();

	let progress = (numNewlyCompletedSongs, numTotalSongs, lastSongTitle) => {
		if (status.songsSoFar === -1) status.songsSoFar = 0;

		status.songsSoFar += numNewlyCompletedSongs;
		status.songsTotal = numTotalSongs;

		if (lastSongTitle) {
			status.subtitle = "Scanning " + lastSongTitle;
		}

		loading.update();
	};

	// the limit of 50 is the max the API allows for getMySavedTracks
	return getTrackSet(
		options => spotifyApi.getMySavedTracks(options),
		50,
		undefined,
		progress
	).then(passthrough => {
		status.isActive = false;
		status.isDone = true;
		loading.update();

		return passthrough;
	});
}

function getTrackSet(trackApiCall, limit, playlistLength, progress) {
	// get them once first, to get the total,
	// then make the required number of requests
	// to reach that total
	return trackApiCall({ limit }).then(dataFromSpotify => {
		let songs = new Set();

		let firstSongs = dataFromSpotify.items;
		addSongsToSet(songs, firstSongs);

		let totalNumberOfSongs = playlistLength
			? playlistLength
			: dataFromSpotify.total;

		progress(firstSongs.length, totalNumberOfSongs, firstSongs[0].track.name);

		// if we were able to get all of the songs already, because
		// the the number of songs was less than the limit for one
		// request
		if (totalNumberOfSongs <= limit) return songs;

		let nextPromise = Promise.resolve();

		for (let offset = limit; offset < totalNumberOfSongs; offset += limit) {
			nextPromise = nextPromise
				.then(() => {
					return trackApiCall({ offset, limit });
				})
				.then(data => {
					let newSongs = data.items;
					addSongsToSet(songs, newSongs);

					// increase the progress bar with the number of songs that came through in this call
					progress(newSongs.length, totalNumberOfSongs, newSongs[0].track.name);
				});
		}

		return nextPromise.then(() => songs);
	});

	function addSongsToSet(songsSet, newSongs) {
		for (let song of newSongs) {
			// this prevents local songs from polluting our sets
			if (song.track.id) {
				songsSet.add(song.track.id);
			}
		}
	}
}

function concatSets(set, setToAdd) {
	for (const item of setToAdd) {
		set.add(item);
	}
	return set;
}

function getMutualSet(set1, set2) {
	var res = [];
	for (const song of set1) {
		// if the other set has the key
		if (song && set2.has(song)) {
			res.push("spotify:track:" + song);
		}
	}
	return res;
}

function addSongsToPlaylist(userId, playlistId, songList, spotifyApi) {
	var promiseList = [];
	for (var offset = 0; offset < songList.length; offset += 100) {
		var songsToAdd = songList.slice(offset, offset + 100);
		promiseList.push(
			spotifyApi.addTracksToPlaylist(userId, playlistId, songsToAdd)
		);
	}
	return Promise.all(promiseList);
}

function getInitialLoadingStatus(statusList) {
	let res = [];
	for (let title of statusList) {
		res.push({
			title,
			subtitle: "",
			songsSoFar: -1,
			songsTotal: 0,
			isDone: false,
			isActive: false
		});
	}
	return res;
}

function getPhaseLoadingStatusFuncs(
	phaseNum,
	currentLoadingStatus,
	setLoadingStatus
) {
	return {
		get: () => {
			return currentLoadingStatus[phaseNum];
		},
		update: () => {
			setLoadingStatus(currentLoadingStatus);
		}
	};
}

function getTotalNumberOfSongs(playlists) {
	let count = 0;
	for (let pl of playlists) {
		count += pl.tracks.total;
	}
	return count;
}

module.exports = { getListOfMutualSongs, addSongsToPlaylist };
