import {date_format,icd_idcode} from '@/utils/GlobalFunction'
import {showTimeZone} from '@/utils/reqDataTrans'

export function showPhone(ccode,phone,bEncode=false)
{
  if (!phone) {
    return ''
  }
  if (phone && bEncode) {
    phone = icd_idcode(phone)
  }
  if (ccode) {
    return '+'+ccode+' '+phone
  }
  return phone
}

export function showID(id,bEncode=true)
{
  if (id && bEncode) {
    id = icd_idcode(id)
  }
  return id || ''
}

export function format_riskLevel(row,riskRegions_map){
  if (row.reserved2) {
    var nameJson = JSON.parse(row.reserved2)
    row['regionsName'] = nameJson['cn'] || nameJson['en'] || ''
    var riskLevel = 1
    if (row.RDCustom1) {
      var levelJson = JSON.parse(row.RDCustom1)
      riskLevel = levelJson['riskLevel'] || 1
    }
    else if (row.reserved1) {
      var county = riskRegions_map[row.reserved1]
      if (county && county.riskLevel) {
        riskLevel = county.riskLevel
      }
    }
    row['riskLevel'] = riskLevel
  }
  return row
}

function date_TimeSpace(row){
  if (row.TimeSpace) {
    var dateArray = row.TimeSpace.split('-')
    var _showDate = dateArray[0]
    _showDate = _showDate.substr(0,4) +'/' + _showDate.substr(4,2)+'/' + _showDate.substr(6,2)

    if (dateArray.length>1) {
      var _endDate = dateArray[1]
      _endDate = _endDate.substr(0,4) +'/' + _endDate.substr(4,2)+'/' + _endDate.substr(6,2)
      _showDate = _showDate +' - '+_endDate 
    }

    return _showDate
  }
  return ''
}

function date_Vdate(Vdate,Vtime){
  let _Vdate = String(Vdate)
  var _showDate = _Vdate.substr(0,4)+'/'+_Vdate.substr(4,2)+'/'+_Vdate.substr(6,2)
  if (Vtime){
    let _time = String(Vtime)
    let sub = _time.substr(0, _time.length - 2);
    let stimeS = _time.replace(sub, sub + ':');
    _showDate = _showDate + ' ' +stimeS
  }
  return _showDate
}

export function recordFormat(item){
    let nowDate = parseInt(date_format(new Date(),'yyyyMMdd'))

    if (item['TimeSpace']) {
      item['showVdate'] = showTimeZone(date_TimeSpace(item),item['TimeZoneValue'])
    }
    else{
      if (item.Vfreq === 4 && item.date && item.date.length === 2) {
        item['Vdate'] = item.date[1].date
        item['showVdate'] = showTimeZone(date_Vdate(item.date[0].date,item['Vtime']) + ' - ' + date_Vdate(item.date[1].date,item['Vtime']),item['TimeZoneValue'])
      }
      else
        item['showVdate'] = showTimeZone(date_Vdate(item['Vdate'],item['Vtime']),item['TimeZoneValue'])
    }

    if (item['opertimeUTC']) {
      item['showOpertime'] = item['opertimeUTC']
    }
    else if (item['opertime']){
      item['showOpertime'] = date_format(new Date(item['opertime']*1000),'yyyy/MM/dd')
    }
    if (item['showOpertime']) {
        item['showOpertime'] = showTimeZone(item['showOpertime'],item['opertimeZone'])
    }
    if (item['applytimeUTC']) {
        item['showApplytime'] = showTimeZone(item['applytimeUTC'],item['applytimeZone'])
    }

    if (item['approved'] === undefined) {item['approved']=0}

    if (item.approved === -1) {
      item['status']='cancel'
    } else if (item.approved === -100) {
      item['status']='reject'
    }
    else{
      if (!item['approved']) {
        item['status'] = 'valid' 
        if (item['Rtimein'] || item['RtimeinUTC']) {
          item['showRtimein'] = showTimeZone(item['RtimeinUTC'] || (date_format(new Date(item['Rtimein']*1000),'yyyy/MM/dd  hh:mm:ss')),item['TimeZoneValue'])
          item['status'] = 'visited';
        }else{
          if (nowDate>item['Vdate']) {
            item['status']='invalid'
          }      
        }
        if (item['Rtimeout'] || item['RtimeoutUTC']) {
          item['showRtimeout'] = showTimeZone(item['RtimeoutUTC'] || (date_format(new Date(item['Rtimeout']*1000),'yyyy/MM/dd  hh:mm:ss')),item['TimeZoneValue'])             
        }         
      }
      else if (item['approved'] === 100) {
        if (nowDate>item['Vdate']) {
          item['status']='invalid'
        }
        else
          item['status'] = 'pending'
      }
    }
    return item
}