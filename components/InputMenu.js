import React, { Component } from 'react'
import Lang from '../lang'

class InputMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		let animationClass = this.props.visible ? 'mky-menu-bubble-show' : 'mky-menu-bubble-hide';
		let menuClass = this.props.visible ? '' : 'mky-disabled';
		return (
			<div id='mky-menu-bubble' className={'mky-menu-bubble '+animationClass}>
				{/*<div className='menu-bubble-item' onClick={this.props.enableGeoInput}><i id='mky-menu-location-icon' className='demo-icon mky-location'>&#xe815;</i><p>Send Location</p></div>*/}
				<div className='mky-menu-bubble-item' onClick={this.props.handleAttach}>
					<div className='mky-bubble-circle-icon'>
						<i id='mky-menu-attach-icon' className='icons mky-icon-image' style={this.props.colorButton}></i>
					</div>
					<div className='mky-bubble-title'>{Lang[this.context.lang]['button.image.text']}</div>
				</div>
				<div className='mky-menu-bubble-item' onClick={this.props.handleAttachFile}>
					<div className='mky-bubble-circle-icon'>
						<i id='mky-menu-attach-file' className='icon mky-icon-file' style={this.props.colorButton}></i>
					</div>
					<div className='mky-bubble-title'>{Lang[this.context.lang]['button.file.text']}</div>
				</div>
				<div id='mky-layer-menu' className={menuClass} onClick={this.props.toggleVisibility}></div>
			</div>
		)
	}
}

InputMenu.contextTypes = {
    lang: React.PropTypes.string.isRequired
}

export default InputMenu;
