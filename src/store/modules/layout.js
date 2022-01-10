import Cookies from 'js-cookie'
import { getLanguage } from '@/i18n/index'

const state = {
  showSettings: 'ICD Visitor System',
  fixedHeader: false,
  sidebarLogo: false,
  sidebar:{
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
  },
  device: 'desktop',
  language: getLanguage(),
  nav: 'modernNav',
  hiddenProperty:false,
  isTopNav:true
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    console.log('SET_LANGUAGE',language)
    state.language = language
    Cookies.set('language', language)
  },
  CHECK_NAVIGATOR: (state) => {
    const browserName = navigator.userAgent.toLowerCase()
    const ieReg = /(msie I firefox | chrome | opera | version | rv:).*?([\d.]+)/
    if (browserName.match(ieReg)) {
      state.nav = 'ieNav'
    } else {
      state.nav = 'modernNav'
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  checkNavigator({ commit }, navObj) {
    commit('CHECK_NAVIGATOR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}