import React, { Component } from 'react'
import ConversationItem from './ConversationItem.js';
import SearchInput, {createFilter} from 'react-search-input';
import ReactDOM from 'react-dom';
import DeleteConversation from './DeleteConversation.js'

import { isConversationGroup } from './../utils/monkey-utils.js'

const KEYS_TO_FILTERS = ['name']

class ConversationList extends Component {

	constructor(props, context) {
		super(props, context);
	    this.state = {
		    searchTerm: '',
			conversationArray: undefined,
			isDeleting: false,
			deletingConversation: undefined,
			deletingIndex: undefined,
			deletingActive: undefined,
			loading : false,
		}
		this.conversationToDeleteIsGroup;
	    this.searchUpdated = this.searchUpdated.bind(this);
	    this.conversationIdSelected = this.conversationIdSelected.bind(this);
	    this.isSelected = this.isSelected.bind(this);
	    this.updateScrollTop = this.updateScrollTop.bind(this);
	    this.handleScroll = this.handleScroll.bind(this);

	    this.handleDeleteConversation = this.handleDeleteConversation.bind(this);
	    this.handleExitGroup = this.handleExitGroup.bind(this);
	    this.handleClosePopup = this.handleClosePopup.bind(this);

	    this.handleAskDeleteConversation = this.handleAskDeleteConversation.bind(this);
	    this.setConversationSelected = this.setConversationSelected.bind(this);
	    this.domNode;
	    this.isLoading;
	    this.scrollToLoad;
	}

	componentWillMount() {
		this.setState({conversationArray: this.createArray(this.props.conversations)});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.isLoadingConversations != this.props.isLoadingConversations && this.props.isLoadingConversations && !nextProps.isLoadingConversations){
			this.isLoading = false;
		}
		this.setState({conversationArray: this.createArray(nextProps.conversations)});
	}

	render() {
		const conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    	return (
    		<div className='mky-session-conversations'>
    			{ this.state.isDeleting
	    			? <DeleteConversation handleDeleteConversation={this.handleDeleteConversation} handleExitGroup={this.handleExitGroup} handleClosePopup={this.handleClosePopup} isGroupConversation={this.conversationToDeleteIsGroup} />
	    			: null }
	    		<SearchInput className='mky-search-input' placeholder='Search for existing conversation' onChange={this.searchUpdated} />
	    		{ this.props.conversationsLoading
		    		? ( <div>
		    				<div className='mky-spinner'>
								<div className='mky-bounce1'></div>
								<div className='mky-bounce2'></div>
								<div className='mky-bounce3'></div>
							</div>
		    			</div>
		    		)
		    		: ( <ul ref='conversationList' id='mky-conversation-list'>
						{ conversationNameFiltered.map( (conversation, index) => {
			    			return (
								<ConversationItem index={index} deleteConversation={this.handleAskDeleteConversation} key={conversation.id} conversation={conversation} conversationIdSelected={this.conversationIdSelected} selected={this.isSelected(conversation.id)}/>
							)
						})}
						</ul>
		    		)
	    		}
    		{this.props.isLoadingConversations ? <Loading /> : null}
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
		this.domNode.addEventListener('scroll', this.handleScroll);
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

		if(typeof this.context.options.conversationSort == "function"){
			conversationarray.sort(this.context.options.conversationSort);
		}
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

	handleScroll(event) {
		this.updateScrollTop();
	}

	updateScrollTop(){
		this.domNode = ReactDOM.findDOMNode(this.refs.conversationList);
		console.log(this.domNode.scrollTop + this.domNode.scrollHeight);
		if(this.domNode.scrollTop + this.domNode.clientHeight >= this.domNode.scrollHeight && this.scrollToLoad){
			var conversationArray = this.state.conversationArray;
			var timestamp;
			try{
				var lastMessage = conversationArray[conversationArray.length - 1].messages[conversationArray[conversationArray.length - 1].lastMessage];
				timestamp = lastMessage.datetimeCreation
			}catch(exception){
				timestamp = conversationArray[conversationArray.length - 1].lastModified;
			}
			this.props.handleLoadMoreConversations(timestamp);
			this.isLoading = true;
			this.scrollToLoad = false;
		}
		if(!this.isLoading && !this.scrollToLoad){
			this.scrollToLoad = true;
		}
	}

}

ConversationList.contextTypes = {
    options: React.PropTypes.object.isRequired,
}

const Loading = () => <div className="mky-fading-circle mky-absolute-circle">
	<div className="mky-circle1 mky-circle"></div>
	<div className="mky-circle2 mky-circle"></div>
	<div className="mky-circle3 mky-circle"></div>
	<div className="mky-circle4 mky-circle"></div>
	<div className="mky-circle5 mky-circle"></div>
	<div className="mky-circle6 mky-circle"></div>
	<div className="mky-circle7 mky-circle"></div>
	<div className="mky-circle8 mky-circle"></div>
	<div className="mky-circle9 mky-circle"></div>
	<div className="mky-circle10 mky-circle"></div>
	<div className="mky-circle11 mky-circle"></div>
	<div className="mky-circle12 mky-circle"></div>
</div>

export default ConversationList;
