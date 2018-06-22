import React, { Component } from "react";
import Clipboard from "react-clipboard.js";

import FaFacebookSquare from "react-icons/lib/fa/facebook-square";
import FaTwitterSquare from "react-icons/lib/fa/twitter-square";
import FaEnvelopeSquare from "react-icons/lib/fa/envelope-square";
import FaTumblrSquare from "react-icons/lib/fa/tumblr-square";

import {
	FacebookShareButton,
	TwitterShareButton,
	TumblrShareButton,
	EmailShareButton
} from "react-share";

const icon = {
	background: "white",
	borderRadius: "6px",
	marginLeft: "6px"
};

class PlaylistResult extends Component {
	render() {
		return (
			<div className="content">
				<h3>Playlist created!</h3>
				<p>You can find it at the top of your Spotify playlists.</p>
				<div className="btn-container">
					<Clipboard
						type="button"
						className="btn btn-info"
						data-clipboard-text={this.props.playlistResult}
					>
						Copy Link
					</Clipboard>
					<a
						href={this.props.playlistResult}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button
							type="button"
							className="btn btn-info"
							style={{ marginLeft: "6px" }}
						>
							Open Playlist
						</button>
					</a>
				</div>
				<div className="btn-container">
					<div className="btn-group mr-2" role="group">
						<FacebookShareButton url={this.props.playlistResult}>
							<FaFacebookSquare style={icon} size={38} color="#3b5998" />
						</FacebookShareButton>
						<TwitterShareButton url={this.props.playlistResult}>
							<FaTwitterSquare style={icon} size={38} color="#00aced" />
						</TwitterShareButton>
						<TumblrShareButton url={this.props.playlistResult}>
							<FaTumblrSquare style={icon} size={38} color="#35465c" />
						</TumblrShareButton>
						<EmailShareButton url={this.props.playlistResult}>
							<FaEnvelopeSquare style={icon} size={38} color="grey" />
						</EmailShareButton>
					</div>
				</div>
				<br />
				<div className="btn-container">
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
