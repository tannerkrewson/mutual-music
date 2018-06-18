const WAIT_AFTER_PHASE = 2; // seconds

function getListOfMutualSongs(spotifyApi, friendsUserID, setLoadingStatus) {
	let loadingStatus = getInitialLoadingStatus([
		/* PHASE LIST */
		/* 0 */ "Getting all of the songs on your playlists...",
		/* 1 */ "Scanning all of your saved tracks...",
		/* 2 */ "Loading all of the songs on your friend's public playlists..."
	]);
	setLoadingStatus(loadingStatus);

	let phases = [
		/* Phase 0 */ getThisUsersPlaylistSongs,
		/* Phase 1 */ getThisUsersSavedTracks,
		/* Phase 2 */ getFriendsPlaylistSongs
	];

	let phaseSongSets = [];
	let promise = Promise.resolve();

	// get all of the songs from spotify, phases 0, 1, and 2
	for (let i in phases) {
		let phaseFunction = phases[i];
		let loading = getPhaseLoadingStatusFuncs(
			i,
			loadingStatus,
			setLoadingStatus
		);

		let status = loading.get();

		promise = promise
			.then(() => {
				// show the loading bar
				status.isActive = true;
				loading.update();
			})
			.then(() =>
				// run this phase's call to spotify
				phaseFunction(spotifyApi, loading, friendsUserID)
			)
			.then(songsFromSpotify => {
				// then, take the songs from the call and save them here
				phaseSongSets.push(songsFromSpotify);

				/* sometimes the number of songs we were expecting to get won't match the number of songs that we actually get. so this makes sure the loading bar is at 100% in that scenario */
				status.songsTotal = status.songsSoFar;
				status.subtitle = "Complete!";
				loading.update();
			})
			.then(
				// wait to make the UI feel more fluid
				wait(WAIT_AFTER_PHASE)
			)
			.then(songsFromSpotify => {
				// hide the loading bar
				status.isActive = false;
				status.isDone = true;
				loading.update();
			});
	}

	return promise.then(() => {
		/* PHASE 3 */
		/* find the mutual songs */
		/* phase 3 stuff happens too fast for the loading bar to matter, so we don't call it here */

		let playlistSongSet = phaseSongSets[0];
		let savedSongSet = phaseSongSets[1];
		let friendsSongsSet = phaseSongSets[2];

		// combine all of the songs into one set
		let thisUsersSongsSet = concatSets(playlistSongSet, savedSongSet);

		// find the mutual songs
		let mutualSet = getMutualSet(thisUsersSongsSet, friendsSongsSet);

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

						// called everytime a batch of new songs comes in from spotify.
						// updates the loading bar.
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
			return nextPromise.then(() => totalSet);
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

	// called everytime a batch of new songs comes in from spotify.
	// updates the loading bar.
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
	).then(passthrough => passthrough);
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

		// this is me singing Wish You Were Here to Lodash
		let firstSongNameValid =
			firstSongs &&
			firstSongs[0] &&
			firstSongs[0].track &&
			firstSongs[0].track.name;

		let firstSongTitle = firstSongNameValid
			? firstSongs[0].track.name
			: "songs";
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
