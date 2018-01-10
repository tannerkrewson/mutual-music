
function getListOfMutualSongs (spotifyApi, otherUserID) {
	var promiseList = [];
	promiseList.push(getMapOfAllSongs(spotifyApi));
	promiseList.push(getUserSavedTracks(spotifyApi));
	promiseList.push(getListOfSongsByUserID(spotifyApi, otherUserID));
	return Promise.all(promiseList).then(function (data) {
		var userSongMap = data[0];
		var friendSongMap = data[2];
		concatMaps(userSongMap, data[1]);
		return getMutualMap(userSongMap, friendSongMap);
	});
}

function getMapOfAllSongs(spotifyApi) {
	return getListOfSongsByUserID(spotifyApi, null);
}

function getListOfSongsByUserID (spotifyApi, otherUserID) {
	return spotifyApi.getUserPlaylists(otherUserID).then(function(data) {
		var promiseList = [];
		for (var pl of data.items) {
			//const wasCreatedByThisUser = pl.owner.id === otherUserID || pl.owner.id === spotifyApi.id;
			promiseList.push(getSongsOfPlaylist(pl.owner.id, pl.id, pl.tracks.total, spotifyApi));
		}
		return Promise.all(promiseList).then(function (data) {
			var totalMap = data[0];
			for (var i = 1; i < data.length; i++) {
				concatMaps(totalMap, data[i]);
			}
			return totalMap;
		});
	});
}

function getSongsOfPlaylist (userId, playlistId, playlistLength, spotifyApi) {
	var songs = new Map();
	var promiseList = [];
	for (var offset = 0; offset < playlistLength; offset += 100) {
		promiseList.push(spotifyApi.getPlaylistTracks(userId, playlistId, { offset })
	        .then(addSongsToMap, function (err) {
	            console.error(err);
	        })
		);
	}
	return Promise.all(promiseList).then(function (data) {
		return songs;
	});
	function addSongsToMap (data) {
		for (var song of data.items) {
			if (song.track.id) {
				songs.set(song.track.id, true);
			}
		}
	}
}

function getUserSavedTracks (spotifyApi) {
	const limit = 50;
	var songs = new Map();

	// get them once first, to get the total,
	// then make the required number of requests
	// to reach that total
	return spotifyApi.getMySavedTracks({ limit }).then(function (res) {
		addSongsToMap(res);
		if (res.total > limit) {
			var promiseList = [];
			for (var offset = limit; offset < res.total; offset += limit) {
				promiseList.push(spotifyApi.getMySavedTracks({ offset, limit })
					.then(addSongsToMap, function (err) {
						console.error(err);
					})
				);
			}
			return Promise.all(promiseList).then(function (data) {
				return songs;
			});
		}
	});

	function addSongsToMap (data) {
		for (var song of data.items) {
			if (song.track.id) {
				songs.set(song.track.id, true);
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
