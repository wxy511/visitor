<template>
  <div>
    <apppage-layout 
      :title="$t('Regis.selVisitor')" 
      page="ChangeUserInfo" 
      customClass="vlist"
    >
      <div slot="body">
        <el-row class="header-search">
          <el-col :span="16">
            <el-input v-model="vListsearch" size="mini" prefix-icon="el-icon-search" :placeholder="$t('Visitor.pldSearch')"/>
          </el-col>
          <el-col :span="8" class="mainclr">
            <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="onClickSave">{{$t('Visitor.addNewVisitor')}} </el-button>
          </el-col>
        </el-row>
        <el-table
            v-loading="tableloading"
            :data="vListTable"
            ref="vList"
            class="list-table"
            :highlight-current-row="true"
            :style="tableStyle"
            @selection-change="vListSelectionChange"
            :row-key='getRowVVID'
            :empty-text="$t('NoData')"
            :cell-style="stateTableCellStyle"
            @row-click="vlistRowClick"
            @select="vListSelect"
            :row-class-name="TableRowClassName"
        >
          <el-table-column type="selection" width="42" :reserve-selection="true" :selectable="checkEntable" :show-overflow-tooltip="false"></el-table-column>
          <el-table-column :label="$t('RegInfo.Vname')" prop="Vname"  align="left" :show-overflow-tooltip="true">
            <div slot-scope="scope">
              <span>{{scope.row.Vname}}</span>
              <!-- <br><span class="table-unit">{{scope.row.Vunit}}</span> -->
            </div>
          </el-table-column>
          <el-table-column :label="$t('RegInfo.Vunit')" prop="Vunit"  align="left" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column width="80" align="right" type="operation">
            <div slot-scope="scope">
              <el-button v-if="scope.row.Vinblack && rights.Vinblack" size="mini" plain @click="visitorInfo($event,scope.$index, scope.row)" class="tablebtn"><i class="el-icon-document"></i></el-button>
              <el-button v-else size="mini" plain @click="vlistEdit($event,scope.$index, scope.row)" class="tablebtn"><i class="el-icon-edit"></i></el-button>
              <el-popconfirm                         
                :title="$t('tooltip.deleteVisitor',{name:scope.row.Vname})"
                :confirm-button-text="$t('confirm')"
                :cancel-button-text="$t('cancel')"
                @confirm="vlistDelete(scope.row)"
              >
                <el-button size="mini" type="danger" slot="reference"  class="tablebtn" @click="onClickDelete($event, scope.row)">
                  <i class="el-icon-delete clrWhite"></i>
                </el-button>                                                       
              </el-popconfirm>
            </div>
          </el-table-column>
        </el-table>
        <el-pagination
            v-show="true"
            :hide-on-single-page="hideonepage"
            small
            :background="location_cfg.page_bk"
            :page-size="vListPageSize"
            style="float:left;margin-top:10px;"
            :current-page="vListCurrentPage"
            @current-change='vlistPageChange'
            layout="total, prev, pager, next"
            :total="visitorList.length">
        </el-pagination>
        <div style="height:20px"></div>
        <el-divider></el-divider>
        <div>
          <el-button type="primary" round class="submitbtn" size="small" :disabled="!selVArray.length" @click="onSubmitSelVisitor">     
            <span style="font-size: 14px">{{$t('Visitor.btnSelConfirm')}}</span>
          </el-button>
        </div>
      </div>
    </apppage-layout>
    <el-drawer
      ref="drawerVInfo"
      :title="$t('Regis.'+vInfoType)" 
      :visible.sync="detailsDrawerVisible" 
      direction="rtl"
      size="90%"
      custom-class="vinfo-drawer"
      :modal-append-to-body="true"
      :wrapperClosable="true"
      :append-to-body="true"
    >
      <div class="vinfo-drawer__content">
        <el-form 
          :model="vForm" 
          :rules="vRules"
          :size="elementSize"
          validate-on-rule-change
          ref="vForm" label-position="left" label-width="0px"
        >
          <div class="home-form-row">
            <div class="home-form-col">
              <el-row>
                <el-col :span="3" class="form-icon"><i class="el-icon-user"></i></el-col>
                <el-col :span="20">
                  <el-form-item prop="Vname">
                    <el-input v-model="vForm.Vname" :placeholder="$t('RegInfo.Vname')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vphone && config.Vphone.E">
                <el-col :span="3" class="form-icon"><i class="el-icon-mobile-phone"></i></el-col>
                <el-col :span="20">
                  <el-form-item prop="Vphone">
                    <el-input 
                      :placeholder="$t('RegInfo.Vphone')" 
                      v-model="vForm.Vphone" 
                      ref="Vphone" 
                      class="inputBtn" 
                      maxlength='11'  
                      v-on:input="numberCheck('vForm','Vphone')" 
                      :readonly="!enableChangVphone">     
                      <el-select v-model="vForm.Vcountrycode" slot="prepend" class="ccode-select" :disabled="!enableChangVphone">
                        <country-code />
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vphone && config.Vphone.R"><span class="redstart">*</span></el-col>
              </el-row> 
              <el-row v-if="config.Vemail && config.Vemail.E">
                <el-col :span="3" class="form-icon"><i class="el-icon-message"></i></el-col>
                <el-col :span="20">
                  <el-form-item prop="Vemail">
                    <el-input v-model="vForm.Vemail" :placeholder="$t('RegInfo.Vemail')"></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vemail && config.Vemail.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row class="tips" v-if="showTipsStr">
                <span :class="showTips? 'yes':'no' ">* {{$t(showTipsStr)}} </span>
              </el-row>
              <el-row v-if="config.Vunit && config.Vunit.E">
                <el-col :span="3" class="form-icon"><i class="el-icon-office-building"></i></el-col>
                <el-col :span="20">
                  <el-form-item prop="Vunit">
                    <el-input v-model="vForm.Vunit" :placeholder="$t('RegInfo.Vunit')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vunit && config.Vunit.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vnation && config.Vnation.E">
                <el-col :span="3" class="form-icon"><svg-icon class-name="international-icon" icon-class="icd-earth" /></el-col>
                <el-col :span="20">
                  <el-form-item prop="Vnation">
                    <el-select v-model="vForm.Vnation" class="fullWidth" filterable :disabled="vInfoType==='EditUserInfo'">
                      <nation-list />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vnation && config.Vnation.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vid && config.Vid.E">
                <el-col :span="3" class="form-icon"><i class="el-icon-postcard"></i></el-col>
                <el-col :span="8">
                <el-form-item prop="Vidtype">
                  <el-select :disabled="vInfoType==='EditUserInfo' && config.Vid.R && vForm.Vid!='' " v-model="vForm.Vidtype" class="fullwidth" @change="onIDTypeChange">
                    <document-id></document-id>
                  </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="1" class="form-icon">&nbsp;</el-col>
                <el-col :span="11">
                  <el-form-item prop="Vid">
                    <el-input :readonly="vInfoType==='EditUserInfo' && config.Vid.R && vForm.Vid!=''" v-model="vForm.Vid" :placeholder="$t('RegInfo.Vid')" ref="Vid"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vid && config.Vid.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vplate && config.Vplate.E">
                <el-col :span="3" class="form-icon"> <svg-icon icon-class="drive"></svg-icon> </el-col>
                <el-col :span="20">
                  <el-form-item prop="Vplate">
                    <el-input v-model="vForm.Vplate" :placeholder="$t('RegInfo.Vplate')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft"></el-col>
              </el-row>
              <div class="risk-regions" v-if="py_config.testReport">
                <el-row class="form-regions">{{$t('Regis.riskRegions.highRegions')}} <span class="paddingleft redstart">*</span></el-row>
                <el-row>
                  <el-form-item  prop="highRegions">
                    <el-radio-group v-model="vForm.highRegions">
                      <el-radio label="yes" value="yes"> {{$t('yes')}} </el-radio>
                      <el-radio label="no" value="no"> {{$t('no')}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-row>
                <el-row class="form-regions">{{$t('Regis.riskRegions.otherRegions')}} <span class="paddingleft redstart">*</span></el-row>
                <el-row>
                  <el-form-item  prop="otherRegions">
                    <el-radio-group v-model="vForm.otherRegions">
                      <el-radio label="yes" value="yes"> {{$t('yes')}} </el-radio>
                      <el-radio label="no" value="no"> {{$t('no')}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-row>

                <div v-show="vForm.otherRegions ==='yes' ">
                  <el-row>
                    {{$t('Regis.riskRegions.label')}}
                  </el-row>
                  <el-row class="upload">
                    <el-upload
                      class="upload-demo"
                      action="/posts/"
                      :auto-upload="false"
                      :file-list="fileList"
                      :limit="1"
                      >
                      <el-button size="small" type="primary" icon="el-icon-upload"> {{$t('Regis.riskRegions.upload2')}}</el-button>
                      
                      <div class="el-upload__tip" slot="tip"></div>
                    </el-upload>                 
                  </el-row>  
                </div>                
              </div>
            </div>
          </div>
        </el-form>
        <div class="vinfo-drawer__footer">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button @click="cancelForm" class="fullWidth">{{ $t('reset') }}</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="onSubmit('vForm')" :loading="loading" :disabled="vForm.highRegions ==='yes'"  class="fullWidth">{{ $t('submit') }}</el-button>
            </el-col>
          </el-row>
          <el-row v-show="vForm.highRegions ==='yes' " class="errortip">{{$t('Regis.riskRegions.highRegionsTips')}}</el-row>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      ref="drawerVInfo"
      :title="$t('Visitor.Vinblack')" 
      :visible.sync="visitorInfoVisible" 
      direction="rtl"
      size="90%"
      :modal-append-to-body="true"
      :wrapperClosable="false"
      :append-to-body="true"
    >
      <div class="vinfo-drawer__content">
        <el-timeline>
          <el-timeline-item  placement="top" hide-timestamp  color="#fff">
            <div>
            <img class="bannerBg" v-if="showVisitorInfo.Vinblack && rights.Vinblack" :src="blackImgSrc">
            <div class="reg-card">
              <details-item :label="$t('RegInfo.Vname')" :icon="'el-icon-user'" :value="showVisitorInfo.Vname"/>
              <details-item :label="$t('RegInfo.Vunit')" :icon="'el-icon-office-building'" :value="showVisitorInfo.Vunit"/>
              <details-item :label="$t('RegInfo.Vphone')" :icon="'el-icon-mobile-phone'" :value="showPhone(showVisitorInfo.Vcountrycode,showVisitorInfo.Vphone)"/>
              <details-item :label="$t('RegInfo.Vemail')" :icon="'el-icon-message'" :value="showVisitorInfo.Vemail"/>
              <details-item v-show="showVisitorInfo.Vnation" :label="$t('RegInfo.Vnation')" svg="icd-earth" type="Vnation" :value="showVisitorInfo.Vnation"/>
              <details-item v-show="showVisitorInfo.Vid" :label="$t('RegInfo.Vid')" icon="el-icon-postcard" type="Vid" :recordData="showVisitorInfo"/>             
              <details-item 
                v-if="py_config.riskRegions" 
                icon="el-icon-place" 
                :label="$t('riskRegions.tableLabel')" 
                type="risk"
                :showRiskLevel="rights.riskLevel"
                :recordData="showVisitorInfo"
              />
            </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
  </div>
</template>
<script>

// import {changePsd_py} from '@/api/visitor'
import {gRule} from '@/utils/validateRules.js'
import CountryCode from '@/components/CountryCode'
import { icd_idcode } from '@/utils/GlobalFunction.js'
import DocumentId from '@/components/DocumentID'
import NationList from '@/components/NationList'
import DetailsItem from '@/components/DetailsItem/DetailsItem_APP.vue'
import ApppageLayout from '@/components/ApppageLayout'

import { mapState,mapGetters, mapActions } from 'vuex'
import { 
    s_GetVList,
    s_VUpdate,
    s_VDelete
} from '@/api/api.js'

export default {
  name: 'SelectVisitor',
  components:{
    CountryCode,
    DocumentId,
    NationList,
    DetailsItem,
    ApppageLayout
  },
  data(){
    return {
      tableStyle:'overflow-y: auto;min-height:550px',
      visitorType:'v',
      visitorListFull:[],
      visitorList:[],
      vListTable:[],//Table Data
      loading: false,
      tableloading:false,
      vInfoType:'newVisitor',//EditUserInfo newVisitor
      vListsearch:'',
      vListPageSize:10,
      vListCurrentPage:1,
      hideonepage:false,
      selList:[],
      vForm: {
        Vname: '', 
        Vcountrycode:'86', 
        Vphone:'', 
        Vemail:'',
        Vidtype:'0',
        Vid:'',
        Vunit:'',
        Vplate:'',
        Vnation:'CHN',
        highRegions:'',
        otherRegions:''
      },
      vRules: {
        Vname:  gRule({'configKey':'Vname'}),
        Vphone: gRule({'configKey':'Vphone'}),
        Vemail: gRule({'configKey':'Vemail','valid':'Email'}),
        Vid:    gRule({'configKey':'Vid','valid':'IdCard'}),
        Vunit:  gRule({'configKey':'Vunit'}),    
        highRegions: [ { required: true, message: this.$t('plsSel'), trigger: 'change' }], 
        otherRegions: [ { required: true, message: this.$t('plsSel'), trigger: 'change' }], 
      },
      selVArray:[],

      detailsDrawerVisible:false,
      vFormInit: {Vname: '', Vcountrycode:'86', Vphone:'', Vemail:'',Vidtype:'0',Vid:'',Vunit:''},
      drawerInfo:{},
      editInfo:null,

      queryVListByEHID:{},
      fileList:[],

      showVisitorInfo:{},
      visitorInfoVisible:false,
      blackImgSrc:require('@/assets/basic/black.png'),

      showTips:false,
      showTipsStr:'',

      enableChangVphone:true
    }
  },
  computed: {
    ...mapState(['mainclr','config','elementSize','stateTableCellStyle','location_cfg','py_config','rights','embeddedAPP']),
    ...mapGetters(['countrycodeList','language','lastCountryCode','sync_xs_selVisitorList']),
  },
  watch:{
    vListsearch:function(val) {
      this.getVisitorList(val,null,null)
    },
    sync_xs_selVisitorList(val){
      this.initCheck(val)
    },
  },
  created(){
    if (this.py_config.custom === 'UNNC') {
      this.showTipsStr = 'Regis.visitorTips.UNNC'
    }
    if (this.embeddedAPP) {
      this.tableStyle = 'overflow-y: auto;height:calc(100vh - 180px);'
      this.vListPageSize = parseInt((document.body.clientHeight - 210 - 15)/34)
    }
    else{
      this.tableStyle = 'overflow-y: auto;height:calc(100vh - 230px);'
      this.vListPageSize = parseInt((document.body.clientHeight - 210 - 60)/34)
    }

    const params = this.$route.query
    if (params) {
        this.initData(params,[])
    }
    else{
        this.$router.push({'name':'add'})
    }
  },
  methods: {
    ...mapActions(['sync_updateSelVList']),
    TableRowClassName({ row, rowIndex }) {
      if (row.Vinblack && this.rights.Vinblack) {
        return 'table-row-black'
      }
      return 'table-row'
    },
    checkEntable(row, index) {
      if (row.Vinblack && this.rights.Vinblack) {
        return false
      }
      return true
    },
    onClickSave(){
        this.onAddNewVisitor()
    },
    onClickLeft () {
        if (!this.$route.query.type) {
            this.$router.push({'name':'add'})
        }
        else{
          this.$router.goBack();
        }
    },
    async initData(data,checkList){
      this.tableloading = true
      if (!checkList) {
        checkList = this.sync_xs_selVisitorList || []
      }
      else{

      }
      if (!data) {
        if (this.queryVListByEHID) {
          data = this.queryVListByEHID
        }
        else{
          return
        }
      }
      var reqData = {
        'Vtype':data.Vtype,
      }
      this.queryVListByEHID = reqData
      this.vListTable = []
      setTimeout(() => {
        s_GetVList(reqData).then(response=>{
          if(!response.visitor){response.visitor=[]}
            response.visitor.forEach(item => {
            item['bDrive'] = false
            item['riskRegions'] = ''

            if (item['Vplate']=== undefined) {
              item['Vplate'] = ''
            }
          });
          this.visitorListFull = response.visitor || []
          this.visitorList = response.visitor || []
          this.vListCurrentPage = 1
          this.getVisitorList(null,1,null)
          this.tableloading = false
          
          this.$nextTick(()=>{
            this.selVArray = checkList || []
            this.initCheck(checkList || [])
          })
        }).catch(error=>{
          console.log(error)
          this.tableloading = false
        })
      }, 500)
    },
    changeIDVaild(idtype,bValidate){
      if (idtype==='0' || idtype===0) {
        this.vRules.Vid = gRule({'configKey':'Vid','valid':'IdCard'})
      }
      else
        this.vRules.Vid = gRule({'configKey':'Vid'})

      if (this.$refs.vForm && bValidate) {
        this.$nextTick(()=>{
          this.$refs.vForm.validateField('Vid') 
        }) 
      }
    },
    onIDTypeChange(val){
      this.changeIDVaild(val,true)
    },
    initCheck(checkList){
      checkList = this.sync_xs_selVisitorList || []
      this.$refs.vList.clearSelection()
      if (!checkList.length) {
        return
      }
      this.visitorListFull.forEach(item => {
        let bCheck = false
        checkList.forEach(sel => {
          if (sel.VVID || sel.VV_ID) {
            if ((item.VVID||item.VV_ID) == (sel.VVID||sel.VV_ID)) {
              bCheck = true
            }              
          }
        });
        this.$refs.vList.toggleRowSelection(item,bCheck);
      });
    },
    clearSelectionRow(row){
    },
    unique(arr) {
        const res = new Map();
        return arr.filter((a) => !res.has(a.VVID||a.VV_ID) && res.set(a.VVID||a.VV_ID, a))
    },
    onSubmitSelVisitor(){
      let selectionList = this.$refs.vList.selection||[];
      let lenold = selectionList.length
      selectionList = this.unique(selectionList)
      let lennew = selectionList.length
      if (lenold!==lennew) {
        console.log(lenold,' ',lennew)
      }
      this.$store.state.sync_xs_selVisitorList = selectionList.slice(0)
      this.$router.goBack();
    },
    getVisitorList(search,page,index){
      let self = this
      var vlist = []
      if (search) {
        self.visitorListFull.forEach(data => {
          var filter1 = (data.Vname.toLowerCase().includes(search.toLowerCase()))||
                        ((data.Vunit||'').toLowerCase().includes(search.toLowerCase()))||
                        ((data.Vphone||'').includes(search))
          
          if (filter1) {
            vlist.push(data)
          }     
        });
        self.visitorList = JSON.parse(JSON.stringify(vlist))
      }
      else if (search == '') {
        self.visitorList = self.visitorListFull
        vlist = self.visitorList
        //vlist = JSON.parse(JSON.stringify(self.visitorListFull))
      }
      else{
        vlist = self.visitorList
        //vlist = JSON.parse(JSON.stringify(self.visitorList))
      }
      page = page || this.vListCurrentPage
      index = index || this.vListPageSize
      if (vlist.length< (page-1)*index) {
        page = 1
      }
      
      this.vListTable = vlist.slice((page-1)*index,page*index)
    },
    onSubmit(formName){
      let self = this
      this.$refs[formName].validate(function(valid){
        if (valid) {
          if (self.py_config.custom === 'UNNC') {
            if (self.vForm.Vphone === '' && self.vForm.Vemail === '' ) {
              self.showTips = true
              return
            }
          }
          let reqData = self.initFormData(self.vForm,self.editInfo || {})
          reqData['Vtype'] = self.queryVListByEHID.Vtype
          s_VUpdate(reqData).then(response=>{
            if (response.error == 0 && response.VV_ID) {
              if (reqData['VVID']) {
                self.sync_updateSelVList(reqData,'update')
              }
              if (response.createnew) {
                reqData['VVID'] = response.VV_ID
                self.selVArray.push(reqData)
              }
              if (reqData.Vcountrycode) {
                self.$store.dispatch("setLastCountryCode",reqData.Vcountrycode); 
              }
            }
            self.detailsDrawerVisible = false
            self.initData(self.queryVListByEHID)
          }).catch(error=>{
            console.log(error)
            self.$message({
              type: 'error',
              message: self.$t('erGeneral')
            })            
          })
        }
      })
    },
    vlistPageChange(val){
      let self = this
      self.vListCurrentPage = val
      self.getVisitorList(null,val,null)
      // this.$nextTick(()=>{
      //   this.initCheck()
      // })
    },
    getRowVVID(row){
      return String(row.VV_ID||row.VVID||0)
    },
    visitorInfo(event,index, row){
      let self = this
      event.stopPropagation();
      this.showVisitorInfo = row
      this.visitorInfoVisible = true
    },
    vlistDelete(row){
      let self = this
      const VVID = row.VV_ID||row.VVID
      let reqData = {
        'visitor':[{'VV_ID':VVID}]
      }
      s_VDelete(reqData).then(response=>{
        if (response.error == 0 ) {
          self.sync_updateSelVList({'VVID':VVID},'delete')
          self.initData(self.queryVListByEHID)
        }
      }).catch(error=>{
        console.log(error)
        self.$message({
          type: 'error',
          message: self.$t('erGeneral')
        })            
      })
    },
    onClickDelete(event, row){
      event.stopPropagation();
    },
    vlistRowClick(row, column, event){
      if (row.Vinblack && this.rights.Vinblack) {
        this.$refs.vList.toggleRowSelection(row,false);
      }
      else{
        this.$refs.vList.toggleRowSelection(row);
      }
    },
    vListSelectionChange(val) {
      let self = this
      self.selVArray = val;
    },
    vListSelect(selection, row){
      row.bCheck = selection
    },
    phonecode(value){
      if (!value) {return ''}
      let _str = String(value)
      let _return = _str
      if (_str.length>=12) {_return = _str.replace(/^(\d{6})\d+(\d{4})/,"$1********$2") }
      else if (_str.length==11) {_return = _str.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2") }
      else if (_str.length>=6){_return =_str.replace(/^(\d{2})\d{2}(\d+)/,"$1****$2") }  
      return _return
    },
    showPhone(ccode,phone){
      phone = this.phonecode(phone)
      if (ccode) {
        return '+'+ccode+' '+phone
      }
      return phone
    },
    cancelForm(){
      this.vForm = JSON.parse(JSON.stringify( this.initFormData(this.editInfo)))
    },
    initFormData(data,submitData=null){
      if (!data) {
        data = {}
        if (this.lastCountryCode) {
          data['Vcountrycode'] = this.lastCountryCode
        }
      }
      var forminfo =  submitData || {}
      for (var key in this.config)
      {
        if(key.substr(0, 1) === "V"){
          if (this.config[key]['E']) {
            forminfo[key] = data[key]||''
            if (key == 'Vidtype') {
              forminfo[key] = String(data[key]||0)
            }
            else if (key == 'Vcountrycode') {
              forminfo[key] = data[key]||this.lastCountryCode||'86'
            }
            else if (key == 'Vnation') {
              forminfo[key] = data[key]||'CHN'
            }
            else{
              forminfo[key] = data[key]||''
            }
          }
        }
      }
      forminfo['highRegions'] = ''
      forminfo['otherRegions'] = ''
      return forminfo
    },
    setDrawInfo(data){
      this.showTips = false
      this.fileList = []
      var drawinfo = this.initFormData(data)
      this.editInfo = data
      this.vForm = JSON.parse(JSON.stringify(drawinfo))
    },
    vlistEdit(event,index, row){
      let self = this
      this.vInfoType = 'EditUserInfo'
      if (row.Vphone && row.Vcountrycode ) {
        this.enableChangVphone = false
      }
      else{
        this.enableChangVphone = true
      }
      event.stopPropagation();
      this.setDrawInfo(row)
      this.detailsDrawerVisible = true
      this.changeIDVaild(row.Vidtype,false)
      this.$nextTick(()=>{
        this.$refs['vForm'].clearValidate() 
      }) 
    },
    onAddNewVisitor(){
      this.vInfoType = 'newVisitor'
      this.enableChangVphone = true
      this.setDrawInfo(null)
      this.detailsDrawerVisible = true
      this.changeIDVaild(0,false)
      this.$nextTick(()=>{
        this.$refs['vForm'].clearValidate() 
      }) 
    },
    numberCheck(key1,key2){
      if (key2) {this[key1][key2]=this[key1][key2].replace(/[^0-9]+/,'')}
      else{this[key1]=this[key1][key2].replace(/[^0-9]+/,'')}
    },
  }
}
</script>
<style lang="scss">
.list-table .table-row-black
{
  background-color: #e5e5e5 !important;
}
.clrWhite
{
  color: white;
}
.submitbtn
{
    width: 90%;
    max-width: 350px;
    font-size: 1rem;
}
.username
{
  text-align: left;
}
.tablebtn{
  height: 20px;
  width: 21px;
  text-align: center;
  padding: 3px;
  margin: 0 2px;
}

.vinfo-drawer
{
  width: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
  .form-regions
  {
    color: $form-icon;
    font-size: 1rem;
  }
}
.tips
{
  text-align: left;
  font-size: 14px;
  margin-bottom: 15px;
  .yes{color: red;}
  .no{color: $user-value;}
}
.errortip
{
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: right;
}
.vinfo-drawer__content
{
  padding: 0 20px;
}
.vinfo-drawer__footer
{
  margin-top: 20px;
  border-top: 1px solid $line;
  padding-top: 20px;
}
.vlist
{
  overflow-x: hidden;
  padding-bottom:20px;
  .bottom-btn-bk
  {
    margin-top:20px
  }
  .btn-add
  {
    margin-right: 10px;
  }
  .header-search
  {
    padding:10px 5px;
  }
}
.home-form-row
{
  .form-icon{
    font-size: 1.6rem;
    text-align: left;
    color: $form-icon;
  }
  .redstart{
    color: red;
    padding-right: 5px;
    padding-left: 5px
  }
}
.table-unit
{
  font-size: 12px;
  color: $form-icon;
}
.risk-regions
{
  margin-top: 20px;
  border-top: 1px solid $line;
  padding-top: 20px; 
  color: $spanclr;
  .upload
  {
    padding-top: 10px;
  }
}
.bannerBg{
  height: 100%;
  width: auto;
  opacity: 0.1;
  z-index: 1;
  position: absolute;
  // left: 170px;
  right:0;
  top:15px;
  overflow-x: hidden;
  overflow-Y: hidden;
}
</style>