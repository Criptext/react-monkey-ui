import React, { Component } from 'react'
import PopUp from './PopUp.js'
import ContentLogOut from './ContentLogOut.js'

class InfoItem extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showActions: false,
			showConfirm: false,
			actionIndex: null,
			bottom : 0,
			right : 0,
			errored : false
		}
		this.toggleActions = this.toggleActions.bind(this);
		this.renderActions = this.renderActions.bind(this);
		this.toggleConfirm = this.toggleConfirm.bind(this);
		this.handleError = this.handleError.bind(this);
	}

	componentWillReceiveProps(nextProps) {

	}

	render() {
		const Confirm_ = PopUp(ContentLogOut);

    	return (
			<div className="mky-info-list-item">
				<img src={this.state.errored ? 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png' : this.props.item.avatar} onError={this.handleError}/>
				<div className="mky-info-list-name">
					<div className="mky-info-content">
						<div className="mky-info-content-name">{this.props.item.name}</div>
						{this.props.item.rol ? <div className="mky-info-content-rol">{this.props.item.rol}</div> : null}
					</div>
					<div className="mky-info-list-desc">{this.props.item.description}</div>
					{ this.props.actions && this.props.actions.length > 0 && !this.props.item.rol
						? <div className="mky-info-actions-icon" onClick={this.toggleActions}><i className="icon mky-icon-arrow-down-regular"></i></div>
						: null
					}
					{	
						this.state.showActions && this.props.actions && this.props.actions.length > 0 && !this.props.item.rol
						? (<div>
							<div className="mky-info-actions" style={{bottom : this.state.bottom + "px", right : this.state.right + "px"}}>
								{this.renderActions()}
							</div>
							<div className="mky-info-actions-back" onClick={this.toggleActions}>
							</div>
						</div>)
						: null
					}
					{typeof this.state.actionIndex == "number"
						? <Confirm_ togglePopup = {this.toggleConfirm} popUpMessage = {"Are you sure?"} userSessionLogout={() => { this.props.actions[this.state.actionIndex].func(this.props.item.id, this.props.conversationSelected.id); }}/> 
						: null
					}
				</div>
			</div>
		)
	}

	handleError(){
		this.setState({
			errored : true,
		});
	}

	toggleActions(event){
		this.setState({
			showActions : !this.state.showActions,
			actionIndex : null,
			bottom : window.innerHeight - event.clientY,
			right : window.innerWidth - event.clientX,
		});
	}

	toggleConfirm(index){
		if(typeof index == "number" && !this.props.actions[index].confirm){
			this.setState({
				showActions : false,
			});
			this.props.actions[index].func(this.props.item.id, this.props.conversationSelected.id);
			return;
		}else if(typeof index == "number"){
			this.setState({
				showActions : false,
				actionIndex : index,
			});
			return;
		}

		this.setState({
			showActions : false,
			actionIndex : null
		});
	}

	renderActions(){
		var actionList = [];

		this.props.actions.forEach( (action, index) => {
			if(action){
				actionList.push(<div key={"action" + index} className="mky-info-action" onClick={ () => { this.toggleConfirm(index); } }>
					{action.action}
				</div>);
			}
		})

		return actionList;
	}

}

InfoItem.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default InfoItem;