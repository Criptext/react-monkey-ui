import React, { Component } from 'react'
import ConversationList from './ConversationList.js';

class ContentInfo	 extends Component {
	constructor(props, context) {
		super(props, context);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-no-expand';
	}

	render() {

		var objectInfo = {};
		objectInfo = this.props.getConversationInfo();

    	return (
			<aside className={this.props.isMobile ? "mky-aside-right-wide" : "mky-aside-right"} >
				<header className="mky-info-header" >

					<div className='mky-info-back' onClick={this.props.toggleConversationHeader}><i className="icon mky-icon-back"></i></div>

					<div className="mky-info-header-block" style={{marginLeft : '20px'}}>
						<span className='mky-ellipsify mky-info-header-name'>Group Info</span>
						<span className="mky-info-header-desc" ></span>
					</div>
					
				</header>
				<div className="mky-info-container">
					<div className="mky-info-body-img">
					  <img src={objectInfo.avatar} />
					</div>
					<div className="mky-info-input" >
						<input defaultValue={objectInfo.name} type="text" className="mky-info-input-input" />
						<i className="icon mky-icon-edit"></i>
					</div>
					<div className="mky-info-list">
						{this.renderList(objectInfo.users)}
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
						<div>{item.name}</div>
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