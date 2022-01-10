var g_timezone = new Date().getTimezoneOffset()
var g_timeUTCFormat = 'yyyy-MM-dd hh:mm:ss'
import store from '@/store'

function time_format(fmt) {
	var nowDate = new Date()
	var o = {   
	"M+" : nowDate.getMonth()+1,                 //月份   
	"d+" : nowDate.getDate(),                    //日   
	"h+" : nowDate.getHours(),                   //小时   
	"m+" : nowDate.getMinutes(),                 //分   
	"s+" : nowDate.getSeconds(),                 //秒   
	"q+" : Math.floor((nowDate.getMonth()+3)/3), //季度   
	"S"  : nowDate.getMilliseconds()             //毫秒   
	}; 
	if(/(y+)/.test(fmt))   
		fmt=fmt.replace(RegExp.$1, (nowDate.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
		if(new RegExp("("+ k +")").test(fmt))   
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
}

function getTimeZoneString(TimezoneOffset) {
	var strpm = '-'
	if (TimezoneOffset<0) {
		strpm = '+'
		TimezoneOffset = 0-TimezoneOffset
	}
	var hours = Math.floor(TimezoneOffset/60).toString()
	var minutes = (TimezoneOffset%60).toString()
	return ("(UTC"+strpm+ (hours.length<2?"0"+hours:hours)+":"+ (minutes.length<2?"0"+minutes:minutes)+")")
}

export function userDataTrans(data,type,keyE,keyV) {
	var userKey = null
	if (type ===  'pending') {
		userKey = 'EHID'
	}
	else if (store.state.userType === 'e' ) {
		userKey = keyE
	}
	else if (store.state.userType === 'v' ){
		userKey = keyV
	}
	if (userKey) {
		data[userKey] = store.state.userInfo.EHID || store.state.userInfo.VVID
	}
	if (type === 'submitRegis') {
		if (store.state.userType === 'v' && store.state.py_config.IgnoreBlacklist) {
			data['VIgnoreBlacklist'] = 1
		}
	}
	return data
}

export function apiTrans(type) {
	if (type === 'v_Query' ) {
		return store.state.userType === 'v'?'v_Query_v':'v_Query'
	}
}

export function timeDataTrans(data,type) {
	if (!data) {
		return data
	}
	var UTCTime = null
	var TimeZone = null

	if (type == 'V') {
		UTCTime = 'VTimeUTC'
		TimeZone = 'VTimeZone'
	}
	else if (type == 'E') {
		UTCTime = 'ETimeUTC'
		TimeZone = 'ETimeZone'
	}
	else if (type == 'Regis') {
		UTCTime = 'ApplyTimeUTC'
		TimeZone = 'ApplyTimeZone'		
	}
	else if (type == 'Operate') {
		UTCTime = 'operateTimeUTC'
		TimeZone = 'operateTimeZone'		
	}
	else if (type == 'Signin') {
		UTCTime = 'RtimeinUTC'
		TimeZone = 'RtimeinTimeZone'		
	}
	else if (type == 'Signout') {
		UTCTime = 'ROutTimeUTC'
		TimeZone = 'ROutTimeZone'		
	}
	else if (type == 'Query') {
		TimeZone = 'timezone'
	}
	if (UTCTime) {
		data[UTCTime] = time_format(g_timeUTCFormat)
	}
	if (TimeZone) {
		data[TimeZone] = g_timezone
	}

	return data
}

export function showTimeZone(time,TimezoneOffset,ignoreLocal=true) {
	if (!TimezoneOffset || (ignoreLocal && TimezoneOffset == g_timezone)) {return time}
	return time + " " +getTimeZoneString(TimezoneOffset)
}