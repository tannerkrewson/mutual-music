import React, {
	Component
} from 'react';
import SpotifyLogin from './SpotifyLogin';

class Intro extends Component {
	render() {
		const header = {
			padding: '20px'
		};
		const right = {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			paddingBottom: '20px'
		};
		return (
			<div>
				<header style={header}>
	        		<h1 className="App-title">
						<span role="img" aria-label="">🎧</span> mutual music
					</h1>
					<p className="lead">
						Generate a playlist of songs that you and a friend both love.
					</p>
	        	</header>
				<div style={right}>
					<SpotifyLogin isLoggedIn={this.props.isLoggedIn} user={this.props.user} />
				</div>
			</div>
        );
	}
}

export default Intro;
