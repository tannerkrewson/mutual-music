import React, { Component } from "react";

const cssCenter = {
	textAlign: "center",
	paddingTop: "16px",
	paddingBottom: "24px"
};

const butGroup = {
	textAlign: "center",
	paddingTop: "12px"
};

const but = {
	margin: ".25rem"
};

class Generator extends Component {
	render() {
		var countString;
		if (this.props.countResult === 0) {
			countString = "You guys don't have any mutual songs. ;(";
		} else if (this.props.countResult === 1) {
			countString = "You guys only have one mutual song.";
		} else {
			countString =
				"You guys have " + this.props.countResult + " mutual songs!";
		}
		return (
			<div style={cssCenter}>
				<h3>{countString}</h3>
				<div style={butGroup}>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={this.props.onReset}
						style={but}
					>
						Back
					</button>
					{this.props.countResult > 0 && (
						<button
							type="button"
							className="btn btn-success"
							onClick={this.props.onMakePlaylist}
							style={but}
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
