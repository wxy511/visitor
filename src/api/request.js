import axios from 'axios'
import { Message,MessageBox } from 'element-ui'
import store from '@/store'
import i18n from '@/i18n'
import {getStore,setStore} from '@/utils/mUtils.js'

function showErrorMsg(){
  var lasttime = parseInt(getStore('lasterrormsg') || 0)
  var nowtime = parseInt( (new Date().getTime())/1000 )
  if ((nowtime - lasttime) > 6) {
    Message({
      message: i18n.t('erGeneral'),
      type: 'error',
    })
    setStore('lasterrormsg',nowtime)
  }
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, 
})

var aes_key = null
service.interceptors.request.use(
  config => {
    if (!aes_key) {
      aes_key = process.env.NODE_ENV === 'development'?CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_KEY):CryptoJS.enc.Utf8.parse(g_ac.split("").reverse().join(""))
    }
    config.method = config.method.toUpperCase()
    if (config.method === 'POST' ) {
      if (process.env.NODE_ENV === 'development' && store.state.token && config.url == '/api/getUserbyToken/') {
        config.headers['217e95513e0ce5fc80a5a66bf18ae2b2'] = store.state.token    
      }

      if (store.state.py_config.debug ) {
        console.log(config.url)
        console.log(config.data)
      }

      if (!config.data) {
        config.data = JSON.stringify({})
      } else if (typeof (config.data) === 'object') {
        config.data = JSON.stringify(config.data)
      }

      config.data = code_aes(config.data)
      config.url = config.url + getSign(config.data)   
    }
    config.timeout = config.timeout || 5000   
    return config
  },
  error => {
    showErrorMsg()
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    var res = response.data
    if (response.config.method == 'post' || response.config.method == 'POST') {
      res = decode_aes(response.data)
      if (store.state.py_config.debug ) {
        console.log(res)
      }
    }
    if (res.show_err) {
      /**
       * show_err = {
       *  "desc":"", 
       *  "type":"error",
       *  "modal":{
       *    "title":"",
       *    "confirmbtn":"",
       *    "redirect":""
       *  }
       * }
       */
      if (res.show_err.modal) {
        var modal = res.show_err.modal
        MessageBox.alert(i18n.t(res.show_err.desc), i18n.t(modal.title||'title'), {
          confirmButtonText: i18n.t(modal.confirmbtn||'ok'),
          customClass: 'messag-box-class',
          callback: action => {
            if (modal.redirect) {
              window.location.href = modal.redirect
            }
          }
        });        
      }
      else{
        Message({
          message: i18n.t(res.show_err.desc),
          type: res.show_err.type,
        })
      }
    }
    return res
  },
  error => {
    showErrorMsg()
    return Promise.reject(error)
  }
)

const CryptoJS = require('crypto-js')
function getSign(data) {
  var timestamp = new Date().getTime()
  var bodydata = data + '.' + String(timestamp)
  bodydata = CryptoJS.enc.Utf8.parse(bodydata)
  var encrypted = CryptoJS.AES.encrypt(bodydata, aes_key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString()
  var sha256 = CryptoJS.SHA256(encrypted).toString()
  return '?timestamp=' + String(timestamp) + '&sign=' + sha256.toLowerCase()
}

function code_aes(data){
  return CryptoJS.AES.encrypt(data, aes_key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString()
}

function decode_aes(data){
  let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decodedata = CryptoJS.AES.decrypt(srcs, aes_key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  decodedata = decodedata.toString(CryptoJS.enc.Utf8)

  return JSON.parse(decodedata)
}

export default service
