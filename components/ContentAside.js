import React, { Component } from 'react'
import ConversationList from './ConversationList.js';
import ReactDOM from 'react-dom'

class ContentAside extends Component {
	constructor(props, context) {
		super(props, context);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-no-expand';
		this.classContentt = this.props.showBanner ? 'aside-divided' : '';
		this.state = {
			editingUsername : false, 
			username : this.context.userSession.name,
		}

		this.logout = this.logout.bind(this);
		this.closeSide = this.closeSide.bind(this);
		this.defineUrlAvatar = this.defineUrlAvatar.bind(this);
		this.toogleEditUsername=this.toogleEditUsername.bind(this);
		this.handleUsernameKeyDown = this.handleUsernameKeyDown.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleUsernameBlur = this.handleUsernameBlur.bind(this);
	}

	render() {
    	return (
			<aside id={this.classContent} className={ 'mky-content-aside ' + this.classContentt} >
				<header className='mky-session-header'>
					<div className='mky-session-image'>
						<img src={this.defineUrlAvatar()}/>
					</div>
					<div className='mky-session-description'>
						<div className='mky-session-name'>
							<input ref='usernameChange'
									className='mky-ellipsify mky-edit-input'
									value={this.state.username}
									onChange={this.handleUsernameChange}
									onKeyDown={this.handleUsernameKeyDown}
									onBlur={this.handleUsernameBlur}
									type='text'
									disabled={this.state.editingUsername ? false : true}/>
							{this.state.editingUsername ? null : <i className='icon mky-icon-edit mky-info-edit-name' onClick={this.toogleEditUsername}></i>}
						</div>
						{ this.props.viewType == 'rightside'
							? <div className='mky-header-exit' onClick={this.closeSide}><i className='icon mky-icon-close-medium'></i></div>
							: <div className='mky-header-exit' onClick={this.logout}><i className="icon mky-icon-signout-sober"></i></div>
						}
					</div>
				</header>
				<ConversationList customLoader = {this.props.customLoader}
					isMobile = {this.props.isMobile}
					asidePanelParams = {this.props.asidePanelParams}
					connectionStatus={this.props.connectionStatus}
					isLoadingConversations={this.props.isLoadingConversations}
					handleLoadMoreConversations={this.props.handleLoadMoreConversations}
					handleConversationDelete={this.props.handleConversationDelete}
					handleConversationExit={this.props.handleConversationExit}
					conversations={this.props.conversations}
					handleConversationSelected={this.props.handleConversationSelected}
					conversationSelected={this.props.conversationSelected}
					conversationsLoading={this.props.conversationsLoading}/>
			</aside>
		)
	}

	componentDidUpdate(){
		if(this.state.editingUsername){
			var domNode = ReactDOM.findDOMNode(this.refs.usernameChange);
        	domNode.focus();
		}
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

	toogleEditUsername(){
		this.setState({
			editingUsername : !this.state.editingUsername
		});
		var domNode = ReactDOM.findDOMNode(this.refs.usernameChange);
        domNode.focus();
	}

	handleUsernameChange(event) {
        this.setState({
			username : event.target.value,
		});
	}

	handleUsernameKeyDown(event){
		if(event.keyCode === 13 && !event.shiftKey) {
			this.props.usernameEdit(this.state.username);
			this.setState({
				editingUsername : false
			});
		}
	}

	handleUsernameBlur(event){
		this.setState({
			username : this.context.userSession.name,
			editingUsername : false
		});
	}
}

ContentAside.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ContentAside;
