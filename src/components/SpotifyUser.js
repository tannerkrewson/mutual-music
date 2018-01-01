import React, {
	Component
} from 'react';

class SpotifyUser extends Component {
	render() {
		const icon = {
			borderRadius: '50%',
			height: '32px'
		}
		if (this.props.user) {
			return (
				<div>
					<img src={this.props.user.images[0].url} style={icon} alt=""/>
					<span>{this.props.user.display_name}</span>
				</div>
			);
		} else return null;
	}
}

export default SpotifyUser;
