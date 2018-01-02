import React, {
	Component
} from 'react';
import SpotifyUser from './SpotifyUser';

class FriendSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			userID: '',
			selectedUser: this.props.selectedUser
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		var value = event.target.value;
		var userID = this.state.userID;
		if (value.startsWith('https://open.spotify.com/user/')) {
			userID = value.substring(30);
		} else if (value.startsWith('spotify:user:')) {
			userID = value.substring(13);
		}
		this.setState({value, userID});
	}

	handleSubmit(event) {
		alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
	}

	componentDidUpdate() {
		if (this.state.userID) {
			this.props.onValidUserId(this.state.userID);
		}
	}

	render() {
		if (this.state.selectedUser) {
			return (
				<div>
					<p>Logged in as</p>
					<SpotifyUser user={this.state.selectedUser} />
				</div>
			);
		} else {
			return (
				<form onSubmit={this.handleSubmit}>
					<label>Enter the Spotify user id of your friend here: </label>
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="e.g. https://open.spotify.com/user/XXXX"
							value={this.state.value}
							onChange={this.handleChange}
						/>
					</div>
				</form>
	        );
		}
	}
}

export default FriendSelector;
