import React, { Component } from "react";

import FaQuestion from "react-icons/lib/fa/question";

const icon = {
	borderRadius: "50%",
	height: "48px"
};

const user = {
	textAlign: "center",
	display: "inline-block",
	padding: "16px",
	height: "100px",
	width: "128px"
};

class SpotifyUser extends Component {
	render() {
		let firstName = " ";
		let imageUrl;
		if (this.props.user) {
			if (this.props.user.display_name) {
				firstName = this.props.user.display_name.trim().split(" ")[0];
			} else {
				firstName = this.props.user.id;
			}
			if (this.props.user.images && this.props.user.images[0]) {
				imageUrl = this.props.user.images[0].url;
			}
		}
		return (
			<div style={user}>
				{imageUrl && <img src={imageUrl} style={icon} alt={firstName} />}
				{!imageUrl && <FaQuestion size={48} />}
				<br />
				<span>{firstName}</span>
			</div>
		);
	}
}

export default SpotifyUser;
