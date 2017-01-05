import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ConversationListsContainer from './ConversationListsContainer.js';
import { getContrastColorObject } from '../utils/monkey-utils.js'

class ContentAside extends Component {
	constructor(props, context) {
		super(props, context);
		this.classContent = props.compactView ? 'mky-expand-each-screen' : 'mky-no-expand';
		this.classContentt = props.showBanner ? 'aside-divided' : '';
		this.state = {
			editingUsername: false, 
			username: context.userSession.name,
			urlAvatar: context.userSession.urlAvatar ? context.userSession.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'
		}
		
		this.handleErrorAvatar = this.handleErrorAvatar.bind(this);
		this.logout = this.logout.bind(this);
		this.closeSide = this.closeSide.bind(this);
		this.toogleEditUsername=this.toogleEditUsername.bind(this);
		this.handleUsernameKeyDown = this.handleUsernameKeyDown.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleUsernameBlur = this.handleUsernameBlur.bind(this);
	}
	
	componentWillReceiveProps(nextProps, nextContext) {
    	if(nextContext.userSession.urlAvatar != this.state.urlAvatar){
	    	this.setState({urlAvatar: nextContext.userSession.urlAvatar});
    	}
	}
  
	render() {
		let styleHeader = this.defineStyles();
    	return (
			<aside id={this.classContent} className={ 'mky-content-aside ' + this.classContentt} >
				<header className='mky-session-header' style={styleHeader.header}>
					<div className='mky-session-image'>
						<img src={this.state.urlAvatar} onError={this.handleErrorAvatar}/>
					</div>
					<div className='mky-session-description'>
						<div className='mky-session-name'>
							<input ref='usernameChange'
									className='mky-ellipsify mky-edit-input'
									value={this.state.editingUsername ? this.state.username : this.context.userSession.name}
									onChange={this.handleUsernameChange}
									onKeyDown={this.handleUsernameKeyDown}
									onBlur={this.handleUsernameBlur}
									type='text'
									disabled={this.state.editingUsername ? false : true}
									style={styleHeader.title}/>
							{!this.props.usernameEdit || this.state.editingUsername ? null : <i className='icon mky-icon-pencil' onClick={this.toogleEditUsername}></i>}
						</div>
						{ this.props.viewType == 'rightside'
							? ( <div className='mky-conversation-header-options' onClick={this.closeSide} style={styleHeader.title}>
									<div style={styleHeader.optionButton}><i className='icon mky-icon-minimize'></i></div>
								</div>
							)
							: <div className='mky-header-exit' onClick={this.logout}><i className="icon mky-icon-signout"></i></div>
						}
					</div>
				</header>
				<ConversationListsContainer customLoader = {this.props.customLoader}
					compactView = {this.props.compactView}
					isMobile = {this.props.isMobile}
					asidePanelParams = {this.props.asidePanelParams}
					connectionStatus={this.props.connectionStatus}
					isLoadingConversations={this.props.isLoadingConversations}
					handleLoadMoreConversations={this.props.handleLoadMoreConversations}
					conversations={this.props.conversations}
					alternateConversations={this.props.alternateConversations}
					handleConversationSelected={this.props.handleConversationSelected}
					conversationSelected={this.props.conversationSelected}
					conversationsLoading={this.props.conversationsLoading}
					scrollTop = {this.props.scrollTop}
					searchUpdated = {this.props.searchUpdated}/>
			</aside>
		)
	}

	componentDidUpdate(){
		if(this.state.editingUsername){
			var domNode = ReactDOM.findDOMNode(this.refs.usernameChange);
        	domNode.focus();
		}
	}
	
	defineStyles() {
		let style = {
			header: {},
			title: {},
			optionButton: {}
		};
		if(this.context.styles){
			if(this.context.styles.toggleColor){
				style.header.background = this.context.styles.toggleColor;	
				style.header.borderBottom = '1px solid ' + this.context.styles.toggleColor;
				style.optionButton = getContrastColorObject(this.context.styles.toggleColor);
			}
			if(this.context.styles.tabTextColor){
				style.title.color = this.context.styles.tabTextColor
			}
		}
		
		return style;
	}
	
	logout() {
		this.props.togglePopup();
	}

	closeSide() {
		this.props.closeSide();
	}
	
	handleErrorAvatar() {
		this.setState({urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'});
	}

	toogleEditUsername(){
		if(!this.state.editingUsername){
			this.setState({
				username : this.context.userSession.name
			});
		}
		this.setState({
			editingUsername : !this.state.editingUsername
		});
		var domNode = ReactDOM.findDOMNode(this.refs.usernameChange);
        domNode.focus();
	}

	handleUsernameChange(event) {
        this.setState({
			username: event.target.value,
		});
	}

	handleUsernameKeyDown(event){
		if(event.keyCode === 13 && !event.shiftKey) {
			this.props.usernameEdit(this.state.username);
			this.setState({
				editingUsername: false
			});
		}
	}

	handleUsernameBlur(event){
		this.setState({
			username: this.context.userSession.name,
			editingUsername: false
		});
	}
}

ContentAside.contextTypes = {
    userSession: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object.isRequired
}

export default ContentAside;
