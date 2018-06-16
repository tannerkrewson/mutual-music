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

const butGroup = {
	textAlign: 'center',
	paddingTop: '12px',
}

const but = {
	margin: '.25rem'
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
		if (this.props.countResult) {
			var countString = 'You guys ';
			if (this.props.countResult === 1) {
				countString += 'only have one mutual song.';
			} else {
				countString += ' have ' + this.props.countResult + ' mutual songs!';
			}
			return (
				<div style={cssCenter}>
					<h3>{countString}</h3>
					<div style={butGroup}>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={this.props.onReset}
							style={but}
						>
							Back
						</button>
						<button
							type="button"
							className="btn btn-success"
							onClick={this.props.onMakePlaylist}
							style={but}
						>
							Make a Playlist
						</button>
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
