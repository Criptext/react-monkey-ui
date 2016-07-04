# react-monkey-ui

Use monkeyUI using REACT, and you can pass props and methods to your React Class:

#### view (prop)

To define the type chat view.

```
let view = {
screen: {
type: (String),
data: {
width: (String),
height: (String)
},
}
}
...
<MonkeyUI view={view}>
```

#### userSession (prop)
To define the user session.
```
let userSession = {
id: (String),
name: (String),
urlAvatar: (String)
}
...
<MonkeyUI userSession={userSession}>
```

#### conversation (prop)
To define the conversation to start the chat
```
let conversation = {
id: (Strind),
lastMessage: (String),
messages: (Obj),
name: (String),
unreadMessageCounter: (int),
urlAvatar: (String)
}
...
<MonkeyUI conversation={conversation}>
```

#### conversations (prop)
To define the list conversation of the chat
```
let conversations = {
[conversationA.id]: conversationA,
[conversationB.id]: conversationB,
...
}
...
<MonkeyUI conversations={conversations}>
```

#### userSessionToSet (method)
To receive a user's data from login
```
<MonkeyUI userSessionToSet={handleUserSessionToSet}>
...
handleUserSessionToSet(user){
}

```

#### messageToSet (method)
To receive a message generated from input.
```
<MonkeyUI messageToSet={handleMessageToSet}>
...
handleMessageToSet(message){
}
```

#### conversationOpened (method)
To recieve a conversation opened.
```
<MonkeyUI conversationOpened={handleConversationOpened}>
...
handleConversationOpened(conversation){
}
```

#### loadMessages (method)
To receive a conversation's data that need get more messages.
```
<MonkeyUI loadMessages={handleLoadMessages}>
...
handleLoadMessages(conversationId, firstMessageId){
}
```

#### form (React.Component)
To define a component form that you will add in the app.
```
import MyForm from './path/MyForm.js'
...
<MonkeyUI form={MyForm}>
```

#### dataDownloadRequest (method)
To receive the message data that need download source.
```
<MonkeyUI dataDownloadRequest={handleDownloadData}>
...
handleDownloadData(mokMessage){
}
```

#### getUser (method)
To receive a user's id that the UI needs to know the name and the color; it is used from bubble. 
```
<MonkeyUI getUser={handleGetUser}>
...
handleGetUser(userId){
}
```

#### styles (prop)
To define the styles of the chat view
```
let styles = {
colorIn: (String),
colorOut: (String),
tabColor: (String),
tabTextColor: (String),
tabText: (String),
logo: (String),
}
...
<MonkeyUI styles={styles}>
```


## * Options
The following options are supported in view:
type: 'classic' | 'fullscreen'
If use 'classic' add the data:
data: {width: '380px',height: '500px'}