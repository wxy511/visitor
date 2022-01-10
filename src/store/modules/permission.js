import { asyncRoutes, constantRoutes , addRoutes } from '@/router'


function checkKeepAlive(item){
  if (item.meta && item.meta.keepAlive) {
    return true
  }
  return false
}

function webRouterObj(path,item){
  let _nav = {}
  _nav.path = path +'/'+item['path']
  _nav.name = item.name
  _nav.title = item.meta.titleWeb || item.meta.title
  _nav.normal = item.meta.lineicon
  _nav.active = item.meta.lineicon+'-sel'  
  return _nav
}

export function filterAsyncRoutes(routers, rightObj,noticeForUse_url) {
  let webRoutes = []
  let pcRoutes = []
  var routerKeepAlive = []
  routers.forEach(route => {
    const tmp = { ...route }
    let path = tmp.path === '/'?'':tmp.path
    if (!tmp.name || rightObj[tmp.name] === undefined || !!rightObj[tmp.name] === true) {
      if ( tmp.name  && tmp.name === 'noticeForUse' && noticeForUse_url) {
        tmp.path = noticeForUse_url
      }
      if (tmp.children) {
        let res = filterAsyncRoutes(tmp.children, rightObj,noticeForUse_url)
        tmp.children = res.pcRoutes
        routerKeepAlive = routerKeepAlive.concat(res.routerKeepAlive)
        webRoutes = webRoutes.concat(res.webRoutes)
      }
      if (tmp.meta && tmp.name) {
        if (tmp.meta.app ) {
          webRoutes.push(webRouterObj(path,tmp))
        }
        if (tmp.meta.keepAlive) {
          routerKeepAlive.push(tmp.name)
        }         
      }
      pcRoutes.push(tmp)
    }
  })
  return {pcRoutes,webRoutes,routerKeepAlive}
}

const state = {
  routes: [],
  addRoutes: [],
  webRoutes:[],
  keepAliveRouterList:[]
}

const mutations = {
  SET_PC_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_WEB_ROUTES: (state, routes) => {
    state.webRoutes = routes
  },
  SET_RIGHT_OBJ: (state, rightObj) => {
    state.rightObj = rightObj
  },
  SET_ROUTES_KEEPALIVE: (state, routerKeepAlive) => {
    state.routerKeepAlive = routerKeepAlive
  },
}

const actions = {
  generateRoutes({ commit }, {rights,noticeForUse_url}) {
    return new Promise(resolve => {
      const rightObj = rights
      commit('SET_RIGHT_OBJ', rightObj)
      var {pcRoutes,webRoutes,routerKeepAlive} = filterAsyncRoutes(asyncRoutes, rights,noticeForUse_url)
      commit('SET_ROUTES_KEEPALIVE', routerKeepAlive)
      commit('SET_PC_ROUTES', pcRoutes)

      var constRouter = filterAsyncRoutes(constantRoutes, rights,noticeForUse_url)
      if (constRouter.webRoutes) {
        webRoutes = constRouter.webRoutes.concat(webRoutes)
      }
      commit('SET_WEB_ROUTES', webRoutes)
      addRoutes(pcRoutes)
      resolve(pcRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
