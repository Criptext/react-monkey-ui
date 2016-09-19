import React, { Component } from 'react'
var EXIF = require('exif-js/exif.js');
require('jquery-knob/dist/jquery.knob.min.js');
var $ = require('jquery');

class ContentViewer extends Component {
	constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
		this.rotateBase64Image90Degree = this.rotateBase64Image90Degree.bind(this);
		this.state = {
			imageOrientation : ''
		}
	}

	componentDidMount() {
   		window.addEventListener('resize', this.handleResize);

			if (this.props.message.data != null && this.state.imageOrientation.length==0 ) {

				let imageObject = new Image();
				var that = this;

				imageObject.onload = function(){
					EXIF.getData(imageObject, function() {
						let orientation = EXIF.getTag(this, "Orientation");
						if (orientation != undefined) {
							console.log('did mount');
							switch (orientation) {
								case 3:
									that.setState({ imageOrientation : 'rotate180'});
									break;
								case 8:
									that.setState({ imageOrientation : 'rotate270'});
									break;
								case 6:
									that.setState({ imageOrientation : 'rotate90'});
									break;
								default:
							}

						}
					});
				};

				imageObject.src = this.props.message.data;
			}
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
						<div className='mky-button-download mky-button-modal' title="Download">Download</div>
					</a>
				</div>
				<div id="file_viewer_image" className={"mky-viewer-image "+this.state.imageOrientation}>
					<div className="mky-viewer-back-close" onClick={this.props.onClose}></div>
						<img id="viewer-img" src={this.props.message.data} onLoad={this.handleResize} />
				</div>
			</div>
		)
	}

	rotateBase64Image90Degree(base64data) {

	}
}

export default ContentViewer;
