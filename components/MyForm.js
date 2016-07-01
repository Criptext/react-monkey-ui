import React, { Component } from 'react'
import styles from '../styles/myform.css';

class MyForm extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			text: ''
		};
		this.login = this.login.bind(this);
		this.handleOnChangeInput = this.handleOnChangeInput.bind(this);
	}

	render() {
		return (
			<div className='mky-monkey-login'>
				<div className='mky-monkey-logo'>
					<img src={this.defineLogo()}></img>
				</div>
				<form className='mky-chat-login-container'>
					<div className='field-login-text'>
						<p className='title'> <b>{this.defineLoginTitle()}</b>  </p>
						<p className='subtittle'>Please enter the information I need</p>
					</div>
					<div className='field field-input-name'>
						<input type='text' id='user_name' placeholder='Name' value={this.state.text} onChange={this.handleOnChangeInput}></input>
						<div className='error'>Name must contain at least 2 character.</div>
					</div>
					<div className='field field-input-submit'>
						<input type='submit' value='SUBMIT' id='submitChat' onClick={this.login}></input>
					</div>
				</form>
				<div className='mky-monkey_footer_sign'>Powered by <a href='http://criptext.com/'>Criptext</a></div>
			</div>
		)
	}
	
	handleOnChangeInput(event, value) {
		this.setState({text: event.target.value});
	}
	
	login(event) {
		event.preventDefault();
		let text = this.state.text.trim();
		if(text){
			let user = {
				name: text
			}
			this.props.handleLoginSession(user);
		}
		this.setState({text: ''});
	}

	defineLogo() {
		if(this.props.styles != null && this.props.styles.logo != null){
			return this.props.styles.logo
		}
		return 'https://cdn.criptext.com/MonkeyUI/images/monkey_widget_logo.png';
	}

	defineLoginTitle(){
		if(this.props.styles && this.props.styles.loginTitle){
			return this.props.styles.loginTitle;
		}
		return 'Welcome to our secure live-chat';
	}
}

MyForm.contextTypes = {
    extraChat: React.PropTypes.object.isRequired
}

export default MyForm;