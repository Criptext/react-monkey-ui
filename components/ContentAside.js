import React, { Component } from 'react'
import ConversationList from './ConversationList.js';

class ContentAside extends Component {
	constructor(props, context) {
		super(props, context);
		this.logout = this.logout.bind(this);
		this.closeSide = this.closeSide.bind(this);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : '';
	}
	
	render() {
    	return (
			<aside id={this.classContent} className={ this.props.showBanner ? 'aside-divided' : ''} >
				<header id='mky-session-header'>
					<div id='mky-session-image'>
						<img src={this.context.userSession.urlAvatar}/>
					</div>
					<div id='mky-session-description'>
						<div id='mky-session-name'>
							<span className="mky-ellipsify">{this.context.userSession.name}</span>
						</div>
						{ this.props.isMobile
							? <div className="mky-header-exit" onClick={this.closeSide}><i className="icon mky-icon-close-strong"></i></div>
							: <div className="mky-header-exit" onClick={this.logout}><i className="icon mky-icon-logout-right"></i></div>
						}
					</div>
				</header>
				<ConversationList deleteConversation={this.props.deleteConversation} conversations={this.props.conversations} conversationSelected={this.props.conversationSelected}/>
			</aside>
		)
	}

	logout() {
		this.props.userSessionLogout();
	}
	
	closeSide() {
		this.props.closeSide();
	}
}

ContentAside.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ContentAside;
