import React, { Component } from 'react'
import ContentAside from './ContentAside.js'
import ContentWindow from './ContentWindow.js'

import ContentLogin from './ContentLogin.js'

import Bubble from './Bubble.js'
import BubbleText from './BubbleText.js'
import BubbleImage from './BubbleImage.js'
import BubbleFile from './BubbleFile.js'
import BubbleAudio from './BubbleAudio.js'

import ContentViewer from './ContentViewer.js'

import MyForm from './MyForm.js';
import PopUp from './PopUp.js'
import ContentLogOut from './ContentLogOut.js'
import styles from '../styles/chat.css';

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

class MonkeyUI extends Component {
	constructor(props) {
		super(props);
		this.state = {
			conversation: {},
			contentStyle: undefined,
			classTabIcon: 'mky-icon-arrow-up-light',
			isMobile: isMobile.any() ? true : false,
			showConversations: true,
			showBanner: false,
			wrapperInClass: '',
			showPopUp : false
		}
		this.notifyTime = 0;
		this.toggleTab = this.toggleTab.bind(this);
		this.openSide = this.openSide.bind(this);
		this.handleLoginSession = this.handleLoginSession.bind(this);
		this.handleConversationSelected = this.handleConversationSelected.bind(this);
		this.handleMessageCreated = this.handleMessageCreated.bind(this);
		this.handleUserSessionLogout = this.handleUserSessionLogout.bind(this);
		this.classContent;
		this.expandWindow = false;
		this.handleShowAside = this.handleShowAside.bind(this);
		this.haveConversations = true;
		this.togglePopup = this.togglePopup.bind(this);
		this.handleNotifyTyping = this.handleNotifyTyping.bind(this);

	}

	getChildContext() {
	    return {
		    userSession: this.props.userSession,
		    bubbles: {
			    text: Bubble(BubbleText),
			    image: Bubble(BubbleImage),
			    file: Bubble(BubbleFile),
			    audio: Bubble(BubbleAudio)
		    },
		    bubblePreviews: {
			    image: ContentViewer
		    },
		    styles: this.props.styles != null ? this.props.styles : {},
		    options: this.props.options,
		    extraChat: this.props.chatExtraData
		}
	}

