import {
  getUser,
  getCountryCode,
  s_getConfig,
  s_getBranch,
  s_getPurpose,
  s_InitData,
  s_EUpdate,
  s_VUpdate,
  s_getNationList
} from '@/api/api.js'
import Cookies from 'js-cookie'
import {
  checkMobile
} from '@/utils/mUtils'
import {
  getStore
} from '@/utils/mUtils.js'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
export default {
  changeSetting({
    commit
  }, data) {
    commit('CHANGE_SETTING', data)
  },
  setLastCountryCode({
    commit
  }, CountryCode) {
    commit('SET_LAST_CCODE', CountryCode)
  },
  async getUserInfo({
    commit,
    state
  }, token) {
    return new Promise(async (resolve, reject) => {
      var response = await getUser()
      if (response && response.error === 0) {
        commit('USER_INFO', response)
      } else if (response.error === 3702) {
        window.location.href = response.page || '/logout/'
      } else {
        console.log('getUser', response)
        // window.location.href = '/logout/'
        // return
      }

      var lastCountryCode = getStore('lastCountryCode') || response.Ecountrycode || response.Vcountrycode || '86'
      commit('SET_LAST_CCODE', lastCountryCode)

      if (typeof py_config === undefined) {
        console.log('py_config', py_config)
      } else {
        commit("SET_PY_CONFIG", py_config);
        let rights = state.rights || {}
        rights['approval'] = (state.userType === 'e') && (state.py_config.approved === 100)

        var bE = (state.userType === 'e')
        rights['riskLevel'] = bE
        rights['Vinblack'] = bE
        commit("SET_RIGHTS", rights);
      }
      resolve(response)
    })
  },
  async getCountryCode({
    commit,
  }) {
    let response = await getCountryCode();
    if (response && response.error == 0) {
      let countryCodeList = response.nation
      commit('COUNRTY_CODE_LIST', {
        countryCodeList
      });
    }
  },
  setLanguage({
    commit
  }, language) {
    commit("SET_LANGUAGE", language);
  },
  setLastPageSize({
    commit
  }, size) {
    commit("SET_PAGESIZE", size);
  },
  setLastBranch({
    commit
  }, branch) {
    commit("SET_LAST_BRANCH", branch);
  },
  initRights({
    commit,
    state
  }) {
    let rights = {
      'approval': (state.userType === 'e') && (state.py_config.approved === 100)
    }
    commit("SET_RIGHTS", rights);
  },
  async InitData({
    commit
  }, ) {
    const TERMINAL = Cookies.get('TERMINAL') || checkMobile() || 'pc'
    commit('SET_TERMINAL', TERMINAL);
    const embeddedAPP = parseInt(Cookies.get('embeddedAPP')) || 0
    commit('SET_EMBEDDEDAPP', embeddedAPP);
    const lastPageSize = parseInt(getStore('lastPageSize')) || 20
    commit("SET_PAGESIZE", lastPageSize);
    const lastBranch = getStore('lastBranch') || ''
    commit("SET_LAST_BRANCH", lastBranch);

    const reqData = {
      'countrycode': 1,
      'purpose': 1,
      'branch': 1,
    }
    let response = await s_InitData(reqData)
    if (response && response.error == 0) {
      if (response.countrycode) {
        let res = JSON.parse(response.countrycode)
        commit('SET_CCODE', res.nation || []);
      }
      if (response.branch) {
        let res = JSON.parse(response.branch)
        commit('SERVER_BRANCH', res.branch || []);
      }
      if (response.purpose) {
        let res = JSON.parse(response.purpose)
        commit('SERVER_PURPOSE', res.visitortype || []);
      }
    }
  },
  async getConfig({
    commit,
    state
  }) {
    return new Promise(async (resolve, reject) => {
      let response = await s_getConfig();
      if (response && response.error == 0 && response.Storges) {
        let config = response.Storges[0]["Value"]
        config = JSON.parse(config)
        if (config.Vphone) {
          config['Vcountrycode'] = config.Vphone
        }
        if (config.Ephone) {
          config['Ecountrycode'] = config.Ephone
        }
        if (config.Vid) {
          config['Vidtype'] = config.Vid
        }
        commit('SERVER_CONFIG', config);
        if (config.Vnation && config.Vnation.E) {
          response = await s_getNationList();
          if (response && response.error == 0 && response.nation) {
            commit('SET_NATION', response.nation || []);
          }
          //nationList
        }
      }
      resolve(response)
    })
  },
  async getBranch({
    commit
  }, ) {
    let response = await s_getBranch();
    if (response && response.error == 0) {
      commit('SERVER_BRANCH', response.branch || []);
    }
  },
  async getPurpose({
    commit
  }, ) {
    let response = await s_getPurpose();
    if (response && response.error == 0) {
      commit('SERVER_PURPOSE', response.visitortype || []);
    }
  },
  sync_updateSelVList({
    commit
  }, data, type) {
    commit('SYNC_VLIST_UPDATE', {
      data,
      type
    });
  },
  async changeUserinfo({
    commit,
    state
  }, data, type) {
    data['modifyprofile'] = 1
    if (state.userType == 'e') {
      data['EH_ID'] = state.userInfo.EHID
      let response = await s_EUpdate(data);
      if (response && response.error == 0) {
        for (var key in data) {
          state.userInfo[key] = data[key]
        }
      }
    } else if (state.userType == 'v') {
      data['VV_ID'] = state.userInfo.VVID
      let response = await s_VUpdate(data);
      if (response && response.error == 0) {
        for (var key in data) {
          state.userInfo[key] = data[key]
        }
      }
    }
  }
}
