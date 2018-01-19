import React, {
	Component
} from 'react';

const icon = {
	borderRadius: '50%',
	height: '48px'
}

const user = {
	textAlign: 'center',
}

class SpotifyUser extends Component {
	render() {
		if (this.props.user) {
			return (
				<div style={user}>
					<img src={this.props.user.images[0].url} style={icon} alt=""/>
					<br/>
					<span>{this.props.user.display_name.split(" ")[0]}</span>
				</div>
			);
		} else return null;
	}
}

export default SpotifyUser;
