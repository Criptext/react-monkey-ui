import React, { Component } from 'react'
import { defineTime, isConversationGroup } from '../utils/monkey-utils.js'

const Bubble = Component => class extends Component {
	constructor(props){
		super(props);
		this.username;
		this.userColor;
		this.resendMessage = this.resendMessage.bind(this);
		this.handleShowOptionList = this.handleShowOptionList.bind(this);
	}

	componentWillMount() {
		if(isConversationGroup(this.props.message.recipientId) && (this.props.userSessionId != this.props.message.senderId) && this.props.getUser){
			var user = this.props.getUser(this.props.message.senderId);
			this.username = user.name ? user.name : 'Unknown';
			this.userColor = user.color ? user.color : '#8c8c8c';
		}
	}

	render() {
		let customStyle = {color: this.userColor};
    	return (
			<div className='mky-message-line'>
				<div id={this.props.message.id} className={this.defineClass()} style={this.defineStyles()}>
					<div className='mky-message-detail'>
					{ this.props.userSessionId === this.props.message.senderId
						? <Status value={this.props.message.status} classStatus={this.defineStatusClass(this.props.message.status) } resendFunction={this.resendMessage}/>
						: ( this.username
							? <span className='mky-message-user-name' style={customStyle}>{this.username}</span>
							: null
						)
					}
						<span className='mky-message-hour'>{defineTime(this.props.message.datetimeCreation)}</span>
					</div>
					<div className='mky-message-content'>
						<Component {...this.props}/>
						{ (this.props.showOptions.incoming && this.props.userSessionId != this.props.message.senderId) || (this.props.showOptions.outgoing && this.props.userSessionId === this.props.message.senderId)
							? ( <div className='mky-message-option'>
									<div className='mky-message-option-plus' onClick={this.handleShowOptionList}>
										<i className='icon mky-icon-arrow-down-bold'></i>
									</div>
								</div>
							)
							: null
						}
					</div>
				</div>
			</div>
		)
	}
	
	defineClass() {
		const prefix = 'mky-';
		const baseClass = 'bubble';
		let layerClass = this.props.layerClass;
		let side = '';
		if(this.props.userSessionId === this.props.message.senderId){
			side = 'out';
		}else{
			side = 'in';
		}

		return prefix+baseClass+' '+prefix+baseClass+'-'+side+' '+prefix+baseClass+'-'+layerClass+' '+prefix+baseClass+'-'+layerClass+'-'+side
	}
	
	defineStatusClass(status) {
		let state;
		switch(status){
            case 0:
                state = 'load';
                break;
            case 50:
                state = 'sent';
                break;
            case 51:
                state = 'sent';
                break;
            case 52:
                state = 'read';
                break;
        }

        return 'mky-status-'+state;
	}

	defineStyles() {
		let style = {};
		if(this.props.layerClass == 'text' && this.props.styles != null){
			if(this.props.userSessionId === this.props.message.senderId){
				if(this.props.styles.bubbleColorOut){
					style.background = this.props.styles.bubbleColorOut;
				}
				if(this.props.styles.bubbleTextColorOut){
					style.color = this.props.styles.bubbleTextColorOut;
				}
			}else{
				if(this.props.styles.bubbleColorIn){
					style.background = this.props.styles.bubbleColorIn;
				}
				if(this.props.styles.bubbleTextColorIn){
					style.color = this.props.styles.bubbleTextColorIn;
				}
			}
		}

		return style;
	}

	resendMessage(){
		console.log('resend function');
	}

	handleShowOptionList(event){
		this.props.showOptionList(this.props.message, event.clientY, event.clientX);
	}
}

const Status = ({value, classStatus, resendFunction}) => (
	<div className={"mky-message-status "+classStatus} onClick={resendFunction}>
		{ value !== 0
			? ( value == -1
				? <i className="demo-icon mky-check">!</i>
				: <i className="icon mky-icon-check-sober"></i>
			)
			: null
		}
	</div>
);

export default Bubble;
