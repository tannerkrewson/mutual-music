import React, {
	Component
} from 'react';
import SpotifyUser from './SpotifyUser';

const css = {
	textAlign: 'center'
}

const left = {
	paddingLeft: '50%'
}

const and = {
	paddingTop: '40px',
	paddingBottom: '30px'
}

const right = {
	paddingRight: '50%'
}

class TwoFriends extends Component {
	render() {
		return (
			<div className="row" style={css}>
				<div className="col-5">
					<div style={left}>
						<SpotifyUser user={this.props.user} />
					</div>
				</div>
				<div className="col-2">
					<div style={and}>and</div>
				</div>
				<div className="col-5">
					<div style={right}>
						<SpotifyUser user={this.props.friend} />
					</div>
				</div>
			</div>
        );
	}
}

export default TwoFriends;
