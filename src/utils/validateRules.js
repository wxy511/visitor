import i18n from "@/i18n/index";
import store from '@/store'
import {checkCard} from './check_idcard.js'
const rules = { 
  Email(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return valid(email, regex, 'validate.email')
  },
  
  IdCard(code){
    return {result:code?checkCard(code):true,errMsg:'validate.IDCard'}
  },
}

function valid(val, regex, msg){
  return {result: regex instanceof RegExp? regex.test(val) : !!val, errMsg: msg}
}

export function gRule({required, valid,type, trigger, nullMsg,configKey}){
  required = required || true
  if (valid === 'select') {
    let rule = {required:required}
    rule.trigger = trigger || "change"
    rule.message = i18n.t(nullMsg || "validate.plsSel")
    if (type) {
      rule.type = type
    }
    return [rule]
  }

  trigger = trigger || "blur"
  nullMsg = nullMsg || "validate.required"
  if (configKey) {
    var config = store.state.config
    if (config[configKey]) {
      required = !!config[configKey]['R']
    }
  }

  const rule = { required: !!required, trigger}
  if (type) {
    rule.type = type
  }

  let check = null
  if(typeof valid === "function"){
    check = valid
  }else{
    check = valid ? rules[valid+""] : null
  }

  var result = true
  var errMsg = 'erGeneral'
  rule.validator = (r, v, c) => {
    if (check && typeof check === "function") {
      const checkinfo = check(v)
      result = checkinfo.result
      errMsg = checkinfo.errMsg
    }
    errMsg = i18n.t(errMsg)
    if(required){
      return (v==null || (v+"").trim()==="") ? c(new Error(i18n.t(nullMsg))) : result ? c() : c(new Error(errMsg))
    }
    return (v==null || (v+"")==="" || result) ? c() : c(new Error(errMsg))
  }

  return [rule]
}