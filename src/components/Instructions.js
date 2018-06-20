import React, { Component } from "react";

class Instructions extends Component {
	constructor(props) {
		super(props);

		this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		this.state = {
			step: 1,
			showMobile: this.isMobile
		};
	}
	onClickBack() {
		this.setState({
			step: this.state.step - 1
		});
	}
	onClickStep() {
		this.setState({
			step: this.state.step + 1
		});
	}
	render() {
		return (
			<div className="instructions">
				<h4>First, copy your friends Spotify profile link.</h4>
				<div style={{ fontSize: "8px" }}>
					I would give you a list of your friends to select from, but Spotify
					won't let me. 😡
				</div>
				{this.isMobile && (
					<div>
						<div>Step {this.state.step}: </div>
						<div style={{ height: "375px" }}>
							<img src={"/mobile_" + this.state.step + ".jpg"} />
						</div>
					</div>
				)}
				{!this.isMobile && (
					<div>
						<img src="/desktop.gif" />
					</div>
				)}
				{this.state.step > 1 &&
					this.state.showMobile && (
						<button
							type="button"
							className="btn btn-secondary"
							onClick={this.onClickBack.bind(this)}
						>
							&lt;= Back
						</button>
					)}
				{this.state.step < 4 &&
					this.state.showMobile && (
						<button
							type="button"
							className="btn btn-success"
							onClick={this.onClickStep.bind(this)}
						>
							Next =&gt;
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
				<button type="button" className="btn btn-secondary">
					How do I do it on {this.state.showMobile ? "desktop" : "mobile"}?
				</button>
			</div>
		);
	}
}

export default Instructions;
