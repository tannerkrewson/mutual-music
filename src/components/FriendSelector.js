import React, {
	Component
} from 'react';

class FriendSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			userID: ''
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		event.preventDefault();
		var value = event.target.value;
		var userID = this.state.userID;
		if (value.startsWith('https://open.spotify.com/user/')) {
			userID = value.substring(30, 40);
		} else if (value.startsWith('spotify:user:')) {
			userID = value.substring(13);
		}
		this.setState({value, userID});
	}

	componentDidUpdate() {
		if (this.state.userID) {
			this.props.onValidUserId(this.state.userID);
		}
	}

	render() {
		return (
			<form onSubmit={this.handleChange}>
				<label>Copy and paste your friend's Spotify profile link here: </label>
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

export default FriendSelector;
