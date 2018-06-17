import React, { Component } from "react";

class LoadingPhase extends Component {
	render() {
		let percent = 0;
		if (this.props.songsSoFar >= 0 && this.props.songsTotal > 0) {
			percent = Math.ceil(
				(this.props.songsSoFar / this.props.songsTotal) * 100
			);
		}

		let progress = {
			width: percent + "%"
		};

		if (this.props.noBar) progress.visibility = "hidden";

		return (
			<div>
				<h4>{this.props.title}</h4>
				<br />
				<div className="progress" style={{ height: "24px" }}>
					<div
						className="progress-bar bg-success"
						role="progressbar"
						style={progress}
					>
						{this.props.songsSoFar} of {this.props.songsTotal} songs
					</div>
				</div>
				<p style={{ height: "2em" }}>{this.props.subtitle}</p>
			</div>
		);
	}
}

export default LoadingPhase;
