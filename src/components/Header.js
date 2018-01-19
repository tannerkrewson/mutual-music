import React, {
	Component
} from 'react';

class Header extends Component {
	render() {
		return (
			<header>
        		<h1 className="App-title">
					<span role="img" aria-label="">🎧</span> mutual music
				</h1>
				<p className="lead">
					Generate a playlist of songs that you and a friend both love.
				</p>
        	</header>
        );
	}
}

export default Header;
