import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { defineTimeByToday, isConversationGroup, defineTimeByDay } from '../utils/monkey-utils.js'

import Bubble from './Bubble.js';
import BubbleText from './BubbleText.js';
import BubbleImage from './BubbleImage.js';
import BubbleFile from './BubbleFile.js';
import BubbleAudio from './BubbleAudio.js';

const BubbleText_ = Bubble(BubbleText);
const BubbleImage_ = Bubble(BubbleImage);
const BubbleFile_ = Bubble(BubbleFile);
const BubbleAudio_ = Bubble(BubbleAudio);

class TimelineChat extends Component {

	constructor(props, context) {
		super(props, context);
		this.orderedConversations = [];
		this.goBottom = false;
		this.scrollTop = 0;
		this.scrollHeight = 0;
		this.loadingMessages = 0;
		this.noNewMessage = false;
		this.firstLoad = true;
		this.handleScroll = this.handleScroll.bind(this);
		this.updateScrollTop = this.updateScrollTop.bind(this);
		this.handleControlPosition = this.handleControlPosition.bind(this);
		this.updateShowControl = this.updateShowControl.bind(this);
		this.getMoreMessages = this.getMoreMessages.bind(this);
		this.showOrderedMessages = this.showOrderedMessages.bind(this);
		this.sentMessage

		this.state = {
			update: 0,
			classControl: 'mky-disappear'
		}
		this.domNode;
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversationSelected.lastMessage) {
			if(Object.keys(nextProps.conversationSelected.messages).length != Object.keys(this.props.conversationSelected.messages).length && nextProps.conversationSelected.messages[nextProps.conversationSelected.lastMessage] && nextProps.conversationSelected.messages[nextProps.conversationSelected.lastMessage].senderId === this.context.userSession.id){
				this.goBottom = true;
			}
			
			if(nextProps.conversationSelected.id !== this.props.conversationSelected.id) {
				this.goBottom = true;
			}
		}
		if(this.props.conversationSelected.id != nextProps.conversationSelected.id){
			this.goBottom = true;
			this.scrollTop = 0;
			this.scrollHeight = 0;
			this.loadingMessages = 0;
			this.firstLoad = true;
		}

		if(this.props.conversationSelected.id == nextProps.conversationSelected.id && nextProps.conversationSelected.lastMessage == this.props.conversationSelected.lastMessage){
			this.noNewMessage = true;
		}else{
			this.noNewMessage = false;
		}

		this.orderedConversations = this.sortObject(nextProps.conversationSelected.messages);
		if(Object.keys(nextProps.conversationSelected.messages).length != Object.keys(this.props.conversationSelected.messages).length && nextProps.conversationSelected.lastMessage == this.props.conversationSelected.lastMessage && this.props.conversationSelected.id == nextProps.conversationSelected.id){
			this.loadingMessages = 1;
		}
	}

	componentWillMount() {
		if(this.props.conversationSelected.unreadMessageCount === 0){
			this.goBottom = true;
		}
		this.orderedConversations = this.sortObject(this.props.conversationSelected.messages);
	}

	componentWillUpdate() {

	}

