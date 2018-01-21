import React, {
	Component
} from 'react';

const cssAppTitle = {
	fontWeight: 'bolder'
}

class Header extends Component {
	render() {
		var subtitleClasses = 'lead ';
		var titleClasses = 'h1 ';
		if (this.props.isLoggedIn) {
			subtitleClasses += 'd-none d-sm-block ';
		}
		return (
			<header>
        		<p className={titleClasses} style={cssAppTitle}>
					<span role="img" aria-label="">🎧</span> mutual music
				</p>
				<p className={subtitleClasses}>
					Generate a playlist of songs that you and a friend both love.
				</p>
        	</header>
        );
	}
}

export default Header;
