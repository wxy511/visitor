import request from './request'
import apiURLMap from './api_url_map'
import {timeDataTrans,userDataTrans,apiTrans} from '@/utils/reqDataTrans'


function general(url,data,method="post",timaout=5000) {
	if (!data) {
		data = {}
	}
	var requestData = {
		method: method,
		timaout: timaout,
		url: url,
		data: data
	}
	return request(requestData)
}

export async function testGet()				{ return general('/sitetree',null,'GET')}
export async function getUser()				{ return general(apiURLMap.getUserbyToken,null)}
export async function s_getCountryCode()	{ return general(apiURLMap.getCountryCode_svg,{"OnlyCountry":1},'GET')}
export async function s_getNationList()		{ return general(apiURLMap.getCountryCode)}
export async function s_getConfig()			{ return general(apiURLMap.getConfig,{"Type": 11,"Key":"WebRegis"})}
export async function s_getBranch()			{ return general(apiURLMap.getBranch,{})}
export async function s_getPurpose()			{ return general(apiURLMap.getPurpose,{'eletype':21})}
export async function s_InitData(reqData)		{ return general(apiURLMap.py_initData,reqData,"post",10000)}

//E
export async function s_EQuery(reqData)			{ return general(apiURLMap.EQuery,reqData)}
export async function s_EUpdate(reqData)		{ return general(apiURLMap.EUpdate,timeDataTrans(reqData,'E'))}

//V
export async function s_GetVList(reqData)		{
	reqData = userDataTrans(reqData,'VQuery', 'EHRegistrantID','VVRegistrantID')
	return general(apiURLMap[apiTrans('v_Query')],reqData)
}
export async function s_VUpdate(reqData)		{
	reqData = userDataTrans(reqData,'VUpdate', 'EH_ID','VVRegistrantID')
	return general(apiURLMap.VUpdate,timeDataTrans(reqData,'V'))
}
export async function s_VDelete(reqData)		{
	reqData = userDataTrans(reqData,'VDelete','EH_ID','VVRegistrantID')
	return general(apiURLMap.VDelete,timeDataTrans(reqData,'V'))
}
export async function s_VGroupUpdate(reqData)	{
	return general(apiURLMap.VGroupUpdate,timeDataTrans(reqData,'V'))
}

//Record
export async function s_SubmitRegis(reqData)	{
	reqData = userDataTrans(reqData,'submitRegis','EHRegistrantID','VVRegistrantID')
	return general(apiURLMap.submitReg,timeDataTrans(reqData,'Regis'))
}
export async function s_SubmitRegisEx(reqData)	{
	reqData = userDataTrans(reqData,'submitRegis','EHRegistrantID','VVRegistrantID')
	return general(apiURLMap.submitRegEx,timeDataTrans(reqData,'Regis'))
}
export async function s_RQuery(reqData)			{ 
	reqData = userDataTrans(reqData,'RQuery','EHRegistrantID','VVRegistrantID')
	return general(apiURLMap.RQuery,timeDataTrans(reqData,'Query'))
}
export async function s_RPendingQuery(reqData)	{
	reqData = userDataTrans(reqData,'pending')
	return general(apiURLMap.PendingQuery,timeDataTrans(reqData,'Query'))
}

export async function s_RPendingPass(reqData)	{
	reqData['approved'] = 0
	return general(apiURLMap.PendingPass,timeDataTrans(reqData,'Operate'))
}
export async function s_RPendingReject(reqData){ 
	reqData['approved'] = -100
	return general(apiURLMap.PendingReject,timeDataTrans(reqData,'Operate'))
}
export async function s_RCancel(reqData)		{ return general(apiURLMap.RCancel,timeDataTrans(reqData,'Operate'))}
export async function s_regionsQuery(reqData)	{ return general(apiURLMap.regionsQuery,timeDataTrans(reqData,'Operate'),'post',1000*10)}

export async function s_check_e(reqData)	{ return general(apiURLMap.py_check_e,timeDataTrans(reqData,'E'))}