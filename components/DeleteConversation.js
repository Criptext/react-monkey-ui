import React, { Component } from 'react'

class DeleteConversation extends Component {
	constructor(props, context){
		super(props, context);
	}
	
	render() {
		return(
			<div className='mky-generic-modal'>
				<div className='mky-inner-modal'>
					<div className='mky-popup-message'>Are you sure you want to delete the conversation</div>
					<div className='mky-popup-buttons'>
						{ this.context.options.deleteConversation.permission.delete
							? <button className='mky-popup-button' onClick={this.props.handleDeleteConversation}>DELETE</button>
							: null
						}
						{ this.context.options.deleteConversation.permission.exitGroup
							? <button className='mky-popup-button' onClick={this.props.handleExitGroup}>EXIT GROUP</button>
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