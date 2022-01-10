import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import {checkMobile} from '@/utils/mUtils'
import Cookies from 'js-cookie'
import i18n from '@/i18n'
import store from '@/store'

const TERMINAL = Cookies.get('TERMINAL') || checkMobile() || 'pc'
const Loading = () => import('@/views/loading/Loading.vue'); 
const Layout = () => import('@/views/layout/' + TERMINAL + '/index.vue'); //框架
const Home = () => import('@/views/home/'+ TERMINAL + '/Home.vue'); //首页
const test1 = () => import('@/views/home/'+ TERMINAL + '/Home.vue');

const complete = () => import('@/views/complete/'+ TERMINAL + '/index.vue');
const AddRegistration = () => import('@/views/regis/'+ TERMINAL + '/index.vue');
const app_SelectVisitor = () => import('@/views/regis/webapp/Children/SelectVisitor.vue');

const records = () => import('@/views/records/'+ TERMINAL + '/index.vue');
const recordDetails_APP = () => import('@/views/records/webapp/Children/RecordDetails.vue');
const approval = () => import('@/views/approval/'+ TERMINAL + '/index.vue');

//records

const Error404 = () => import('@/views/error/'+ TERMINAL + '/404.vue'); //404错误页
const Error = () => import('@/views/error/'+ TERMINAL + '/Error.vue'); //错误页

const Userinfo = () => import('@/views/userinfo/'+TERMINAL + '/Userinfo.vue'); //个人信息
const Userinfo_E = () => import('@/views/userinfo/webapp/Children/Userinfo_E.vue'); //个人信息

//Web
const SwitchLanguage = () => import('@/views/userinfo/'+TERMINAL + '/Children/SwitchLanguage.vue'); //webapp
const ChangeUserInfo = () => import('@/views/userinfo/'+TERMINAL + '/Children/ChangeUserInfo.vue'); //webapp

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/404',
    component: Error404,
    hidden: true
  },
  {
    path: '/error',
    name:'error',
    component: Error,
    hidden: true
  },
  {
    path: '/loading',
    name: 'loading',
    component: Loading,
    hidden: true,
    meta: {keepAlive: false,app:false}
  },
  {
    path: '/',
    component: Layout,
    redirect:"/registration/add",
    // children: [{
    //   path: 'home',
    //   name: 'home',
    //   component: Home,
    //   meta: { keepAlive: true,app:true,title: 'nav.home', titleWeb: 'navWebApp.home',icon: 'home',lineicon: 'nav-home',tag: 'true' }
    // }]
  },
  {
    path: '/complete',
    name: 'complete',
    component: complete,
    hidden: true,
    meta: {keepAlive: false,app:false}
  },
]
//noticeForUse
export const asyncRoutes = [
  {
    path: '/notice',
    component: Layout,
    redirect:"/read",
    children: [{
      name: 'noticeForUse',
      link: true,
      path: store.state.noticeForUse_url,
      meta: { keepAlive: true ,doctitle:'noticeForUse',app:false,title: 'nav.noticeForUse',icon: 'noticeForUse',lineicon: 'nav-home',tag: 'true' }
    }]
  },
  {
    path: '/registration',
    component: Layout,
    redirect:"/add",
    children: [{
      path: 'add',
      name: 'add',
      component: AddRegistration,
      meta: {keepAlive: true,app:true, doctitle:'regis',title: 'nav.regis', titleWeb: 'navWebApp.regis',icon: 'regis',lineicon: 'nav-add',tag: 'true' },
    },
    {
      path: 'visitor',
      name: 'selectVisitor',
      hidden: true,
      meta: {keepAlive: true,doctitle:'visitorList',},
      component: app_SelectVisitor
    }]
  },
  {
    path: '/record',
    component: Layout,
    redirect:"/list",
    children: [{
      path: 'list',
      name: 'records',
      component: records,
      meta: {keepAlive: false,app:false,doctitle:'records',title: 'nav.record', titleWeb: 'navWebApp.record',icon: 'record',lineicon: 'nav-home',tag: 'true'}
    },{
      path: 'details',
      name: 'recordDetails',
      hidden: true,
      component: recordDetails_APP,
      meta: {keepAlive: false,doctitle:'recordDetails',}
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect:"/index",
    children: [{
      path: 'index',
      name: 'user',
      component: Userinfo,
      hidden: true,
      meta: { app: true,keepAlive: true,doctitle:'me',title: 'nav.userInfo',titleWeb: 'navWebApp.userInfo',icon: 'user', lineicon: 'user', tag: 'true'},
      children: []
    },{
      path: 'language',
      name: 'switchLanguage',
      hidden: true,
      meta: {keepAlive: false,doctitle:'switchLanguage'},
      component: SwitchLanguage
    },{
      path: 'info',
      name: 'Userinfo_E',
      hidden: true,
      meta: {keepAlive: false,doctitle:'userInfo'},
      component: Userinfo_E
    },
    {
      path: 'change',
      name: 'changeUserInfo',
      hidden: true,
      meta: {keepAlive: false,doctitle:'userInfo'},
      component: ChangeUserInfo
    }]
  },
  {
    path: '/approval',
    component: Layout,
    redirect:"/list",
    children: [{
      path: 'list',
      name: 'approval',
      component: approval,
      meta: { keepAlive: false ,doctitle:'approval',app:false,title: 'nav.approval', titleWeb: 'navWebApp.approval',icon: 'approval',lineicon: 'nav-home',tag: 'true' }
    }]
  },
  { path: '*', redirect: '/home', hidden: true }
]

const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return {
            x: 0,
            y: 0
        }
    }
  },
  routes: constantRoutes
})


export function addRoutes(routers){
  router.addRoutes(routers||[])
}

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

function getPageTitle(to)
{
  var title = to.meta.doctitle
  if (!title) {
    return i18n.t('title')
  }

  let thetitle = i18n.t('doctitle.'+title)
  if ( store.state.TERMINAL === 'pc' ) {
    let maintitle = i18n.t('title')
    thetitle = `${thetitle} - ${maintitle}`
  }
  else if (to.query && to.query.type ){
    if ( to.name == 'records') {
      thetitle = i18n.t('Records.title.'+to.query.type)
    }
    else if (to.name == 'changeUserInfo' ) {
      thetitle = i18n.t('user.changeUserInfo.'+to.query.type)
    }
  }
  return thetitle
}

const whiteList = ['/login','/loading'] // no redirect whitelist
const webappTitleList = ['records','recordDetails','selectVisitor','switchLanguage','Userinfo_E','changeUserInfo'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  window.document.title = getPageTitle(to)

  if (store.state.userType == null) {
    await store.dispatch('getUserInfo')
    var rights = store.state.rights
    var noticeForUse_url = store.state.noticeForUse_url
    await store.dispatch('permission/generateRoutes', {rights,noticeForUse_url})
  }
  // if (whiteList.indexOf(to.path) !== -1) {
  //   next()
  //   NProgress.done()
  //   return
  // }

  if (!store.state.hasInit && to.path!='/loading') {
    next(`/loading?redirect=${to.path}`)
  }
  else if (!store.state.user_complete && to.name!='complete' && to.path!='/loading') {
    next(`/complete?redirect=${to.path}`)    
  }
  else{
    next()
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