/*
	render() {
		const bubbles = this.context.bubbles;
		return( <div ref='timelineChat' id='mky-chat-timeline'>
			{ this.props.conversationSelected.loading ? <Loading /> : null }
			{ Object.keys(this.props.conversationSelected).length
				? this.orderedConversations.map( item => {
					const message = this.props.conversationSelected.messages[item.key];
					const Bubble_ = bubbles[message.bubbleType];
					return <Bubble_ key={message.id} message={message} userSessionId={this.context.userSession.id} layerClass={message.bubbleType} messageSelected={this.props.messageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUser={this.props.getUser} styles={this.context.styles}/>
				})
				: null}
		</div>)
	}
*/

	render() {

		return(
			<div className='mky-chat-timeline-content'>
				<div ref='timelineChat' id='mky-chat-timeline'>
					{ this.props.conversationSelected.loading ? <Loading /> : null }
					{ Object.keys(this.props.conversationSelected).length
						? this.showOrderedMessages()
						: null
					}
				</div>
				<div className={'mky-chat-timeline-control '+this.state.classControl} onClick={this.handleControlPosition}>
					<i className='icon mky-icon-arrow-down-regular'></i>
				</div>
			</div>
		)
	}

	componentDidMount() {
		this.domNode = ReactDOM.findDOMNode(this.refs.timelineChat);
		//this.domNode.lastChild.scrollIntoView();
	    this.domNode.addEventListener('scroll', this.handleScroll);
	    let amountMessages = Object.keys(this.props.conversationSelected.messages).length;
	    if( (amountMessages === 1 || (amountMessages > 0 && amountMessages < 10)) && !this.props.conversationSelected.loading ){
			this.getMoreMessages();
		}
	}

	componentDidUpdate() {
		let amountMessages = Object.keys(this.props.conversationSelected.messages).length;
	    if( (amountMessages === 1 || (amountMessages > 0 && amountMessages < 10)) && !this.props.conversationSelected.loading && this.firstLoad){
			this.firstLoad = false;
			this.getMoreMessages();
		}
		this.domNode = ReactDOM.findDOMNode(this.refs.timelineChat);

		if(!this.loadingMessages && this.domNode.lastChild != null && !this.noNewMessage && this.goBottom){
 			this.domNode.lastChild.scrollIntoView();
 		}
 		this.updateScrollTop();
 		if(this.scrollHeight != this.domNode.scrollHeight && this.loadingMessages){

 			this.domNode.scrollTop += this.domNode.scrollHeight - this.scrollHeight - 60;
 			this.scrollHeight = this.domNode.scrollHeight;
 			this.loadingMessages = 0;
 		}
	}

	showOrderedMessages() {
		var messagesArray = [];
		var timeFrom = null;
		this.orderedConversations.forEach( item => {

			const message = this.props.conversationSelected.messages[item.key];
			let messageTime = defineTimeByDay(message.datetimeCreation);
			if(messageTime.indexOf("AM") > -1 || messageTime.indexOf("PM") > -1){
				messageTime = "Today"
			}

			if(timeFrom != messageTime){
				timeFrom = messageTime;
				messagesArray.push(<SystemBubble key={messageTime} message={messageTime} />);
			}
			switch(message.bubbleType){
			case 'text':
				messagesArray.push(<BubbleText_ key={message.id} message={message} userSessionId={this.context.userSession.id} layerClass={message.bubbleType} messageSelected={this.props.messageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUser={this.props.getUser} styles={this.context.styles}/>)
				break;
			case 'image':
				messagesArray.push(<BubbleImage_ key={message.id} message={message} userSessionId={this.context.userSession.id} layerClass={message.bubbleType} messageSelected={this.props.messageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUser={this.props.getUser} styles={this.context.styles}/>)
				break;
			case 'file':
				messagesArray.push(<BubbleFile_ key={message.id} message={message} userSessionId={this.context.userSession.id} layerClass={message.bubbleType} messageSelected={this.props.messageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUser={this.props.getUser} styles={this.context.styles}/>)
				break;
			case 'audio':
				messagesArray.push(<BubbleAudio_ key={message.id} message={message} userSessionId={this.context.userSession.id} layerClass={message.bubbleType} messageSelected={this.props.messageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUser={this.props.getUser} styles={this.context.styles}/>)
				break;
			default:
				break;
			}
		});

		return messagesArray;
	}

	updateScrollTop() {

		this.domNode = ReactDOM.findDOMNode(this.refs.timelineChat);

		if(this.domNode.scrollTop != 0){
			this.scrollTop = this.domNode.scrollTop;
			if(this.domNode.scrollTop + this.domNode.clientHeight >= this.domNode.scrollHeight - 75){
				this.goBottom = true;
			}else{
				this.goBottom = false;
			}
			return;
		}

		if (this.goBottom){
			if(!(this.domNode.scrollTop + this.domNode.clientHeight >= this.domNode.scrollHeight - 75)){
				this.goBottom = false;
			}
		}

		if(this.domNode.scrollTop === 0 && this.scrollTop != 0 ){
			this.scrollHeight = this.domNode.scrollHeight;
			if(!this.props.conversationSelected.loading){
				this.getMoreMessages();
			}
		}
		this.scrollTop = this.domNode.scrollTop;
	}

	handleScroll(event) {
		this.updateScrollTop();
		this.updateShowControl();
	}
	
	updateShowControl() {
		this.domNode = ReactDOM.findDOMNode(this.refs.timelineChat);
		
		if( (this.domNode.scrollTop + this.domNode.clientHeight >= this.domNode.scrollHeight - 75) && this.state.classControl === ''){
			this.setState({classControl: 'mky-disappear'});
		}else if( !(this.domNode.scrollTop + this.domNode.clientHeight >= this.domNode.scrollHeight - 75) && this.state.classControl !== '') {
			this.setState({classControl: ''});
		}
	}
	
	handleControlPosition() {
		this.domNode = ReactDOM.findDOMNode(this.refs.timelineChat);
		this.domNode.lastChild.scrollIntoView();
	}
	
	sortObject(obj) {
    	var arr = [];
	    var prop;
	    Object.keys(obj).map(function(key, index) {
	    	arr.push({
                'key': key,
                'date': obj[key].datetimeOrder
            });
        });
	    arr.sort(function(a, b) {
	        return a.date - b.date;
	    });
	    return arr;
	}

	getMoreMessages() {
		this.props.loadMessages(this.props.conversationSelected.id, this.props.conversationSelected.messages[this.orderedConversations[0].key].datetimeCreation/1000);
	}
}

const Loading = () => <div className="mky-fading-circle">
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

const SystemBubble = (props) => {

	return (
		<div className="mky-system-panel">
			<div className="mky-devider-dots"> </div>
			<div className="mky-system-panel-date">{props.message}</div>
		</div>
	)
}

TimelineChat.contextTypes = {
    userSession: React.PropTypes.object.isRequired,
    bubbles: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object.isRequired
}

export default TimelineChat;
