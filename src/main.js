async function getConfig() {
  return new Promise((resolve, reject) => {
    const location_config = import (`@/custom/${process.env.VUE_APP_BUILD_VERSION}/js/config.js`)
    location_config.then((res)=>{
      if (process.env.NODE_ENV === 'development') {
        py_config = res.default.test_py_config
      }
      else{
        py_config = JSON.parse(py_config)
      }
      resolve(res.default.location_config)
    })
  })
}

import Vue from 'vue'
import App from './App.vue'
import Cookies from "js-cookie";
import router from './router'
import store from './store'
import i18n from '@/i18n'

import '@/styles/transition.scss'
import ElementUI from 'element-ui';

import (`@/custom/${process.env.VUE_APP_BUILD_VERSION}/styles/element/index.css`)
import '@/icons'
import '@/styles/index.scss'
import '@/styles/icd-classes-general.scss'
Vue.config.productionTip = false

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import Vconsole from 'vconsole'

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(i18n, {
  i18n: (key, value) => i18n.t(key, value)
});
router.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}


getConfig().then((config)=>{
  store.state.location_cfg = config
  if (py_config.debug ) {
    const vConsole = new Vconsole()
    Vue.use(vConsole) 
  }
  var mainvue = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')

  window.onload = function(){
    var counter = 0;//&& window.history.pushState
    if (window.history ) {
      window.onpopstate = function () {  
        if (mainvue) {
          router.isBack = true
        }
      };
    }
    window.history.pushState('forward', null, '#'); 
    window.history.forward(1);
  }
})