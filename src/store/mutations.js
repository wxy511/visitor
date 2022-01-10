
import Cookies from "js-cookie";
import { constantRoutes } from '@/router/index'
import {getStore,setStore} from '@/utils/mUtils.js'

const STORE_LAST_SITE = 'site_last'
export default {
    SET_RIGHTS: (state, rights) => {
        state.rights = rights
    },
    SET_EMBEDDEDAPP: (state, embeddedAPP) => {
        state.embeddedAPP = embeddedAPP
    },
    SET_NATION: (state, nationList) => {
        state.nationList = nationList
        var nationMap = {}
        var nationMap_code_obj = {}
        nationList.forEach(item => {
            nationMap[item.en] = item
            nationMap_code_obj[item.code] = item
        });
        state.nationMap_en_code = nationMap
        state.nationMap_code_obj = nationMap_code_obj
    },
    SET_PY_CONFIG: (state, config) => {
        if (!config) {
            return
        }
        if (config.suffix !== undefined)        { state.py_config.suffix = config.suffix }
        if (config.changeLng !== undefined)     { state.py_config.changeLng = config.changeLng }
        if (config.debug !== undefined)         { state.py_config.debug = !!config.debug }
        if (config.approved !== undefined)      { state.py_config.approved = config.approved }
        if (config.regis_group !== undefined)   { state.py_config.regis_group = !!config.regis_group }
        if (config.e_otherHost !== undefined)   { state.py_config.e_otherHost = !!config.e_otherHost }
        if (config.IgnoreBlacklist !== undefined) { state.py_config.IgnoreBlacklist = config.IgnoreBlacklist }
        if (config.riskRegions !== undefined)   { state.py_config.riskRegions = config.riskRegions }
        if (config.testReport !== undefined)    { state.py_config.testReport = config.testReport }
        if (config.custom !== undefined)        { state.py_config.custom = config.custom }

        if (config.noticeForUse !== undefined) { 
            state.py_config.noticeForUse = config.noticeForUse
            if (!state.rights) {
                state.rights = {}
            }
            state.rights['noticeForUse'] = !!config.noticeForUse
        }

        if (config.mainclr !== undefined)     { state.mainclr = config.mainclr }
        if (config.countrycode !== undefined) { 
            if (!getStore('lastCountryCode')) {
                setStore('lastCountryCode',countrycode)
            }
        }

        if (state.userType === 'e') {
            if (config.E_hostType !== undefined)    { 
                state.py_config.E_hostType = config.E_hostType
                state.py_config.hostType = config.E_hostType
            }
        }else{
            if (config.V_hostType !== undefined)    { 
                state.py_config.V_hostType = config.V_hostType
                state.py_config.hostType = config.V_hostType
            }            
        }
    },
    SYNC_VLIST_UPDATE: (state, {data,type}) => {
        let findIndex = -1
        state.sync_xs_selVisitorList.forEach((item,index) => {
            if (data.VVID === item.VVID) {
                findIndex = index
            }
        });
        if (findIndex!=-1) {
            if (type === 'delete') {
                state.sync_xs_selVisitorList = state.sync_xs_selVisitorList.splice(index, 1);
            }
            else if (type === 'update') {
                state.sync_xs_selVisitorList[findIndex] = data
            }        
        }
    },
    CHANGE_SETTING: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
          state[key] = value
        }
    },
    USER_INFO:(state, userInfo) => {
        state.userInfo = userInfo;
        state.userType = userInfo.EHID?'e':'v'
        state.noticeForUse_url = window.location.origin + '/notice/' + state.userType+'/?type=read'

        if (userInfo.uncomplete) {
            state.user_complete = false
        }
        // if (state.userType  === 'e') {
        //     if (userInfo['Ereserved'] === 'uncomplete' && userInfo['Ename'] ===  (userInfo['Eemail']||'').split('@')[0] ) {
        //         state.user_complete = false
        //     }
        // }
        // else{
        //     if (userInfo['Vremark'] === 'uncomplete' && userInfo['Vname'] === userInfo['Vphone'] ) {
        //         state.user_complete = false
        //     }            
        // }
        //user_complete
    },
    SET_APP: (state, {app}) => {
        state.app = app;
    },
    SET_LAST_BRANCH: (state, lastBranch) => {
        setStore('lastBranch',lastBranch)
        state.lastBranch = lastBranch
        state.hasInit = true
    },
    SET_LAST_CCODE: (state, countrycode) => {
        setStore('lastCountryCode',countrycode)
        state.lastCountryCode = countrycode
    },
    SET_PAGESIZE: (state, size) => {
        setStore('lastPageSize',size)
        state.lastPageSize = size
    },
    SET_TERMINAL:(state, TERMINAL) => {
        state.TERMINAL = TERMINAL
        if (TERMINAL!='pc') {
            state.elementSize = 'small'
        }
    },
    CHANGE_USER_NAME:(state, {name}) => {
        let userInfo = state.userInfo;
        Object.keys(userInfo).forEach((info, index) => {
            if (info == 'name') {
                userInfo['name'] = name;
            }
        });
        state.userInfo = {
            ...userInfo
        };
    },
    CASE_SITE_INFO:(state, {customerID, customerSite,customerSite_ele}) => {
        state.customerSite = customerSite;
        state.customerSite_ele = customerSite_ele;
        let locationSiteAll = getStore(STORE_LAST_SITE,'json')||{}
        let locationSite = locationSiteAll[String(customerID)] || []
        let newLocationSite = []
        let lastSite_ele = []
        locationSite.forEach(element => {
            if(element.siteid){
                customerSite.forEach(site => {
                    if(site.siteid===element.siteid) {
                        newLocationSite.push(element)
                        lastSite_ele.push(site)
                    }
                });                  
            }
        });
        state.lastSite_ele = lastSite_ele
        locationSiteAll[String(customerID)] = newLocationSite
        setStore(STORE_LAST_SITE,locationSiteAll) 
    },
    SET_LAST_SITE:(state,{customerID,site}) =>  {
        if (!site || !customerID) {
            return
        }
        let set_site = {'siteid':site.siteid}
        let locationSiteAll = getStore(STORE_LAST_SITE,'json')||{}
        let locationSite = locationSiteAll[String(customerID)] || []
        let locationSite_new = []
        locationSite.forEach(element => {
            if (element.siteid !== site.siteid) {
                locationSite_new.push(element)
            }
        });

        let lastSite_ele_new = []
        state.lastSite_ele.forEach(element => {
            if (element.siteid !== site.siteid) {
                lastSite_ele_new.push(element)
            }
        });        
        locationSite_new.unshift(set_site)
        lastSite_ele_new.unshift(site)
        if(locationSite_new.length>5)
        {
            locationSite_new= locationSite_new.slice(0,5)
            lastSite_ele_new= lastSite_ele_new.slice(0,5)
        }
        locationSiteAll[String(customerID)] = locationSite_new
        state.lastSite_ele = lastSite_ele_new
        setStore(STORE_LAST_SITE,locationSiteAll)
    },
    ERROR_CODE:(state, {errorCode })=>  {
        state.errorCode = errorCode;
    },  
    LOGIN_OUT:(state) => {
        state.userInfo = {};
        state.customerInfo = {};
        window.location.href = '/logout/?type='+state.userType
    },
    SET_LANGUAGE: (state, language) => {
        state.layout.language = language;
        Cookies.set("language", language);
        setStore("language", language);
    },
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    SERVER_CONFIG:(state, config) => {
        state.config = config
    },
    SERVER_BRANCH:(state, branch) => {
        state.branchList = branch
    },
    SERVER_PURPOSE:(state, purpose) => {
        state.purposeList = purpose || []
        state.purposeList.forEach(item => {
            item['label'] = item['en']
        });
    },
    SET_CCODE:(state, countrycode) => {
        state.countrycodeList = countrycode
    },
}