import React, { Component } from 'react'

class BubbleImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageHeight : 'mky-content-image-data',
			imageBubbleClass : 'mky-content-image'
		}
		this.eventBubble = this.eventBubble.bind(this);
		this.openImage = this.openImage.bind(this);
		this.downloadData = this.downloadData.bind(this);

	}

	componentWillMount() {
        if(this.props.message.data == null && !this.props.message.isDownloading && !this.props.message.error){
            this.props.dataDownloadRequest(this.props.message.mokMessage);
        }
				
				if (this.props.message.data != null ) {
					let imageObject = new Image();
					var that = this;
					imageObject.onload = function(){
						if (imageObject.height < 250) {
							that.setState({
								imageHeight : 'mky-content-image-data-auto',
								imageBubbleClass : 'mky-content-image-auto'
				    	});
						}


					};
					imageObject.src = this.props.message.data;
				}
	}

	render() {

		return (
			<div className={this.state.imageBubbleClass}>
				{ this.props.message.data
					? ( <div className={this.state.imageHeight}>
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
