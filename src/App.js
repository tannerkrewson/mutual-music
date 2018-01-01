import React, {
	Component
} from 'react';
import Intro from './components/Intro';
import FriendSelector from './components/FriendSelector';

import spotify from './utils/spotify';

class App extends Component {
	render() {
		var spotifyHash = spotify.checkForAccessToken();
		const isLoggedIn = !!spotifyHash;

		const box = {
			'border-style': 'solid',
			'background-color': 'white'
		};
		return (
            <div className="App container">
				<div className="row" style={box}>
					<div className="col-md-12">
						<Intro isLoggedIn={isLoggedIn} style={box} />
					</div>
				</div>
				<div className="row">
					<div className="col-md-6" style={box}>
						{isLoggedIn &&
							<FriendSelector />
						}
					</div>
					<div className="col-md-6">
					</div>
				</div>
            </div>
        );
	}
}

export default App;
