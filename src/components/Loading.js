import React, { Component } from "react";

import LoadingPhase from "./LoadingPhase";

const cssCenter = {
	textAlign: "center",
	paddingTop: "16px",
	paddingBottom: "24px"
};

class Loading extends Component {
	render() {
		let status = this.props.status;
		let phases = [];

		if (Array.isArray(status)) {
			for (let i in status) {
				let phase = status[i];
				if (!phase.isActive) continue;
				phases.push(
					<LoadingPhase
						key={i}
						title={phase.title}
						subtitle={phase.subtitle}
						progress={phase.progress}
						isDone={phase.isDone}
						isActive={phase.isActive}
					/>
				);
			}
		}
		return <div style={cssCenter}>{phases}</div>;
	}
}

export default Loading;
