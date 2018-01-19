import React, {
	Component
} from 'react';
import Header from './components/Header';
import FriendSelector from './components/FriendSelector';
import TwoFriends from './components/TwoFriends';
import Generator from './components/Generator';
import SpotifyLogin from './components/SpotifyLogin';

import spotifyUtils from './utils/spotify';
import mutual from './utils/mutual';
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
				spotifyApi.id = data.id;
			});
		}
		this.state = {
			spotify: spotifyApi,
			isLoggedIn: !!spotifyHash,
			isLoading: true
		};
	}
	onFriendSelected(userID) {
		var self = this;
		if (!this.state.friend) {
			this.state.spotify.getUser(userID).then(function(data) {
				self.setState({
					friend: data
				});
				self.findCount();
			});
		}
	}
	findCount() {
		var self = this;
		mutual.getListOfMutualSongs(this.state.spotify, this.state.friend.id)
			.then(function (songs) {
				self.setState({
					mutualSongs: songs,
					countResult: songs.length,
					isLoading: false
				});
			});
	}
	makePlaylist() {
		this.setState({
			isLoading: true
		});
		var self = this;
		this.state.spotify.createPlaylist(this.state.user.id, {
			name: 'me and ' + this.state.friend.display_name.toLowerCase() + '\'s mutual songs',
			description: 'Made with Mutual Music: ' + window.location.href
		}).then(function(playlist) {
			self.setState({
				isLoading: false,
				playlistResult: playlist.external_urls.spotify
			});
			return mutual.addSongsToPlaylist(self.state.user.id, playlist.id, self.state.mutualSongs, self.state.spotify);
		})
	}
	render() {
		return (
            <div className="App container">
				<div className="row">
					<div className="col-md-12">
						<Header />
						{!this.state.isLoggedIn &&
							<SpotifyLogin />
						}
						{this.state.isLoggedIn &&
							<TwoFriends user={this.state.user} friend={this.state.friend} />
						}
					</div>
				</div>
				<div className="row">
					{this.state.isLoggedIn &&
						<div className="col-md-6">
								<FriendSelector
									onValidUserId={this.onFriendSelected.bind(this)}
									selectedUser={this.state.friend}
								/>
						</div>
					}
					{this.state.friend &&
						<div className="col-md-6">
							<Generator
								countResult={this.state.countResult}
								playlistResult={this.state.playlistResult}
								onMakePlaylist={this.makePlaylist.bind(this)}
								isLoading={this.state.isLoading}
							/>
						</div>
					}
				</div>
				<footer>
					Mutual Music by <a href="http://www.tannerkrewson.com/" target="_blank" rel="noopener noreferrer">Tanner Krewson</a>
					<br/>
					<a href="https://github.com/tannerkrewson/mutual-music" target="_blank" rel="noopener noreferrer">View on GitHub</a>
				</footer>
            </div>
        );
	}
}

export default App;
