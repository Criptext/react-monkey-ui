import React, { Component } from 'react'
import TimelineChat from './TimelineChat.js'
import Input from './Input.js'
// import LocationInput from './LocationInput.js'
import Modal from './Modal.js'
import Panel from './Panel.js'
import ContentViewer from './ContentViewer.js'
import ContentReconnect from './ContentReconnect'
import { defineTime, defineTimeByDay, getCombineColor} from '../utils/monkey-utils.js'
import Lang from '../lang'

const Modal_ = Modal(ContentViewer);

class ContentConversation extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showLocationInput: false,
			messageSelected: undefined,
			urlAvatar: props.conversationSelected.urlAvatar ? props.conversationSelected.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png',
			classEndChatButton: ''
		}
		this.classExpand = '';
		this.classStateChat = '';
		this.conversationBannerClass = props.showBanner && !props.compactView ? 'mnk-converstion-divided' : '';
		
		this.handleMessageSelected = this.handleMessageSelected.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.showAside = this.showAside.bind(this);
		this.handleErrorAvatar = this.handleErrorAvatar.bind(this);
		this.handleConnectionStatus = this.handleConnectionStatus.bind(this);
		this.closeSide = this.closeSide.bind(this);
		this.handleToggleConversationHeader = this.handleToggleConversationHeader.bind(this);
		this.handleEndConversation = this.handleEndConversation.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.conversationSelected.id != nextProps.conversationSelected.id){
			this.setState({
				showLocationInput: false,
				messageSelected: undefined,
				urlAvatar: nextProps.conversationSelected.urlAvatar ? nextProps.conversationSelected.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png',
				classEndChatButton: ''
			});
		}
	}

	render() {
		let styleHeader = this.defineStyles();
		if(this.props.showAsideInfo){
			if(this.props.compactView || this.props.viewType != 'fullscreen'){
				this.classExpand = 'mky-disappear';
			}else{
				this.classExpand = 'mky-content-conversation-no-expand';
			}
		}else{
			this.classExpand = 'mky-content-conversation-expand';
		}

		var modalComponent = null;
		if(this.state.messageSelected){
			modalComponent = <Modal_ message={this.state.messageSelected} closeModal={this.handleCloseModal}/>
		}
		
		if(this.props.overlayView){
			this.classStateChat = 'mky-disabled';
		}else{
			this.classStateChat = '';
		}
		
		return (
	    	<div className={'mky-content-conversation ' + this.conversationBannerClass + ' ' + this.classExpand}>
				<header className='mky-conversation-selected-header' style={styleHeader.header}>
					{ this.props.compactView && this.props.haveConversations
						? <div className='mky-conversation-back' onClick={this.showAside}><i className='icon mky-icon-back' style={styleHeader.title}></i></div>
						: null
					}
					<div className={'mky-conversation-selected-image '+this.defineClassOnlineStatus()} onClick={this.handleToggleConversationHeader}><img src={this.state.urlAvatar} onError={this.handleErrorAvatar}/></div>
					<div className='mky-conversation-selected-description' onClick={this.handleToggleConversationHeader}>
						<span className='mky-conversation-selected-name mky-ellipsify' style={styleHeader.title}>{this.props.conversationSelected.name}</span>
						{ this.props.conversationSelected.description != null
							? <span className='mky-conversation-selected-status' style={styleHeader.subtitle}>{this.props.conversationSelected.description}</span>
							: ( !this.props.conversationSelected.online
								? <span className='mky-conversation-selected-status' style={styleHeader.subtitle}> {Lang[this.context.lang]['status.lastseen'] +' ' + defineTimeByDay(this.props.conversationSelected.lastSeen)}</span>
								: <span className='mky-conversation-selected-status' style={styleHeader.subtitle}>{Lang[this.context.lang]['status.online']}</span>
							)
						}
					</div>
					{ this.context.options.conversation.onEnd
						? <input className={'mky-button-standard '+this.state.classEndChatButton} type='submit' value={Lang[this.context.lang]['button.endchat.text']} id='mky-end-chat' onClick={this.handleEndConversation}></input>
						: null
					}
					{ this.props.viewType == 'rightside'
						? ( <div className='mky-conversation-header-options' onClick={this.closeSide} style={styleHeader.title}>
								<div><i className='icon mky-icon-close'></i></div>
							</div>
						)
						: ( this.props.viewType == 'embedded' && this.props.exitButton
							? ( <div className='mky-conversation-header-options' onClick={this.closeSide} style={styleHeader.title}>
									<div><i className='icon mky-icon-close'></i></div>
								</div>
							)
							: null
						)
					}
					<div className='mky-signature'>
						{ this.props.version
							? <span><a className='mky-signature-link' target='_blank' href='http://criptext.com/'><img src='https://cdn.criptext.com/MonkeyUI/images/black-criptext-icon.png'></img></a>{this.props.version}</span>
							: <span style={styleHeader.title}>Powered by: <a className='mky-signature-link' style={styleHeader.subtitle} target='_blank' href='http://criptext.com/'>Criptext Inc.</a></span>
						}
					</div>
					
					<Panel panelParams={this.props.panelParams} />

				</header>
				{ this.state.showLocationInput
					? <LocationInput messageCreated={this.props.messageCreated} disableGeoInput={this.disableGeoInput.bind(this)} />
					: ( <div className={'mky-chat-area '+this.classStateChat}>
							<TimelineChat customLoader={this.props.customLoader}
								loadMessages={this.props.loadMessages}
								conversationSelected={this.props.conversationSelected}
								messageSelected={this.handleMessageSelected}
								onClickMessage={this.props.onClickMessage}
								dataDownloadRequest={this.props.dataDownloadRequest}
								getUser={this.props.getUser}
								showOptionList = {this.props.showOptionList}/>
							{ modalComponent }
							<Input connectionStatus={this.props.connectionStatus}
								conversationSelected={this.props.conversationSelected}
								handleNotifyTyping={this.props.handleNotifyTyping}
								enableGeoInput={this.enableGeoInput.bind(this)}
								messageCreated={this.props.messageCreated}/>
						</div>
					)
				}
				{ this.props.overlayView
					? <div className='mky-content-overlay'> 
						{this.props.overlayView}
					</div>
					: null
				}
			</div>
		)
	}
	
	defineStyles() {
		let style = {
			header: {},
			title: {},
			subtitle: {}
		};
		if(this.context.styles){
			if(this.context.styles.toggleColor){
				style.header.background = this.context.styles.toggleColor;	
				style.header.borderBottom = '1px solid ' + this.context.styles.toggleColor;
				style.subtitle.color = getCombineColor(this.context.styles.toggleColor);
			}
			if(this.context.styles.subtitleTextColor){
				style.subtitle.color = this.context.styles.subtitleTextColor;
			}
			if(this.context.styles.tabTextColor || this.context.styles.titleTextColor){
				style.title.color = this.context.styles.tabTextColor || this.context.styles.titleTextColor
			}
		}
		
		return style;
	}
	
	defineClassOnlineStatus() {
		let result;
		if(this.props.conversationSelected.online){
			result = 'mky-connection-status-online';
		}else{
			result = 'mky-connection-status-offline';
		}
		return result;
	}
	
	handleErrorAvatar() {
		this.setState({urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'});
	}
	
	closeSide(event){
		event.stopPropagation();
		this.props.closeSide();
	}

	handleConnectionStatus(connectionStatus){
		if(!connectionStatus){
			return;
		}
	}
	
	handleToggleConversationHeader(){
		this.props.toggleConversationHeader('conversation');
	}

	handleMessageSelected(message) {
		this.setState({messageSelected:message});
	}

	handleCloseModal() {
		this.setState({messageSelected: undefined});
	}

	showAside() {
		if (this.props.compactView) {
			this.props.expandAside(true);
			this.props.conversationClosed();
		}
	}

	enableGeoInput() {
		this.setState({showLocationInput: true});
	}

	disableGeoInput() {
		this.setState({showLocationInput: false});
	}

	defineUrlAvatar() {
		this.setState({urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'});
	}
	
	handleEndConversation() {
		this.context.options.conversation.onEnd(this.props.conversationSelected);
		this.setState({classEndChatButton: 'mky-disabled'});
	}
}

ContentConversation.contextTypes = {
	bubblePreviews: React.PropTypes.object.isRequired,
	options: React.PropTypes.object.isRequired,
	lang: React.PropTypes.string.isRequired,
	styles: React.PropTypes.object.isRequired
}

export default ContentConversation;
