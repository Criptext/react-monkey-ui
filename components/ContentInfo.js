import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import InfoItem from './InfoItem.js';

class ContentInfo	 extends Component {
	constructor(props, context) {
		super(props, context);
		this.classContent = this.props.isMobile ? 'mky-expand-each-screen' : 'mky-no-expand';
		this.objectInfo = {};
		this.state = {
			editingName : false, 
			infoName : '',
		}
		this.toogleEditName=this.toogleEditName.bind(this);
		this.handleNameKeyDown = this.handleNameKeyDown.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleNameBlur = this.handleNameBlur.bind(this);
	}

	componentWillMount(){
		this.objectInfo = this.props.getConversationInfo();
		this.setState({
			infoName : this.objectInfo.name
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.conversationSelected.id && nextProps.conversationSelected.id != this.props.conversationSelected.id) {
			this.props.toggleConversationHeader();
		}
		this.objectInfo = this.props.getConversationInfo();
		if(this.objectInfo.name != this.state.infoName && !this.state.editingName){
			this.setState({
				infoName : this.objectInfo.name
			})
		}
	}

	render() {

    	return (
			<aside className={this.props.isMobile ? "mky-aside-right-wide" : "mky-aside-right"} >
				<header className="mky-info-header" >

					<div className='mky-info-back' onClick={this.props.toggleConversationHeader}><i className="icon mky-icon-close-light"></i></div>

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
						<input ref="nameChange" value={this.state.infoName} onChange={this.handleNameChange} onKeyDown={this.handleNameKeyDown} onBlur={this.handleNameBlur} type="text" className="mky-info-input-input" disabled={this.state.editingName ? false : true}/>
						{this.objectInfo.renameGroup && !this.state.editingName ? <i className="icon mky-icon-edit mky-info-edit-icon" onClick={this.toogleEditName}></i> : null}					
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

	componentDidUpdate(){
		if(this.state.editingName){
			var domNode = ReactDOM.findDOMNode(this.refs.nameChange);
        	domNode.focus();
		}
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
			editingName : !this.state.editingName
		});
		var domNode = ReactDOM.findDOMNode(this.refs.nameChange);
        domNode.focus();
	}

	handleNameChange(event) {
        this.setState({
			infoName : event.target.value.trim(),
		});
	}

	handleNameKeyDown(event){
		if(event.keyCode === 13 && !event.shiftKey) {
			this.objectInfo.renameGroup(this.props.conversationSelected.id, this.state.infoName);
			this.setState({
				editingName : false
			});
		}
	}

	handleNameBlur(event){
		this.setState({
			infoName : this.objectInfo.name,
			editingName : false
		});
	}

}

ContentInfo.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default ContentInfo;

//<i className="icon mky-icon-edit mky-info-edit-icon"></i>