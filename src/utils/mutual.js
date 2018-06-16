function getListOfMutualSongs(spotifyApi, friendsUserID) {
	let playlistSongSet, savedSongSet, thisUsersSongsSet, friendsSongsSet;
	return getThisUsersPlaylistSongs(spotifyApi)
		.then(data => {
			playlistSongSet = data;
		})
		.then(() => getThisUsersSavedTracks(spotifyApi))
		.then(data => {
			savedSongSet = data;
		})
		.then(() => getFriendsPlaylistSongs(spotifyApi, friendsUserID))
		.then(data => {
			friendsSongsSet = data;
		})
		.then(data => {
			// combine all of the songs into one set
			thisUsersSongsSet = concatSets(playlistSongSet, savedSongSet);

			// find the mutual songs and
			return getMutualSet(thisUsersSongsSet, friendsSongsSet);
		});
}

function getThisUsersPlaylistSongs(spotifyApi) {
	return getPlaylistSongsByUserID(spotifyApi, null);
}

function getFriendsPlaylistSongs(spotifyApi, userIDofFriend) {
	return getPlaylistSongsByUserID(spotifyApi, userIDofFriend);
}

function getPlaylistSongsByUserID(spotifyApi, otherUserID) {
	return spotifyApi.getUserPlaylists(otherUserID).then(function(data) {
		let totalSet = new Set();
		let nextPromise = Promise.resolve();

		for (let pl of data.items) {
			//const wasCreatedByThisUser = pl.owner.id === otherUserID || pl.owner.id === spotifyApi.id;
			nextPromise = nextPromise
				.then(() => {
					// get a set of all of the songs in the playlist
					return getSongsOfPlaylist(
						pl.owner.id,
						pl.id,
						pl.tracks.total,
						spotifyApi
					);
				})
				.then(plSet => {
					// add all of those songs to the totalSet
					concatSets(totalSet, plSet);
				});
		}
		return nextPromise.then(() => totalSet);
	});
}

function getSongsOfPlaylist(userId, playlistId, playlistLength, spotifyApi) {
	// the limit of 100 is the max the API allows for getPlaylistTracks
	return getTrackSet(
		options => spotifyApi.getPlaylistTracks(userId, playlistId, options),
		100,
		playlistLength
	);
}

function getThisUsersSavedTracks(spotifyApi) {
	// the limit of 50 is the max the API allows for getMySavedTracks
	return getTrackSet(
		options => spotifyApi.getMySavedTracks(options),
		50,
		undefined
	);
}

function getTrackSet(trackApiCall, limit, playlistLength) {
	// get them once first, to get the total,
	// then make the required number of requests
	// to reach that total
	return trackApiCall({ limit }).then(res => {
		let songs = new Set();

		addSongsToSet(songs, res.items);

		let totalNumberOfSongs = playlistLength ? playlistLength : res.total;

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
					addSongsToSet(songs, data.items);
				});
		}

		return nextPromise.then(() => {
			return songs;
		});
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

module.exports = { getListOfMutualSongs, addSongsToPlaylist };
