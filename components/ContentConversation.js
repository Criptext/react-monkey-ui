import React, { Component } from 'react'
import TimelineChat from './TimelineChat.js'
import Input from './Input.js'
// import LocationInput from './LocationInput.js'

import Modal from './Modal.js'
import Panel from './Panel.js'
import ContentViewer from './ContentViewer.js'
import { defineTime, defineTimeByToday, defineTimeByDay } from '../utils/monkey-utils.js'

const Modal_ = Modal(ContentViewer);

class ContentConversation extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showLocationInput: false,
			messageSelected: undefined
		}
		this.classExpand = '' ;
		this.conversationBannerClass= this.props.showBanner && !this.props.isMobile ? 'mnk-converstion-divided':''
		
		this.handleMessageSelected = this.handleMessageSelected.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.showAside = this.showAside.bind(this);
		this.defineUrlAvatar = this.defineUrlAvatar.bind(this);
		this.handleConnectionStatus = this.handleConnectionStatus.bind(this);
		this.closeSide = this.closeSide.bind(this);
		this.handleToggleConversationHeader = this.handleToggleConversationHeader.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.conversationSelected.id != nextProps.conversationSelected.id){
			this.setState({
				showLocationInput: false,
				messageSelected: undefined
			});
		}
	}

	render() {

		if(this.props.showAsideInfo){
			if(this.props.isMobile || this.props.viewType != "fullscreen"){
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
		
		return (
	    	<div className={'mky-content-conversation ' + this.conversationBannerClass + ' ' + this.classExpand}>
				<header className='mky-conversation-selected-header'>
					{ this.props.isMobile & this.props.haveConversations
						? <div className='mky-conversation-back' onClick={this.showAside}><i className="icon mky-icon-back"></i></div>
						: null
					}
					<div className='mky-conversation-selected-image' onClick={this.handleToggleConversationHeader}><img src={this.defineUrlAvatar()}/></div>
					<div className='mky-conversation-selected-description' onClick={this.handleToggleConversationHeader}>
						<span className='mky-conversation-selected-name mky-ellipsify'>{this.props.conversationSelected.name}</span>
						{ this.props.conversationSelected.description === null
							? ( !this.props.conversationSelected.online
								? <span className='mky-conversation-selected-status'> {'Last seen ' + defineTimeByDay(this.props.conversationSelected.lastOpenApp)}</span>
								: <span className='mky-conversation-selected-status'> Online </span>
							)
							: <span className='mky-conversation-selected-status'>{this.props.conversationSelected.description}</span>
						}
					</div>
					{ this.props.viewType == 'rightside'
						? <div className='mky-conversation-header-exit' onClick={this.closeSide}><i className='icon mky-icon-arrow-down-regular'></i></div>
						: null
					}
					<div className='mky-signature'>Powered by <a className='mky-signature-link' target='_blank' href='http://criptext.com/'>Criptext</a>{' '+this.props.version}</div>
					<div className='mky-signature-logo'>
						<a className='mky-signature-link' target='_blank' href='http://criptext.com/'>
							<img src="https://cdn.criptext.com/MonkeyUI/images/black-criptext-icon.png" ></img>
						</a><span> {this.props.version}</span>
					</div>
					<Panel panelParams={this.props.panelParams} />

				</header>
				{ this.state.showLocationInput
					? <LocationInput messageCreated={this.props.messageCreated} disableGeoInput={this.disableGeoInput.bind(this)} />
					: ( <div className='mky-chat-area'>
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
			</div>
		)
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
		if (this.props.isMobile) {
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
		return this.props.conversationSelected.urlAvatar ? this.props.conversationSelected.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png';
	}
}

ContentConversation.contextTypes = {
	bubblePreviews: React.PropTypes.object.isRequired
}

export default ContentConversation;
