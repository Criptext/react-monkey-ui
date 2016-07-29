import React, { Component } from 'react'
import TimelineChat from './TimelineChat.js'
import Input from './Input.js'
// import LocationInput from './LocationInput.js'

import Modal from './Modal.js'
import ContentViewer from './ContentViewer.js'
import { defineTime, defineTimeByToday } from '../utils/monkey-utils.js'

const Modal_ = Modal(ContentViewer);

class ContentConversation extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showLocationInput: false,
			messageSelected: undefined
		}
		this.handleMessageSelected = this.handleMessageSelected.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.showAside = this.showAside.bind(this);
		this.conversationBannerClass= this.props.showBanner && !this.props.isMobile ? 'mnk-converstion-divided':''
		this.defineUrlAvatar = this.defineUrlAvatar.bind(this);
		this.handleConnectionStatus = this.handleConnectionStatus.bind(this);
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

		var modalComponent = null;
		if(this.state.messageSelected){
			modalComponent = <Modal_ message={this.state.messageSelected} closeModal={this.handleCloseModal}/>
		}
		return (
	    	<div className={'mky-content-conversation ' + this.conversationBannerClass}>
				<header id='mky-conversation-selected-header'>
					{ this.props.isMobile & this.props.haveConversations
						? <div className="mky-conversation-burger" onClick={this.showAside}><i className="icon mky-icon-back"></i></div>
						: null
					}
					<div id='mky-conversation-selected-image'><img src={this.defineUrlAvatar()}/></div>
					<div id='mky-conversation-selected-description'>
						<span id='mky-conversation-selected-name' className='mky-ellipsify'>{this.props.conversationSelected.name}</span>
						{ this.props.conversationSelected.description === null
							? ( !this.props.conversationSelected.online
								? <span id='mky-conversation-selected-status'> {'Last seen ' + defineTimeByToday(this.props.conversationSelected.lastOpenApp)}</span>
								: <span id='mky-conversation-selected-status'> Online </span>
							)
							: <span id='mky-conversation-selected-status'>{this.props.conversationSelected.description}</span>
						}
					</div>
					<div className='mky-signature'>Powered by <a className='mky-signature-link' target='_blank' href='http://criptext.com/'>Criptext</a></div>
					<Panel handleReconnect={this.props.handleReconnect} panelParams={this.props.panelParams} />

				</header>
				{ this.state.showLocationInput
					? <LocationInput messageCreated={this.props.messageCreated} disableGeoInput={this.disableGeoInput.bind(this)} />
					: ( <div className='mky-chat-area'>
							<TimelineChat loadMessages={this.props.loadMessages} conversationSelected={this.props.conversationSelected} messageSelected={this.handleMessageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUser={this.props.getUser}/>
							{ modalComponent }
							<Input handleNotifyTyping={this.props.handleNotifyTyping} enableGeoInput={this.enableGeoInput.bind(this)} messageCreated={this.props.messageCreated}/>
						</div>
					)
				}
			</div>
		)
	}

	handleConnectionStatus(connectionStatus){
		if(!connectionStatus){
			return;
		}

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

const Panel = (props) => {

	var params = props.panelParams;

	if(props.panelParams && props.panelParams.show){
		return (<div className={params.className ? params.className : 'mky-panel-show mky-panel-height'} style={{backgroundColor : params.backgroundColor ? params.backgroundColor : "#636363", color : params.color ? params.color : "white"}}>
			<p>{params.message}</p>
			{params.component ? params.component : null}
		</div>)
	}else{
		return <div className={params.className ? params.className : 'mky-panel-show mky-panel-height-hide'} style={{backgroundColor : params.backgroundColor ? params.backgroundColor : "#636363", color : params.color ? params.color : "white"}}>
			<p>{params.message}</p>
			{params.component ? params.component : null}
		</div>

	}
}

export default ContentConversation;
