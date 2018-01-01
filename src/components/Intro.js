import React, {
	Component
} from 'react';
import SpotifyLogin from './SpotifyLogin';

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
					<SpotifyLogin isLoggedIn={this.props.isLoggedIn} />
				</div>
			</div>
        );
	}
}

export default Intro;
