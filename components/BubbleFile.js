import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { getExtention } from '../utils/monkey-utils.js'

class BubbleFile extends Component {
	constructor(props) {
		super(props);
		this.eventBubble = this.eventBubble.bind(this);
		this.downloadData = this.downloadData.bind(this);
		this.firstLoad = false;
	}

	componentWillReceiveProps(nextProps){
		if(!this.props.message.data && nextProps.message.data){
			this.firstLoad = true;
		}
	}

	render() {
		return (
			<div className='mky-content-file'>
				<div className='mky-content-file-data'>
					<a ref="downloadLink" className='mky-file-link' download={this.props.message.filename} href={this.props.message.data || ''} onClick={this.downloadData}>
						{ this.props.message.isDownloading  
							?(<div className='mky-file-download'>
	                            	<div className='mky-double-bounce1'></div>
									<div className='mky-double-bounce2'></div>
							</div>)
							:<Fileicon classFileType={this.defineFileType(this.props.message.filename)} />
						}
						<div className='mky-file-detail'>
							<div className='mky-file-name'>
								<span className='mky-ellipsify'>{this.props.message.filename}</span>
							</div>
							<div className='mky-file-size'>
								<span className='mky-ellipsify'>{this.humanFileSize(this.props.message.filesize, true)}</span>
							</div>
						</div>
					</a>
				</div>
			</div>
		)
	}

	componentDidUpdate(){
		if(this.firstLoad){
			this.firstLoad = false;

			var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
				ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
				ieEDGE = navigator.userAgent.match(/Edge/g),
				ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

			if (ie && ieVer<10) {
				return console.log("No blobs on IE ver<10");
			}else if(ieVer>-1){
				let link = ReactDOM.findDOMNode(this.refs.downloadLink);
				if(link){
					window.navigator.msSaveBlob(this.props.message.data, this.props.message.filename);
				}
			}else{
				let link = ReactDOM.findDOMNode(this.refs.downloadLink);
				if(link){
					link.click();
				}
			}
		}
	}

	eventBubble() {
		this.props.onClickMessage(this.props.message);
	}

	downloadData(event) {
		if(!this.props.message.data){
			event.preventDefault();
			if(!this.props.message.isDownloading){
				this.props.dataDownloadRequest(this.props.message.mokMessage);
			}
			return
		}

		var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
				ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
				ieEDGE = navigator.userAgent.match(/Edge/g),
				ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

		if (ie && ieVer<10) {
			console.log("No blobs on IE ver<10");
			event.preventDefault();
			return;
		}else if(ieVer>-1){
			event.preventDefault();
			window.navigator.msSaveBlob(this.props.message.data, this.props.message.filename);
		}
	}

	humanFileSize(bytes, si) {
	    var thresh = si ? 1000 : 1024;
	    if(Math.abs(bytes) < thresh) {
	        return bytes + ' B';
	    }
	    var units = si
	        ? ['KB','MB','GB','TB','PB','EB','ZB','YB']
	        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	    var u = -1;
	    do {
	        bytes /= thresh;
	        ++u;
	    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
	    return bytes.toFixed(1)+' '+units[u];
	}

	defineFileType(filename) {
        let ft;  //fileType by extention
		let pdf = ['pdf'];
		let doc = ['doc', 'docx'];
		let xls = ['xls', 'xlsx'];
		let ppt = ['ppt', 'pptx'];
		let gif = ['gif'];

        let extension = getExtention(filename);

		if (pdf.indexOf(extension)>-1){
			ft = 'pdf'
		}else if (doc.indexOf(extension)>-1){
            ft = 'doc';
        }else if(xls.indexOf(extension)>-1){
	        ft = 'xls';
        }else if(ppt.indexOf(extension)>-1){
	        ft = 'ppt';
        }else {
	     	ft = 'ext';
        }
        return 'mky-file-'+ft+'-icon';
    }
}

const Fileicon = ({classFileType}) => (
	<div className={'mky-file-icon '+classFileType}></div>
);

export default BubbleFile;
