import React, { Component } from 'react'

const PopUp = Component => class extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return(
			<div className='mky-generic-modal' onClick={this.props.togglePopup}>
				<div className='mky-inner-modal'>
					<div className='mky-popup-message'>{this.props.popUpMessage}</div>
					<div className='mky-popup-buttons'>
						<Component {...this.props}/>
						<button className='mky-popup-button' onClick={this.props.togglePopup}>CANCEL</button>
					</div>
					
				</div>
			</div>
		)
	}
}

export default PopUp;
