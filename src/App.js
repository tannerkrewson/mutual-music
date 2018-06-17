import React, { Component } from "react";
import Header from "./components/Header";
import FriendSelector from "./components/FriendSelector";
import TwoFriends from "./components/TwoFriends";
import Generator from "./components/Generator";
import SpotifyLogin from "./components/SpotifyLogin";
import PlaylistResult from "./components/PlaylistResult";
import Loading from "./components/Loading";

import spotifyUtils from "./utils/spotify";
import mutual from "./utils/mutual";
import SpotifyWebAPI from "spotify-web-api-js";

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
			isLoading: false,
			loadingStatus: {}
		};
	}
	onFriendSelected(userID) {
		if (!this.state.friend) {
			this.setState({
				isLoading: true
			});
			this.state.spotify.getUser(userID).then(data => {
				this.setState({
					friend: data
				});
				this.findCount();
			});
		}
	}
	anotherOne() {
		this.setState({
			friend: null,
			isLoading: false,
			countResult: null,
			playlistResult: null
		});
	}
	findCount() {
		mutual
			.getListOfMutualSongs(
				this.state.spotify,
				this.state.friend.id,
				this.setLoadingStatus.bind(this)
			)
			.then(
				songs => {
					// success
					this.setState({
						mutualSongs: songs,
						countResult: songs.length,
						isLoading: false
					});
				},
				err => {
					// fail
					this.setState({
						isLoading: false
					});
					console.error(err);
				}
			);
	}
	makePlaylist() {
		this.setState({
			isLoading: true
		});
		var self = this;
		var friendName = this.state.friend.id;
		if (this.state.friend.display_name) {
			friendName = this.state.friend.display_name.toLowerCase();
		}
		this.state.spotify
			.createPlaylist(this.state.user.id, {
				name: "me and " + friendName + "'s mutual songs",
				description: "Made with tannerkrewson.com/mutual-music"
			})
			.then(function(playlist) {
				self.setState({
					isLoading: false,
					playlistResult: playlist.external_urls.spotify
				});
				return mutual.addSongsToPlaylist(
					self.state.user.id,
					playlist.id,
					self.state.mutualSongs,
					self.state.spotify
				);
			});
	}
	setLoadingStatus(loadingStatus) {
		this.setState({ loadingStatus });
	}
	render() {
		return (
			<div className="App container">
				<div className="row">
					<div className="col-md-12">
						<Header isLoggedIn={this.state.isLoggedIn} />
						{!this.state.isLoggedIn && <SpotifyLogin />}
						{this.state.isLoggedIn && (
							<TwoFriends user={this.state.user} friend={this.state.friend} />
						)}
						{this.state.isLoggedIn &&
							!this.state.friend && (
								<FriendSelector
									onValidUserId={this.onFriendSelected.bind(this)}
									selectedUser={this.state.friend}
								/>
							)}
						{this.state.friend &&
							!this.state.playlistResult &&
							!this.state.isLoading && (
								<Generator
									countResult={this.state.countResult}
									playlistResult={this.state.playlistResult}
									onMakePlaylist={this.makePlaylist.bind(this)}
									onReset={this.anotherOne.bind(this)}
								/>
							)}
						{this.state.playlistResult && (
							<PlaylistResult
								playlistResult={this.state.playlistResult}
								onReset={this.anotherOne.bind(this)}
							/>
						)}
						{this.state.isLoading && (
							<Loading status={this.state.loadingStatus} />
						)}
						<footer>
							Mutual Music by{" "}
							<a
								href="http://www.tannerkrewson.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Tanner Krewson
							</a>
							<br />
							<a
								href="https://github.com/tannerkrewson/mutual-music"
								target="_blank"
								rel="noopener noreferrer"
							>
								View on GitHub
							</a>
						</footer>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
