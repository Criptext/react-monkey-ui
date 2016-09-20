import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { getExtention } from '../utils/monkey-utils.js'

class BubbleContact extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {

	}

	render() {
		return (
			<div className='mky-content-contact'>
				<div>
					<div className='mky-contact-photo'>
                        <img src={this.props.message.data.photo ? "data:image/png;base64," + this.props.message.data.photo : "https://cdn.criptext.com/MonkeyUI/images/userdefault.png"} />
					</div>
					<div className='mky-contact-detail'>
						<div className='mky-contact-name'>
							<span className='mky-ellipsify'>{this.props.message.data.name}</span>
						</div>
						<div>
							<span className='mky-ellipsify'>{this.props.message.data.tel}</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

export default BubbleContact;
