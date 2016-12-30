import React, { Component } from 'react'
import Lang from '../lang'

class ContentLogOut extends Component {

	constructor(props, context){
		super(props, context);
	}
	
	render() {
    	return <button className='mky-popup-button' onClick={this.props.userSessionLogout}>{Lang[this.context.lang]['button.yes.text']}</button>
	}
}

ContentLogOut.contextTypes = {
    lang: React.PropTypes.string.isRequired
}

export default ContentLogOut;