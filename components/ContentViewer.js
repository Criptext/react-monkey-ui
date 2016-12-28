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

		this.downloadImage = this.downloadImage.bind(this)
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
					<a href={this.props.message.data} onClick={this.downloadImage} download={this.props.message.filename}>
						<div className='mky-button-download mky-button-modal' title="Download">Download</div>
					</a>
				</div>
				<div id="file_viewer_image" className={"mky-viewer-image "+this.state.imageOrientation}>
					<div className="mky-viewer-back-close" onClick={this.props.onClose}></div>
						<img ref="image" id="viewer-img" src={this.props.message.data} onLoad={this.handleResize} />
				</div>
			</div>
		)
	}

	rotateBase64Image90Degree(base64data) {

	}

	downloadImage(event){
		var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
				ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
				ieEDGE = navigator.userAgent.match(/Edge/g),
				ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

		if ( (ie && ieVer<10) || ieVer>-1 ) {
			var blob = base64toBlob(this.props.message.data.split(";base64,")[1], this.props.message.mimetype);
			window.navigator.msSaveBlob(blob, this.props.message.filename);
			event.preventDefault();
		}
	}
}

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

export default ContentViewer;
