import React, {
	Component
} from 'react';

class Intro extends Component {
	render() {
		const header = {
			height: '200px',
			padding: '20px'
		};
		const right = {
			'display': 'flex',
			'justify-content': 'center',
			'align-items': 'center'
		};
		return (
			<div className="row">
				<header className="col-md-6" style={header}>
	        		<h1 className="App-title">
						SPOTIFY IN COMMON
					</h1>
					<p className="lead">
						Generate a playlist of songs that you and a friend both love.
					</p>
	        	</header>
				<div className="col-md-6" style={right}>
					<div>
						<button type="button" className="btn btn-success" onClick={this.props.onLogin}>Login to Spotify</button>
						<p>Login to get started.</p>
					</div>
				</div>
			</div>
        );
	}
}

export default Intro;
