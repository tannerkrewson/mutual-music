import React, { Component } from "react";

import MdHeadset from "react-icons/lib/md/headset";

class Header extends Component {
	render() {
		var subtitleClasses = "subtitle lead ";
		var titleClasses = "h1 title ";
		if (this.props.isLoggedIn) {
			subtitleClasses += "d-none ";
		}
		return (
			<header>
				<h1 className={titleClasses}>
					<MdHeadset style={{ paddingBottom: "2px" }} />{" "}
					<span className="avoidwrap">mutual music</span>
				</h1>
				<div className={subtitleClasses}>
					Generate a playlist of songs that you and a friend both love.
				</div>
			</header>
		);
	}
}

export default Header;
