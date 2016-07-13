import React, { Component } from 'react'
import { defineTime, defineTimeByToday } from '../utils/monkey-utils.js'

class ConversationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unreadMessages: false
		}
		this.openConversation = this.openConversation.bind(this);
		this.deleteConversation = this.deleteConversation.bind(this);
		this.defineUrlAvatar = this.defineUrlAvatar.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversation.unreadMessageCounter > 0){
			this.setState({unreadMessages: true});
		}else{
			this.setState({unreadMessages: false});
		}
	}

	render() {
			// console.log('conversation information');
			// console.log(this.props.conversation.messages);
			let classContent = this.props.selected ? 'mky-conversation-selected' : 'mky-conversation-unselected';
    	return (
			<li className={classContent}>
				<div className='mky-full' onClick={this.openConversation}>
					<div className='mky-conversation-image'><img src={this.defineUrlAvatar()} onerror='imgError(this);'/></div>
					<div className='mky-conversation-description'>
						<div className='mky-conversation-title'>
							<div className='mky-conversation-name'>
								{ this.state.unreadMessages
									? <span className='mky-ellipsify mky-bold-text'>{this.props.conversation.name}</span>
									: <span className='mky-ellipsify'>{this.props.conversation.name}</span>
								}
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
								? ( this.state.unreadMessages
									? <span className='mky-ellipsify mky-bold-text'>{this.props.conversation.messages[this.props.conversation.lastMessage] ? this.props.conversation.messages[this.props.conversation.lastMessage].preview : ''}</span>
									: <span className='mky-ellipsify'>{this.props.conversation.messages[this.props.conversation.lastMessage] ? this.props.conversation.messages[this.props.conversation.lastMessage].preview : ''}</span>
								)
								: <span className="mky-ellipsify">Click to open conversation</span>
							}
						</div>
					</div>
				</div>
				<div className='mnk-conversation-opts'>
					<div className='mky-delete-conv' onClick={this.deleteConversation}><i className='icon mky-icon-close animated pulse'></i></div>
					<Badge value={this.props.conversation.unreadMessageCounter} />

							{ Object.keys(this.props.conversation.messages).length ? (
									this.props.conversation.messages[this.props.conversation.lastMessage] ?
									(this.props.conversation.messages[this.props.conversation.lastMessage].status == 52 ?
										<span> c </span>:''
									):null
								):null
							}

				</div>
			</li>
		)
	}

	openConversation() {
		this.props.conversationIdSelected(this.props.conversation.id);
	}

	deleteConversation() {
		if(this.props.selected) {
			this.props.deleteConversation(this.props.conversation, this.props.index, true)
		}else{
			this.props.deleteConversation(this.props.conversation, this.props.index, false)
		}
	}

	defineUrlAvatar() {
		return this.props.conversation.urlAvatar ? this.props.conversation.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png';
	}
}

const Badge = (props , showNotification) => (
	<div className='mky-conversation-notification'>
	{ props.value > 0
		? <div className='mky-notification-amount animated pulse'>{props.value}</div>
		: null
	}
	</div>
);

export default ConversationItem;
