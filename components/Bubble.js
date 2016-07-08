import React, { Component } from 'react'
import { defineTime, isConversationGroup } from '../utils/monkey-utils.js'

const Bubble = Component => class extends Component {
	constructor(props){
		super(props);
		this.username;
		this.userColor;
		this.resendMessage = this.resendMessage.bind(this);
	}

	componentWillMount() {
		if(isConversationGroup(this.props.message.recipientId) && (this.props.userSessionId != this.props.message.senderId)){
			var user = this.props.getUser(this.props.message.senderId);
			this.username = user.name ? user.name : 'Unknown';
			this.userColor = user.color ? user.color : '#8c8c8c';
		}
	}

	render() {
		let classBubble = this.defineClass();
		let styleBubble = this.defineStyles();
		let customStyle = {color : this.userColor};
    	return (
			<div className='mky-message-line'>
				<div id={this.props.message.id} className={classBubble} style={styleBubble}>
					<div className="mky-message-detail">
					{ this.props.userSessionId === this.props.message.senderId
						? <Status value={this.props.message.status} classStatus={this.defineStatusClass(this.props.message.status) } resendFunction={this.resendMessage}/>
						: ( this.username
							? <span className="mky-message-user-name" style={customStyle}>{this.username}</span>
							: null
						)
					}
						<span className="mky-message-hour">{defineTime(this.props.message.datetimeCreation)}</span>
					</div>
					<Component {...this.props}/>
				</div>
			</div>
		)
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
}

const Status = ({value, classStatus, resendFunction}) => (
	<div className={"mky-message-status "+classStatus} onClick={resendFunction}>
		{ value !== 0
			? ( value == -1
				? <i className="demo-icon mky-check">!</i>
				: <i className="icon mky-icon-check"></i>
			)
			: null
		}
	</div>
);

export default Bubble;
