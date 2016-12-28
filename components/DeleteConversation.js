import React, { Component } from 'react'
import Lang from '../lang'

class DeleteConversation extends Component {
	constructor(props, context){
		super(props, context);
	}
	
	render() {
		return(
			<div className='mky-generic-modal' onClick={this.props.handleClosePopup}>
				<div className='mky-inner-modal'>
					<div className='mky-popup-message'>{Lang[this.context.lang]['ask.conversation']}</div>
					<div className='mky-popup-buttons'>
						{ this.context.options.conversation.optionsToDelete.onExitGroup && this.props.isGroupConversation
							? <button className='mky-popup-button' onClick={this.props.handleExitGroup}>{Lang[this.context.lang]['button.exitgroup.text']}</button>
							: null
						}
						{ this.context.options.conversation.optionsToDelete.onDelete
							? <button className='mky-popup-button' onClick={this.props.handleDeleteConversation}>{Lang[this.context.lang]['button.delete.text']}</button>
							: null
						}
						<button className='mky-popup-button' onClick={this.props.handleClosePopup}>{Lang[this.context.lang]['button.cancel.text']}</button>
					</div>
				</div>
			</div>
		)
	}
}

DeleteConversation.contextTypes = {
	lang: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
}

export default DeleteConversation