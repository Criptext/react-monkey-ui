import React, { Component } from 'react'
import Linkify from 'react-linkify'

class BubbleText extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return <span className="mky-content-text"><Linkify>{this.props.message.text}</Linkify></span>
	}
}

export default BubbleText;