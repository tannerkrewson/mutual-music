import React, { Component } from "react";

const cssCenter = {
	textAlign: "center",
	paddingTop: "16px",
	paddingBottom: "24px"
};

class Loading extends Component {
	render() {
		return (
			<div style={cssCenter}>
				<h3>Loading...</h3>
				<code>{JSON.stringify(this.props.status)}</code>
			</div>
		);
	}
}

export default Loading;