	componentWillMount() {
		this.setState({conversation: this.props.conversation});

		let screenMode;
		let style = {};
		//screen mode for webchat and privatechat
		if(this.props.view.type === 'fullscreen') {
			screenMode = 'fullsize';
			if(this.props.showConversations === false){
				this.haveConversations = false;
				this.setState({showConversations: this.props.showConversations});
				this.expandWindow = true;
			}
		    if(this.props.showBanner === true) {
		        this.setState({showBanner: this.props.showBanner});
		    }
		}else{
			screenMode = 'partialsize';
			style.width = this.props.view.type === 'rightside' ? this.props.sideWidth : this.props.view.data.width;
			style.height = this.props.view.type === 'classic' ? this.props.tabHeight : this.props.view.data.height
		}
		
		this.classContent = this.props.prefix+screenMode+' '+this.props.prefix+this.props.view.type;

		if(this.props.view.type === 'classic'){
			this.haveConversations = false;
			this.setState({
				showConversations: false,
				contentStyle: style,
				wrapperInClass: 'mky-disappear'
			});
			this.expandWindow = true;
		}

	    if (this.props.view.type === 'rightside') {
	    	this.setState({
		    	showConversations: true,
		    	isMobile: true,
		    	contentStyle: style,
		    	wrapperInClass: 'mky-disappear'
		    });
	    }
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.conversation && this.state.conversation && this.state.conversation.id != nextState.conversation.id){
			this.props.onConversationOpened(nextState.conversation);
		}else if(!this.state.conversation && nextState.conversation){
			this.props.onConversationOpened(nextState.conversation);
		}
		return true;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({conversation: nextProps.conversation});
		this.setState({conversations: nextProps.conversations});
	}

	render() {
		const Form_ = ContentLogin(this.props.form);
		const LogOut_ = PopUp(ContentLogOut);
    	return (
			<div className={'mky-wrapper-out '+this.classContent + ' animated pulse'} style={this.state.contentStyle}>
				{ this.props.view.type === 'classic'
					? ( <div className='mky-tab' style={this.defineToggleStyle()} onClick={this.toggleTab}>
                            <span className='mky-tablabel' style={this.defineTabTextColor()}> {this.defineTabText()} </span>
                            <div><i className={'icon '+this.state.classTabIcon}></i></div>
                        </div>
					)
					: ( this.props.view.type === 'rightside'
						? <div className='mky-button' style={this.defineToggleStyle()} onClick={this.openSide}><i className='icon mky-icon-chats'></i></div>
						: null
					)
				}
				<div className={'mky-wrapper-in '+this.state.wrapperInClass}>
					{ this.props.viewLoading
						? (
							<div id='mky-content-connection' className='mky-appear'>
								<div className='mky-spinner'>
									<div className='mky-bounce1'></div>
									<div className='mky-bounce2'></div>
									<div className='mky-bounce3'></div>
								</div>
							</div>
						)
						: null
					}
					{ this.props.userSession
						? ( <div id='mky-content-app' className=''>
								{ this.state.showConversations & this.haveConversations
									? <ContentAside isLoadingConversations={this.props.isLoadingConversations} handleLoadMoreConversations={this.props.onLoadMoreConversations} handleConversationDelete={this.props.onConversationDelete} togglePopup={this.togglePopup} handleConversationExit={this.props.onConversationExit} userSessionLogout={this.props.onUserSessionLogout} conversations={this.state.conversations} handleConversationSelected={this.handleConversationSelected} conversationSelected={this.state.conversation} showBanner={this.state.showBanner} show={this.showListConversation} isMobile={this.state.isMobile} closeSide={this.openSide} conversationsLoading={this.props.conversationsLoading}/>
									: null
								}
								<ContentWindow handleNotifyTyping={this.handleNotifyTyping} panelParams={this.props.panelParams} loadMessages={this.props.onMessagesLoad} conversationSelected={this.state.conversation} conversationClosed={this.props.onConversationClosed} messageCreated={this.handleMessageCreated} expandWindow={this.expandWindow} expandAside={this.handleShowAside} isMobile={this.state.isMobile} isPartialized={this.classContent} showBanner={this.state.showBanner} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.onMessageDownloadData} getUser={this.props.onMessageGetUser} haveConversations={this.haveConversations}/>
							</div>
						)
						: <Form_ handleLoginSession={this.handleLoginSession} styles={this.props.styles}/>
					}
					{ this.state.showPopUp
						? <LogOut_ togglePopup = {this.togglePopup} popUpMessage = {"Are you sure you want to Log Out?"} userSessionLogout={this.handleUserSessionLogout} />
						: null
					}
				</div>
			</div>
		)
	}

	togglePopup() {
		this.setState({
			showPopUp : !this.state.showPopUp
		});
	}

	toggleTab() {
		if(this.state.classTabIcon === 'mky-icon-arrow-up-light'){
			this.setState({
				contentStyle: this.props.view.data,
				classTabIcon: 'mky-icon-arrow-down-light',
				wrapperInClass: ''
			});
		}else{
			let style = {
				width: this.props.view.data.width,
				height: this.props.tabHeight
			}
			this.setState({
				contentStyle: style,
				classTabIcon: 'mky-icon-arrow-up-light',
				wrapperInClass: 'mky-disappear'
			});
		}
	}
	
	openSide() {
		if(this.state.contentStyle.width === 0){
			this.setState({
				contentStyle: this.props.view.data,
				wrapperInClass: ''
			});
		}else{
			let style = {
				width: this.props.sideWidth,
				height: this.props.view.data.height
			}
			this.setState({
				contentStyle: style,
				wrapperInClass: 'mky-disappear'
			});
		}
	}

	handleNotifyTyping(isTyping){
		if(this.props.onNotifyTyping){
			this.props.onNotifyTyping(this.state.conversation.id, isTyping);
			this.notifyTime = new Date();
			setTimeout(() => { 
				var conversationId = this.state.conversation.id;
				var now = new Date();
				var dif = now.getTime() - this.notifyTime.getTime();
				if (dif > 999){
		        	this.props.onNotifyTyping(this.state.conversation.id, false);
	        	}
		    }, 1000);
	    }
	}

	handleLoginSession(user) {
		this.props.onUserSession(user);
	}

	handleUserSessionLogout() {
		this.props.onUserSessionLogout();
	}

	handleConversationAdd(conversation) {
	  	this.setState({conversations: this.state.conversations.concat(conversation)})
	}

	handleConversationSelected(conversation) {
		this.setState({conversation: conversation});

		if (this.state.isMobile) {
			this.setState({showConversations:false}); //escondiendo el aside solo cuando esta en mobile
		}
	}

	handleShowAside(){
		if (this.state.isMobile) {
			this.setState({showConversations:true}); //mostrando el aside solo cuando esta en mobile
		}
	}

	handleMessageCreated(message){
		message.senderId = this.props.userSession.id;
		message.recipientId = this.state.conversation.id;
		message.status = 0;
		this.props.onMessage(message);
	}

	defineToggleStyle(){
		if(this.props.styles != null && this.props.styles.toggleColor != null){
			return {background: this.props.styles.toggleColor};
		}else
			return {};
	}

	defineTabTextColor() {
		if(this.props.styles != null && this.props.styles.tabTextColor != null){
			return {color: this.props.styles.tabTextColor};
		}else
			return {};
	}

	defineTabText() {
		if(this.props.styles != null && this.props.styles.tabText != null){
			return this.props.styles.tabText;
		}else
			return 'Want to know more?';
	}
	
}

MonkeyUI.propTypes = {
	view: React.PropTypes.object,
	form: React.PropTypes.any.isRequired
}

MonkeyUI.defaultProps = {
	prefix: 'mky-',
	view:{
		type: 'fullscreen'
	},
	tabHeight: '30px',
	sideWidth: 0,
	form: MyForm,
	viewLoading: true,
	conversationsLoading: false,
	options: {
		deleteConversation: {
			permission: {
				exitGroup: true,
				delete: true
			}
		}
	},
	chatExtraData: {}
}

MonkeyUI.childContextTypes = {
	userSession: React.PropTypes.object,
	bubbles: React.PropTypes.object,
	bubblePreviews: React.PropTypes.object,
	styles: React.PropTypes.object,
	options: React.PropTypes.object,
	extraChat: React.PropTypes.object
}

/*
if (typeof module !== 'undefined') {
  module.exports = startInterval;
}
*/
export default MonkeyUI;

var ec = document.createElement('script');
ec.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js', ec.type = 'text/javascript', document.getElementsByTagName('head')[0].appendChild(ec)
