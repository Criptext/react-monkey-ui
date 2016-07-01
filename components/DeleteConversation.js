import React, { Component } from 'react'

class DeleteConversation extends Component {
	constructor(props, context){
		super(props, context);
	}
	
	render() {
		return(
			<div className='mky-generic-modal' onClick={this.props.handleClosePopup}>
				<div className='mky-inner-modal'>
					<div className='mky-popup-message'>What do you want to do whit this conversation?</div>
					<div className='mky-popup-buttons'>
						{ this.context.options.deleteConversation.permission.exitGroup
							? <button className='mky-popup-button' onClick={this.props.handleExitGroup}>EXIT</button>
							: null
						}
						{ this.context.options.deleteConversation.permission.delete
							? <button className='mky-popup-button' onClick={this.props.handleDeleteConversation}>DELETE</button>
							: null
						}
						<button className='mky-popup-button' onClick={this.props.handleClosePopup}>CANCEL</button>
					</div>
					
				</div>
			</div>
		)
	}
}

DeleteConversation.contextTypes = {
    options: React.PropTypes.object.isRequired
}

export default DeleteConversation