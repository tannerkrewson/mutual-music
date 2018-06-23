import React, { Component } from "react";

import MoreInfo from "./MoreInfo";

class Generator extends Component {
	render() {
		var countString;
		if (this.props.countResult === 0) {
			countString = "You don't have any mutual songs. ;(";
		} else if (this.props.countResult === 1) {
			countString = "You only have one mutual song.";
		} else {
			countString = "You have " + this.props.countResult + " mutual songs!";
		}
		return (
			<div className="content">
				<h3>{countString}</h3>
				{this.props.countResult < 20 && (
					<p style={{ textAlign: "justify" }}>
						Hmm... that's not very many. Make sure that you and your friend have
						lots of your favorites songs saved in your top 20 playlists.
					</p>
				)}
				{this.props.countResult <= 5 && <MoreInfo />}
				<div className="btn-container">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={this.props.onReset}
					>
						Back
					</button>
					{this.props.countResult > 0 && (
						<button
							type="button"
							className="btn btn-success"
							onClick={this.props.onMakePlaylist}
						>
							Make a Playlist
						</button>
					)}
				</div>
			</div>
		);
	}
}

export default Generator;
