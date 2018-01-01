import React, {
	Component
} from 'react';

import spotify from '../utils/spotify';

class SpotifyLogin extends Component {
	render() {
		var notLoggedIn = (
			<div>
				<button type="button" className="btn btn-success" onClick={spotify.login}>Login to Spotify</button>
				<p>Login to get started.</p>
			</div>

		);
		var loggedIn = (
			<div>
				<p>Logged in as</p>
			</div>
		);
		return this.props.isLoggedIn ? loggedIn : notLoggedIn;
	}
}

export default SpotifyLogin;
