import {
  gRule
} from '@/utils/validateRules.js'
import {
  str_gblen
} from '@/utils/GlobalFunction.js'
import {
  s_EQuery,
  s_SubmitRegisEx,
  s_VGroupUpdate,
  s_check_e
} from '@/api/api.js'
import {
  showPhone
} from '@/utils/visitor.js'
import reskRegionsList from '@/utils/regions.json'
import {
  Dialog,
  Toast
} from 'vant';
import {
  mapActions
} from 'vuex'
Date.prototype.format = Date.prototype.format || function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份 
    'd+': this.getDate(), // 日 
    'h+': this.getHours(), // 小时 
    'm+': this.getMinutes(), // 分 
    's+': this.getSeconds(), // 秒 
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度 
    'f': this.getMilliseconds() // 毫秒 
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

export const data = function () {
  return {
    dlgVisible_Load: false,
    selVisitorList_Load: [],

    size: 'mini',
    device: '',
    dlgResultVisible: false,
    dlgVisible: false,
    loading: false,
    timelineicon: "",
    empoptions: [],
    selVisitorList: [],
    selVisitorDrive: {},
    driveList: {},
    regForm: {
      Vpurpose: '',
      Vfreq: '0',
      Vbranch: '',
      startDate: '',
      endDate: '',
      otherPurpose: ''
    },
    hasEntourage: false,
    VMyVisitingInfo: {
      bDrive: false,
      showInput: false,
      Vplate: '',
      riskRegions: '',
      riskRegions_code: '',
      riskLevel: 1
    },
    regRules: {
      Vpurpose: gRule({
        'valid': 'select'
      }),
      otherPurpose: gRule({}),
      Vbranch: gRule({
        'valid': 'select'
      }),
      startDate: gRule({
        'valid': 'select',
        'type': 'date'
      }),
      endDate: gRule({
        'valid': 'select',
        'type': 'date'
      }),
    },
    hostInfo: {
      Eemail: '',
      EHID: 0,
      notfound: false,
      lastsearch: '',
    },
    vForm: {
      Vphone: '',
      Vcountrycode: ''
    },
    pickerOptions: {
      disabledDate: function (time) {
        let timeOptionRange = new Date()
        let _nowHour = timeOptionRange.getHours()
        // let _minNum = 60*60*24*1000
        let _minNum = 0
        // if (_nowHour>=17) {_minNum = 60*60*24*1000*2}
        let secondNum = 60 * 60 * 24 * 1000 * 30;
        let _maxdata = new Date(timeOptionRange.getTime() + secondNum)
        let _mindata = new Date(timeOptionRange.getTime() + _minNum)

        _maxdata = parseInt(_maxdata.format('yyyyMMdd'))
        let _nowdata = parseInt(_mindata.format('yyyyMMdd'))
        let _checkdata = parseInt(time.format('yyyyMMdd'))
        if (_nowdata) {
          return _checkdata > _maxdata || _checkdata < _nowdata;
        }
      }
    },
    pickerEndOptions: {
      disabledDate: function (time) {
        let timeOptionRange = new Date()
        let _mindata = 0
        let secondNum = 60 * 60 * 24 * 1000 * 30;
        let _maxdata = new Date(timeOptionRange.getTime() + secondNum)

        _mindata = new Date().format('yyyyMMdd')
        _maxdata = parseInt(_maxdata.format('yyyyMMdd'))
        _mindata = parseInt(_mindata)
        let _checkdata = parseInt(time.format('yyyyMMdd'))
        return _checkdata > _maxdata || _checkdata < _mindata;
      }
    },

    //risk regions
    //riskRegionsList:reskRegionsList.regions,
    riskRegionsLast: [],
    riskRegionsSel: {},
    popup_show: false,
    dlgRiskRegionsVisible: false,
    selVisitorRegions: {},
  }
}

