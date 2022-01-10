import { 
    s_RQuery
} from '@/api/api.js'

const state = {
    recordList:[]
}

const mutations = {
    GET_RECORD: (state, recordList) => {
        state.recordList = recordList
    },

}

const actions = {
    getRecords({ commit }, reqData) {
        return new Promise((resolve, reject) => {
            s_RQuery(reqData).then(response => {
            if (response.error === 0) {
                commit('GET_RECORD', response.reg||[])
                resolve()
            } else {
                reject(response)
            }
            }).catch(error => {
            reject(error)
            })
        })
    },
}
 
const getters = {
    getRecordList:(state) => (type) => {
        if(!type || type == 'all') return state.recordList
        var recordList = []
        state.recordList.forEach(item => {
            
        });
    },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}