import React, { Component } from 'react'

class ContentIntro extends Component {

	constructor(props){
		super(props);
		this.bannerClass = this.props.showBanner ?  "mky-app-intro-divided" : '';
	}
	render() {
    	return <div id="mky-app-intro" className={this.bannerClass}></div>
	}
}

export default ContentIntro;
