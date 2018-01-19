import React, {
	Component
} from 'react';

const css = {
	paddingTop: '16px',
	paddingBottom: '24px'
}

const cssCenter = {
	textAlign: 'center',
	paddingTop: '16px',
	paddingBottom: '24px'
}

const but = {
	textAlign: 'center',
	paddingTop: '12px',
}

class Generator extends Component {
	render() {
		if (this.props.isLoading) {
			return (
				<div style={cssCenter}>
					<h3>Loading...</h3>
				</div>
			);
		}
		if (this.props.playlistResult) {
			return (
				<div style={css}>
					<h3>Playlist created!</h3>
					<p>You can find it at the top of your Spotify playlists.</p>
					<a href={this.props.playlistResult}>{this.props.playlistResult}</a>
				</div>
			);
		}
		if (this.props.countResult) {
			return (
				<div style={cssCenter}>
					<h3>
						You guys have
						<span> {this.props.countResult} </span>
						mutual songs!
					</h3>
					<div style={but}>
						<button type="button" className="btn btn-success" onClick={this.props.onMakePlaylist}>Make a Playlist</button>
					</div>
				</div>
			);
		} else if (this.props.countResult === 0) {
			return (
				<div style={css}>
					<h2>
						You guys don't have any mutual songs. ;(
					</h2>
				</div>
			);
		}
		return (<p>Error</p>);
	}
}

export default Generator;
