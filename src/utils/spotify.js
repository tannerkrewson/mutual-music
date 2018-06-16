const SPOTIFY_CLIENT_ID = "1a4c17edb0f044d9a4b14bb3d1353a49";

function checkForAccessToken() {
	// https://stackoverflow.com/questions/38706233/javascript-mime-type-text-html-is-not-executable-and-strict-mime-type-chec

	var hash = {};
	var h = window.location.hash.slice(1);

	if (h !== "") {
		h = h.split("&");
		h.forEach(function(pair) {
			pair = pair.split("=");
			hash[pair.shift()] = pair.join("=");
		});

		if (hash.error) {
			console.error(hash.error);
			return false;
		} else {
			//hash.token_type === "Bearer";
			//remove the junk from the urlS
			window.history.pushState("", document.title, window.location.pathname);
			return hash;
		}
	} else {
		return false;
	}
}

function login() {
	var scopes = "playlist-read-private playlist-modify-public user-library-read";
	window.location.href =
		"https://accounts.spotify.com/authorize" +
		"?client_id=" +
		SPOTIFY_CLIENT_ID +
		"&response_type=token" +
		"&redirect_uri=" +
		encodeURIComponent(window.location.href) +
		//"&state=" + STATE + // optional
		"&scope=" +
		encodeURIComponent(scopes) + // optional
		"";
}

module.exports = { checkForAccessToken, login };
