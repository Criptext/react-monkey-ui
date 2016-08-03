import React, { Component } from 'react'

const Panel = (props) => {

	var params = props.panelParams;

	if(props.panelParams){
		if(props.panelParams.show){
			return (<div className={params.className ? params.classNameShow : 'mky-panel-show mky-panel-height'} style={{backgroundColor : params.backgroundColor ? params.backgroundColor : "#636363", color : params.color ? params.color : "white", fontSize : params.fontSize ? params.fontSize : ""}}>
				<div className="mky-connection-content">
					{params.message}
					{params.component ? params.component : null}
				</div>
			</div>)
		}else{
			return <div className={params.className ? params.classNameHide : 'mky-panel-show mky-panel-height-hide'} style={{backgroundColor : params.backgroundColor ? params.backgroundColor : "#636363", color : params.color ? params.color : "white", fontSize : params.fontSize ? params.fontSize : ""}}>
				<div className="mky-connection-content">
					{params.message}
					{params.component ? params.component : null}
				</div>
			</div>
		}
	}else{
		return null;
	}
}

export default Panel;