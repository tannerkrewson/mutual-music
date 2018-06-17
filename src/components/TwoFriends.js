import React, { Component } from "react";
import SpotifyUser from "./SpotifyUser";

const css = {
	textAlign: "center"
};

const and = {
	paddingTop: "40px",
	paddingBottom: "30px"
};

class TwoFriends extends Component {
	render() {
		return (
			<div className="row" style={css}>
				<div className="col-5">
					<SpotifyUser user={this.props.user} />
				</div>
				<div className="col-2">
					<div style={and}>and</div>
				</div>
				<div className="col-5">
					<SpotifyUser user={this.props.friend} />
				</div>
			</div>
		);
	}
}

export default TwoFriends;
