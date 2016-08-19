import React, { Component } from 'react'
import InfoItem from './InfoItem.js';

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
						{objectInfo.users && objectInfo.users.length > 0 ? objectInfo.subTitle : null}
					</div>
					<div className="mky-info-list">
						{objectInfo.users ? this.renderList(objectInfo.users, objectInfo.actions) : null}
					</div>

			  	</div>
			</aside>
		)
	}

	renderList(items, actions){
		var itemList = [];

		items.forEach((item) => {
			if(item){
				itemList.push(<InfoItem avatar={item.avatar} id={item.id} rol={item.rol} conversationSelected={this.props.conversationSelected} name={item.name} description={item.description} actions={actions} />);
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