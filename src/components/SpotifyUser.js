import React, {
	Component
} from 'react';

const icon = {
	borderRadius: '50%',
	height: '48px'
}

const user = {
	textAlign: 'center',
	display: 'inline-block',
	padding: '16px'
}

class SpotifyUser extends Component {
	render() {
		var firstName = '';
		var imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Question_mark_white_icon.svg/768px-Question_mark_white_icon.svg.png';
		if (this.props.user) {
			firstName = this.props.user.display_name.trim().split(' ')[0];
			imageUrl = this.props.user.images[0].url;
		}
		return (
			<div style={user}>
				<img src={imageUrl} style={icon} alt=""/>
				<br/>
				<span>{firstName}</span>
			</div>
		);
	}
}

export default SpotifyUser;
