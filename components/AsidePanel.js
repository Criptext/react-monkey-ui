import React, { Component } from 'react'

const AsidePanel = (props) => {

	var params = props.panelParams;

	if(props.panelParams){
		if(props.panelParams.show){
			return (<div className={params.className ? params.classNameShow : 'mky-connection-div mky-connection-height'} style={{backgroundColor : params.backgroundColor ? params.backgroundColor : "#636363", color : params.color ? params.color : "white", fontSize : params.fontSize ? params.fontSize : ""}}>
				<div className="mky-connection-content">
		      		{params.message}
					{params.component ? params.component : null}
			  </div>
			</div>)
		}else{
			return (<div className={params.className ? params.classNameShow : 'mky-connection-div mky-connection-hide'} style={{backgroundColor : params.backgroundColor ? params.backgroundColor : "#636363", color : params.color ? params.color : "white", fontSize : params.fontSize ? params.fontSize : ""}}>
				<div className="mky-connection-content">
		      		{params.message}
					{params.component ? params.component : null}
			  </div>
			</div>)
		}
	}else{
		return null;
	}
}

export default AsidePanel;