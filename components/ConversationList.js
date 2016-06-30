import React, { Component } from 'react'
import ConversationItem from './ConversationItem.js';
import SearchInput, {createFilter} from 'react-search-input';
import ReactDOM from 'react-dom';
import DeleteConversation from './DeleteConversation.js'

import { isConversationGroup } from './../utils/monkey-utils.js'

const KEYS_TO_FILTERS = ['name']

class ConversationList extends Component {

	constructor(props) {
		super(props);
	    this.state = {
		    searchTerm: '',
			conversationArray: undefined,
			isDeleting: false,
			deletingConversation: undefined,
			deletingIndex: undefined,
			deletingActive: undefined
		}
		this.conversationToDeleteIsGroup;
	    this.searchUpdated = this.searchUpdated.bind(this);
	    this.conversationIdSelected = this.conversationIdSelected.bind(this);
	    this.isSelected = this.isSelected.bind(this);
	    
	    this.handleDeleteConversation = this.handleDeleteConversation.bind(this);
	    this.handleExitGroup = this.handleExitGroup.bind(this);
	    this.handleClosePopup = this.handleClosePopup.bind(this);
	    
	    this.handleAskDeleteConversation = this.handleAskDeleteConversation.bind(this);
	    this.setConversationSelected = this.setConversationSelected.bind(this);
	    this.domNode;
	}
	
	componentWillMount() {
		this.setState({conversationArray: this.createArray(this.props.conversations)});
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({conversationArray: this.createArray(nextProps.conversations)});
	}
	
	render() {
		const conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    	return (
    		<div className='mky-session-conversations'>
    			{ this.state.isDeleting
	    			? <DeleteConversation handleDeleteConversation={this.handleDeleteConversation} handleExitGroup={this.handleExitGroup} handleClosePopup={this.handleClosePopup} isGroupConversation={this.conversationToDeleteIsGroup} />
	    			: null }
	    		<SearchInput className='mky-search-input' onChange={this.searchUpdated} />
	    		{ this.props.conversationsLoading
		    		? ( <div>
		    				<div className='mky-spinner'>
								<div className='mky-bounce1'></div>
								<div className='mky-bounce2'></div>
								<div className='mky-bounce3'></div>
							</div>
		    			</div>
		    		)
		    		: ( <ul ref='conversationList' id='mky-conversation-list' className='animated slideInLeft'>
						{ conversationNameFiltered.map( (conversation, index) => {
			    			return (
								<ConversationItem index={index} deleteConversation={this.handleAskDeleteConversation} key={conversation.id} conversation={conversation} conversationIdSelected={this.conversationIdSelected} selected={this.isSelected(conversation.id)}/>
							)
						})}
						</ul>
		    		)
	    		}
			</div>
		)
	}
	
	handleAskDeleteConversation(conversation, index, active) {
		this.setState({
			deletingConversation: conversation,
			deletingIndex: index,
			deletingActive: active,
			isDeleting: true
		});
		this.conversationToDeleteIsGroup = isConversationGroup(conversation.id);
	}

	componentDidUpdate() {
		this.scrollToFirstChildWhenItsNecessary();
	}

	componentDidMount() {
		this.domNode = ReactDOM.findDOMNode(this.refs.conversationList);
	}
	
	conversationIdSelected(conversationId) {
		this.props.handleConversationSelected(this.props.conversations[conversationId]);
	}

	setConversationSelected() {
		this.setState({isDeleting: false});
	}
	
	isSelected(conversationId) {
		let result = false
		if(this.props.conversationSelected){
			if(this.props.conversationSelected.id === conversationId){
				result = true;
			}
		}
		return result;
	}
	
	searchUpdated(term) {
    	this.setState({searchTerm: term});
  	}
  	
  	createArray(conversations) {
  		let conversationarray = [];
		for(var x in conversations){
		  conversationarray.push(conversations[x]);
		}

		conversationarray.sort(function(a, b) {
	        if(a.messages[a.lastMessage] == null || a.messages.length == 0)
	        	return 1;
	        if(b.messages[b.lastMessage] == null || b.messages.length == 0)
	        	return -1;
	        return b.messages[b.lastMessage].datetimeCreation - a.messages[a.lastMessage].datetimeCreation;
	    });

		return conversationarray;
  	}

  	scrollToFirstChildWhenItsNecessary() {
		if(this.domNode!=null && this.domNode.children.length > 0 
			&& this.isSelected(this.state.conversationArray[0].id)){
			this.domNode.firstChild.scrollIntoView();
		}
  	}
  	
  	// PopUp methods
  	
  	handleDeleteConversation() {
		var conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		var nextConversation = conversationNameFiltered[this.state.deletingIndex + 1];
		if(!nextConversation) {
			nextConversation = conversationNameFiltered[this.state.deletingIndex - 1];
		}
		this.props.handleConversationDelete(this.state.deletingConversation, nextConversation, this.state.deletingActive, this.setConversationSelected);
	}
	
	handleExitGroup() {
		var conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		var nextConversation = conversationNameFiltered[this.state.deletingIndex + 1];
		if(!nextConversation) {
			nextConversation = conversationNameFiltered[this.state.deletingIndex - 1];
		}
		this.props.handleConversationExit(this.state.deletingConversation, nextConversation, this.state.deletingActive, this.setConversationSelected);
	}
	
	handleClosePopup() {
		this.setState({isDeleting: false});
	}
	
}

export default ConversationList;