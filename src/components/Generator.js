import React, { Component } from "react";

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
					<div style={{ textAlign: "justify" }}>
						<p>
							Hmm... that's not very many. I'm sure you have more mutual songs,
							but maybe your friend doesn't have a lot of songs on their top 20
							public playlists.
						</p>
						<p>
							If you feel that Mutual Music is inaccurate, read about{" "}
							<a
								href="https://github.com/tannerkrewson/mutual-music#mutual-music"
								target="_blank"
							>
								how it works
							</a>
							, or try out{" "}
							<a href="https://www.tannerkrewson.com/sic/" target="_blank">
								Spotify-in-Common
							</a>
							, which finds mutual songs between two or more specific playlists.
						</p>
					</div>
				)}
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
