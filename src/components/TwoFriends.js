import React, { Component } from "react";
import SpotifyUser from "./SpotifyUser";

const friendsContainer = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	paddingTop: "12px"
};

class TwoFriends extends Component {
	render() {
		return (
			<div style={friendsContainer}>
				<div>
					<SpotifyUser user={this.props.user} />
				</div>
				<div>
					<div>and</div>
				</div>
				<div>
					<SpotifyUser user={this.props.friend} />
				</div>
			</div>
		);
	}
}

export default TwoFriends;
