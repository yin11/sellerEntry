import fetch from './fetch'

let USERINFO = {},
	RETURNUSERINFO = {} ,
	TOKEN, IMGFORMDATA = {};
const USER_AGENT = {
	IOS: {
		K: "ios-broswer",
		V: 0
	},
	ANDROID: {
		K: "android-broswer",
		V: 1
	},
	OTHERS: {
		K: "",
		V: 2
	}
}

/*获取行业类型*/
const getTypeList = () => fetch({
	url: '/sapi/shop/dealcate/type',
	method: 'get',
	params: {}
});

/*提交商家信息*/
const subFormation = (data) => fetch({
	url: '/sapi/add/shop',
	method: 'post',
	params: data
});

/*获取之前入驻填写资料信息*/
const getApplyDetail = (data) => fetch({
	url: '/sapi/shop/apply/detail',
	method: 'get',
	params: data
});


/*验证推荐人是否纯在*/
const testReferee = (data) =>fetch({
	url: '/sapi/add/inviter/username',
	method: 'get',
	params: data
});


/*提交图片信息*/
const subImg = (data) => fetch({
	url: '/sapi/upload/shop/images',
	method: 'post',
	data: data
});

/*通过百度获取默认地址城市名称*/
const getDefaultAddress = () => fetch({
	url: '/sapi/voip/get/shop/address/detail',
	method: 'get',
	params: {
		ak: "mbvBHlSGfpglilGIOmpuHnTMWbdoqnxP",
		coor: "bd09ll",
	}
});

/*通过详细地址获取地区经纬度*/
const getDefaultLocation = (address) => fetch({
	url: '/sapi/voip/get/shop/address',
	method: 'get',
	params: {
		ak: "mbvBHlSGfpglilGIOmpuHnTMWbdoqnxP",
		address: address,
	}
});

/*获取验证码*/
const postSendMess = (data) => fetch({
	url: '/api/voip/v2/smsSecurityCode',
	method: 'post',
	params: data
});

const alertMsg = (e) => {
	//alert(e)
}

/**
 * toast提示语
 */
const toast = (msg = '', time = 2000) => {
	var toast = document.createElement('div')
	toast.className = 'common-toast common-toast-show'
	toast.innerHTML = msg
	document.body.appendChild(toast)
	toast.style.display = 'block'
	toast.style.margin = `-${toast.offsetHeight / 2}px 0 0 -${toast.offsetWidth / 2}px`
	var timer = setTimeout(() => {
		toast.className = 'common-toast common-toast-hide'
		clearTimeout(timer)
		var timer2 = setTimeout(() => {
			document.body.removeChild(toast)
			clearTimeout(timer2)
		}, 200)
	}, time)
}

/**
 * 表单校验
 */
const rule = {
	empty: function(str, mess) { //不能为空
		if(str == '') {
			mess == '' ? '' : toast(mess);
			return false
		} else {
			return true
		}
	},
	phone: function(str) { //手机号校验
		var myReg = /^(1)[0-9]{10}$/;
		if(!myReg.test(str)) {
			toast('手机号码有误')
			return false
		} else {
			return true
		}
	},
	testLength: function(str, len) { //验证是否达到指定的最小长度
		if(str.length < len) {
			toast('输入的内容长度小于' + len)
			return false
		} else {
			return true
		}
	},
	testZFB: function(str, mess) { //支付宝账户验证
		var myReg = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/
		if(!myReg.test(str)) {
			mess == '' ? '' : toast(mess);
			//toast('请输入正确的支付宝账户')
			return false
		} else {
			return true
		}
	},
	name: function(str) { //中文姓名
		var myReg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
		if(!myReg.test(str)) {
			toast('请输入正确的姓名')
			return false
		} else {
			return true
		}
	}
}

/**
 * 存储localStorage
 */
const setStore = (name, content) => {
	if(!name) return;
	if(typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
const getStore = name => {
	if(!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 删除localStorage
 */
const removeStore = name => {
	if(!name) return;
	window.sessionStorage.removeItem(name);
}

/**
 * 获取地址栏参数
 */
const getQueryString = (name) => {
	try {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]);
		return null;
	} catch(e) {
		alertMsg(e);
	}
}

//更换状态,str   ，name替换的内容 ,seat 
const replaceNext = (str, name, seat) => {
	try {
		str = str.split('');
		str.splice(seat, 1, name);
		str = str.join('');
		return str;
	} catch(e) {
		alertMsg(e);
	}
}

//加密
const asciiSort = (json) => {
	try {
		let arr = [],
			_json = {},
			str = "",
			reg = /\,/;
		for(i in json) {
			if(json[i] !== "" && json[i] !== undefined && (typeof json[i] != "object")) {
				arr.push(i);
			}
		}
		arr.sort();
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i];
			str += name + "=" + json[name] + "&";
		}
		_json = str + "key=1hehe^_^haha!ysyhl9t@flzx3000c";
		return _json;
	} catch(e) {
		alertMsg(e);
	}
}

