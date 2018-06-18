function getListOfMutualSongs(spotifyApi, friendsUserID, setLoadingStatus) {
	let loadingStatus = getInitialLoadingStatus([
		/* PHASE LIST */
		/* 0 */ "Getting all of the songs on your playlists...",
		/* 1 */ "Scanning all of your saved tracks...",
		/* 2 */ "Loading all of the songs on your friend's public playlists...",
		/* 3 */ "Finding mutual songs..."
	]);
	setLoadingStatus(loadingStatus);

	let phases = [
		/* Phase 0 */ getThisUsersPlaylistSongs,
		/* Phase 1 */ getThisUsersSavedTracks,
		/* Phase 2 */ getFriendsPlaylistSongs
		/* Phase 3 doesn't have a call to spotify */
	];

	let phaseSongSets = [];
	let promise = Promise.resolve();

	// get all of the songs from spotify, phases 0, 1, and 2
	for (let i in phases) {
		let phaseFunction = phases[i];
		let phaseLoadingStatusFuncs = getPhaseLoadingStatusFuncs(
			i,
			loadingStatus,
			setLoadingStatus
		);

		promise = promise
			.then(() =>
				// run this phase's call to spotify
				phaseFunction(spotifyApi, phaseLoadingStatusFuncs, friendsUserID)
			)
			.then(songsFromSpotify => {
				// then, take the songs from the call and save them here
				phaseSongSets.push(songsFromSpotify);
			});
	}
	return promise.then(() => {
		/* PHASE 3 */
		/* find the mutual songs */

		let loading = getPhaseLoadingStatusFuncs(
			3,
			loadingStatus,
			setLoadingStatus
		);
		let status = loading.get();

		status.isActive = true;
		status.noBar = true;
		loading.update();

		let playlistSongSet = phaseSongSets[0];
		let savedSongSet = phaseSongSets[1];
		let friendsSongsSet = phaseSongSets[2];

		// combine all of the songs into one set
		let thisUsersSongsSet = concatSets(playlistSongSet, savedSongSet);

		// set the loading bar to halfway
		// (phase 3 stuff happens so fast this doesn't even have time to render)
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

function getFriendsPlaylistSongs(spotifyApi, loading, userIDofFriend) {
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
						return getSongsOfPlaylist(pl.owner.id, pl.id, spotifyApi, progress);
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

function getSongsOfPlaylist(userId, playlistId, spotifyApi, progress) {
	// the limit of 100 is the max the API allows for getPlaylistTracks
	return getTrackSet(
		options => spotifyApi.getPlaylistTracks(userId, playlistId, options),
		100,
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
		progress
	).then(passthrough => {
		status.isActive = false;
		status.isDone = true;
		loading.update();

		return passthrough;
	});
}

function getTrackSet(trackApiCall, limit, progress) {
	// get them once first, to get the total,
	// then make the required number of requests
	// to reach that total
	return trackApiCall({ limit }).then(dataFromSpotify => {
		let songs = new Set();

		let firstSongs = dataFromSpotify.items;
		addSongsToSet(songs, firstSongs);

		let totalNumberOfSongs = dataFromSpotify.total;

		let firstSongTitle =
			firstSongs &&
			firstSongs[0] &&
			firstSongs[0].track &&
			firstSongs[0].track.name
				? firstSongs[0].track.name
				: "";
		progress(firstSongs.length, totalNumberOfSongs, firstSongTitle);

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
					firstSongTitle =
						newSongs &&
						newSongs[0] &&
						newSongs[0].track &&
						newSongs[0].track.name
							? newSongs[0].track.name
							: "";
					progress(newSongs.length, totalNumberOfSongs, firstSongTitle);
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
	let nextPromise = Promise.resolve();
	for (let offset = 0; offset < songList.length; offset += 100) {
		let songsToAdd = songList.slice(offset, offset + 100);
		nextPromise = nextPromise.then(() =>
			spotifyApi.addTracksToPlaylist(userId, playlistId, songsToAdd)
		);
	}
	return nextPromise;
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

function wait(seconds) {
	// sorry it looks complicated... it just waits.
	// that's it. pinky swear.
	// https://stackoverflow.com/a/42529585
	return () => {
		return new Promise(resolve => setTimeout(() => resolve(), seconds * 1000));
	};
}

module.exports = { getListOfMutualSongs, addSongsToPlaylist };
