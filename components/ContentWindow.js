import React, { Component } from 'react'
import ContentIntro from './ContentIntro.js'
import ContentBanner from './ContentBanner.js'
import ContentConversation from './ContentConversation.js'
import ContentInfo from './ContentInfo.js'

class ContentWindow extends Component {
	constructor(props){
		super(props);
		this.state = {
			showAsideInfo: false,
			typeAsideInfo: ''
		}
		this.classExpand = this.props.compactView ? 'mky-expand-each-screen' : 'mky-content-window-with';
		this.classStateWindow = '';
		this.classWithBanner = this.props.showBanner && !this.props.compactView ? 'content-window-with-divided' : '';
		this.toggleConversationHeader = this.toggleConversationHeader.bind(this);
	}

	componentWillMount() {
		if(this.props.expandWindow){
			this.classExpand = 'mky-content-window-only';
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.conversationSelected && this.props.conversationSelected) {
			if(nextProps.conversationSelected.id && nextProps.conversationSelected.id != this.props.conversationSelected.id && this.state.showAsideInfo) {
				this.toggleConversationHeader(this.state.typeAsideInfo);
				if(this.props.messageSelectedInfo){
					this.props.messageSelectedInfo.close();
				}
			}
		}
		if(nextProps.messageSelectedInfo && !(this.state.typeAsideInfo == 'message' && this.state.showAsideInfo) ){
			this.toggleConversationHeader('message');
		}
	}

	render() {
		if(this.props.conversationSelected == undefined){
			this.classStateWindow = 'mky-disabled';
		}else{
			this.classStateWindow = '';
		}

    	return (
	    	<section className = {this.classExpand+' '+this.classStateWindow + ' '+this.classWithBanner}>
	    	{ this.props.conversationSelected
		    	? <ContentConversation closeSide = {this.props.closeSide}
		    		viewType = {this.props.viewType}
		    		showAsideInfo = {this.state.showAsideInfo}
		    		toggleConversationHeader = {this.toggleConversationHeader}
		    		customLoader = {this.props.customLoader}
		    		connectionStatus = {this.props.connectionStatus}
		    		handleNotifyTyping = {this.props.handleNotifyTyping}
		    		panelParams = {this.props.panelParams}
		    		loadMessages = {this.props.loadMessages}
		    		conversationSelected = {this.props.conversationSelected}
		    		conversationClosed = {this.props.conversationClosed}
		    		messageCreated = {this.props.messageCreated}
		    		compactView = {this.props.compactView}
		    		isPartialized = {this.props.isPartialized}
		    		expandAside = {this.props.expandAside}
		    		onClickMessage = {this.props.onClickMessage}
		    		dataDownloadRequest = {this.props.dataDownloadRequest}
		    		getUser = {this.props.getUser}
		    		showBanner = {this.props.showBanner}
		    		haveConversations = {this.props.haveConversations}
		    		version = {this.props.version}
		    		showOptionList = {this.props.showOptionList}
		    		overlayView = {this.props.overlayView}/>
		    	: <ContentIntro isMobile = {this.props.compactView} showBanner = {this.props.showBanner}/>
	    	}
	    	{ this.state.showAsideInfo
		    	? <ContentInfo toggleConversationHeader = {this.toggleConversationHeader}
		    		viewType = {this.props.viewType}
		    		compactView = {this.props.compactView}
		    		conversationSelected = {this.props.conversationSelected}
		    		typeAsideInfo = {this.state.typeAsideInfo}
            		getConversationInfo = {this.props.getConversationInfo}
            		messageSelectedInfo = {this.props.messageSelectedInfo}
            		dataDownloadRequest = {this.props.dataDownloadRequest}
		    		getUser = {this.props.getUser}/>
            	: null
	    	}
			{ this.props.showBanner && !this.props.compactView ?
				<ContentBanner />
				: null
			}
			</section>
		);
	}
	
	toggleConversationHeader(type) {
		if(this.state.showAsideInfo && this.state.typeAsideInfo !== type){
			if(this.state.typeAsideInfo == 'message'){
				this.props.messageSelectedInfo.close();
			}
			this.setState({typeAsideInfo: type});
		}else {
			if(type == 'conversation' && typeof this.props.getConversationInfo == 'undefined' ){
				return;
			}
			
			this.setState({
				showAsideInfo: !this.state.showAsideInfo,
				typeAsideInfo: type
			});
		}
	}
}

export default ContentWindow;
