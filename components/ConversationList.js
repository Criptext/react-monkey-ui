import React, { Component } from 'react'
import ConversationItem from './ConversationItem.js'
import SearchInput, {createFilter} from 'react-search-input'
import ReactDOM from 'react-dom'
import DeleteConversation from './DeleteConversation.js'
import AsidePanel from './AsidePanel.js'
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
	    this.domNode = null;
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
		var params = {};
		if (this.props.panelParams){
			params = this.props.panelParams;
		}

		const conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    	return (
    		<div className='mky-session-conversations'>
    			{ this.state.isDeleting
	    			? <DeleteConversation handleDeleteConversation={this.handleDeleteConversation}
	    				handleExitGroup={this.handleExitGroup}
	    				handleClosePopup={this.handleClosePopup}
	    				isGroupConversation={this.conversationToDeleteIsGroup} />
	    			: null }

    			{ (this.props.conversationSelected == null) ?
    				<AsidePanel panelParams={this.props.asidePanelParams} />
					:
					null
    			}

	    		<SearchInput className='mky-search-input' placeholder='Search for existing conversation' onChange={this.searchUpdated} />
	    		{ this.props.conversationsLoading
		    		? <Loading customLoader={this.props.customLoader} />
		    		: ( <ul ref='conversationList' className='mky-conversation-list'>
						{ conversationNameFiltered.map( (conversation, index) => {
			    			return (
								<ConversationItem isMobile={this.props.isMobile}
									index={index}
									deleteConversation={this.handleAskDeleteConversation}
									key={conversation.id}
									conversation={conversation}
									conversationIdSelected={this.conversationIdSelected}
									selected={this.isSelected(conversation.id)}/>
							)
						})}
						</ul>
		    		)
	    		}
    			{ this.props.isLoadingConversations ? <Loading customLoader={this.props.customLoader} /> : null}
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
		//this.scrollToFirstChildWhenItsNecessary();
		if(!this.domNode && !this.props.conversationsLoading){
			this.domNode = ReactDOM.findDOMNode(this.refs.conversationList);
			this.domNode.addEventListener('scroll', this.handleScroll);
		}
	}

	componentDidMount() {
		if(!this.domNode && !this.props.conversationsLoading){
			this.domNode = ReactDOM.findDOMNode(this.refs.conversationList);
			this.domNode.addEventListener('scroll', this.handleScroll);
			this.domNode.scrollTop = this.props.scrollTop;
		}
	}

	conversationIdSelected(conversationId) {
		let topScroll = 0;
		if(this.domNode && this.domNode.scrollTop){
			topScroll = this.domNode.scrollTop;
		}  
		this.props.handleConversationSelected(this.props.conversations[conversationId], topScroll);
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

		if(typeof this.context.options.conversation.onSort == 'function'){
			conversationarray.sort(this.context.options.conversation.onSort);
		}
		return conversationarray;
  	}

  	/*scrollToFirstChildWhenItsNecessary() {
		if(this.scrollToLoad && !this.isLoading && this.domNode!=null && this.domNode.children.length > 0
			&& this.isSelected(this.state.conversationArray[0].id)){
			this.domNode.firstChild.scrollIntoView();
		}
  	}*/

  	// PopUp methods

  	handleDeleteConversation() {
		var conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		var nextConversation = conversationNameFiltered[this.state.deletingIndex + 1];
		if(!nextConversation) {
			nextConversation = conversationNameFiltered[this.state.deletingIndex - 1];
		}
		this.context.options.conversation.optionsToDelete.onDelete(this.state.deletingConversation, nextConversation, this.state.deletingActive, this.setConversationSelected);
	}

	handleExitGroup() {
		var conversationNameFiltered = this.state.conversationArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		var nextConversation = conversationNameFiltered[this.state.deletingIndex + 1];
		if(!nextConversation) {
			nextConversation = conversationNameFiltered[this.state.deletingIndex - 1];
		}
		this.context.options.conversation.optionsToDelete.onExitGroup(this.state.deletingConversation, nextConversation, this.state.deletingActive, this.setConversationSelected);
	}

	handleClosePopup() {
		this.setState({isDeleting: false});
	}

	handleScroll(event) {
		this.updateScrollTop();
	}

	updateScrollTop(){
		this.domNode = ReactDOM.findDOMNode(this.refs.conversationList);
		if(this.domNode.scrollTop + this.domNode.clientHeight + 20 >= this.domNode.scrollHeight && this.scrollToLoad){
			var conversationArray = this.state.conversationArray;
			var timestamp;
			try{
				var lastMessage = conversationArray[conversationArray.length - 1].messages[conversationArray[conversationArray.length - 1].lastMessage];
				timestamp = Math.max(lastMessage.datetimeCreation, conversationArray[conversationArray.length - 1].lastModified);
			}catch(exception){
				timestamp = conversationArray[conversationArray.length - 1].lastModified;
			}
			this.isLoading = true;
			this.scrollToLoad = false;
			this.props.handleLoadMoreConversations(timestamp);
		}
		if(!this.isLoading && !this.scrollToLoad && this.domNode.scrollTop + this.domNode.clientHeight + 20 < this.domNode.scrollHeight){
			this.scrollToLoad = true;
		}
	}

}

ConversationList.contextTypes = {
    options: React.PropTypes.object.isRequired,
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

/*const Loading = () => <div className='mky-loader-ring'>
	<div className='mky-loader-ring-light'></div>
	<img className='mky-loading-icon-inside' src='http://cdn.criptext.com/messenger/criptextGradientLogo.png'></img>
</div>*/

export default ConversationList;
