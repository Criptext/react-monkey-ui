import React, { Component } from 'react'
import Badge from './Badge.js'
import { defineTime, defineTimeByToday } from '../utils/monkey-utils.js'

class ConversationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unreadMessages: false,
			urlAvatar: this.props.conversation.urlAvatar ? this.props.conversation.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'
		}
		this.openConversation = this.openConversation.bind(this);
		this.deleteConversation = this.deleteConversation.bind(this);
		this.handleErrorAvatar = this.handleErrorAvatar.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversation.unreadMessageCounter > 0){
			this.setState({unreadMessages: true});
		}else{
			this.setState({unreadMessages: false});
		}
	}

	render() {

			let classContent = this.props.selected ? 'mky-conversation-selected' : 'mky-conversation-unselected';
    	return (
			<li className={classContent}>
				<div className='mky-full' onClick={this.openConversation}>
					<div className='mky-conversation-image'><img src={this.state.urlAvatar} onError={this.handleErrorAvatar}/></div>
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
										<div className="mky-message-status mky-status-read" ><i className="icon mky-icon-check-sober mky-message-read"></i></div>:''
									):null
								):null
							}

				</div>
			</li>
		)
	}

	handleErrorAvatar() {
		this.setState({urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'});
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
}


export default ConversationItem;