//将blob对象转为dataUrl
const readBlobAsDataURL = (blob, callback) => {
	try {
		var a = new FileReader();
		a.onload = function(e) {
			callback(e.target.result);
		};
		a.readAsDataURL(blob);
	} catch(e) {
		alertMsg(e);
	}
}

//dataURL转换为Blob对象
const dataURLtoBlob = (dataurl) => {
	try {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while(n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: mime
		});
	} catch(e) {
		alertMsg(e);
	}
}

//判断是否在app内打开
const getUserAgentType = () => {
	if(navigator.userAgent.indexOf(USER_AGENT.ANDROID.K) >= 0) {
		return 1;
	} else if(navigator.userAgent.indexOf(USER_AGENT.IOS.K) >= 0) {
		return 2;
	} else {
		return 3;
	}
}

/*
 *  与OC交互，将需要的参数内容以json字符串的格式传给app
 * */
const postData = (data) => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestInformation.postAndroidData(data);
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestInformation.postMessage(data);
		}
	} catch(e) {
		alertMsg(e);
	}
}

/*
 *  与OC交互，将需要的参数名传给客户端
 * */
const getToken = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestParameter.getAndroidParameter();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestParameter.postMessage({
				token: ""
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}

/*
 *  与OC交互，提交完图片信息，跳转app等待审核页面
 * */
const goUrl = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTgoUrl.goAndroidUrl();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTgoUrl.postMessage({
				token: ""
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}

//告诉app页面需要请求数据
const getData = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestGetInformation.getAndroidData();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestGetInformation.postMessage({
				data: ''
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}



//告诉app页面需要的定位信息（定位的省市区，详细地址，经纬度）字符串格式
const getLocation = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestGetLocation.getAndroidLocation();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestGetLocation.postMessage({
				data: ''
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}

//获取app传递的定位地址信息
const ZSTObtainLocation = (msg) => {
	try {
		if(msg!=''){
			setStore('LOCATION',msg); //将app传给页面的值存入缓存
		}
	} catch(e) {
		alertMsg(e);
	}
}




/*禁止分享*/
const noShare = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTNoShare.getAndroidNoShare();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTNoShare.postMessage({
				data: ''
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}

/*禁止刷新*/
const noRefresh = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTNoRefresh.getAndroidNoRefresh();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTNoRefresh.postMessage({
				data: ''
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}



//获取USERINFO等信息
const ZSTGetInformation = (msg) => {
	try {
		if(msg != '' && msg != '(null)' && msg != undefined) {
			//toast(msg + '====1')
			let _json = JSON.parse(msg);
			_json = _json.info || _json ;
			_json = JSON.stringify(_json);
			setStore('CACHEUSERINFO',_json);
		}
	}catch(e){
		alertMsg(e);
	}
}

//获取token等信息
const ZSTObtainParameter = (msg) => {
	try {
		TOKEN = msg;
	} catch(e) {
		alertMsg(e);
	}
}

const isNVL = (str, dest) => {
	return str || dest;
}

/*获取当前时间20180505*/
const getNowFormatDate = () => {
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	let currentdate = year + month + strDate;
	return currentdate;
}

export {
	postSendMess,
	toast,
	isNVL,
	getQueryString,
	rule,
	setStore,
	getStore,
	removeStore,
	getTypeList,
	USERINFO, //填写存入变量
	RETURNUSERINFO , //接口返回获取的信息
	alertMsg,
	replaceNext,
	getDefaultAddress,
	subFormation,
	asciiSort,
	IMGFORMDATA,
	readBlobAsDataURL,
	dataURLtoBlob,
	getDefaultLocation,
	getUserAgentType,
	postData,
	getData,
	getToken,
	getNowFormatDate,
	ZSTObtainParameter,
	ZSTGetInformation,
	goUrl,
	getApplyDetail ,
	ZSTObtainLocation ,
	getLocation ,
	testReferee ,
	noRefresh ,
	noShare
}