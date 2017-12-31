import React, {
	Component
} from 'react';
import Intro from './components/Intro';
import FriendSelector from './components/FriendSelector';

class App extends Component {
	render() {
		const box = {
			'border-style': 'solid',
			'background-color': 'white'
		};
		return (
            <div className="App container">
				<div className="row" style={box}>
					<div className="col-md-12">
						<Intro style={box} />
					</div>
				</div>
				<div className="row">
					<div className="col-md-6" style={box}>
						<FriendSelector />
					</div>
					<div className="col-md-6">
					</div>
				</div>
            </div>
        );
	}
}

export default App;
