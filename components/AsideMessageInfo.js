import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import InfoItem from './InfoItem.js'
import { defineDate, isConversationGroup, defineTime } from '../utils/monkey-utils.js'
import Lang from '../lang'

import Bubble from './Bubble.js';
import BubbleText from './BubbleText.js';
import BubbleImage from './BubbleImage.js';
import BubbleFile from './BubbleFile.js';
import BubbleAudio from './BubbleAudio.js';
import BubbleContact from './BubbleContact.js';

const BubbleText_ = Bubble(BubbleText);
const BubbleImage_ = Bubble(BubbleImage);
const BubbleFile_ = Bubble(BubbleFile);
const BubbleAudio_ = Bubble(BubbleAudio);
const BubbleContact_ = Bubble(BubbleContact);

class AsideMessageInfo extends Component {
	constructor(props, context) {
		super(props, context);
		this.objectInfo = {};
		this.state = {
			editingName: false, 
			infoName: '',
			urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'
		}
		this.closeAside = this.closeAside.bind(this);
	}

	render() {
    	return (
			<div className='mky-info-conversation'>
				<header className='mky-info-header'>
					<div className='mky-info-close' onClick={this.closeAside}><i className='icon mky-icon-close'></i></div>
					<div className='mky-info-header-message'>
						<span className='mky-info-message-title mky-ellipsify'>Message Info</span>
						<span className='mky-info-message-subtitle'>{ Lang[this.context.lang]['title.sent'] + ' ' + defineDate(this.props.messageSelectedInfo.message.datetimeCreation) + ' ' + Lang[this.context.lang]['text.at'] + ' ' + defineTime(this.props.messageSelectedInfo.message.datetimeCreation)}</span>
					</div>
				</header>
				<div className='mky-info-container'>
					<div className='mky-info-message-container'>
						{this.renderMessage(this.props.messageSelectedInfo.message)}
					</div>
					<div className='mky-info-conversation-description mky-info-conversation-members'>
						<div className='mky-info-conversation-header'>
							<label className='mky-info-conversation-title mky-ellipsify'>{Lang[this.context.lang]['title.readby'] + ':'}</label>
						</div>
						<div className='mky-info-conversation-container'>
							<ul className='mky-info-conversation-list'>
								{this.renderList(this.props.messageSelectedInfo.users)}
							</ul>
						</div>
					</div>
					<div className='mky-space'></div>
				</div>
			</div>
		)
	}

	renderMessage(message) {
		switch(message.bubbleType){
			case 'text':
				return (<BubbleText_ key={message.id}
									message={message}
									userSessionId={this.context.userSession.id}
									layerClass={message.bubbleType}
									dataDownloadRequest={this.props.dataDownloadRequest}
									getUser={this.props.getUser}
									styles={this.context.styles}
									showOptions={false}/>)
			case 'image':
				return (<BubbleImage_ key={message.id}
									message={message}
									userSessionId={this.context.userSession.id}
									layerClass={message.bubbleType}
									dataDownloadRequest={this.props.dataDownloadRequest}
									getUser={this.props.getUser}
									styles={this.context.styles}
									showOptions={false}/>)
			case 'file':
				return (<BubbleFile_ key={message.id}
									message={message}
									userSessionId={this.context.userSession.id}
									layerClass={message.bubbleType}
									dataDownloadRequest={this.props.dataDownloadRequest}
									getUser={this.props.getUser}
									styles={this.context.styles}
									showOptions={false}/>)
			case 'audio':
				return (<BubbleAudio_ key={message.id}
									message={message}
									userSessionId={this.context.userSession.id}
									layerClass={message.bubbleType}
									dataDownloadRequest={this.props.dataDownloadRequest}
									getUser={this.props.getUser}
									styles={this.context.styles}
									showOptions={false}/>)
			case 'contact':
				return (<BubbleContact_ key={message.id}
									message={message}
									userSessionId={this.context.userSession.id}
									layerClass={message.bubbleType}
									dataDownloadRequest={this.props.dataDownloadRequest}
									getUser={this.props.getUser}
									styles={this.context.styles}
									showOptions={false}/>)
			default:
				break;
		}			
	}

	renderList(items){
		if(!items){
			return;
		}

		var itemList = [];

		items.forEach((item) => {
			if(item){
				itemList.push(<MessageInfoUser key={item.id} item={item} />);
			}
		})

		return itemList;
	}

	closeAside(){
		this.props.messageSelectedInfo.close();
		this.props.toggleConversationHeader('message');
	}
}

AsideMessageInfo.contextTypes = {
    userSession: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object.isRequired,
	lang: React.PropTypes.string.isRequired
}

const MessageInfoUser = (props) => <li className='mky-info-conversation-member'>
	<img src={props.item.avatar ? props.item.avatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'} />
	<div className='mky-message-info-desc'>
		<div className='mky-info-member-detail'>
			<span className='mky-info-member-name'>{props.item.name}</span>
		</div>
		<span className={props.item.description == "Online" ? 'mky-info-member-status mky-info-member-online' : 'mky-info-member-status'}>{props.item.description}</span>
	</div> 
	<div className={props.item.read ? "mky-message-read-check mky-status-read" : "mky-message-read-check mky-status-sent"}>
		<i className="icon mky-icon-check"></i>
	</div>
</li>

export default AsideMessageInfo;




