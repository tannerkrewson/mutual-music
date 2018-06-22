import React, { Component } from "react";

import LoadingPhase from "./LoadingPhase";

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
						songsSoFar={phase.songsSoFar}
						songsTotal={phase.songsTotal}
						isDone={phase.isDone}
						isActive={phase.isActive}
					/>
				);
			}
		}
		return <div className="content">{phases}</div>;
	}
}

export default Loading;
