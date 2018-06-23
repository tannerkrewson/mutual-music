import React, { Component } from "react";

class MoreInfo extends Component {
	render() {
		return (
			<p style={{ textAlign: "justify" }}>
				If you feel that Mutual Music is inaccurate, read about{" "}
				<a
					href="https://github.com/tannerkrewson/mutual-music#mutual-music"
					target="_blank"
				>
					how it works
				</a>
				, or try out{" "}
				<a href="https://www.tannerkrewson.com/sic/" target="_blank">
					Spotify-in-Common
				</a>
				, which finds mutual songs between two or more specific playlists.
			</p>
		);
	}
}

export default MoreInfo;
