import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import InputMenu from './InputMenu.js'
import ReactDOM from 'react-dom'
import { getExtention } from '../utils/monkey-utils.js'
import styles from '../styles/animate.min.css' // from ReactToastr
import Textarea from 'react-autosize-textarea'

import { ToastContainer, ToastMessage } from 'react-toastr'
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

// ======================
// MediaStreamRecorder.js
var MediaStreamRecorder = require('msr');

// ======================
// FileAPI.js
require('fileapi/dist/FileAPI.min.js');

// ======================
// jquery.knob.js
require('jquery-knob/dist/jquery.knob.min.js');
var $ = require('jquery');

class Input extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			buttonToShow: 1,
			classAudioButtonAvailable: '',
			minutes: '00',
			seconds: '00',
			text: '',
            menuVisibility: 0,
            creatingAudio: false,
            showAttachButton: true,
            showCancelAudioButton: false,
            showTextArea: true,
            showAudioArea: false,
            showAudioButton: true,
            showSendButton: false
            
		}
		this.handleOnKeyDownTextArea = this.handleOnKeyDownTextArea.bind(this);
		this.textMessageInput = this.textMessageInput.bind(this);

		this.handleRecordAudio = this.handleRecordAudio.bind(this);
		this.onMediaSuccess = this.onMediaSuccess.bind(this);
		this.onMediaError = this.onMediaError.bind(this);
		this.handleCancelAudio = this.handleCancelAudio.bind(this);
		this.setTime = this.setTime.bind(this);
		this.clearAudioRecordTimer = this.clearAudioRecordTimer.bind(this);
		this.handleAttach = this.handleAttach.bind(this);
		this.handleAttachFile = this.handleAttachFile.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.catchUpFile = this.catchUpFile.bind(this);
		this.generateDataFile = this.generateDataFile.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.buildAudio = this.buildAudio.bind(this);
		this.buildMP3 = this.buildMP3.bind(this);
		this.getFFMPEGWorker = this.getFFMPEGWorker.bind(this);
		this.handleMenuVisibility = this.handleMenuVisibility.bind(this);
		this.readData = this.readData.bind(this);
		this.pauseAllAudio = this.pauseAllAudio.bind(this);
		this.handleOnChangeTextArea = this.handleOnChangeTextArea.bind(this);
		this.focusTextarea = this.focusTextarea.bind(this);
		this.mediaRecorder;
		this.mediaStream;
		this.micActivated = false;
		this.mediaConstraints = {
		    audio: true
		};
		this.secondsRecording = 0;
		this.refreshIntervalId;
		this.typeMessageToSend = 0;
		this.audioCaptured = {};
		this.audioMessageOldId;
		this.ffmpegRunning = false;
		this.ffmpegWorker;
	}

    componentWillReceiveProps(nextProps){
    	if(nextProps.conversationSelected.id !== this.props.conversationSelected.id) {
			this.setState({text: ''});
		}
    }

    componentWillMount() {
	    if (window.location.protocol != "https:" || /iPhone|iPad|iPod/i.test(navigator.userAgent)){
		    this.setState({ classAudioButtonAvailable: 'mky-disabled'});
        }
    }

	render() {
		let styleInput = this.defineStyles();
    	return ( 
    		<div id='mky-chat-input' className={(this.props.connectionStatus == null || this.props.connectionStatus == 3) ? '' : 'mky-disabled'} >
				<div id='mky-chat-inner-input'>
					<InputMenu toggleVisibility={this.handleMenuVisibility}
						visible={this.state.menuVisibility}
						enableGeoInput={this.props.enableGeoInput}
						handleAttach={this.handleAttach}
						handleAttachFile={this.handleAttachFile}
						colorButton={styleInput.inputRightButton}/>
					<div className='mky-inner-chat-input'>
						<div id='mky-divider-chat-input'></div>
						<div className='mky-button-input'>
							{ this.state.showAttachButton
								? <i className='mky-button-icon icon mky-icon-drawer-sober' style={styleInput.inputLeftButton} onClick={this.handleMenuVisibility}></i>
								: null
							}
							{ this.state.showCancelAudioButton
								? <i className='mky-button-icon icon mky-icon-trashcan-regular' onClick={this.handleCancelAudio}></i>
								: null
							}
						</div>
						{ this.state.showTextArea
							? ( <Textarea ref='textareaInput'
									className='mky-textarea-input'
									value={this.state.text}
									placeholder='Write a secure message'
									onKeyDown={this.handleOnKeyDownTextArea}
									onChange={this.handleOnChangeTextArea}>
								</Textarea> )
							: null
						}
						{ this.state.showAudioArea
							? ( <div className='mky-record-area'>
									<div className='mky-record-preview-area'>
										<div id='mky-button-action-record'>
											<span id='mky-button-start-record' className='mky-blink'></span>
										</div>
										<div id='mky-time-recorder'>
											<span id='mky-minutes'>{this.state.minutes}</span><span>:</span><span id='mky-seconds'>{this.state.seconds}</span>
										</div>
									</div>
								</div> )
							: null
						}
						<div className='mky-button-input'>
							{ this.state.showAudioButton
								? ( this.state.creatingAudio
									? ( <div className='mky-spinner-input-audio'>
			    							<div className='mky-rect1'></div>
			    							<div className='mky-rect2'></div>
			    							<div className='mky-rect3'></div>
			    							<div className='mky-rect4'></div>
			    						</div> )
									: ( <i className={'mky-button-icon icon mky-icon-mic-sober'+' '+this.state.classAudioButtonAvailable}
											style={styleInput.inputRightButton}
											onClick={this.handleRecordAudio}>
											<span className='tooltip'>Browser is incompatible to record audio</span>
										</i> )
								)
								: null
							}
							{ this.state.showSendButton
								? <i className='mky-button-icon icon mky-icon-send-regular' style={styleInput.inputRightButton} onClick={this.handleSendMessage}></i>
								: null
							}
						</div>
						<Dropzone ref='dropzone' className='mky-disappear' onDrop={this.onDrop} accept="image/*" >
							<div>Try dropping some files here, or click to select files to upload.</div>
						</Dropzone>
						<Dropzone ref='dropzoneFile' className='mky-disappear' onDrop={this.onDrop} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.zip,.tar" >
							<div>Try dropping some files here, or click to select files to upload.</div>
						</Dropzone>
						<ToastContainer ref='container' toastMessageFactory={ToastMessageFactory} className='toast-bottom-center' />
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.ffmpegWorker = this.getFFMPEGWorker();
		this.focusTextarea();
	}

	componentDidUpdate() {
		this.focusTextarea();
	}

	focusTextarea(){
        if( (this.props.connectionStatus == null || this.props.connectionStatus == 3) && this.state.showTextArea){
			this.domNode = ReactDOM.findDOMNode(this.refs.textareaInput);
            this.domNode.focus();
        }
	}

	defineStyles() {
		let style = {
			inputLeftButton: {},
			inputRightButton: {}
		};
		if(this.context.styles){
			if(this.context.styles.inputLeftButtonColor){
				style.inputLeftButton.color = this.context.styles.inputLeftButtonColor
			}
			if(this.context.styles.inputRightButtonColor){
				style.inputRightButton.color = this.context.styles.inputRightButtonColor
			}
		}

		return style;
	}

    handleMenuVisibility() {
        this.setState({menuVisibility : !this.state.menuVisibility});
    }

	handleOnKeyDownTextArea(event) {
		this.typeMessageToSend = 0;

		if(event.keyCode === 13 && !event.shiftKey) {
			 if ($('#mky-chat-input').attr('style') != undefined) {
			 	$('#mky-chat-input').attr('style','');
			 }

			event.preventDefault()
			let text = this.state.text.trim();
			if(text){
				this.textMessageInput(event.target.value.trim());
			}
			this.setState({
				text: '',
				showAudioButton: true,
				showSendButton: false
			});
            this.props.handleNotifyTyping(false);
		}else if(event.keyCode === 8){
            this.props.handleNotifyTyping(false);
        }
	}

	handleOnChangeTextArea(event, value){
        if(event.target.value.length > this.state.text.length){
            this.props.handleNotifyTyping(true);
        }
        if(event.target.value.length == 0){
        	this.setState({
				showAudioButton: true,
				showSendButton: false
			});
        }else{
    		this.setState({
				showAudioButton: false,
				showSendButton: true
			});
        }
		this.setState({text: event.target.value});
	}

	textMessageInput(text) {
		let message = {
			bubbleType: 'text',
			text: text,
			preview: text
		}
		this.props.messageCreated(message);
	}

	handleRecordAudio() {
		this.typeMessageToSend = 1;

        if (!this.mediaRecorder) {
	        try {
			    navigator.getUserMedia(this.mediaConstraints, this.onMediaSuccess, this.onMediaError);
			    this.setState({
					showAttachButton: false,
					showCancelAudioButton: true,
					showTextArea: false,
					showAudioArea: true,
					showAudioButton: false,
					showSendButton: true
				});
			}
			catch(err) {
			    console.log(err);
			    this.setState({ classAudioButtonAvailable: 'mky-disabled' });
			}
        }
	}

    onMediaSuccess(stream) {
        //default settings to record
        this.micActivated = true;
        this.mediaRecorder = new MediaStreamRecorder(stream);
        this.mediaRecorder.mimeType = 'audio/wav';
        this.mediaRecorder.audioChannels = 1;
        var that = this;
        this.mediaRecorder.ondataavailable = function (blob) {
//             that.clearAudioRecordTimer();
            var timestamp = new Date().getTime();
            that.audioCaptured.blob = blob; //need to save the raw data
            that.audioCaptured.src = URL.createObjectURL(blob); // need to save de URLdata
        };

        this.refreshIntervalId = setInterval(this.setTime, 1000);//start recording timer
        this.mediaStream = stream;
        this.mediaRecorder.start(99999999999);//starts recording
    }

    onMediaError(e) {
	    this.handleCancelAudio();
	    console.log(e);
        console.error('media error', e);
    }

    setTime() {
	    ++this.secondsRecording;
	    let seconds = ('0' + this.secondsRecording%60).slice(-2);
        this.setState({seconds: seconds});
        let minutes = ('0' + parseInt(this.secondsRecording/60)).slice(-2);
        this.setState({minutes: minutes});
    }

    handleCancelAudio() {
	    this.setState({
			showAttachButton: true,
			showCancelAudioButton: false,
			showTextArea: true,
			showAudioArea: false,
			showAudioButton: true,
			showSendButton: false
		});
		this.clearAudioRecordTimer();
        this.mediaRecorder = null;
        this.mediaStream.getTracks().forEach(track => track.stop());
    }

    handleSendMessage(){
    	switch (this.typeMessageToSend) {
            case 0:
     			let text = this.state.text.trim();
				if(text){
					this.textMessageInput(text);
				}
				this.setState({
					text: '',
					showAudioButton: true,
					showSendButton: false
				});
     			break;
            case 1:
            	if (this.mediaRecorder) {
                    this.mediaRecorder.stop(); //detiene la grabacion del audio
                    this.mediaStream.getTracks().forEach(track => track.stop());
                }
                this.audioCaptured.duration = this.secondsRecording;
                this.setState({creatingAudio: true});
                this.clearAudioRecordTimer();
	               //      monkeyUI.showChatInput();
	            this.buildAudio();
	               //      mediaRecorder = null;
                this.handleCancelAudio()
            	break;
            case 3:

				break;
            case 4:

            	break;
            default:

                break;
        }
    }

    clearAudioRecordTimer() {
        this.secondsRecording = 0;
        clearInterval(this.refreshIntervalId);
        this.setState({
			seconds: '00',
	        minutes: '00'
		});
    }

    buildAudio() {
        // if (globalAudioPreview != null) pauseAudioPrev();

        this.audioMessageOldId = Math.round(new Date().getTime() / 1000 * -1);
        // disabledAudioButton(true);
        var that = this;
        FileAPI.readAsArrayBuffer(this.audioCaptured.blob, function (evt) {
            if (evt.type == 'load') {
                that.buildMP3('audio_.wav', evt.result);
            }else if (evt.type == 'progress') {
                var pr = evt.loaded / evt.total * 100;
            }else{
            	console.log(evt);
            }
        });
    }

    buildMP3(fileName, fileBuffer) {
        if (this.ffmpegRunning) {
            this.ffmpegWorker.terminate();
            this.ffmpegWorker = this.getFFMPEGWorker();
        }

        this.ffmpegRunning = true;
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        var outFileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.' + 'mp3';
        var _arguments = [];
        _arguments.push("-i");
        _arguments.push(fileName);
        _arguments.push("-b:a");
        _arguments.push('128k');
        _arguments.push("-acodec");
        _arguments.push("libmp3lame");
        _arguments.push("out.mp3");

        this.ffmpegWorker.postMessage({
            type: "command",
            arguments: _arguments,
            files: [{
                "name": fileName,
                "buffer": fileBuffer
            }]
        });
    }

    getFFMPEGWorker() {

        var response = "importScripts('https://cdn.criptext.com/MonkeyUI/scripts/ffmpeg.js');function print(text) {postMessage({'type' : 'stdout', 'data' : text});}function printErr(text) {postMessage({'type' :'stderr', 'data' : text});}var now = Date.now; onmessage = function(event) { var message = event.data; if (message.type === \"command\") { var Module = { print: print, printErr: print, files: message.files || [], arguments: message.arguments || [], TOTAL_MEMORY: message.TOTAL_MEMORY || false }; postMessage({ 'type' : 'start', 'data' : Module.arguments.join(\" \")}); postMessage({ 'type' : 'stdout', 'data' : 'Received command: ' + Module.arguments.join(\" \") + ((Module.TOTAL_MEMORY) ? \".  Processing with \" + Module.TOTAL_MEMORY + \" bits.\" : \"\")}); var time = now(); var result = ffmpeg_run(Module); var totalTime = now() - time; postMessage({'type' : 'stdout', 'data' : 'Finished processing (took ' + totalTime + 'ms)'}); postMessage({ 'type' : 'done', 'data' : result, 'time' : totalTime});}};postMessage({'type' : 'ready'});";

        window.URL = window.URL || window.webkitURL;
        var blobWorker;
        try {
            blobWorker = new Blob([response], { type: 'application/javascript' });
        } catch (e) {
            // Backwards-compatibility
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            blob = new BlobBuilder();
            blob.append(response);
            blob = blob.getBlob();
        }

        var ffmpegWorker = new Worker(URL.createObjectURL(blobWorker));
        var that = this;
        ffmpegWorker.onmessage = function (event) {
            var message = event.data;

            if (message.type === "ready" && window.File && window.FileList && window.FileReader) {} else if (message.type == "stdout") {
                // console.log(message.data);
            } else if (message.type == "stderr") {} else if (message.type == "done") {
                    var code = message.data.code;
                    var outFileNames = Object.keys(message.data.outputFiles);

                    if (code == 0 && outFileNames.length) {

                        var outFileName = outFileNames[0];
                        var outFileBuffer = message.data.outputFiles[outFileName];
                        var mp3Blob = new Blob([outFileBuffer]);
                        // var src = window.URL.createObjectURL(mp3Blob);
                        that.readData(mp3Blob);
                    } else {
                        /*Error*/
                    }
                }
        };
        return ffmpegWorker;
    }

    readData(mp3Blob) {
        // read mp3 audio
        var that = this;
        FileAPI.readAsDataURL(mp3Blob, function (evt) {
            if (evt.type == 'load') {
                // disabledAudioButton(false);
                //var dataURL = evt.result;
                var _src = evt.result;
                var _dataSplit = _src.split(',');
                var _data = _dataSplit[1];
                that.audioCaptured.src = 'data:audio/mpeg;base64,' + _data;
                that.audioCaptured.monkeyFileType = 1;
                that.audioCaptured.oldId = that.audioMessageOldId;
                that.audioCaptured.type = 'audio/mpeg';

                let message = {
	                data: that.audioCaptured.src,
	                bubbleType: 'audio',
	                preview: 'Audio',
	                length:that.audioCaptured.duration,
	                mimetype: 'audio/mpeg'
	            };
                that.props.messageCreated(message);
                that.setState({creatingAudio: false});

            } else if (evt.type == 'progress') {
                var pr = evt.loaded / evt.total * 100;
            } else {/*Error*/}
        });
    }

    pauseAllAudio() {
	    clearInterval(window.playIntervalBubble);
	    var that = this;
        document.addEventListener('play', function(e){
            var audios = document.getElementsByTagName('audio');
            for(var i = 0, len = audios.length; i < len;i++){
                if(audios[i] != e.target){
                    audios[i].pause();
                    $('.mky-bubble-audio-button').hide();
                    $('.mky-bubble-audio-play-button').show();
                }
            }
        }, true);
    }

    handleAttach() {
        this.handleMenuVisibility();
	    this.refs.dropzone.open();
    }

    handleAttachFile() {
        console.log('handleAttachFile');
        this.handleMenuVisibility();
        this.refs.dropzoneFile.open();
    }

    onDrop(files) {
		let _file;
	    files.map((file) => (_file = file))
		this.catchUpFile(_file);
    }

    catchUpFile(file) {
        this.generateDataFile(file);
    }

    generateDataFile(file) {
        if(file.size <= 5000000){
            FileAPI.readAsDataURL(file, (evt) => {
                if( evt.type == 'load' ){
    	            let message = {
    	                filename: file.name,
    	                filesize: file.size,
    	                mimetype: file.type
                	}
    				message.data = evt.result;
    	            let type = this.checkExtention(file);
    	            switch(type){
    		            case 1:{
    			            message.bubbleType = 'image';
    			            message.preview = 'Image';
    			            break;
    		            }
    		            case 2:{
    			            message.bubbleType = 'file';
    			            message.preview = 'File';
    			            break;
    		            }
    	            }
    				this.props.messageCreated(message);
                }
            });
        }
        else{
            this.refs.container.warning(
              "",
              "File size limit is 5MB", {
              timeOut: 5000,
              extendedTimeOut: 0
            });
        }
    }

    checkExtention(files) {
        var ft=0;  //fileType by extention

        var file=["doc","docx","pdf","xls", "xlsx","ppt","pptx","zip","tar","csv"];
        var img=["jpe","jpeg","jpg","png","gif"]; //1

        var extension = getExtention(files.name);

        if(img.indexOf(extension)>-1){
            ft=1;
        }else if(file.indexOf(extension)>-1){
	        ft=2;
        }

        return ft;
    }
}

Input.contextTypes = {
    styles: React.PropTypes.object.isRequired
}

export default Input;
