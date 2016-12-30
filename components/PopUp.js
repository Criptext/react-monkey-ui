import React, { Component } from 'react'
import Lang from '../lang'

const PopUp = Component => class extends Component {
	constructor(props, context){
		super(props, context);
	}

	render() {
		return(
			<div className='mky-generic-modal' onClick={this.props.togglePopup}>
				<div className='mky-inner-modal'>
					<div className='mky-popup-message'>{this.props.popUpMessage}</div>
					<div className='mky-popup-buttons'>
						<Component {...this.props}/>
						<button className='mky-popup-button' onClick={this.props.togglePopup}>{Lang[this.context.lang]['button.cancel.text']}</button>
					</div>
					
				</div>
			</div>
		)
	}
}

PopUp.contextTypes = {
    lang: React.PropTypes.string.isRequired
}

export default PopUp;
