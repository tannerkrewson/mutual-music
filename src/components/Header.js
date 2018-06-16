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
			subtitleClasses += "d-none d-sm-block ";
		}
		return (
			<header>
				<p className={titleClasses} style={cssAppTitle}>
					<MdHeadset style={{ paddingBottom: "2px" }} />{" "}
					<span class="avoidwrap">mutual music</span>
				</p>
				<p className={subtitleClasses}>
					Generate a playlist of songs that you and a friend both love.
				</p>
			</header>
		);
	}
}

export default Header;