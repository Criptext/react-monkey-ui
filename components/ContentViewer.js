import React, { Component } from 'react'
require('exif-js/exif.js');
require('jquery-knob/dist/jquery.knob.min.js');
var $ = require('jquery');

class ContentViewer extends Component {
	constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
	}
	componentDidMount() {
   		window.addEventListener('resize', this.handleResize);
	}

	handleResize(){

		var height_ = $('#file_viewer_image').parent().height() - 40;
		var width_ = $('#file_viewer_image').parent().width() - 40;
		$('#viewer-img').css({
				'max-height': height_+'px',
				'max-width': width_+'px'
		});
	}

	render() {
		return(
			<div className="mky-viewer-image-container">
				<div className="mky-viewer-toolbar">
					<a href={this.props.message.data} download={this.props.message.filename} >
						<button className="mky-button-download" title="Download">Download</button>
					</a>
				</div>
				<div id="file_viewer_image" className="mky-viewer-image">
					<div className="mky-viewer-back-close" onClick={this.props.onClose}>
					</div>
					<img id="viewer-img" src={this.props.message.data} onLoad={this.handleResize} />
				</div>
			</div>
		)
	}
}

export default ContentViewer;