export const methods = {
  showPhone,
  vueCreated(type) {
    this.device = type
    if (type == 'pc') {
      this.size = ""
    } else {
      // Dialog.setDefaultOptions({
      //   confirmButtonColor:this.mainclr
      // })
    }
    this.initRegisInfo()
    if (this.branchList.length == 1) {
      this.regForm.Vbranch = this.branchList[0].code
    } else {
      this.regForm.Vbranch = this.lastBranch
    }
  },
  onChangeDrive(val, row, index, refname) {
    var VVID = row.VVID || row.VV_ID || 0
    if (VVID) {
      this.selVisitorDrive[VVID] = val
    } else {
      this.selVisitorDrive[index + 'load'] = val
    }
    if (!row.Vplate && refname && val) {
      this.$nextTick(() => {
        this.$refs[refname].onVisible()
        // this.$refs[refname].$el.click()
      })
    }
  },
  async submitRegis_valid() {
    let self = this
    self.loading = true
    let reqdata = {
      'Vbranch': self.regForm['Vbranch'],
      'Vpurpose': self.regForm['Vpurpose'],
      'language': self.language.toUpperCase(),
      'Visitors': [],
      'channel': self.py_config['channel'] || 0,
      'approved': self.py_config['approved'] || 0
    }
    if (self.py_config.hostType === 'input') {
      var Eemail = self.hostInfo.Eemail + self.py_config['suffix']
      var respons = await s_check_e({
        'Eemail': Eemail
      })
      if (respons.error == 0 && respons.EHID) {
        reqdata['EHID'] = respons.EHID
      } else {
        self.toastMsg('erGeneral', 'el-icon-close', 'center')
        self.loading = false
        return
      }
    } else {
      reqdata['EHID'] = self.hostInfo.EHID
    }
    if (reqdata['Vpurpose'] === '9999') {
      reqdata['Vpurpose'] = self.$t('other') + ':' + self.regForm['otherPurpose']
    }
    if (self.regForm['startDate'] == self.regForm['endDate']) {
      reqdata['Vfreq'] = 0;
      reqdata['date'] = [{
        'date': parseInt(self.regForm['startDate'])
      }]
    } else {
      reqdata['Vfreq'] = 4
      reqdata['date'] = [{
        'date': parseInt(self.regForm['startDate'])
      }, {
        'date': parseInt(self.regForm['endDate'])
      }]
    }
    //py_config.riskRegions
    var checkRiskResult = true
    var visitorList = []
    if (self.userType === 'e') {
      reqdata['approved'] = 0
    } else {
      visitorList.push(self.userInfo)
      let gvisitor = {
        'VVID': self.userInfo.VVID,
        'Vtype': 1,
        'Number': 0
      }
      if (self.py_config.riskRegions) {
        if (self.VMyVisitingInfo.riskRegions_code === '') {
          checkRiskResult = false
          self.toastMsg('riskRegions.erSelMyFrom', 'el-icon-close', 'center')
          self.loading = false
          return
        } else {
          gvisitor['reserved1'] = self.VMyVisitingInfo.riskRegions_code
          gvisitor['reserved2'] = JSON.stringify({
            'en': self.VMyVisitingInfo.riskRegions,
            'cn': self.VMyVisitingInfo.riskRegions
          })
        }
      }
      reqdata['Visitors'].push(gvisitor)
    }
    //原来的
    // if (self.selVisitorList_Load.length) {
    //   visitorList = visitorList.concat(self.selVisitorList_Load)
    //   self.selVisitorList_Load.forEach((item,index) => {
    //     item.visitorNum = index
    //   });
    //   var groupAddReqData = {
    //     'visitorGroup':self.selVisitorList_Load
    //   }
    //   var respons =  await s_VGroupUpdate(groupAddReqData)
    //   if (respons.results) {
    //     respons.results.forEach((item,index) => {
    //       if (item.error === 0 && item['VV_ID']) {
    //         let gvisitor = {'VVID':item['VV_ID'],'Vtype':1,'Number':index}


    //         reqdata['Visitors'].push(gvisitor)    
    //         console.log("批量导入---->",gvisitor)          
    //       }
    //       else{
    //         console.log(item)
    //       }
    //     });          
    //   }
    // }

    if (self.selVisitorList_Load.length) {
      visitorList = visitorList.concat(self.selVisitorList_Load)
      self.selVisitorList_Load.forEach((item, index) => {
        // item.visitorNum = index
        visitorList.push(item)
      });
      var groupAddReqData = {
        'visitorGroup': self.selVisitorList_Load
      }
      var respons = await s_VGroupUpdate(groupAddReqData)
      if (respons.results) {
        respons.results.forEach((item, index) => {
          if (item.error === 0 && item['VV_ID']) {
            let gvisitor = {
              'VVID': item['VV_ID'],
              'Vtype': 1,
              'Number': index
            }
            //ADD
            console.log(groupAddReqData)
            if (self.selVisitorDrive[index + 'load'] && groupAddReqData.visitorGroup[index]['Vplate']) {
              gvisitor['Vplate'] = groupAddReqData.visitorGroup[index]['Vplate']
            }
            if (self.py_config.riskRegions) {
              // var riskInfo = self.selVisitorRegions[index+'load']  大小写！！！注意别写错了
              var riskInfo = self.selVisitorRegions[index + 'Load']
              console.log("aaa", self.selVisitorRegions)
              if (!riskInfo || !riskInfo.code) {
                checkRiskResult = false
              } else {
                gvisitor['reserved1'] = riskInfo.code
                gvisitor['reserved2'] = JSON.stringify({
                  'en': riskInfo.fullName,
                  'cn': riskInfo.fullName
                })
              }
            }
            //ADD END
            reqdata['Visitors'].push(gvisitor)
          } else {
            console.log(item)
          }
        });
      }
    } else if (self.selVisitorList.length) {
      self.selVisitorList.forEach((item, index) => {
        visitorList.push(item)
        let vvid = item.VVID || item.VV_ID
        if (vvid) {
          let gvisitor = {
            'VVID': vvid,
            'Vtype': item.Vtype || 1,
            'Number': index
          }
          if (self.selVisitorDrive[vvid] && item['Vplate']) {
            gvisitor['Vplate'] = item['Vplate']
          }
          if (self.py_config.riskRegions) {
            var riskInfo = self.selVisitorRegions[vvid]
            if (!riskInfo || !riskInfo.code) {
              checkRiskResult = false
            } else {
              gvisitor['reserved1'] = riskInfo.code
              gvisitor['reserved2'] = JSON.stringify({
                'en': riskInfo.fullName,
                'cn': riskInfo.fullName
              })
            }
          }
          reqdata['Visitors'].push(gvisitor)
        }
      });
    }

    if (!reqdata['Visitors'].length) {
      self.toastMsg('erGeneral', 'el-icon-close', 'center')
      self.loading = false
      return
    }

    if (!checkRiskResult) {
      self.toastMsg('riskRegions.erSelFrom', 'el-icon-close', 'center')
      self.loading = false
      return
    }

    visitorList = visitorList.slice(0)
    self.$store.dispatch("setLastBranch", reqdata.Vbranch);
    console.log(reqdata)

    setTimeout(() => {
      s_SubmitRegisEx(reqdata).then(response => {
        self.loading = false
        var bSuccess = false
        if (response.results) {
          bSuccess = true
          response.results.forEach((item, index) => {
            if (item.error !== 0) {
              bSuccess = false
            }
          });
        }
        if (bSuccess) {
          self.toastMsg(reqdata.approved === 100 ? 'Regis.regPending' : 'Regis.regSuccess', 'success', 'center')
        } else {
          self.dlgResultVisible = true
          self.$nextTick(() => {
            self.$refs.submitResult.initData(response.results || [], visitorList)
          })
        }
        self.initRegisInfo()
      }).catch(error => {
        self.loading = false
      })
    }, 500)
  },
  async submitRegis(formName) {
    let self = this
    // self.toastMsg('Regis.regSuccess','success','center') 
    // self.initRegisInfo()
    // return
    this.$refs[formName].validate(function (valid) {
      if (valid) {
        if (!self.regForm['startDate']) {
          setTimeout(function () {
            document.getElementById('regStartDate').focus()
          }, 300);
          return
        }
        if (!self.regForm['endDate']) {
          setTimeout(function () {
            document.getElementById('regEndDate').focus()
          }, 300);
          return
        }
        var nowdate = new Date().format('yyyyMMdd')
        if (self.regForm['startDate'] < nowdate) {
          self.toastMsg('Regis.erVdate', 'el-icon-close', 'center')
          return
        }
        if (self.regForm['startDate'] > self.regForm['endDate']) {
          self.toastMsg('Regis.erVdate_end', 'el-icon-close', 'center')
          return
        }
        if (self.py_config.hostType !== 'input' && !self.hostInfo.EHID) {
          self.toastMsg('Regis.nohost', 'el-icon-close', 'center')
          return
        }
        if (self.userType === 'e') {
          if (!self.selVisitorList.length && !self.selVisitorList_Load.length) {
            self.toastMsg('Regis.novisitor', 'el-icon-close', 'center')
            return
          }
        }
        self.submitRegis_valid()
      }
    })
  },
  initRegisInfo() {
    this.selVisitorList = []
    this.selVisitorList_Load = []
    if (this.userType === 'e') {
      this.hostInfo.Eemail = this.userInfo.Eemail.split('@')[0]
      this.hostInfo.EHID = this.userInfo.EHID
    } else {
      this.hostInfo.Eemail = ''
      this.hostInfo.EHID = 0
      this.VMyVisitingInfo.Vplate = this.userInfo.Vplate || ''
      this.VMyVisitingInfo.bDrive = false
      this.VMyVisitingInfo.riskRegions = ''
      this.VMyVisitingInfo.riskRegions_code = ''
      this.VMyVisitingInfo.riskLevel = 1
    }
    this.regForm.Vpurpose = ''
    this.regForm.Vfreq = 0
    this.regForm.startDate = ''
    this.regForm.endDate = ''
    this.regForm.otherPurpose = ''
    this.$store.state.sync_xs_selVisitorList = []
    // this.regForm = {
    //   Vpurpose: '', 
    //   Vfreq:'0', 
    //   Vbranch:'',
    //   startDate:'',
    //   endDate:'',
    //   otherPurpose:''
    // }
    if (this.$refs['regForm']) {
      this.$nextTick(() => {
        this.$refs['regForm'].clearValidate()
      })
    }
  },
  onSelVisitors(selVisitorList) {
    this.selVisitorList = selVisitorList || []
    this.selVisitorList.forEach(item => {
      var VVID = item['VVID'] || item['VV_ID']
      item['bDrive'] = this.selVisitorDrive[VVID] || false
      var riskInfo = this.selVisitorRegions[VVID]
      if (riskInfo) {
        item['riskRegions'] = riskInfo.provinceCn + '/' + riskInfo.cityCn + '/' + riskInfo.name
      }
    });
    this.dlgVisible = false
  },

  onSelVisitors_Load(selVisitorList) {
    this.selVisitorList_Load = selVisitorList || []
    this.dlgVisible_Load = false
  },
  onDeltVisitor(visitorArr) {
    if (!visitorArr) {
      visitorArr = []
    }

    visitorArr.forEach(v => {
      let vvid = v.VVID || v.VV_ID
      for (var i = 0; i < this.selVisitorList.length; i++) {
        let selVVID = this.selVisitorList[i]['VVID'] || this.selVisitorList[i]['VV_ID']
        if (selVVID == vvid) {
          this.selVisitorList.splice(i, 1);
          i--;
        }
      }
    });
  },
  onUpdateVisitor(visitor) {
    visitor['VVID'] = visitor.VVID || visitor.VV_ID
    let vvid = visitor['VVID']
    for (var i = 0; i < this.selVisitorList.length; i++) {
      let selVVID = this.selVisitorList[i]['VVID'] || this.selVisitorList[i]['VV_ID']
      if (selVVID == vvid) {
        this.$set(this.selVisitorList, i, visitor)
        return
      }
    }
  },
  startdatesel() {
    let self = this
    if (self.regForm.startDate == '') {
      self.regForm.endDate = ''
      return
    }
    if (self.regForm.endDate == '') {
      self.regForm.endDate = self.regForm.startDate
    } else {
      let _start = parseInt(self.regForm.startDate)
      let _end = parseInt(self.regForm.endDate)
      if (_start > _end) {
        self.regForm.endDate = self.regForm.startDate
      }
    }
    this.pickerEndOptions = {
      disabledDate: function (time) {
        let timeOptionRange = new Date()
        let _mindata = 0
        let secondNum = 60 * 60 * 24 * 1000 * 30;
        let _maxdata = new Date(timeOptionRange.getTime() + secondNum)

        if (self.regForm.startDate && self.regForm.startDate != '') {
          _mindata = self.regForm.startDate
        } else {
          _mindata = new Date().format('yyyyMMdd')
        }

        _maxdata = parseInt(_maxdata.format('yyyyMMdd'))
        _mindata = parseInt(_mindata)
        let _checkdata = parseInt(time.format('yyyyMMdd'))
        return _checkdata > _maxdata || _checkdata < _mindata;
      }
    }
  },
  queryHostInfo: function (queryString, cb) {
    let self = this
    const type = self.py_config.E_hostType
    self.hostInfo.notfound = false
    let strLeng = 3
    if (type == 'q_phone') {
      strLeng = 10
    }
    if (str_gblen(queryString) < strLeng) {
      self.hostInfo.notfound = true
      self.hostInfo.EHID = 0
      cb([])
      return
    }
    var reqdata = {}
    if (type == 'q_email') {
      reqdata = {
        Eemail: queryString
      }
    }
    setTimeout(() => {
      s_EQuery(reqdata).then(function (response) {
          if (response.error == 0 && response.emp) {
            self.hostInfo.notfound = false
            self.hostInfo.lastsearch = queryString
            let _emp = []
            if (response.emp) {
              response.emp.forEach(function (item, index) {
                let _e = item.Eemail.split('@')
                if (('@' + _e[1]) == self.py_config['suffix']) {
                  _emp.push(item)
                }
              })
            }
            cb(_emp)
            //if (!_emp.length) {self.hostInfo.EHID = 0;}
          } else {
            cb([])
            self.hostInfo.EHID = 0
            if (response.error !== 0) {
              self.toastMsg('erGeneral', 'el-icon-close', 'center')
            } else {
              self.hostInfo.notfound = true
            }
          }
        })
        .catch(function (error) {
          cb([])
          self.hostInfo.EHID = 0
          self.toastMsg('erGeneral', 'el-icon-close', 'center')
        });
    }, 500)
  },
  queryHostEmail: function (queryString, cb) {
    let self = this
    return self.queryHostInfo(queryString, cb)
  },
  hostlistSelect: function (item) {
    let self = this
    self.hostInfo.Eemail = item.Eemail.split('@')[0]
    self.hostInfo.EHID = item.EHID
  },
  toastMsg: function (msgkey, icon, position) {
    let self = this
    if (!msgkey) {
      msgkey = 'erGeneral'
    }
    let type = icon == 'el-icon-close' ? 'error' : (icon == 'error' ? 'error' : 'success')
    if (self.TERMINAL == 'pc') {
      if (icon == '') {
        type = 'error'
      }
      self.$message({
        type: type,
        showClose: true,
        message: this.$t(msgkey),
      });
    } else {
      // if (type === 'success') {
      //   Toast.success(self.$t(msgkey))
      // }
      // else{
      //   Toast.fail(self.$t(msgkey))
      // }
      var title = type === 'success' ? self.$t('success') : self.$t('error')
      Dialog.alert({
        // title: title,
        message: self.$t(msgkey),
        theme: 'round-button',
        confirmButtonColor: type === 'success' ? self.mainclr : '#F56C6C',
      }).then(() => {

      });
      // if (type === 'success') {

      //   this.$toast.success(this.$t(msgkey))
      //   return
      // }
      // this.$toast({
      //   message: this.$t(msgkey),
      //   iconClass: icon,
      //   position:'bottom'
      // });
    }
  },
  vTableDelete: function (index, row) {
    let self = this
    this.selVisitorList.splice(index, 1)
    this.$refs.VList.clearSelectionRow(row)
  },
  // add start success  移除
  // vTableDelete_Load:function(index, row){
  //     let self = this
  //     this.selVisitorList_Load.splice(index,1)
  //     this.$refs.VListLoad.clearSelectionRow(row)
  // },
  // add end success

  vTableDelete_app: function (index, row) {
    let self = this
    this.selVisitorList.splice(index, 1)
    self.sync_updateSelVList({
      'VVID': row.VVID || row.VV_ID
    }, 'delete')
  },
  showVisitorList_pc() {
    this.dlgVisible = true
    var reqData = {
      Vtype: 1
    }
    this.$nextTick(() => {
      this.$refs.VList.initData(reqData, this.selVisitorList)
    })
  },
  showVisitorList_app() {
    this.$store.state.sync_xs_selVisitorList = this.selVisitorList
    this.$router.push({
      name: 'selectVisitor',
      query: {
        'type': 'v',
        'Vtye': 1
      }
    });
  },


  vTableAddPlate(row, index, plate) {
    row.Vplate = plate
    // this.selVisitorList[index]['Vplate'] = plate
    this.$set(this.selVisitorList[index], 'Vplate', plate)
    console.log("hello")
  },
  vTableModifyPlate(row, index, plate) {
    this.$set(this.selVisitorList[index], 'Vplate', plate)
    console.log("hello")
  },

  //add start
  vTableAddPlate_Load(row, index, plate) {
    row.Vplate = plate
    this.$set(this.selVisitorList_Load[index], 'Vplate', plate)
    console.log(this.selVisitorList_Load)
  },
  vTableModifyPlate_Load(row, index, plate) {
    this.$set(this.selVisitorList_Load[index], 'Vplate', plate)
  },
  // add end


  VMeAddPlate(row, index, plate) {
    this.VMyVisitingInfo.Vplate = plate
  },
  VMeModifyPlate(row, index, plate) {
    this.VMyVisitingInfo.Vplate = plate
  },
  testResult() {
    var results = [{
        "Number": 1,
        "error": 5,
        "regcode": "0062882188",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 2,
        "error": 0,
        "regcode": "2862882588",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 3,
        "error": 40,
        "regcode": "3262882588",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 2,
        "error": 0,
        "regcode": "2862882588",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 2,
        "error": 0,
        "regcode": "2862882588",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 2,
        "error": 0,
        "regcode": "2862882588",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 1,
        "error": 40,
        "regcode": "3262882588",
        "time": "2021-05-13 15:17:03"
      },
      {
        "Number": 3,
        "error": 0,
        "regcode": "3262882588",
        "time": "2021-05-13 15:17:03"
      }
    ]
    var visitor = [{
      "Vname": "Leona",
      "Vunit": "ICD",
      "Vphone": "18600505363",
      "Vcountrycode": "86"
    }, {
      "Vname": "Test",
      "Vunit": "ICGFDSGSDFGFDD",
      "Vphone": "18984465",
      "Vcountrycode": "44"
    }, {
      "Vname": "JLFHSAKJFHASF",
      "Vunit": "FSAFKD",
      "Vphone": "4681766",
      "Vcountrycode": "86"
    }, {
      "Vname": "Leona",
      "Vunit": "ICD",
      "Vphone": "18600505363",
      "Vcountrycode": "86"
    }]

    this.dlgResultVisible = true
    this.$nextTick(() => {
      this.$refs.submitResult.initData(results, visitor)
    })
  },


  showLoadVisitor_pc() {
    this.dlgVisible_Load = true
  },

  deleteAllVisitor() {
    this.selVisitorList = []
    this.selVisitorList_Load = []
  },

  onShowRiskRegions(type, index, data) {
    this.popup_show = true
    this.dlgRiskRegionsVisible = true
    this.$nextTick(() => {
      this.$refs.riskRegions.initSel(type, data.riskRegions_code || null, index, data)
    })
  },
  onRegionsSel(item, type, index, data) {
    this.popup_show = false
    this.dlgRiskRegionsVisible = false
    if (type === 'addMe' || type === 'modifyMe') {
      this.VMyVisitingInfo.riskRegions = item.provinceCn + '/' + item.cityCn + '/' + item.name
      this.VMyVisitingInfo.riskRegions_code = item.code
      this.VMyVisitingInfo.riskLevel = item.riskLevel
    }
    //批量导入点击地区
    else if (type === 'addMeLoad' || type === 'modifyMeLoad') {
      this.selVisitorList_Load[index]['riskRegions'] = item.provinceCn + '/' + item.cityCn + '/' + item.name
      this.selVisitorList_Load[index]['riskRegions_code'] = item.code
      console.log(this.selVisitorList_Load)
      var VVID = String(index) + 'Load'
      //  var VVID = 5
      if (VVID) {
        this.selVisitorRegions[VVID] = item
        console.log("1", this.selVisitorRegions[VVID] = item)

      }
    }
    //新增选择访客点击地区
    else {
      this.selVisitorList[index]['riskRegions'] = item.provinceCn + '/' + item.cityCn + '/' + item.name
      this.selVisitorList[index]['riskRegions_code'] = item.code
      var VVID = data.VVID || data.VV_ID || 0
      if (VVID) {
        this.selVisitorRegions[VVID] = item
      }
    }
  },
}
