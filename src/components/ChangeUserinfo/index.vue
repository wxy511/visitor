<template>
    <el-dialog 
      top="10vh" 
      :title="$t('user.title')" 
      :append-to-body="true" 
      :visible.sync="dlgVisible" 
      width="50%"
      :close-on-click-modal="false" >
      <div align="center">
      <div class="info_div" v-if="userType === 'e' ">
        <el-form 
          :model="eForm" 
          :rules="eRules" 
          validate-on-rule-change
          ref="eForm" size="small" label-position="left" label-width="0px"
        >
          <div class="home-form-row">
            <div class="home-form-col">
              <el-row>
                <el-col :span="2" class="form-icon"><i class="el-icon-user"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Ename">
                    <el-input v-model="eForm.Ename" :placeholder="$t('RegInfo.Ename')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Eemail && config.Eemail.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-message"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Eemail">
                    <el-input v-model="eForm.Eemail" :placeholder="$t('RegInfo.Eemail')" readonly></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Eemail && config.Eemail.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Ephone && config.Ephone.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-mobile-phone"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Ephone">
                    <el-input 
                      :placeholder="$t('RegInfo.Ephone')" 
                      v-model="eForm.Ephone" 
                      ref="Ephone" 
                      class="inputBtn" 
                      maxlength='11'  
                      v-on:input="numberCheck('eForm','Ephone')" 
                      >     
                      <el-select v-model="vForm.Vcountrycode" slot="prepend" class="ccode-select" >
                        <country-code />
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Ephone && config.Ephone.R"><span class="redstart">*</span></el-col>
              </el-row> 
              <el-row v-if="config.Edept && config.Edept.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-house"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Edept">
                    <el-input v-model="eForm.Edept" :placeholder="$t('RegInfo.Edept')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Edept && config.Edept.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Edivision && config.Edivision.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-map-location"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Edivision">
                    <el-input v-model="eForm.Edivision" :placeholder="$t('RegInfo.Edivision')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Edivision && config.Edivision.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row >
                <el-col :span="12" class="form-icon">&nbsp; </el-col>
                <el-col :span="11">
                  <el-button type="primary" @click="onSubmit_E('eForm')" :loading="loading" class="fullWidth">{{ $t('submit') }}</el-button>               
                </el-col>
                <el-col :span="1" class="paddingleft" >&nbsp; </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>

      <div class="info_div" v-if="userType === 'v' ">
        <el-form 
          :model="vForm" 
          :rules="vRules" 
          validate-on-rule-change
          ref="vForm" size="small" label-position="left" label-width="0px"
        >
          <div class="home-form-row">
            <div class="home-form-col">
              <el-row>
                <el-col :span="2" class="form-icon"><i class="el-icon-user"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vname">
                    <el-input v-model="vForm.Vname" :placeholder="$t('RegInfo.Vname')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vphone && config.Vphone.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-mobile-phone"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vphone">
                    <el-input 
                      :placeholder="$t('RegInfo.Vphone')" 
                      v-model="vForm.Vphone" 
                      ref="Vphone" 
                      class="inputBtn" 
                      maxlength='11'
                      readonly
                      v-on:input="numberCheck('vForm','Vphone')" >     
                      <el-select v-model="vForm.Vcountrycode" slot="prepend" class="ccode-select" disabled>
                        <country-code />
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vphone && config.Vphone.R"><span class="redstart">*</span></el-col>
              </el-row> 
              <el-row v-if="config.Vemail && config.Vemail.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-message"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vemail">
                    <el-input v-model="vForm.Vemail" :placeholder="$t('RegInfo.Vemail')"></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vemail && config.Vemail.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vunit && config.Vunit.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-office-building"></i></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vunit">
                    <el-input v-model="vForm.Vunit" :placeholder="$t('RegInfo.Vunit')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vunit && config.Vunit.R"><span class="redstart">*</span></el-col>
              </el-row>

              <el-row v-if="config.Vnation && config.Vnation.E">
                <el-col :span="2" class="form-icon"><svg-icon class-name="international-icon" icon-class="icd-earth" /></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vnation">
                    <el-select v-model="vForm.Vnation" class="fullWidth" filterable :disabled="config.Vid.R && vForm.Vid!=''">
                      <nation-list />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vnation && config.Vnation.R"><span class="redstart">*</span></el-col>
              </el-row>

              <el-row v-if="config.Vid && config.Vid.E">
                <el-col :span="2" class="form-icon"><i class="el-icon-postcard"></i></el-col>
                <el-col :span="7">
                <el-form-item prop="Vidtype">
                  <el-select v-model="vForm.Vidtype" class="fullwidth" @change="onIDTypeChange">
                    <document-id></document-id>
                  </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="1" class="form-icon">&nbsp;</el-col>
                <el-col :span="13">
                  <el-form-item prop="Vid">
                    <el-input v-model="vForm.Vid" :placeholder="$t('RegInfo.Vid')" ref="Vid" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft" v-if="config.Vid && config.Vid.R"><span class="redstart">*</span></el-col>
              </el-row>
              <el-row v-if="config.Vplate && config.Vplate.E">
                <el-col :span="2" class="form-icon"> <svg-icon icon-class="drive"></svg-icon> </el-col>
                <el-col :span="21">
                  <el-form-item prop="Vplate">
                    <el-input v-model="vForm.Vplate" :placeholder="$t('RegInfo.Vplate')" ></el-input>
                  </el-form-item>                      
                </el-col>
                <el-col :span="1" class="paddingleft"></el-col>
              </el-row>
              <el-row >
                <el-col :span="12" class="form-icon">&nbsp; </el-col>
                <el-col :span="11">
                  <el-button type="primary" @click="onSubmit_V('vForm')" :loading="loading" class="fullWidth">{{ $t('submit') }}</el-button>              
                </el-col>
                <el-col :span="1" class="paddingleft" >&nbsp; </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
      </div>
    </el-dialog>
