import React, { Component } from 'react'
const isFirefox = typeof InstallTrigger !== 'undefined';
var EXIF = require('exif-js/exif.js');

class BubbleImage extends Component {
	constructor(props) {
		super(props);
		this.eventBubble = this.eventBubble.bind(this);
		this.openImage = this.openImage.bind(this);
		this.downloadData = this.downloadData.bind(this);
		this.defineImageDataStyle = this.defineImageDataStyle.bind(this);
		this.state = {
			imageHeightAuto : '',
			imageOrientation : '',
			loaded : false,
		}
	}

	componentWillMount() {
        if(this.props.message.data == null && !this.props.message.isDownloading && !this.props.message.error){
            this.props.dataDownloadRequest(this.props.message.mokMessage);
        }
	}

	componentWillReceiveProps(nextProps){

		if (nextProps.message.data != null && this.state.imageHeightAuto.length==0 && !this.state.loaded) {

			let imageObject = new Image();
			var that = this;

			imageObject.onload = function(){
				if (imageObject.height < 250) {
					that.setState({ imageHeightAuto : 'mky-content-image-data-staic'});
				}
				EXIF.getData(imageObject, function() {
					let orientation = EXIF.getTag(this, "Orientation");
					if (orientation != undefined) {
						// console.log('orientation: '+ orientation);
						// console.log(EXIF.pretty(this));
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

			imageObject.src = nextProps.message.data;
			this.setState({
				loaded : true
			})
		}
	}

	render() {
		return (
			<div className='mky-content-image'>
				{ this.props.message.data
					? ( <div className={'mky-content-image-data ' +this.state.imageHeightAuto + ' '+this.state.imageOrientation}>
							<img src={this.props.message.data} onClick={this.openImage} ></img>
						</div>
					)
					: ( this.props.message.isDownloading
						? ( <div className='mky-content-image-loading'>
                            	<div className='mky-double-bounce1'></div>
								<div className='mky-double-bounce2'></div>
							</div>
						)
						: <div className='mky-content-image-to-download' onClick={this.downloadData}><i className='icon mky-icon-download'></i></div>
                    )
                }
			</div>
		)
	}

	defineImageDataStyle() {
		let style = {};
		if(isFirefox){
			style.height = '100%';
		}else{
			style.height = 'auto';
		}
		return style;
	}

	openImage() {
		this.props.messageSelected(this.props.message);
	}

	eventBubble() {
		this.props.onClickMessage(this.props.message.mokMessage);
	}

	downloadData() {
		this.props.dataDownloadRequest(this.props.message.mokMessage);
	}
}

export default BubbleImage;
