import React, { Component } from 'react'
import ContentIntro from './ContentIntro.js';
import ContentBanner from './ContentBanner.js';
import ContentConversation from './ContentConversation.js';
import ContentInfo from './ContentInfo.js';

class ContentWindow extends Component {
	constructor(props){
		super(props);
		this.state = {
			showAsideInfo: false,
			typeAsideInfo: ''
		}
		this.classExpand = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-content-window-with';
		this.classStateWindow = 'mky-disabled';
		this.classWithBanner = this.props.showBanner && !this.props.isMobile ? 'content-window-with-divided' : '';
		
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
				this.toggleConversationHeader();
			}
		}
	}

	render() {
		if(this.props.conversationSelected != undefined){
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
		    		isMobile = {this.props.isMobile}
		    		isPartialized = {this.props.isPartialized}
		    		expandAside = {this.props.expandAside}
		    		onClickMessage = {this.props.onClickMessage}
		    		dataDownloadRequest = {this.props.dataDownloadRequest}
		    		getUser = {this.props.getUser}
		    		showBanner = {this.props.showBanner}
		    		haveConversations = {this.props.haveConversations}
		    		version = {this.props.version}/>
		    	: <ContentIntro isMobile = {this.props.isMobile} showBanner = {this.props.showBanner}/>
	    	}
	    	{ this.state.showAsideInfo
		    	? <ContentInfo toggleConversationHeader = {this.toggleConversationHeader}
		    		viewType = {this.props.viewType}
		    		isMobile = {this.props.isMobile}
		    		conversationSelected = {this.props.conversationSelected}
		    		typeAsideInfo = {this.state.typeAsideInfo}
            		getConversationInfo = {this.props.getConversationInfo}/>
            	: null
	    	}
			{ this.props.showBanner && !this.props.isMobile ?
				<ContentBanner />
				: null
			}
			</section>
		);
	}
	
	toggleConversationHeader(type) {	
		if(this.showAsideInfo && this.state.typeAsideInfo !== type){
			this.setState({typeAsideInfo: type});
		}else {
			this.setState({
				showAsideInfo: !this.state.showAsideInfo,
				typeAsideInfo: type
			});
		}
	}
}

export default ContentWindow;
