import React, { Component } from 'react'
import AsidePanel from './AsidePanel.js'
import ConversationList from './ConversationList.js'
import SearchInput, {createFilter} from 'react-search-input'
import Lang from '../lang'

class ConversationListsContainer extends Component {

	constructor(props, context) {
		super(props, context);
	    this.state = {
		    searchTerm: '',
		}
		this.conversationToDeleteIsGroup;
	    this.searchUpdated = this.searchUpdated.bind(this);
	}

	render() {
		var params = {};
		if (this.props.panelParams){
			params = this.props.panelParams;
		}

    	return (
    		<div className='mky-session-conversations'>
    			{ this.state.isDeleting
	    			? <DeleteConversation handleDeleteConversation={this.handleDeleteConversation}
	    				handleExitGroup={this.handleExitGroup}
	    				handleClosePopup={this.handleClosePopup}
	    				isGroupConversation={this.conversationToDeleteIsGroup} />
	    			: null 
	    		}
    			{ this.props.conversationSelected == null
	    			? <AsidePanel panelParams={this.props.asidePanelParams} />
					: null
    			}
	    		<SearchInput className='mky-search-input' placeholder={Lang[this.context.lang]['input.search.placeholder']} onChange={this.searchUpdated} />
	    		{ this.props.conversationsLoading
		    		? <Loading customLoader={this.props.customLoader} />
		    		: <div className='mky-dflex-dcolumn'>
		    			{ this.props.alternateConversations != null 
		    			? <div className='mky-conversation-list-header'>
		    				{this.context.options.conversation.header1}
		    			</div>
		    			: null}
		    			<ConversationList customLoader = {this.props.customLoader}
							compactView = {this.props.compactView}
							isMobile = {this.props.isMobile}
							asidePanelParams = {this.props.asidePanelParams}
							connectionStatus={this.props.connectionStatus}
							isLoadingConversations={this.props.isLoadingConversations}
							handleLoadMoreConversations={this.props.handleLoadMoreConversations}
							conversations={this.props.conversations}
							handleConversationSelected={this.props.handleConversationSelected}
							conversationSelected={this.props.conversationSelected}
							conversationsLoading={this.props.conversationsLoading}
							scrollTop = {this.props.scrollTop}
							searchTerm = {this.state.searchTerm}
							alternativeList = {false}/>

						{ this.props.alternateConversations != null 
		    			? <div className='mky-conversation-list-header'>
		    				{this.context.options.conversation.header2}
		    			</div>
		    			: null}

		    			{ this.props.alternateConversations != null 
		    			? <ConversationList customLoader = {this.props.customLoader}
							compactView = {this.props.compactView}
							asidePanelParams = {this.props.asidePanelParams}
							connectionStatus={this.props.connectionStatus}
							isLoadingConversations={this.props.isLoadingConversations}
							handleLoadMoreConversations={this.props.handleLoadMoreConversations}
							conversations={this.props.alternateConversations}
							handleConversationSelected={this.props.handleConversationSelected}
							conversationSelected={this.props.conversationSelected}
							conversationsLoading={this.props.conversationsLoading}
							scrollTop = {this.props.scrollTop}
							searchTerm = {this.state.searchTerm}
							alternativeList = {true}/>
		    			: null }
					</div>
	    		}
			</div>
		)
	}

	searchUpdated(term) {
    	this.setState({searchTerm: term});
    	if(typeof this.props.searchUpdated != 'undefined'){
    		this.props.searchUpdated(term)
    	}
	}

}

ConversationListsContainer.contextTypes = {
	lang: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
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

export default ConversationListsContainer;