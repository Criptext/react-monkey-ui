import React, { Component } from 'react'

// ======================
// jquery.knob.js
require('jquery-knob/dist/jquery.knob.min.js');
var $ = require('jquery');

var playIntervalBubble;
var $bubblePlayer;

class BubbleAudio extends Component {
	constructor(props) {
		super(props);
		this.messageId = (props.message.id[0] == '-' ? (props.message.datetimeCreation) : props.message.id);
		this.state = {
			minutes: ('0' + parseInt(props.message.length/60)).slice(-2),
			seconds: ('0' + props.message.length%60).slice(-2)
		}
		this.isLoaded = false;
		this.downloadData = this.downloadData.bind(this);
		this.createAudioPlayer = this.createAudioPlayer.bind(this);
		this.playAudioBubble = this.playAudioBubble.bind(this);
		this.pauseAudioBubble = this.pauseAudioBubble.bind(this);
		this.pauseAllAudio = this.pauseAllAudio.bind(this);
		this.updateAnimationBuble = this.updateAnimationBuble.bind(this);
		this.radioColor = props.styles.bubbleColorOut || (props.styles.bubbleOutBackgroundColor || '#2c74c6');
	}
	
	componentWillMount() {	
        if(this.props.message.data == null && !this.props.message.isDownloading && !this.props.message.error){
            this.props.dataDownloadRequest(this.props.message.mokMessage);
        }else if(this.props.message.data) {
	        this.isLoaded = true;
        }
	}
	
	componentWillReceiveProps(nextProps) {
		if(this.props.message.data !== nextProps.message.data){
			this.isLoaded = true;
		}
	}
	
	render() {
		return (
            <div className={'mky-content-audio'}>
                { this.props.message.data
	                ? (
                    	<div className={'mky-content-audio-data'}>
	                        <div ref="mky_bubble_audio_play_button" id={'mky-bubble-audio-play-button-'+this.messageId} className={'mky-bubble-audio-button mky-bubble-audio-button-'+this.messageId+' mky-bubble-audio-play-button mky-bubble-audio-play-button-blue'} onClick={this.playAudioBubble} ></div>
	                        <div ref="mky_bubble_audio_pause_button" id={'mky-bubble-audio-pause-button-'+this.messageId} className={'mky-bubble-audio-button mky-bubble-audio-button-'+this.messageId+' mky-bubble-audio-pause-button mky-bubble-audio-pause-button-blue'} onClick={this.pauseAudioBubble} ></div>
	                        <input ref="mky_bubble_audio_player" id={'mky-bubble-audio-player-'+this.messageId} className='knob second'></input>
	                        <div className='mky-bubble-audio-timer'>
	                            <span>{this.state.minutes}</span><span>:</span><span>{this.state.seconds}</span>
	                        </div>
	                        <audio ref="mky_audio" id={'audio_'+this.messageId} preload='auto' controls='' src={this.props.message.data}></audio>
						</div>
                    )
                    : ( this.props.message.isDownloading
						? ( <div className='mky-content-audio-loading'>
	                        	<div className='mky-double-bounce1'></div>
								<div className='mky-double-bounce2'></div>
							</div>
						) : <div className='mky-content-audio-to-download' onClick={this.downloadData}><i className='icon mky-icon-download'></i></div>
					)
                }
            </div>
		)
	}
	
	componentDidMount() {
		this.createAudioPlayer();
	}
	
	componentDidUpdate() {
		this.createAudioPlayer();
	}
	
	downloadData() {
		this.props.dataDownloadRequest(this.props.message.mokMessage);
	}
	
