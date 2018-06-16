import React, { Component } from "react";

class FriendSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ""
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		event.preventDefault();
		var value = event.target.value;
		if (value.startsWith("https://open.spotify.com/user/")) {
			let userID = value.substring(30).split("?")[0];
			this.props.onValidUserId(userID);
		} else if (value.startsWith("spotify:user:")) {
			let userID = value.substring(13);
			this.props.onValidUserId(userID);
		}
		this.setState({ value });
	}

	render() {
		return (
			<form onSubmit={this.handleChange}>
				<label>Copy and paste your friend's Spotify profile link here: </label>
				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="e.g. https://open.spotify.com/user/XXXX"
						value={this.state.value}
						onChange={this.handleChange}
					/>
				</div>
			</form>
		);
	}
}

export default FriendSelector;
