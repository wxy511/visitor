import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import layout from './modules/layout'
import permission from './modules/permission'
import riskRegions from './modules/riskRegions'

Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        layout,
        permission,
        riskRegions
    },
    state,
    mutations,
    actions,
    getters
})