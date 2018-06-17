import React, { Component } from "react";

class LoadingPhase extends Component {
	render() {
		let progress = {
			width: this.props.progress + "%"
		};
		if (this.props.noBar) progress.display = "none";
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
						{this.props.progress}%
					</div>
				</div>
				<p style={{ height: "2em" }}>{this.props.subtitle}</p>
			</div>
		);
	}
}

export default LoadingPhase;
