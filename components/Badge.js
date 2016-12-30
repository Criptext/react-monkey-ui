import React, { Component } from 'react'

class Badge extends React.Component {
	constructor(props) {
		super(props);
	    this.state = {
	      numbreClass : ''
	    }
	}
  componentWillMount(){

    if ( (this.props.value == 11) || (this.props.value < 10) ) {
      this.setState({ numbreClass : 'mky-notification-amount-1' });
    }else if ( (this.props.value >= 10 && this.props.value < 20) && (this.props.value != 11) ) {
      this.setState({ numbreClass : 'mky-notification-amount-2' });
    }else if (this.props.value >= 20) {
      this.setState({ numbreClass : 'mky-notification-amount-1' });
    }

  }

	render() {
		return (
      <div className='mky-conversation-notification'>
    	{ this.props.value > 0
    		? <div className={'mky-notification-amount '+this.state.numbreClass+' animated pulse'}>{this.props.value}</div>
    		: null
    	}
    	</div>
    )
	}
}

export default Badge;