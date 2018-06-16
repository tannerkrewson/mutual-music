import React, { Component } from "react";

import spotifyUtils from "../utils/spotify";

const but = {
	textAlign: "center",
	padding: "32px"
};

class SpotifyLogin extends Component {
	render() {
		return (
			<div style={but}>
				<button
					type="button"
					className="btn btn-success"
					onClick={spotifyUtils.login}
				>
					Login to Spotify
				</button>
			</div>
		);
	}
}

export default SpotifyLogin;
