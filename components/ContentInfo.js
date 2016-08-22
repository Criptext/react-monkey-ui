import React, { Component } from 'react'
import InfoItem from './InfoItem.js';

class ContentInfo	 extends Component {
	constructor(props, context) {
		super(props, context);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-no-expand';
		this.objectInfo = {};
		this.state = {
			editingName : false, 
		}
	}

	componentWillMount(){
		this.objectInfo = this.props.getConversationInfo();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversationSelected.id && nextProps.conversationSelected.id != this.props.conversationSelected.id) {
			this.props.toggleConversationHeader();
		}
		this.objectInfo = this.props.getConversationInfo();
	}

	render() {

    	return (
			<aside className={this.props.isMobile ? "mky-aside-right-wide" : "mky-aside-right"} >
				<header className="mky-info-header" >

					<div className='mky-info-back' onClick={this.props.toggleConversationHeader}><i className="icon mky-icon-back"></i></div>

					<div className="mky-info-header-block" style={{marginLeft : '20px'}}>
						<span className='mky-ellipsify mky-info-header-name'>{this.objectInfo.title ? this.objectInfo.title : "Information"}</span>
						<span className="mky-info-header-desc" ></span>
					</div>
					
				</header>
				<div className="mky-info-container">
					<div className="mky-info-body-img">
					  <img src={this.objectInfo.avatar} />
					</div>
					<div className="mky-info-input" >
						<label>Name</label>
						<input value={this.objectInfo.name} type="text" className="mky-info-input-input" disabled/>
						<i className="icon mky-icon-edit mky-info-edit-icon"></i>						
					</div>
					<div className="mky-info-subtitle">
						<div className="mky-info-subtitle-head">
							<div className="mky-info-subtitle-left">
								{this.objectInfo.subTitle}
							</div>
							<div>
								{this.objectInfo.users.length + " of 50"}
							</div>
						</div>
						{this.objectInfo.canAdd 
							?	<div>
									<i className="icon mky-icon-add-regular"></i> Add {this.objectInfo.users && this.objectInfo.users.length > 0 ? this.objectInfo.subTitle : null}
								</div>
							: null
						}
					</div>
					<div className="mky-info-list">
						{this.objectInfo.users ? this.renderList(this.objectInfo.users, this.objectInfo.actions) : null}
					</div>

			  	</div>
			</aside>
		)
	}

	renderList(items, actions){
		var itemList = [];

		items.forEach((item) => {
			if(item){
				itemList.push(<InfoItem item={item} conversationSelected={this.props.conversationSelected} actions={actions} />);
			}
		})

		return itemList;
	}

	toogleEditName(){
		this.setState({
			
		});
	}

}

ContentInfo.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ContentInfo;

//<i className="icon mky-icon-edit mky-info-edit-icon"></i>