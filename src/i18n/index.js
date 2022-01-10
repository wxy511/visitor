import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
// import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'
// import elementEnLocale from 'element-plus/lib/locale/lang/en'


import enLocale from './en'
import zhLocale from './zh'
Vue.use(VueI18n)

var enLocale_py = null
var zhLocale_py = null

// if (process.env.NODE_ENV === 'production' && g_lng) {
//   let Base64 = require('js-base64').Base64;
//   g_lng = JSON.parse(Base64.decode(g_lng))
//   var enLocale_py = g_lng['en']
//   var zhLocale_py = g_lng['zh']
// }
const messages = {
  'en': {
    ...(enLocale_py||enLocale),
    ...elementEnLocale,
  },
  'cn': {
    ...(zhLocale_py||zhLocale),
    ...elementZhLocale,
  }
}

export function transLng(lng) {
  var lngmap = {
    'en':'en',
    'cn':'cn',
    'zh':'cn',
    'zh-cn':'cn',
  }
  return lngmap[lng.toLowerCase()]||lng
}
export function getLanguage() {
  var lng = Cookies.get('language')
  if (!lng) {
    const language = (navigator.language || navigator.browserLanguage).toLowerCase()
    const locales = Object.keys(messages)
    for (const locale of locales) {
      if (language.indexOf(locale) > -1) {
        lng = locale
        break
      }
    }    
  }
  if (!lng) {
    lng = 'en'
  }
  return transLng(lng)
}

const language = getLanguage()
const i18n = new VueI18n({
  // set locale
  // options: en | cn | es
  locale: language,
  // set locale messages
  messages,
  silentTranslationWarn: true
})

document.title = i18n.t('title')
export default i18n
