import React, { Component } from "react";

const cssCenter = {
	textAlign: "center",
	paddingTop: "16px",
	paddingBottom: "24px"
};

class Error extends Component {
	render() {
		return (
			<div style={cssCenter}>
				<h4>Error!</h4>
				<p>{this.props.reason}</p>
				<button
					type="button"
					className="btn btn-danger"
					onClick={this.props.onReset}
				>
					Try again
				</button>
			</div>
		);
	}
}

export default Error;
