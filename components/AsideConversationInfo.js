import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import InfoItem from './InfoItem.js'
import { isConversationGroup } from '../utils/monkey-utils.js'
import Lang from '../lang'

class AsideConversationInfo extends Component {
	constructor(props, context) {
		super(props, context);
		this.objectInfo = {};
		this.state = {
			editingName: false, 
			infoName: '',
			urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'
		}
		this.toogleEditName = this.toogleEditName.bind(this);
		this.handleNameKeyDown = this.handleNameKeyDown.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleNameBlur = this.handleNameBlur.bind(this);
	}

	componentWillMount(){
		this.objectInfo = this.props.getConversationInfo();
		this.setState({
			infoName: this.objectInfo.name,
			urlAvatar: this.objectInfo.avatar ? this.objectInfo.avatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'
		});
	}

	componentWillReceiveProps(nextProps) {
		this.objectInfo = this.props.getConversationInfo();
		if(this.objectInfo.name != this.state.infoName && !this.state.editingName){
			this.setState({infoName: this.objectInfo.name})
		}
	}

	render() {
		let styleHeader = this.defineStyles();
    	return (
			<div className='mky-info-conversation'>
				<header className='mky-info-header' style={styleHeader.header}>
					<div className='mky-info-close' style={styleHeader.title} onClick={ () => {this.props.toggleConversationHeader('conversation')} }>
						{ this.props.compactView
							? <i className='icon mky-icon-back'></i>
							: <i className='icon mky-icon-close'></i>
						}
					</div>
					<div className='mky-info-header-description'>
						<span className='mky-info-header-title mky-ellipsify' style={styleHeader.title}>{this.objectInfo.title ? this.objectInfo.title : Lang[this.context.lang]['title.information']}</span>
						<span className='mky-info-header-subtitle'></span>
					</div>
				</header>
				<div className='mky-info-container'>
					<div className='mky-info-conversation-image'>
						<img src={this.state.urlAvatar} onError={this.handleErrorAvatar}/>
					</div>
					<div className='mky-info-conversation-description mky-info-conversation-data'>
						<div className='mky-info-conversation-header'>
							<label className='mky-info-conversation-title'>{isConversationGroup(this.props.conversationSelected.id) ? Lang[this.context.lang]['title.groupname'] : Lang[this.context.lang]['title.name']}</label>
							<div className='mky-info-conversation-action'>
								<input ref='nameChange'
									className='mky-info-input'
									value={this.state.infoName}
									onChange={this.handleNameChange}
									onKeyDown={this.handleNameKeyDown}
									onBlur={this.handleNameBlur}
									type='text'
									disabled={this.state.editingName ? false : true}/>
								{ this.objectInfo.renameGroup && !this.state.editingName ? <i className='icon mky-icon-pencil' onClick={this.toogleEditName}></i> : null }	
							</div>
						</div>
					</div>
					<div className='mky-info-conversation-description mky-info-conversation-members'>
						<div className='mky-info-conversation-header'>
							<label className='mky-info-conversation-title mky-ellipsify'>{this.objectInfo.subTitle}</label>
							<span className='mky-info-conversation-amount'>{this.objectInfo.users.length + ' of 50'}</span>
							<div className='mky-info-conversation-action'>
								{ this.objectInfo.canAdd 
									? <div>
										<i className='icon mky-icon-add'></i> Add {this.objectInfo.users && this.objectInfo.users.length > 0 ? this.objectInfo.subTitle : null }
									</div>
									: null
								}
							</div>
						</div>
						<div className='mky-info-conversation-container'>
							<ul className='mky-info-conversation-list'>
								{ this.objectInfo.users ? this.renderList(this.objectInfo.users, this.objectInfo.actions) : null }
							</ul>
						</div>
					</div>
					{ this.objectInfo.button && this.objectInfo.button.text && this.objectInfo.button.func
						? <button className="mky-info-button" onClick={ () => { this.objectInfo.button.func(this.props.conversationSelected.id) } }>
								<span className="mky-info-button-text">{this.objectInfo.button.text}</span>
								<i className={ this.objectInfo.button.class ? this.objectInfo.button.class : 'icon mky-icon-signout mky-info-button-i'}></i>
						</button>
						: null
					}
					<div className='mky-space'></div>
				</div>
			</div>
		)
	}

	componentDidUpdate(){
		if(this.state.editingName){
			var domNode = ReactDOM.findDOMNode(this.refs.nameChange);
        	domNode.focus();
		}
	}
	
	defineStyles() {
		let style = {
			header: {},
			title: {}
		};
		if(this.context.styles){
			if(this.context.styles.toggleColor){
				style.header.background = this.context.styles.toggleColor;	
				style.header.borderBottom = '1px solid ' + this.context.styles.toggleColor;
			}
			if(this.context.styles.titleTextColor){
				style.title.color = this.context.styles.titleTextColor
			}
		}
		
		return style;
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
		this.setState({editingName: !this.state.editingName});
		var domNode = ReactDOM.findDOMNode(this.refs.nameChange);
        domNode.focus();
	}

	handleNameChange(event) {
        this.setState({infoName: event.target.value});
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
			infoName: this.objectInfo.name,
			editingName: false
		});
	}
	
	handleErrorAvatar() {
		this.setState({urlAvatar: 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png'});
	}
}

AsideConversationInfo.contextTypes = {
    lang: React.PropTypes.string.isRequired,
    styles: React.PropTypes.object.isRequired
}

export default AsideConversationInfo;