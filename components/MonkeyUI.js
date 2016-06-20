import React, { Component } from 'react'
import ContentAside from './ContentAside.js'
import ContentWindow from './ContentWindow.js'

import ContentLogin from './ContentLogin.js'

import BubbleText from './BubbleText.js'
import BubbleImage from './BubbleImage.js'
import BubbleFile from './BubbleFile.js'
import BubbleAudio from './BubbleAudio.js'

import ContentViewer from './ContentViewer.js'

import MyForm from './MyForm.js'
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
	constructor(props){
		super(props);
		this.state = {
			conversation: {},
			contentStyle: undefined,
			classTabIcon: 'mky-icon-arrow-up-big',
			isMobile: isMobile.any() ? true : false,
			showConversations: true,
			showBanner: false,
			isLoading: false,
			wrapperInClass: ''
		}
		this.openTab = this.openTab.bind(this);
		this.openSide = this.openSide.bind(this);
		this.handleLoginSession = this.handleLoginSession.bind(this);
		this.handleConversationSelected = this.handleConversationSelected.bind(this);
		this.handleMessageCreated = this.handleMessageCreated.bind(this);
		this.classContent;
		this.expandWindow = false;
		this.handleShowAside = this.handleShowAside.bind(this);
		this.isLoading = false;
		this.haveConversations = true;
	}

	getChildContext() {
	    return {
		    userSession: this.props.userSession,
		    bubbles: {
			    text: BubbleText,
			    image: BubbleImage,
			    file: BubbleFile,
			    audio: BubbleAudio
		    },
		    bubblePreviews: {
			    image: ContentViewer
		    },
		    styles: this.props.styles != null ? this.props.styles : {},
		    extraChat: this.props.extraChat
		}
	}

	componentWillMount() {
		this.setState({conversation: this.props.conversation});

		let screenMode;
		let style = {};
		//screen mode for webchat and privatechat
		if(this.props.view.type === 'fullscreen'){
			screenMode = 'fullsize';
			if(this.props.showConversations === false){
				this.haveConversations = false;
				this.setState({showConversations: this.props.showConversations});
				this.expandWindow = true;
			}
		    if(this.props.showBanner === true){
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
			this.props.conversationOpened(nextState.conversation);
		}else if(!this.state.conversation && nextState.conversation){
			this.props.conversationOpened(nextState.conversation);
		}
		return true;
	}

	componentWillReceiveProps(nextProps) {

		this.setState({conversation: nextProps.conversation});
		this.setState({conversations: nextProps.conversations});

		if(nextProps.userSession && (nextProps.userSession.id && this.state.isLoading)){
			this.setState({isLoading: false});
			console.log('App - login ok');
		}
	}

	render() {
		const Form_ = ContentLogin(this.props.form);
    	return (
			<div className={'mky-wrapper-out '+this.classContent + ' animated pulse'} style={this.state.contentStyle}>
				{ this.props.view.type === 'classic'
					? ( <div className='mky-tab' style={this.defineTabStyle()}>
                            <span className='mky-tablabel' style={this.defineTabTextColor()}> {this.defineTabText()} </span>
                            <div onClick={this.openTab}><i className={'icon '+this.state.classTabIcon}></i></div>
                        </div>
					)
					: ( this.props.view.type === 'rightside'
						? <div className='mky-button' onClick={this.openSide}><i className='icon mky-icon-chats'></i></div>
						: null
					)
				}
				<div className={'mky-wrapper-in '+this.state.wrapperInClass}>
					{ this.state.isLoading
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
									? <ContentAside deleteConversation={this.props.deleteConversation} userSessionLogout={this.props.userSessionLogout} conversations={this.state.conversations} conversationSelected={this.handleConversationSelected} showBanner={this.state.showBanner} show={this.showListConversation} isMobile={this.state.isMobile} closeSide={this.openSide}/>
									: null
								}
								<ContentWindow loadMessages={this.props.loadMessages} conversationSelected={this.state.conversation} messageCreated={this.handleMessageCreated} expandWindow={this.expandWindow} expandAside={this.handleShowAside} isMobile={this.state.isMobile} isPartialized={this.classContent} showBanner={this.state.showBanner} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUserName={this.props.getUserName} haveConversations={this.haveConversations}/>
							</div>
						)
						: <Form_ handleLoginSession={this.handleLoginSession} styles={this.props.styles}/>
					}
				</div>
			</div>
		)
	}

	openTab() {
		if(this.state.classTabIcon === 'mky-icon-arrow-up-big'){
			this.setState({
				contentStyle: this.props.view.data,
				classTabIcon: 'mky-icon-arrow-down-big',
				wrapperInClass: ''
			});
		}else{
			let style = {
				width: this.props.view.data.width,
				height: this.props.tabHeight
			}
			this.setState({
				contentStyle: style,
				classTabIcon: 'mky-icon-arrow-up-big',
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

	handleLoginSession(user) {
		this.setLoading(true);
		this.props.userSessionToSet(user);
	}

	setLoading(value) {
		this.setState({isLoading: value});
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
		this.props.messageToSet(message);
	}

	defineTabStyle(){
		if(this.props.styles != null && this.props.styles.tabColor != null){
			return {background: this.props.styles.tabColor};
		}else
			return {};
	}

	defineTabTextColor(){
		if(this.props.styles != null && this.props.styles.tabTextColor != null){
			return {color: this.props.styles.tabTextColor};
		}else
			return {};
	}

	defineTabText(){
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
	form: MyForm
}

MonkeyUI.childContextTypes = {
	userSession: React.PropTypes.object,
	bubbles: React.PropTypes.object,
	bubblePreviews: React.PropTypes.object,
	styles: React.PropTypes.object,
	extraChat: React.PropTypes.object
}

/*
if (typeof module !== 'undefined') {
  module.exports = startInterval;
}
*/
export default MonkeyUI;

var e = document.createElement('link');
e.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css', e.type = 'text/css', e.rel = 'stylesheet', document.getElementsByTagName('head')[0].appendChild(e)

var ec = document.createElement('script');
ec.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js', ec.type = 'text/javascript', document.getElementsByTagName('head')[0].appendChild(ec)
