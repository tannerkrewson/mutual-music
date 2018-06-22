import React, { Component } from "react";

class Error extends Component {
	render() {
		return (
			<div className="content">
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
