import React, { Component } from "react";
import Clipboard from "react-clipboard.js";

import FaFacebookSquare from "react-icons/lib/fa/facebook-square";
import FaTwitterSquare from "react-icons/lib/fa/twitter-square";
import FaInstagram from "react-icons/lib/fa/instagram";

const css = {
	paddingTop: "16px",
	paddingBottom: "24px"
};

const butGroup = {
	textAlign: "center",
	paddingTop: "12px"
};

const butGroupGroup = {
	display: "flex",
	justifyContent: "center"
};

class PlaylistResult extends Component {
	render() {
		return (
			<div style={css}>
				<h3>Playlist created!</h3>
				<p>You can find it at the top of your Spotify playlists.</p>
				<div
					className="btn-toolbar"
					style={butGroupGroup}
					role="toolbar"
					aria-label="Toolbar with button groups"
				>
					<div className="btn-group mr-2" role="group">
						<Clipboard
							type="button"
							className="btn btn-info"
							data-clipboard-text={this.props.playlistResult}
						>
							Copy Link
						</Clipboard>
					</div>
					<div className="btn-group mr-2" role="group">
						<button type="button" className="btn">
							<FaFacebookSquare />
						</button>
						<button type="button" className="btn">
							<FaTwitterSquare />
						</button>
						<button type="button" className="btn">
							<FaInstagram />
						</button>
					</div>
				</div>
				<div style={butGroup}>
					<button
						type="button"
						className="btn btn-success"
						onClick={this.props.onReset}
					>
						Try it with a different friend
					</button>
				</div>
			</div>
		);
	}
}

export default PlaylistResult;
