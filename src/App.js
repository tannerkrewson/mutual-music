import React, {
	Component
} from 'react';
import Intro from './components/Intro';
import FriendSelector from './components/FriendSelector';

import spotifyUtils from './utils/spotify';
import SpotifyWebAPI from 'spotify-web-api-js';

class App extends Component {
	constructor(props) {
		super(props);
		var spotifyHash = spotifyUtils.checkForAccessToken();
		var spotifyApi;
		if (spotifyHash) {
			spotifyApi = new SpotifyWebAPI();
			spotifyApi.setAccessToken(spotifyHash.access_token);
			var self = this;
			spotifyApi.getMe().then(function(data) {
				self.setState({
					user: data
				});
			});
		}
		this.state = {
			spotify: spotifyApi,
			isLoggedIn: !!spotifyHash
		};
	}
	render() {
		const box = {
			'border-style': 'solid',
			'background-color': 'white'
		};
		return (
            <div className="App container">
				<div className="row" style={box}>
					<div className="col-md-12">
						<Intro isLoggedIn={this.state.isLoggedIn} user={this.state.user} style={box} />
					</div>
				</div>
				<div className="row">
					<div className="col-md-6" style={box}>
						{this.state.isLoggedIn &&
							<FriendSelector />
						}
					</div>
					<div className="col-md-6">
					</div>
				</div>
            </div>
        );
	}
}

export default App;
