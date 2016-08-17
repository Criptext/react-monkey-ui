import React, { Component } from 'react'
import ConversationList from './ConversationList.js';

class ContentInfo	 extends Component {
	constructor(props, context) {
		super(props, context);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-no-expand';
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversationSelected.id && nextProps.conversationSelected.id != this.props.conversationSelected.id) {
			this.props.toggleConversationHeader();
		}
	}

	render() {

		var objectInfo = {};
		objectInfo = this.props.getConversationInfo();

    	return (
			<aside className={this.props.isMobile ? "mky-aside-right-wide" : "mky-aside-right"} >
				<header className="mky-info-header" >

					<div className='mky-info-back' onClick={this.props.toggleConversationHeader}><i className="icon mky-icon-back"></i></div>

					<div className="mky-info-header-block" style={{marginLeft : '20px'}}>
						<span className='mky-ellipsify mky-info-header-name'>{objectInfo.title ? objectInfo.title : "Information"}</span>
						<span className="mky-info-header-desc" ></span>
					</div>
					
				</header>
				<div className="mky-info-container">
					<div className="mky-info-body-img">
					  <img src={objectInfo.avatar} />
					</div>
					<div className="mky-info-input" >
						<input value={objectInfo.name} type="text" className="mky-info-input-input" disabled/>
						
					</div>
					<div className="mky-info-subtitle">
						{objectInfo.subTitle}
					</div>
					<div className="mky-info-list">
						{objectInfo.users ? this.renderList(objectInfo.users) : null}
					</div>
			  	</div>
			</aside>
		)
	}

	renderList(items){
		var itemList = [];

		items.forEach(function(item){
			if(item){
				itemList.push(<div className="mky-info-list-item">
					<img src={item.avatar} />
					<div className="mky-info-list-name">
						<div className="mky-info-name-name">{item.name}</div>
						<div className="mky-info-list-desc">{item.description}</div>
					</div>
				</div>);
			}
		})

		return itemList;
	}

}

ContentInfo.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ContentInfo;

//<i className="icon mky-icon-edit mky-info-edit-icon"></i>