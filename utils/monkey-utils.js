import moment from 'moment'

export const isConversationGroup = (conversationId) => {
	let result = false;
    if(conversationId.indexOf("G:") >= 0){
        result = true;
    }
    return result;
}

export const defineTime = (time) => {
    let _d = new Date(+time);
    let nhour = _d.getHours(),
        nmin = _d.getMinutes(),
        ap;
    if (nhour == 0) {
        ap = " AM";nhour = 12;
    } else if (nhour < 12) {
        ap = " AM";
    } else if (nhour == 12) {
        ap = " PM";
    } else if (nhour > 12) {
		ap = " PM";nhour -= 12;
    }
    let result = ("0" + nhour).slice(-2) + ":" + ("0" + nmin).slice(-2) + ap + "";
    return result;
}

export const defineTimeByToday = (time) => {
	let result;
	const oneDay = 86400000;
	
	let diffTime = moment().diff(moment(time));
	if(diffTime <= oneDay) {
		result = moment(time).format('hh:mm A');
	}else if(diffTime < oneDay*2) {
		result = 'yesterday';
	}else if(diffTime < oneDay*7) {
		result = moment(time).format('dddd');
	}else{
		result = moment(time).format('DD/MM/YYYY');
	}
	
	return result;
}

export const defineTimeByDay = (time) => {
    let result;
    const oneDay = 86400000;
    
    let diffTime = moment().startOf('day').diff(moment(time).startOf('day'));
    if(diffTime <= 0) {
        result = moment(time).format('hh:mm A');
    }else if(diffTime <= oneDay) {
        result = 'yesterday';
    }else if(diffTime <= oneDay*6) {
        result = moment(time).format('dddd');
    }else{
        result = moment(time).format('DD/MM/YYYY');
    }
    
    return result;
}

export const defineDate = (time) => {
    return moment(time).format('DD/MM/YYYY');
}

export const getExtention = (filename) => {
    let arr = filename.split('.');
    let extension = arr[arr.length-1];
    extension = extension.toLowerCase();
    return extension;
}

export const getCombineColor = (rgb) => {
	let colors = rgb.match(/[0-9]+/g);
	let red = parseInt(colors[0], 10);
	let green = parseInt(colors[1], 10);
	let blue = parseInt(colors[2], 10);
	
	const uRed = red / 255
	const uGreen = green / 255
	const uBlue = blue / 255
	const max = Math.max(uRed, uGreen, uBlue)
	const min = Math.min(uRed, uGreen, uBlue)
	let hue
	let saturation
	let lightness = (max + min) / 2
	
	if (max == min) {
    	hue = 0
    	saturation = 0
	} else {
    	const delta = max - min
    	saturation = lightness > 0.5 ?
    	delta / (2 - max - min) :
    	delta / (max + min)
    
    	let tmpHue
    	switch (max) {
    		case uRed: tmpHue = (uGreen - uBlue) / delta + (uGreen < uBlue ? 6 : 0); break;
    		case uGreen: tmpHue = (uBlue - uRed) / delta + 2; break;
    		case uBlue: tmpHue = (uRed - uGreen) / delta + 4; break;
    	}
    	hue = (tmpHue / 6) * 360;
		saturation = saturation * 100;
		
		let lightBackground = !!Math.round(
            (
                red + // red
                green + // green
                blue // blue
            ) / 765 // 255 * 3, so that we avg, then normalise to 1
        );
        if (lightBackground) {
            lightness = lightness - 0.3;
        } else {
	        lightness = lightness + 0.3;
        }
		lightness = lightness * 100;
	}
	return 'hsl('+hue+','+saturation+'%,'+lightness+'%)';
}

export const getContrastColorObject = (rgb) => {
	let colors = rgb.match(/[0-9]+/g);
	let red = parseInt(colors[0], 10);
	let green = parseInt(colors[1], 10);
	let blue = parseInt(colors[2], 10);
	
	const uRed = red / 255
	const uGreen = green / 255
	const uBlue = blue / 255
	const max = Math.max(uRed, uGreen, uBlue)
	const min = Math.min(uRed, uGreen, uBlue)
	let hue
	let saturation
	let lightness = (max + min) / 2
	
	let result = {};
	if (max == min) {
    	hue = 0
    	saturation = 0
	} else {
    	const delta = max - min
    	saturation = lightness > 0.5 ?
    	delta / (2 - max - min) :
    	delta / (max + min)
    
    	let tmpHue
    	switch (max) {
    		case uRed: tmpHue = (uGreen - uBlue) / delta + (uGreen < uBlue ? 6 : 0); break;
    		case uGreen: tmpHue = (uBlue - uRed) / delta + 2; break;
    		case uBlue: tmpHue = (uRed - uGreen) / delta + 4; break;
    	}
    	hue = (tmpHue / 6);
		
		let lightBackground = !!Math.round(
            (
                red + // red
                green + // green
                blue // blue
            ) / 765 // 255 * 3, so that we avg, then normalise to 1
        );
        if (lightBackground) {
			result.backgroundColor = 'rgba(140, 140, 140, 0.1)';
			result.border = '1px rgba(140, 140, 140, 0.2) solid';
        } else {
			result.backgroundColor = 'rgba(250, 250, 250, 0.1)';
			result.border = '1px rgba(250, 250, 250, 0.2) solid';
        }
	}
	return result;
}