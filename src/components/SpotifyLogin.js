import React, {
	Component
} from 'react';

import spotifyUtils from '../utils/spotify';
import SpotifyUser from './SpotifyUser';

class SpotifyLogin extends Component {
	render() {
		var notLoggedIn = (
			<div>
				<button type="button" className="btn btn-success" onClick={spotifyUtils.login}>Login to Spotify</button>
				<p>Login to get started.</p>
			</div>

		);
		var loggedIn = (
			<div>
				<p>Logged in as</p>
				<SpotifyUser user={this.props.user} />
			</div>
		);
		return this.props.isLoggedIn ? loggedIn : notLoggedIn;
	}
}

export default SpotifyLogin;
