import React, {
	Component
} from 'react';

class Generator extends Component {
	render() {
		if (this.props.isLoading) {
			return (
				<div>
					<h3>Loading...</h3>
				</div>
			);
		}
		if (this.props.countResult) {
			return (
				<div>
					<h2>
						You guys have
						<span>{this.props.countResult}</span>
						songs in common!
					</h2>
					<label>Wanna make it into a playlist??</label>
					<button type="button" className="btn btn-success" onClick={this.props.onMakePlaylist}>Do it</button>
				</div>
			);
		}
		if (this.props.playlistResult) {
			return (
				<div>
					<h2>Playlist created!</h2>
					<p>It should now be in your Spotify playlist list.</p>
					<a href={this.props.playlistResult}>{this.props.playlistResult}</a>
				</div>
			);
		}
		return (<p>Error</p>);
	}
}

export default Generator;
