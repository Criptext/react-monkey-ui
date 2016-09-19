import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import AsideConversationInfo from './AsideConversationInfo.js';
import AsideMessageInfo from './AsideMessageInfo.js';
import { isConversationGroup } from '../utils/monkey-utils.js'

class ContentInfo extends Component {
	constructor(props) {
		super(props);
		this.classExpand = this.props.isMobile || this.props.viewType != "fullscreen" ? 'mky-content-info-expand' : 'mky-content-info-no-expand';
	}

	componentWillMount() {
		this.objectInfo = this.props.getConversationInfo();
		this.setState({infoName: this.objectInfo.name});
	}

	render() {
    	return (
			<aside className={'mky-content-info '+this.classExpand}>
				{ (() => {
					switch(this.props.typeAsideInfo) {
						case 'conversation': {
							return (
								<AsideConversationInfo toggleConversationHeader = {this.props.toggleConversationHeader}
									conversationSelected = {this.props.conversationSelected}
									getConversationInfo = {this.props.getConversationInfo}/>
							)
						}
						case 'message' : {
							return (
								<AsideMessageInfo toggleConversationHeader = {this.props.toggleConversationHeader}
									messageSelectedInfo = {this.props.messageSelectedInfo}
									dataDownloadRequest = {this.props.dataDownloadRequest}
		    						getUser = {this.props.getUser}/>
							)
						}
						default:
							break;
					}
				  })()
				}	
			</aside>
		)
	}
}

export default ContentInfo;