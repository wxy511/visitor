export function date_format(dateObj,fmt){
    var o = {
        "M+": dateObj.getMonth() + 1, //月份 
        "d+": dateObj.getDate(), //日 
        "h+": dateObj.getHours(), //小时 
        "m+": dateObj.getMinutes(), //分 
        "s+": dateObj.getSeconds(), //秒 
        "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度 
        "f": dateObj.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;      
}


export function str_gblen(string){
    string = String(string)
    var len = 0;    
    for (var i=0; i<string.length; i++) {    
        if (string.charCodeAt(i)>127 || string.charCodeAt(i)==94) {    
             len += 2;    
         } else {    
             len ++;    
         }    
     }    
    return len;        
}

export function safeInput(value)
{
  var value = String(value)
  var pattern=/[`~!#$^&*()=|{}':;',\\\[\]\<>\/?~！#￥……&*（）——|{}【】'；：""'。，、？]/g;
  var reStr = value.replace(pattern,"")
  return reStr
}

export function trim(str){ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function ltrim(str){ //删除左边的空格
     str.replace(/(^\s*)/g,"");
}
function rtrim(str){ //删除右边的空格
    return str.replace(/(\s*$)/g,"");
}
function strCheckPwd(str)
{
    var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    return reg.test(str) && str.length>7
}
export function icd_idcode(value)
{
    if (!value) {return ''}
    let _str = String(value)
    let _return = _str
    if (_str.length>=12) {_return = _str.replace(/^(\d{6})\d+(\d{4})/,"$1********$2") }
    else if (_str.length==11) {_return = _str.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2") }
    else if (_str.length>=6){_return =_str.replace(/^(\d{2})\d{2}(\d+)/,"$1****$2") }  
    return _return
}