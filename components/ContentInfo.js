import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import InfoItem from './InfoItem.js';

class ContentInfo	 extends Component {
	constructor(props, context) {
		super(props, context);
		this.classExpand = this.props.isMobile || this.props.viewType != "fullscreen" ? 'mky-content-info-expand' : 'mky-content-info-no-expand';
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
		this.setState({infoName: this.objectInfo.name});
	}

	componentWillReceiveProps(nextProps) {
		this.objectInfo = this.props.getConversationInfo();
		if(this.objectInfo.name != this.state.infoName && !this.state.editingName){
			this.setState({infoName: this.objectInfo.name})
		}
	}

	render() {
	
    	return (
			<aside className={'mky-content-info '+this.classExpand} >
				<header className='mky-info-header'>
					<div className='mky-info-back' onClick={this.props.toggleConversationHeader}><i className="icon mky-icon-close" style={{fontSize : '14px', marginTop : '5px', display : 'block'}}></i></div>
					<div className="mky-info-header-block" style={{marginLeft : '20px'}}>
						<span className='mky-ellipsify mky-info-header-name'>{this.objectInfo.title ? this.objectInfo.title : 'Information'}</span>
						<span className="mky-info-header-desc" ></span>
					</div>
				</header>
				<div className='mky-info-container'>
					<div className='mky-info-conversation-image'>
						<img src={this.objectInfo.avatar} />
					</div>
					<div className='mky-info-conversation-description'>
						<div className='mky-info-conversation-header'>
							<label className='mky-info-conversation-title'>Name</label>
							<div className='mky-info-conversation-action'>
								<input ref='nameChange'
									className='mky-info-input'
									value={this.state.infoName}
									onChange={this.handleNameChange}
									onKeyDown={this.handleNameKeyDown}
									onBlur={this.handleNameBlur}
									type='text'
									disabled={this.state.editingName ? false : true}/>
								{ this.objectInfo.renameGroup && !this.state.editingName ? <i className='icon mky-icon-edit mky-info-edit-icon' onClick={this.toogleEditName}></i> : null }	
							</div>
						</div>
					</div>
					<div className='mky-info-conversation-description mky-info-conversation-adapt'>
						<div className='mky-info-conversation-header'>
							<label className='mky-info-conversation-title'>{this.objectInfo.subTitle}</label>
							<span className='mky-info-conversation-amount'>{this.objectInfo.users.length + ' of 50'}</span>
							<div className='mky-info-conversation-action'>
								{ this.objectInfo.canAdd 
									? <div>
										<i className='icon mky-icon-add-regular'></i> Add {this.objectInfo.users && this.objectInfo.users.length > 0 ? this.objectInfo.subTitle : null }
									</div>
									: null
								}
							</div>
						</div>
						<div className='mky-info-conversation-container'>
							<div className='mky-info-conversation-list'>
								{ this.objectInfo.users ? this.renderList(this.objectInfo.users, this.objectInfo.actions) : null }
							</div>
						</div>
					</div>
					{ this.objectInfo.button && this.objectInfo.button.text && this.objectInfo.button.func
						? <button className="mky-info-button" onClick={ () => { this.objectInfo.button.func(this.props.conversationSelected.id) } }>
							<span className="mky-info-button-text">{this.objectInfo.button.text}</span>
							<i className={ this.objectInfo.button.class ? this.objectInfo.button.class : 'icon mky-icon-signout-sober mky-info-button-i'}></i>
						</button>
						: null
					}
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
				itemList.push(<InfoItem key={item.id} item={item} conversationSelected={this.props.conversationSelected} actions={actions} />);
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