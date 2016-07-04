import React, { Component } from 'react'

class InputMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="mky-menu-bubble" className="mky-menu-bubble" style={{display : this.props.visible ? "block" : "none"}}>
				{/*<div className="menu-bubble-item" onClick={this.props.enableGeoInput}><i id="mky-menu-location-icon" className="demo-icon mky-location">&#xe815;</i><p>Send Location</p></div>*/}
				<div className="mky-menu-bubble-item" onClick={this.props.handleAttach}><i id="mky-menu-attach-icon" className="icon mky-icon-image-regular" style={this.props.colorButton}></i> <div>Image</div></div>
				<div className="mky-menu-bubble-item" onClick={this.props.handleAttachFile}><i id="mky-menu-attach-file" className="icon mky-icon-doc-regular" style={this.props.colorButton}></i><div>File</div></div>
				<div id="mky-layer-menu" onClick={this.props.toggleVisibility} ></div>
			</div>
		)
	}
}

export default InputMenu;
