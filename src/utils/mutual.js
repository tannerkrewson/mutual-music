function getListOfMutualSongs (spotifyApi, otherUserID) {
	let playlistSongMap, savedSongMap, friendSongMap;
	return getMapOfAllSongs(spotifyApi).then((data) => {
		console.log('this user\'s playlist songs');
		console.log(data);
		//onsole.log(songs.keys().next().value);
		playlistSongMap = data;
	}).then(
		() => getUserSavedTracks(spotifyApi)
	).then((data) => {
		console.log('this user\'s saved songs');
		console.log(data);
		savedSongMap = data;
	}).then(
		() => getListOfSongsByUserID(spotifyApi, otherUserID)
	).then((data) => {
		console.log('friend\'s playlist songs');
		console.log(data);
		friendSongMap = data;
	}).then((data) => {
		concatMaps(playlistSongMap, savedSongMap);
		return getMutualMap(playlistSongMap, friendSongMap);
	});
}

function getMapOfAllSongs(spotifyApi) {
	return getListOfSongsByUserID(spotifyApi, null);
}

function getListOfSongsByUserID (spotifyApi, otherUserID) {
	return spotifyApi.getUserPlaylists(otherUserID).then(function(data) {
		let totalMap = new Map();
		let nextPromise = Promise.resolve();

		for (let pl of data.items) {
			//const wasCreatedByThisUser = pl.owner.id === otherUserID || pl.owner.id === spotifyApi.id;
			nextPromise = nextPromise.then(() => {
				// get a map of all of the songs in the playlist
				return getSongsOfPlaylist(pl.owner.id, pl.id, pl.tracks.total, spotifyApi);
			}).then((plMap) => {
				// add all of those songs to the totalMap
				concatMaps(totalMap, plMap);
			});
		}
		return nextPromise.then(() => totalMap);
	});
}

function getSongsOfPlaylist (userId, playlistId, playlistLength, spotifyApi) {
	return getTrackMap(
		(options) => spotifyApi.getPlaylistTracks(userId, playlistId, options),
		100,
		playlistLength
	);
}

function getUserSavedTracks (spotifyApi) {
	return getTrackMap((options) => spotifyApi.getMySavedTracks(options), 50);
}

function getTrackMap (trackApiCall, limit, playlistLength) {
	let songs = new Map();

	// get them once first, to get the total,
	// then make the required number of requests
	// to reach that total
	return trackApiCall({ limit }).then(function (res) {
		addSongsToMap(songs, res.items);

		let totalNumberOfSongs = playlistLength ? playlistLength : res.total;

		// if we were able to get all of the songs already, because
		// the the number of songs was less than the limit for one
		// request
		if (totalNumberOfSongs <= limit) return;

		let firstPromise = Promise.resolve();
		let nextPromise = firstPromise;

		for (let offset = limit; offset < totalNumberOfSongs; offset += limit) {
			nextPromise = nextPromise.then(() => {
				return trackApiCall({ offset, limit });
			}).then((data) => {
				addSongsToMap(songs, data.items);
			});
		}

		return firstPromise;
	}).then(() => songs);

	function addSongsToMap (songsMap, newSongs) {
		for (let song of newSongs) {
			// this prevents local songs from polluting our maps
			if (song.track.id) {
				songsMap.set(song.track.id, true);
			}
		}
	}
}

function concatMaps (map, mapToAdd) {
	for (const item of mapToAdd) {
		map.set(...item);
	}
}

function getMutualMap (map1, map2) {
	var res = [];
	for (const song of map1) {
		// if the other map has the key
		if (song[0] && map2.has( song[0] )) {
			res.push('spotify:track:' + song[0]);
		}
	}
	return res;
}

function addSongsToPlaylist (userId, playlistId, songList, spotifyApi) {
	var promiseList = [];
	for (var offset = 0; offset < songList.length; offset += 100) {
		var songsToAdd = songList.slice(offset, offset + 100);
		promiseList.push(spotifyApi.addTracksToPlaylist(userId, playlistId, songsToAdd));
	}
	return Promise.all(promiseList);
}

module.exports = {getListOfMutualSongs, addSongsToPlaylist};
