/* global gtag */
import React, { Component } from "react";

import MoreInfo from "./MoreInfo";

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
	socialClick(network) {
		return () => {
			gtag("event", "share", {
				event_label: network
			});
		};
	}
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
						onClick={() => {
							gtag("event", "copy_playlist");
							alert("Playlist link copied! Now you must paste it somewhere.");
						}}
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
							onClick={() => {
								gtag("event", "open_playlist");
							}}
						>
							Open Playlist
						</button>
					</a>
				</div>
				<div className="btn-container">
					<div className="btn-group mr-2" role="group">
						<FacebookShareButton url={this.props.playlistResult}>
							<FaFacebookSquare
								style={icon}
								size={38}
								color="#3b5998"
								onClick={this.socialClick("Facebook")}
							/>
						</FacebookShareButton>
						<TwitterShareButton url={this.props.playlistResult}>
							<FaTwitterSquare
								style={icon}
								size={38}
								color="#00aced"
								onClick={this.socialClick("Twitter")}
							/>
						</TwitterShareButton>
						<TumblrShareButton url={this.props.playlistResult}>
							<FaTumblrSquare
								style={icon}
								size={38}
								color="#35465c"
								onClick={this.socialClick("Tumblr")}
							/>
						</TumblrShareButton>
						<EmailShareButton url={this.props.playlistResult}>
							<FaEnvelopeSquare
								style={icon}
								size={38}
								color="grey"
								onClick={this.socialClick("Email")}
							/>
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
				<br />
				<MoreInfo />
			</div>
		);
	}
}

export default PlaylistResult;
