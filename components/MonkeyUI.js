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
import Lang from '../lang'

import MyForm from './MyForm.js'
import PopUp from './PopUp.js'
import ContentLogOut from './ContentLogOut.js'
import styles from '../styles/chat.css'

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
			classTabIcon: 'mky-icon-arrow-up',
			showConversations: props.showConversations,
			showBanner: false,
			wrapperInClass: '',
			showPopUp: false,
			showAsideInfo: false,
			typeAsideInfo: '',
			compactView: isMobile.any() ? true : false
		}
		this.isMobile = isMobile.any() ? true : false;
		this.lastNotifyTime = 0;
		this.firstNotifyTime = 0;
		this.notifyTimeout = null;
		this.listTopScroll = 0;
		this.exitButton = false;
		this.toggleTab = this.toggleTab.bind(this);
		this.toggleSide = this.toggleSide.bind(this);
		this.handleLoginSession = this.handleLoginSession.bind(this);
		this.handleConversationSelected = this.handleConversationSelected.bind(this);
		this.handleMessageCreated = this.handleMessageCreated.bind(this);
		this.handleUserSessionLogout = this.handleUserSessionLogout.bind(this);
		this.classContent;
		this.expandWindow = false;
		this.handleShowAside = this.handleShowAside.bind(this);
		this.haveConversations = props.showConversations;
		this.togglePopup = this.togglePopup.bind(this);
		this.handleNotifyTyping = this.handleNotifyTyping.bind(this);
		this.formOptions = this.formOptions.bind(this);
		this.handleShowOptionList = this.handleShowOptionList.bind(this);
		this.messageOptionsPosition = {x : 0, y : 0};
		this.hideMessageOption = this.hideMessageOption.bind(this);
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
		    options: this.formOptions(),
		    lang: this.props.lang,
		    extraChat: this.props.chatExtraData
		}
	}
	
	formOptions() {
		if(this.props.options){
			if(!this.props.options.conversation){
				this.props.options.conversation = {
					onSort: undefined,
					onSecondSort: undefined,
					optionsToDelete: {
						onExitGroup: undefined,
						onDelete: undefined
					},
					onEnd: undefined,
					emptyConversationsMessage: undefined,
					emptyAlternateConversationsMessage: undefined
				}
			}else if(!this.props.options.conversation.optionsToDelete){
				this.props.options.conversation.optionsToDelete = {
					onExitGroup: undefined,
					onDelete: undefined
				}
			}
			
			if(!this.props.options.message){
				this.props.options.message = {
					optionsToIncoming: undefined,
					optionsToOutgoing: undefined
				}
			}
			
			if(!this.props.options.input){
				this.props.options.input = {
					textPlaceholder: undefined
				}
			}	
		}
		
		return this.props.options	
	}
		
	componentWillMount() {
		this.setState({conversation: this.props.conversation});

		let screenMode;
		let style = {};

		// screen mode for webchat and privatechat
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
			style.width = this.props.view.type === 'rightside' ? this.props.sideWidth : (this.isMobile ? 'calc(100% - 20px)' : this.props.view.data.width);
			style.height = this.props.view.type === 'classic' ? this.props.tabHeight : this.props.view.data.height;
		}

		this.classContent = this.props.prefix+screenMode+' '+this.props.prefix+this.props.view.type;

		if(this.props.view.type === 'classic'){
			this.haveConversations = false;
			this.setState({
				showConversations: false,
				compactView: true,
				contentStyle: style,
				wrapperInClass: 'mky-disappear'
			});
			this.expandWindow = true;
		}

	    if(this.props.view.type === 'rightside') {
	    	this.setState({
		    	showConversations: this.props.showConversations,
		    	compactView: true,
		    	contentStyle: style,
		    	wrapperInClass: 'mky-disappear'
		    });
	    }
	    
	    if(this.props.view.type === 'embedded') {
		    this.setState({
		    	showConversations: this.props.showConversations,
		    	compactView: true,
		    	contentStyle: style
		    });
		    this.exitButton = this.props.view.data.exitButton;
	    }
	}

	componentWillReceiveProps(nextProps) {
		this.setState({conversation: nextProps.conversation});
		this.setState({conversations: nextProps.conversations});
		this.setState({alternateConversations: nextProps.alternateConversations});

		if (this.props.conversation && nextProps.conversation){
			if (this.state.compactView && this.props.conversation.id !== nextProps.conversation.id) {
				this.setState({showConversations: false}); //escondiendo el aside(list conversation) solo cuando esta en compact view
				if(this.state.wrapperInClass === 'mky-disappear'){
					this.toggleSide();
				}
			}
		}else if(!this.props.conversation && nextProps.conversation) {
			if (this.state.compactView) {
				this.setState({showConversations: false}); //escondiendo el aside(list conversation) solo cuando esta en compact view
/*
				if(this.state.wrapperInClass === 'mky-disappear' && this.props.view.type === 'rightside'){
					this.toggleSide();
				}
*/
			}
		}
		
		if(this.props.view.type === 'embedded' && nextProps.chatOpened) {
			if(this.state.contentStyle.width === 0){
				this.toggleSide();
			}
		}
	}
	
	render() {
		const Form_ = ContentLogin(this.props.form);
		const LogOut_ = PopUp(ContentLogOut);
    	return (
    		<div>
				<div className={'mky-wrapper-out '+this.classContent + ' animated pulse'} style={this.state.contentStyle}>
					{ this.props.view.type === 'classic'
						? ( <div className='mky-tab' style={this.defineToggleStyle()} onClick={this.toggleTab}>
	                            <span className='mky-tablabel' style={this.defineTitleTextColor()}> {this.defineToggleText()} </span>
	                            <div><i className={'icon '+this.state.classTabIcon} style={this.defineTitleTextColor()}></i></div>
	                        </div>
						)
						: ( this.props.view.type === 'rightside'
							? <div className='mky-button' style={this.defineToggleStyle()} onClick={this.toggleSide}><i className='icon mky-icon-criptext' style={this.defineTitleTextColor()}></i></div>
							: null
						)
					}
					<div className={'mky-wrapper-in '+this.state.wrapperInClass}>
						{ this.props.viewLoading
							? ( <div className='mky-content-connection mky-appear'>
								{ this.props.customeLoader
									? ( <div className='mky-spinner'>
											<div className='mky-bounce1'></div>
											<div className='mky-bounce2'></div>
											<div className='mky-bounce3'></div>
										</div>
									)
									: <Loading customLoader={this.props.customLoader} />
								}			
								</div>
							)
							: null
						}
						{ this.props.userSession
							? ( <div className='mky-content-app'>					
								{ this.haveConversations && this.state.showConversations
									? <ContentAside asidePanelParams={this.props.asidePanelParams}
										connectionStatus={this.props.connectionStatus}
										isLoadingConversations={this.props.isLoadingConversations}
										handleLoadMoreConversations={this.props.onLoadMoreConversations}
										togglePopup={this.togglePopup}
										userSessionLogout={this.props.onUserSessionLogout}
										conversations={this.state.conversations}
										alternateConversations = {this.state.alternateConversations}
										handleConversationSelected={this.handleConversationSelected}
										conversationSelected={this.props.conversation}
										showBanner={this.state.showBanner}
										show={this.showListConversation}
										compactView={this.state.compactView}
										isMobile={this.isMobile}
										closeSide={this.toggleSide}
										conversationsLoading={this.props.conversationsLoading}
                    					viewType={this.props.view.type}
                    					customLoader = {this.props.customLoader}
                    					usernameEdit = {this.props.onUserSessionEdit}
                    					scrollTop = {this.listTopScroll}
                    					searchUpdated = {this.props.searchUpdated}
                    					userSession = {this.props.userSession}/>
									: null
								}
								<ContentWindow ref='contentWindow'
									connectionStatus={this.props.connectionStatus}
									handleNotifyTyping={this.handleNotifyTyping}
									panelParams={this.props.panelParams}
									loadMessages={this.props.onMessagesLoad}
									conversationSelected={this.props.conversation}
									conversationClosed={this.props.onConversationClosed}
									messageCreated={this.handleMessageCreated}
									expandWindow={this.expandWindow}
									expandAside={this.handleShowAside}
									compactView={this.state.compactView}
									isPartialized={this.classContent}
									showBanner={this.state.showBanner}
									onClickMessage={this.props.onClickMessage}
									dataDownloadRequest={this.props.onMessageDownloadData}
									getUser={this.props.onMessageGetUser}
									haveConversations={this.haveConversations}
                					version={this.props.view.version}
                					customLoader = {this.props.customLoader}
        							viewType={this.props.view.type}
        							closeSide={this.toggleSide}
        							getConversationInfo = {this.props.onConversationLoadInfo}
        							showOptionList = {this.handleShowOptionList}
        							messageSelectedInfo = {this.props.messageLoadInfo}
        							overlayView = {this.props.overlayView}
        							exitButton = {this.exitButton}/>
							</div>
							)
							: <Form_ handleLoginSession={this.handleLoginSession} styles={this.props.styles} custom={this.props.chatExtraData}/>
						}
						{ this.state.showPopUp
							? <LogOut_ togglePopup={this.togglePopup} popUpMessage={Lang[this.props.lang]['ask.logout']} userSessionLogout={this.handleUserSessionLogout} lang={this.props.lang}/>
							: null
						}
					</div>
					{ this.props.view.type === 'rightside' && !this.props.userSession
						? ( <div className='mky-rightside-option'>
								<div onClick={this.toggleSide}><i className='icon mky-icon-close'></i></div>
							</div>
						)
						: null
					}
				</div>
				{ this.state.messageOptions 
					? (() => {
						let options = null;
						options = this.state.messageOptions.map( (option) => {
							return <div key={option.action} className='mky-message-option-item' onClick={ () => { this.hideMessageOption(option.func) } }>{option.action}</div>
						})

						return (<div>
							<div className='mky-out-options-back' onClick={ () => { this.hideMessageOption(null) } }></div>
							<div className='mky-out-message-options' style={this.messageOptionsPosition}>
								{options}
							</div>
						</div>)

					})()
					: null
				}
			</div>
		)
	}

	togglePopup() {
		this.setState({showPopUp: !this.state.showPopUp});
	}

	toggleTab() {
		if(this.state.classTabIcon === 'mky-icon-arrow-up'){
			let style = {
				width: this.isMobile ? 'calc(100% - 20px)' : this.props.view.data.width,
				height: this.isMobile ? 'calc(100% - 10px)' : this.props.view.data.height
			}
			this.setState({
				contentStyle: style,
				classTabIcon: 'mky-icon-arrow-down',
				wrapperInClass: ''
			});
		}else{
			let style = {
				width: this.isMobile ? 'calc(100% - 20px)' : this.props.view.data.width,
				height: this.props.tabHeight
			}
			this.setState({
				contentStyle: style,
				classTabIcon: 'mky-icon-arrow-up',
				wrapperInClass: 'mky-disappear'
			});
		}
	}

	toggleSide() {
		if(this.state.contentStyle.width === 0){
			let style = {
				width: this.isMobile ? '100%' : this.props.view.data.width,
				height: this.isMobile ? '100%' : this.props.view.data.height
			}
			this.setState({
				contentStyle: style,
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
			if(this.props.onChatClosed){
				this.props.onChatClosed();
			}
		}
	}

	handleNotifyTyping(isTyping){
		if(this.props.onNotifyTyping){

			this.lastNotifyTime = new Date();

			if(this.firstNotifyTime == 0 || this.lastNotifyTime.getTime() - this.firstNotifyTime.getTime() > 1000){
				this.firstNotifyTime = this.lastNotifyTime;
				this.props.onNotifyTyping(this.props.conversation.id, isTyping);
			}

			clearTimeout(this.notifyTimeout);

			var conversationId = this.props.conversation.id;
			this.notifyTimeout = setTimeout(() => {
				var now = new Date();
				var dif = now.getTime() - this.lastNotifyTime.getTime();
				if (dif > 999){
		        	this.props.onNotifyTyping(conversationId, false);
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

	handleConversationSelected(conversation, topScroll) {
		this.listTopScroll = topScroll;
		if(!this.props.conversation) {
			this.props.onConversationOpened(conversation);
		}else if(this.props.conversation.id !== conversation.id){
			this.props.onConversationOpened(conversation);
		}
	}

	handleShowAside(){
		if (this.state.compactView) {
			this.setState({ showConversations: true }); //mostrando el aside(list conversation) solo cuando esta en compact view
		}
	}

	handleMessageCreated(message){
		message.senderId = this.props.userSession.id;
		message.recipientId = this.props.conversation.id;
		message.status = 0;
		this.props.onMessage(message);
	}

	defineToggleStyle(){
		if(this.props.styles != null && (this.props.styles.toggleColor != null || this.props.styles.toggleBackgroundColor != null)){
			return {background: this.props.styles.toggleColor || this.props.styles.toggleBackgroundColor};
		}else
			return {};
	}

	defineTitleTextColor() {
		if(this.props.styles != null && (this.props.styles.tabTextColor != null || this.props.styles.titleTextColor != null || this.props.styles.toggleFontColor)){
			return {color: this.props.styles.tabTextColor || (this.props.styles.titleTextColor || this.props.styles.toggleFontColor)};
		}else
			return {};
	}

	defineToggleText() {
		if(this.props.styles != null && (this.props.styles.toggleText != null || this.props.styles.toggleTitleText != null)){
			return this.props.styles.toggleText || this.props.styles.toggleTitleText;
		}else
			return 'Want to know more?';
	}

	handleShowOptionList(message, top, left){
		if( message.senderId === this.props.userSession.id ){
			this.setState({ messageOptions: this.props.options.message.optionsToOutgoing(message) });
		}else{
			this.setState({ messageOptions: this.props.options.message.optionsToIncoming(message) });
		}
		
		let style = {};
		if(window.innerHeight - top < 300){
			style['bottom'] = window.innerHeight - top;	
		}else{
			style['top'] = top;
		}

		if(window.innerWidth - left < 300){
			style['right'] = window.innerWidth - left
		}else{
			style['left'] = left;
		}
		this.messageOptionsPosition = style;
	}

	hideMessageOption(func){
		this.setState({ messageOptions: null });
		if(func){
			func();
		}
	}

}

const Loading = (props) => <div className='mky-loader-ring'>
	{
		props.customLoader ?
		props.customLoader()
		:
		<div>
			<div className='mky-circle1 mky-circle'></div>
			<div className='mky-circle2 mky-circle'></div>
			<div className='mky-circle3 mky-circle'></div>
			<div className='mky-circle4 mky-circle'></div>
			<div className='mky-circle5 mky-circle'></div>
			<div className='mky-circle6 mky-circle'></div>
			<div className='mky-circle7 mky-circle'></div>
			<div className='mky-circle8 mky-circle'></div>
			<div className='mky-circle9 mky-circle'></div>
			<div className='mky-circle10 mky-circle'></div>
			<div className='mky-circle11 mky-circle'></div>
			<div className='mky-circle12 mky-circle'></div>
		</div>
	}
</div>

MonkeyUI.propTypes = {
	view: React.PropTypes.object,
	form: React.PropTypes.any.isRequired
}

MonkeyUI.defaultProps = {
	prefix: 'mky-',
	view:{
		type: 'fullscreen'
	},
	showConversations: true,
	tabHeight: '30px',
	sideWidth: 0,
	form: MyForm,
	viewLoading: true,
	conversationsLoading: false,
	options: {
		conversation: {
			onSort: undefined,
			onSecondSort: undefined,
			optionsToDelete: {
				onExitGroup: undefined,
				onDelete: undefined
			},
			header1: "Conversation List 1",
			header2: "Conversation List 2",
			onEnd: undefined,
			emptyConversationsMessage: undefined,
			emptyAlternateConversationsMessage: undefined
		},
		message: {
			optionsToIncoming: undefined,
			optionsToOutgoing: undefined
		},
		input: {
			textPlaceholder: undefined
		}
	},
	lang: 'en',
	chatExtraData: {}
}

MonkeyUI.childContextTypes = {
	userSession: React.PropTypes.object,
	bubbles: React.PropTypes.object,
	bubblePreviews: React.PropTypes.object,
	styles: React.PropTypes.object,
	lang: React.PropTypes.string,
	options: React.PropTypes.object,
	extraChat: React.PropTypes.object
}

export default MonkeyUI;