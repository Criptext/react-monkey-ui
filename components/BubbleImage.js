import React, { Component } from 'react'

class BubbleImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDownloading: false
		}
		this.eventBubble = this.eventBubble.bind(this);
		this.openImage = this.openImage.bind(this);
		this.downloadData = this.downloadData.bind(this);
	}

	componentWillMount() {
        if(this.props.message.data == null && !this.state.isDownloading && !this.props.message.error){
            this.props.dataDownloadRequest(this.props.message.mokMessage);
            this.setState({isDownloading: true});
        }
	}
	
	render() {
		return (
			<div className='mky-content-image'>
				{ this.props.message.data
					? ( <div className='mky-content-image-data'>
							<img src={this.props.message.data} onClick={this.openImage}></img>
						</div>
					)
					: ( this.state.isDownloading
						? ( <div className='mky-content-image-loading'>
                            	<div className='mky-double-bounce1'></div>
								<div className='mky-double-bounce2'></div>
							</div>
						)
						: <div className='mky-content-image-to-download' onClick={this.downloadData}><i className='demo-icon mky-menu-down'>&#xe815;</i></div>
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
        this.setState({isDownloading: true});
	}
}

export default BubbleImage;