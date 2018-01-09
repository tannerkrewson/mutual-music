import React, {
	Component
} from 'react';
import Intro from './components/Intro';
import FriendSelector from './components/FriendSelector';
import Generator from './components/Generator';

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
		var self = this;
		console.log(this.state);
		this.state.spotify.createPlaylist(this.state.user.id, {
			name: 'me and ' + this.state.friend.display_name.toLowerCase() + '\'s mutual songs',
			description: 'Made with Mutual Music: ' + window.location.href
		}).then(function(playlist) {
			return mutual.addSongsToPlaylist(self.state.user.id, playlist.id, self.state.mutualSongs, self.state.spotify);
		}).then(function() {
			alert('done did it!!');
		});
	}
	render() {
		const box = {
			borderStyle: 'solid',
			backgroundColor: 'white'
		};
		return (
            <div className="App container">
				<div className="row" style={box}>
					<div className="col-md-12">
						<Intro
							isLoggedIn={this.state.isLoggedIn}
							user={this.state.user}
							style={box}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6" style={box}>
						{this.state.isLoggedIn &&
							<FriendSelector
								onValidUserId={this.onFriendSelected.bind(this)}
								selectedUser={this.state.friend}
							/>
						}
					</div>
					<div className="col-md-6" style={box}>
						{this.state.friend &&
							<Generator
								countResult={this.state.countResult}
								playlistResult={this.state.playlistResult}
								onMakePlaylist={this.makePlaylist.bind(this)}
								isLoading={this.state.isLoading}
							/>
						}
					</div>
				</div>
            </div>
        );
	}
}

export default App;
