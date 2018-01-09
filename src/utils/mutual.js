
function getListOfMutualSongs (spotifyApi, otherUserID) {
	var promiseList = [];
	promiseList.push(getMapOfAllSongs(spotifyApi));
	promiseList.push(getListOfSongsByUserID(spotifyApi, otherUserID));
	return Promise.all(promiseList).then(function (data) {
		var userSongMap = data[0];
		var friendSongMap = data[1];
		return getMutualMap(userSongMap, friendSongMap);
	});
}

function getMapOfAllSongs(spotifyApi) {
	return getListOfSongsByUserID(spotifyApi, null);
}

function getListOfSongsByUserID (spotifyApi, otherUserID) {
	return spotifyApi.getUserPlaylists(otherUserID).then(function(data) {
		var promiseList = [];
		var count = 0;
		for (var pl of data.items) {
			promiseList.push(getSongsOfPlaylist(pl.owner.id, pl.id, pl.tracks.total, spotifyApi));
			count++
			if (count >= 5) break;
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
			songs.set(song.track.id, true);
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
		if (map2.has( song[0] )) {
			res.push('spotify:track:' + song[0]);
		}
	}
	return res;
}

function addSongsToPlaylist (userId, playlistId, songList, spotifyApi) {
	var promiseList = [];
	for (var offset = 0; offset < songList.length; offset += 100) {
		var songsToAdd = songList.slice(offset, offset + 100);
		console.log(songsToAdd);
		promiseList.push(spotifyApi.addTracksToPlaylist(userId, playlistId, songsToAdd));
	}
	return Promise.all(promiseList);
}



module.exports = {getListOfMutualSongs, addSongsToPlaylist};