	createAudioPlayer() {
		if(this.isLoaded){
			this.isLoaded = false;
			this.createAudioHandlerBubble(this.props.message.id, Math.round(this.props.message.length ? this.props.message.length : 1), this.radioColor);
			let mkyAudioBubble = this.refs.mky_audio;
	        $(this.refs.mky_bubble_audio_play_button).show();
	        $(this.refs.mky_bubble_audio_play_button).prop( 'disabled', true );
			$(this.refs.mky_bubble_audio_pause_button).hide();
	        if(mkyAudioBubble){
		        mkyAudioBubble.oncanplay = function() {
			        $(this.refs.mky_bubble_audio_play_button).prop( 'disabled', false );
	                this.createAudioHandlerBubble(this.messageId, Math.round(mkyAudioBubble.duration), this.radioColor);
	                this.setDurationTime(this.messageId);
	            }.bind(this)
	        }
		}
	}
	
	createAudioHandlerBubble(timestamp, duration, radioColor) {
		$(this.refs.mky_bubble_audio_player).knob({
            'min': 0,
            'max': duration,
            'angleOffset': -133,
            'angleArc': 265,
            'width': 100,
            'height': 90,
            'displayInput':false,
            'skin':'tron',
            'fgColor': radioColor,
            'thickness': 0.7,
            change : function (value) {
            }
        });
	}
	
	setDurationTime(timestamp) {
        let mkyAudioBubble = this.refs.mky_audio;
        if(mkyAudioBubble) {
	        let durationTime= Math.round(mkyAudioBubble.duration);
	        let seconds = ('0' + durationTime%60).slice(-2);
	        let minutes = ('0' + parseInt(durationTime/60)).slice(-2);
	        this.setState({
		        minutes: minutes,
		        seconds: seconds
		    });
        }
    }
    
    playAudioBubble() {
	    try {
		    this.pauseAllAudio();
	        window.$bubblePlayer = $(this.refs.mky_bubble_audio_player); //handles the circle
	        $(this.refs.mky_bubble_audio_play_button).hide();
	        $(this.refs.mky_bubble_audio_pause_button).show();
	        let audiobuble = this.refs.mky_audio;
	        audiobuble.play();
	        window.playIntervalBubble = setInterval(this.updateAnimationBuble,1000);
	        audiobuble.addEventListener('ended',function() {
	            this.setDurationTime(this.messageId);
	            window.$bubblePlayer.val(0).trigger('change');
				$(this.refs.mky_bubble_audio_play_button).show();
				$(this.refs.mky_bubble_audio_pause_button).hide();
	            clearInterval(window.playIntervalBubble);
	        }.bind(this));
	    } catch(err) {
		    console.log(err);
	    }
    }
    
    pauseAudioBubble() {
		$(this.refs.mky_bubble_audio_play_button).show();
		$(this.refs.mky_bubble_audio_pause_button).hide();
		let audiobuble = this.refs.mky_audio;
        audiobuble.pause();
        clearInterval(window.playIntervalBubble);
    }
    
    pauseAllAudio() {
	    try {
		    clearInterval(window.playIntervalBubble);
	        document.addEventListener('play', function(e){
	            var audios = document.getElementsByTagName('audio');
	            for(var i = 0, len = audios.length; i < len;i++){
	                if(audios[i] != e.target){
	                    audios[i].pause();
	                    $('.mky-bubble-audio-button').hide();
	                    $('.mky-bubble-audio-play-button').show();
	                }   
	            }
	            $(this.refs.mky_bubble_audio_play_button).hide();
				$(this.refs.mky_bubble_audio_pause_button).show();
	        }.bind(this), true);
	    } catch(err) {
		    console.log(err);
	    }
    }
    
    updateAnimationBuble() {
	    let audiobuble = this.refs.mky_audio;
	    if(audiobuble){
			var currentTime = Math.round(audiobuble.currentTime);
	        window.$bubblePlayer.val(currentTime).trigger('change');
	        let seconds = ('0' + currentTime%60).slice(-2);
	        let minutes = ('0' + parseInt(currentTime/60)).slice(-2);
	        this.setState({
		        minutes: minutes,
		        seconds: seconds
		    });   
	    }else{
		    clearInterval(window.playIntervalBubble);
	    }
    }
}

export default BubbleAudio;