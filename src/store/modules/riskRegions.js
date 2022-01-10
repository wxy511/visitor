import { 
    s_regionsQuery
} from '@/api/api.js'

import {getStore,setStore} from '@/utils/mUtils.js'

const state = {
    riskRegionsList:[],
    riskRegions_ele:[],
    locationSiteAll :[],
    sync_selRegions:null,
    lastRegions_ele:[],
    riskRegions_map:{}
}

const STORE_LAST_SEL = 'riskRegions_last'
const mutations = {
    SET_RISK_REGIONS:(state, {riskRegionsList,riskRegions_ele})=> {
        state.riskRegionsList = riskRegionsList;
        state.riskRegions_ele = riskRegions_ele;
        //console.log(riskRegionsList)
        riskRegionsList.forEach(item => {
            
            state.riskRegions_map[item.countyCode] = item
        });
        let locationSelAll = getStore(STORE_LAST_SEL,'json')||{}
        let locationSel = locationSelAll['sel'] || []
        state.lastRegions_ele = locationSel

        // let locationSel_new = []
        // let lastRegions_ele = []
        // locationSel.forEach(item => {
        //     if(item.code){
        //         riskRegionsList.forEach(city => {
        //             state.riskRegions_map[city.code] = city
        //             if(city.code && item.code === city.code) {
        //                 locationSel_new.push(item)
        //                 lastRegions_ele.push(item)
        //             }
        //         });                  
        //     }
        // });
        // state.lastRegions_ele = lastRegions_ele
        // locationSelAll['sel'] = locationSel_new
        // setStore(STORE_LAST_SEL,locationSelAll) 
    },
    SET_LAST_SEL:(state,sel) =>  {
        if (!sel || !sel.code) {
            return
        }

        let locationSelAll = getStore(STORE_LAST_SEL,'json')||{}
        let locationSel = locationSelAll['sel'] || []
        let locationSel_new = []

        locationSel.forEach(item => {
            if (item.code !== sel.code) {
                locationSel_new.push(item)
            }
        });

        let lastRegions_ele_new = []
        state.lastRegions_ele.forEach(element => {
            if (element.code !== sel.code) {
                lastRegions_ele_new.push(element)
            }
        });        
        locationSel_new.unshift(sel)
        lastRegions_ele_new.unshift(sel)
        if(locationSel_new.length>5)
        {
            locationSel_new = locationSel_new.slice(0,5)
            lastRegions_ele_new = lastRegions_ele_new.slice(0,5)
        }
        locationSelAll['sel'] = locationSel_new
        state.lastRegions_ele = lastRegions_ele_new
        setStore(STORE_LAST_SEL,locationSelAll)
    },
}

const actions = {
    setLastSel({ commit }, sel) {
        commit('SET_LAST_SEL',sel)
    },
    async initRegionsList({ commit }, ) {
        var riskRegionsList = []
        var riskRegions_ele = []
        var response =  await s_regionsQuery({'onlyJson':1})
        if (response && response.error === 0 && response.locationsJson) {
            var jsonData = JSON.parse(response.locationsJson)
            riskRegions_ele = jsonData.regions || []
        }
        response =  await s_regionsQuery({'countyLevel':15})
        riskRegionsList = response.Locations || []
        commit('SET_RISK_REGIONS',{riskRegionsList,riskRegions_ele})
    },
    updateRiskLevel({ commit }, ) {
        
    },
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}