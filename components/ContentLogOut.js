import React, { Component } from 'react'

class ContentLogOut extends Component {

	constructor(props){
		super(props);
	}
	
	render() {
    	return <button className='mky-popup-button' onClick={this.props.userSessionLogout}>YES</button>
	}
}

export default ContentLogOut;