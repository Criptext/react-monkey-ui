import React, { Component } from 'react'
import ConversationList from './ConversationList.js';

class ContentAside extends Component {
	constructor(props, context) {
		super(props, context);
		this.logout = this.logout.bind(this);
		this.closeSide = this.closeSide.bind(this);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : '';
		this.defineUrlAvatar = this.defineUrlAvatar.bind(this);
	}

	render() {
    	return (
			<aside id={this.classContent} className={ this.props.showBanner ? 'aside-divided' : ''} >
				<header id='mky-session-header'>
					<div id='mky-session-image'>
						<img src={this.defineUrlAvatar()}/>
					</div>
					<div id='mky-session-description'>
						<div id='mky-session-name'>
							<span className='mky-ellipsify'>{this.context.userSession.name}</span>
						</div>
						{ this.props.isMobile
							? <div className='mky-header-exit' onClick={this.closeSide}><i className='icon mky-icon-close-medium'></i></div>
							: <div className='mky-header-exit' onClick={this.logout}><i className="icon mky-icon-signout-sober"></i></div>
						}
					</div>
				</header>
				<ConversationList handleConversationDelete={this.props.handleConversationDelete} handleConversationExit={this.props.handleConversationExit} conversations={this.props.conversations} handleConversationSelected={this.props.handleConversationSelected} conversationSelected={this.props.conversationSelected} conversationsLoading={this.props.conversationsLoading}/>
			</aside>
		)
	}

	logout() {
		this.props.togglePopup();
	}

	closeSide() {
		this.props.closeSide();
	}

	defineUrlAvatar() {
		return this.context.userSession.avatar ? this.context.userSession.avatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png';
	}
}

ContentAside.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ContentAside;
