/* global gtag */
import React, { Component } from "react";

const instructions = [
	"Open the Spotify app and search for your friend.",
	"Tap the three dots as shown.",
	"Tap Share.",
	"Finally, tap on Copy Link."
];

class Instructions extends Component {
	constructor(props) {
		super(props);

		this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		this.state = {
			step: 1,
			showMobile: this.isMobile
		};

		gtag("event", "is_mobile", {
			event_label: this.isMobile
		});
	}
	onClickBack() {
		this.setState({
			step: this.state.step - 1
		});
		gtag("event", "instructions_back");
	}
	onClickStep() {
		this.setState({
			step: this.state.step + 1
		});
	}
	switchInstructions() {
		let previous = this.state.showMobile;
		this.setState({
			showMobile: !previous
		});

		gtag("event", "switch_instructions", {
			event_label: previous ? "mobile_to_desktop" : "desktop_to_mobile"
		});
	}
	render() {
		return (
			<div className="content instructions">
				<h5>Pick a friend and copy their Spotify link.</h5>
				{this.state.showMobile && (
					<div className="instruction-container">
						<div style={{ height: "30vh", lineHeight: "30vh" }}>
							<img
								src={
									window.location.pathname +
									"mobile_" +
									this.state.step +
									".jpg"
								}
							/>
						</div>
						<div style={{ height: "3em", margin: "8px" }}>
							Step {this.state.step}: {instructions[this.state.step - 1]}
						</div>
					</div>
				)}
				{!this.state.showMobile && (
					<div
						className="instruction-container"
						style={{ marginBottom: "16px" }}
					>
						<img src={window.location.pathname + "desktop.gif"} />
					</div>
				)}
				{this.state.step > 1 &&
					this.state.showMobile && (
						<button
							type="button"
							className="btn btn-secondary"
							onClick={this.onClickBack.bind(this)}
						>
							Back
						</button>
					)}
				{this.state.step < 4 &&
					this.state.showMobile && (
						<button
							type="button"
							className="btn btn-success"
							onClick={this.onClickStep.bind(this)}
						>
							Next
						</button>
					)}
				{(this.state.step === 4 || !this.state.showMobile) && (
					<button
						type="button"
						className="btn btn-success"
						onClick={this.props.onInstructionsRead}
					>
						I've got it copied!
					</button>
				)}
				<br />
				<button
					type="button"
					className="btn btn-secondary"
					onClick={this.switchInstructions.bind(this)}
					style={{ marginTop: "10px" }}
				>
					How do I do it on {this.state.showMobile ? "desktop" : "mobile"}?
				</button>
			</div>
		);
	}
}

export default Instructions;