</template>
<script>

import {gRule} from '@/utils/validateRules.js'
import { mapState,mapGetters,mapActions } from 'vuex'
import CountryCode from '@/components/CountryCode'
import NationList from '@/components/NationList'
import DocumentId from '@/components/DocumentID'

import { 
    s_VUpdate,
    s_EUpdate,
} from '@/api/api.js'

export default {
  name: 'ChangeUserinfo',
  components:{CountryCode,NationList,DocumentId},
  data(){
    return {
      dlgVisible:false,
      loading:false,
      eForm:{Ename:'',Eemail:'',Ephone:'',Ecountrycode:'',Ephone:'',Edept:'',Edivision:''},
      eRules: {
        Ename:  gRule({'configKey':'Ename'}),
        Ephone: gRule({'configKey':'Ephone'}),
        Eemail: gRule({'configKey':'Eemail','valid':'Email'}),
        Edept:  gRule({'configKey':'Edept'}),
        Edivision:  gRule({'configKey':'Edivision'}),   
      },
      vForm: {
        Vname: '', 
        Vcountrycode:'86', 
        Vphone:'', 
        Vemail:'',
        Vidtype:'0',
        Vid:'',
        Vunit:'',
        Vplate:'',
        Vnation:''
      },
      vRules: {
        Vname:  gRule({'configKey':'Vname'}),
        Vphone: gRule({'configKey':'Vphone'}),
        Vemail: gRule({'configKey':'Vemail','valid':'Email'}),
        Vid:    gRule({'configKey':'Vid','valid':'IdCard'}),
        Vunit:  gRule({'configKey':'Vunit'}),    
      },
    }
  },
  computed: {
    ...mapState(['mainclr','config','stateTableCellStyle','userType']),
    ...mapGetters(['countrycodeList','language','userInfo']),
  },
  methods: {
    ...mapActions([
        'getUserInfo',
    ]),
    numberCheck(key1,key2){
      if (key2) {this[key1][key2]=this[key1][key2].replace(/[^0-9]+/,'')}
      else{this[key1]=this[key1][key2].replace(/[^0-9]+/,'')}
    },
    initData(){
      this.dlgVisible = true
      if (this.userType === 'e') {
        this.eForm = {
          Ename:this.userInfo.Ename||'',
          Eemail:this.userInfo.Eemail||'',
          Ephone:this.userInfo.Ephone||'',
          Ecountrycode:this.userInfo.Ecountrycode||'',
          Ephone:this.userInfo.Ephone||'',
          Edept:this.userInfo.Edept||'',
          Edivision:this.userInfo.Edivision||''
        }        
      }
      else{
        this.vForm = {
          Vname:this.userInfo.Vname|| '', 
          Vcountrycode:this.userInfo.Vcountrycode||'86', 
          Vphone:this.userInfo.Vphone||'', 
          Vemail:this.userInfo.Vemail||'',
          Vidtype:String(this.userInfo.Vidtype||'0'),
          Vid:this.userInfo.Vid||'',
          Vunit:this.userInfo.Vunit||'',
          Vplate:this.userInfo.Vplate||'',
          Vnation:this.userInfo.Vnation||'',
        }
        if (this.userInfo.Vidtype) {
          this.changeIDVaild(this.userInfo.Vidtype)
        } 
      }
    },
    onSubmit_E(formName){
      let self = this
      this.$refs[formName].validate(function(valid){
        if (valid) {
          var reqData = {
            modifyprofile :1,
            EHID:self.userInfo.EHID,
            Ename:self.eForm.Ename
          }
          if (self.config.Ephone) {
            reqData['Ephone'] = self.eForm.Ephone
            reqData['Ecountrycode'] = self.eForm.Ecountrycode
          }
          if (self.config.Edept) {
            reqData['Edept'] = self.eForm.Edept
          }
          if (self.config.Edivision) {
            reqData['Edivision'] = self.eForm.Edivision
          }
          s_EUpdate(reqData).then(response=>{
            self.$message({
              message: self.$t('user.changeSuccess'),
              type: 'success'
            });
            self.getUserInfo();
            self.$emit('onModify', reqData.Ename)
            self.dlgVisible = false
          }).catch(error=>{          
          })
        }
      })
    },
    onSubmit_V(formName){
      let self = this
      this.$refs[formName].validate(function(valid){
        if (valid) {
          var reqData = {
            VVID:self.userInfo.VVID,
            Vname:self.vForm.Vname
          }
          if (self.config.Vemail && self.config.Vemail.E) {
            reqData['Vemail'] = self.vForm.Vemail
          }
          if (self.config.Vplate && self.config.Vplate.E) {
            reqData['Vplate'] = self.vForm.Vplate
          } 
          if (self.config.Vid && self.config.Vid.E) {
            reqData['Vid'] = self.vForm.Vid
            reqData['Vidtype'] = parseInt(self.vForm.Vidtype || 0)
          } 
          if (self.config.Vnation && self.config.Vnation.E) {
            reqData['Vnation'] = self.vForm.Vnation
          } 
          s_VUpdate(reqData).then(response=>{
            self.$message({
              message: self.$t('user.changeSuccess'),
              type: 'success'
            });
            self.getUserInfo();
            self.$emit('onModify', reqData.Vname)
            self.dlgVisible = false
          }).catch(error=>{          
          })
        }
      })      
    },
    changeIDVaild(idtype){
      this.$nextTick(()=>{
        if (idtype==='0' || idtype===0) {
          this.vRules.Vid = gRule({'configKey':'Vid','valid':'IdCard'})
        }
        else
          this.vRules.Vid = gRule({})
      })
      // if (this.$refs.vForm) {
      //  this.$refs.vForm.validateField('Vid') 
      // }
    },
    onIDTypeChange(val){
      this.changeIDVaild(val)
    },
  }
}
</script>
<style lang="scss" scoped>
.edit-Form
{
  max-width: 900px;
  width: 50%;
  align-items: center;
}

.submitbtn
{
  min-width: 250px;
  float: right;
}
.username
{
  text-align: left;
}

.info_div
{
  padding:0 20px 20px 20px;
  max-width: 800px;
  .bottom-btn-bk
  {
    margin-top:20px
  }
  .btn-add
  {
    margin-right: 10px;
  }
}
.home-form-row
{
  .form-icon{
    font-size: 1.8rem;
    text-align: left;
    color: $form-icon;
  }
  .redstart{
    color: red;
    padding-right: 5px;
    padding-left: 5px
  }
}
</style>