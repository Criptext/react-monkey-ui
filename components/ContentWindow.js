import React, { Component } from 'react'
import ContentIntro from './ContentIntro.js';
import ContentBanner from './ContentBanner.js';
import ContentConversation from './ContentConversation.js';

class ContentWindow extends Component {
	constructor(props){
		super(props);
		this.classExpand = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-content-window-with';
		this.classStateWindow = 'mky-disabled';
		this.classWithBanner = this.props.showBanner && !this.props.isMobile ? 'content-window-with-divided' : '';
	}

	componentWillMount() {
		if(this.props.expandWindow){
			this.classExpand = 'mky-content-window-only';
		}
	}

	render() {
		if(this.props.conversationSelected != undefined){
			this.classStateWindow = '';
		}

    	return (
	    	<section className={this.classExpand+' '+this.classStateWindow + ' '+this.classWithBanner}>
	    	{ this.props.conversationSelected
		    	? <ContentConversation loadMessages={this.props.loadMessages} conversationSelected={this.props.conversationSelected} messageCreated={this.props.messageCreated} isMobile={this.props.isMobile} isPartialized={this.props.isPartialized} expandAside={this.props.expandAside} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUserName={this.props.getUserName} showBanner={this.props.showBanner} />
		    	: <ContentIntro isMobile={this.props.isMobile} showBanner={this.props.showBanner} />
	    	}
				{
					this.props.showBanner && !this.props.isMobile ?
						<ContentBanner />
						:null
				}
			</section>
		);
	}
}

export default ContentWindow;
