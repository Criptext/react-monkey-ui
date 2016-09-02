# Getting Started
You can use it with nodeJS.
## Installation
### npm

`npm install react-monkey-ui --save`

## Usage
### Prerequisites
- react

### How to use

```javascript
import React, { Component } from 'react'
import MonkeyUI from 'react-monkey-ui'

class MonkeyChat extends Component {
  constructor(props){
	super(props);
      this.state = {
        userSession: null,
        conversationId: '2',
        conversations: {
          '2': conv2, // * conversation Object
          '3': conv3  // * conversation Object
        }
    }
    this.handleUserSession = this.handleUserSession.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  render() {
	return (
      <MonkeyUI userSession={this.state.userSession}
        onUserSession={this.handleUserSession}
        conversations={this.state.conversations}
        conversation={this.conversations[this.state.conversationId]}  
        onMessage={this.handleMessage}
        onMessagesLoad={this.handleMessagesLoad}
        onMessageGetUsername={this.handleMessageGetUsername} />
	)
  }
	
  /* User */
	
  handleUserSession(user) { // user = {name: 'name'}
    user.id = '1';
    user.urlAvatar = 'http://cdn.criptext.com/MonkeyUI/images/userdefault.png';
	this.setState({userSession: user});
  }

  /* Message */
	
  handleMessage(message) { // message = {senderId: '', recipientId: '', status: 0}
	// TODO: save message to respective conversation
  }
	
  handleMessagesLoad(conversationId, firstMessageId) {
	// TODO: to load more messages and save in the respective conversation
  }
}
```

These props and methods defined are the basic to start to use it like a simple chat.

To understand how the data is structured, check here: http://docs.messaging.criptext.com/structure_data.html

To review the props and method that expose the component, check here: http://docs.messaging.criptext.com/props.html

