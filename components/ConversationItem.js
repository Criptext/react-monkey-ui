import React, { Component } from 'react'
import Badge from './Badge.js'
import { defineTime, defineTimeByToday } from '../utils/monkey-utils.js'

const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}

class ConversationItem extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			unreadMessages: this.props.conversation.unreadMessageCounter > 0 ? true : false,
			urlAvatar: this.props.conversation.urlAvatar ? this.props.conversation.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png',
			pressClass: 'mky-not-pressed'
		}
		this.openConversation = this.openConversation.bind(this);
		this.deleteConversation = this.deleteConversation.bind(this);
		this.handleErrorAvatar = this.handleErrorAvatar.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.longPressDuration = 900;
		this.timer = null;
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversation.unreadMessageCounter > 0 && !this.state.unreadMessages) {
			this.setState({unreadMessages: true});
		}else if(nextProps.conversation.unreadMessageCounter === 0 && this.state.unreadMessages) {
			this.setState({unreadMessages: false});
		}
	}

	render() {

		let classSelect = this.props.selected ? 'mky-conversation-selected' : 'mky-conversation-unselected';
		let classUnread = this.state.unreadMessages ? 'mky-conversation-unread' : '';
		let classContent = 'mky-conversation-item ' + classSelect + ' ' + classUnread + ' ' + this.state.pressClass;

    	return (
			<li className={classContent}>
				<div className='mky-conversation-item-content' onClick={this.openConversation} onTouchMove={this.handleTouchMove} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
					<div className='mky-conversation-image'><img src={this.state.urlAvatar} onError={this.handleErrorAvatar}/></div>
					<div className='mky-conversation-description'>
						<div className='mky-conversation-title'>
							<div className='mky-conversation-name'>
								<span className='mky-ellipsify'>{this.props.conversation.name}</span>
							</div>
							<div className='mky-conversation-time'>
								{ this.state.unreadMessages
									? <span className=''>{this.props.conversation.messages[this.props.conversation.lastMessage] ? defineTimeByToday(this.props.conversation.messages[this.props.conversation.lastMessage].datetimeCreation) : ''}</span>
									: <span className='mky-read-conversation-span' >{this.props.conversation.messages[this.props.conversation.lastMessage] ? defineTimeByToday(this.props.conversation.messages[this.props.conversation.lastMessage].datetimeCreation) : ''}</span>
								}
							</div>
						</div>
						<div className='mky-conversation-state'>
							{ Object.keys(this.props.conversation.messages).length
								? ( this.props.conversation.messages[this.props.conversation.lastMessage]
									? (this.props.conversation.messages[this.props.conversation.lastMessage].status == 52 && this.props.conversation.messages[this.props.conversation.lastMessage].senderId === this.context.userSession.id
										? <div className='mky-message-status mky-status-read'><i className='icon mky-icon-check-sober mky-message-read'></i></div>
										: ''
									)
									: null
								)
								: null
							}
							{ this.props.conversation.preview && !this.props.selected
								? <span className='mky-ellipsify mky-typing'> {this.props.conversation.preview} </span>
								: Object.keys(this.props.conversation.messages).length
									? ( <span className='mky-ellipsify'>{this.props.conversation.messages[this.props.conversation.lastMessage]
										? this.props.conversation.messages[this.props.conversation.lastMessage].preview
										: '' }</span>
									)
									: <span className='mky-ellipsify'>Click to open conversation</span>
							}
						</div>
					</div>
				</div>
				<div className='mky-conversation-options'>
					{ this.props.deleteOption
						? <div className='mky-conversation-delete' onClick={this.deleteConversation}><i className='icon mky-icon-close animated pulse'></i></div>
						: null
					}
					<Badge value={ (this.props.conversation.unreadMessageCounter && !this.props.selected) ? this.props.conversation.unreadMessageCounter : 0} />
				</div>
			</li>
		)
	}

	handleErrorAvatar() {
		this.setState({urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'});
	}

	openConversation() {
		if(isMobile.any()){
			return;
		}
		this.props.conversationIdSelected(this.props.conversation.id);
	}

	deleteConversation() {
		if(this.props.selected) {
			this.props.deleteConversation(this.props.conversation, this.props.index, true)
		}else{
			this.props.deleteConversation(this.props.conversation, this.props.index, false)
		}
	}

	handleTouchStart(event){
		event.stopPropagation();
		if(!isMobile.any()){
			return;
		}
		this.setState({
			pressClass : 'mky-pressing'
		});
		this.timer = setTimeout(() => {
			this.timer = 0;
			this.setState({
				pressClass : 'mky-not-pressed'
			});
			this.deleteConversation();
		}, this.longPressDuration);
	}

	handleTouchMove(event){
		clearTimeout(this.timer);
		this.timer = 0;
		this.setState({
			pressClass : 'mky-not-pressed'
		});
	}

	handleTouchEnd(event){
		event.stopPropagation();
		if(this.timer){
			clearTimeout(this.timer);
			this.setState({
				pressClass : 'mky-not-pressed'
			});
			this.props.conversationIdSelected(this.props.conversation.id);
		}
	}
}

ConversationItem.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ConversationItem;
