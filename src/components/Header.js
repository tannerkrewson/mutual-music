import React, { Component } from "react";

import MdHeadset from "react-icons/lib/md/headset";

const cssAppTitle = {
	fontWeight: "bolder"
};

class Header extends Component {
	render() {
		var subtitleClasses = "lead ";
		var titleClasses = "h1 ";
		if (this.props.isLoggedIn) {
			subtitleClasses += "d-none ";
		}
		return (
			<header>
				<p className={titleClasses} style={cssAppTitle}>
					<MdHeadset style={{ paddingBottom: "2px" }} />{" "}
					<span className="avoidwrap">mutual music</span>
				</p>
				<p className={subtitleClasses}>
					Generate a playlist of songs that you and a friend both love.
				</p>
			</header>
		);
	}
}

export default Header;
