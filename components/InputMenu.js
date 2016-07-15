import React, { Component } from 'react'

class InputMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="mky-menu-bubble" className="mky-menu-bubble animated fadeInUp" style={{display : this.props.visible ? "block" : "none"}}>
				{/*<div className="menu-bubble-item" onClick={this.props.enableGeoInput}><i id="mky-menu-location-icon" className="demo-icon mky-location">&#xe815;</i><p>Send Location</p></div>*/}
				<div className="mky-menu-bubble-item" onClick={this.props.handleAttach}>
					<div className="mky-bubble-circle-icon">
						<i data-icon="&amp;"  id="mky-menu-attach-icon" className="icons" style={this.props.colorButton}></i>

					</div>
					<div className="mky-bubble-title">Image</div>
				</div>
				<div className="mky-menu-bubble-item" onClick={this.props.handleAttachFile}>
					<div className="mky-bubble-circle-icon">
						<i  data-icon="%"  id="mky-menu-attach-file" className="icon " style={this.props.colorButton}></i>
						
					</div>
					<div className="mky-bubble-title">File</div>
				</div>
				<div id="mky-layer-menu" onClick={this.props.toggleVisibility} ></div>
			</div>
		)
	}
}

export default InputMenu;
