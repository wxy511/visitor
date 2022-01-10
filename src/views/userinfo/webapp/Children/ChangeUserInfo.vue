<template>
  <apppage-layout 
    :title="$t('user.changeUserInfo.'+type)" 
    page="ChangeUserInfo" 
    customClass="changeinfo"
  >
    <div slot="body">
      <div class="icd-card">
        <div class="form">
          <el-form :model="theForm" :rules="theRules" ref="theForm" label-position="top" label-width="0px">
            <el-row v-if="type==='Ename'">
              <el-form-item prop="Ename">
                <el-input :placeholder="$t('user.tips.name')" v-model="theForm.Ename" clearable  maxlength="32" class="fullwidth"> </el-input> 
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Ephone'">
              <el-form-item prop="Ephone">
                <el-input :placeholder="$t('user.tips.phone')"  v-model="theForm.Ephone" 
                  ref="Ephone"  class="inputBtn"  maxlength='11'  v-on:input="numberCheck('theForm','Ephone')" 
                  >     
                  <el-select v-model="theForm.Ecountrycode" slot="prepend" class="ccode-select">
                    <country-code />
                  </el-select>
                </el-input>
              </el-form-item>
            </el-row>
            <el-row v-if="type==='Edept'">
              <el-form-item prop="Edept">
                <el-input :placeholder="$t('user.tips.Edept')" v-model="theForm.Edept" clearable  maxlength="32" class="fullwidth"> </el-input> 
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Edivision'">
              <el-form-item prop="Edivision">
                <el-input :placeholder="$t('user.tips.Edivision')" v-model="theForm.Edivision" clearable  maxlength="32" class="fullwidth"> </el-input> 
              </el-form-item> 
            </el-row>            
            <!-- Visitor Info -->
            <el-row v-if="type==='Vname'">
              <el-form-item prop="Vname">
                <el-input :placeholder="$t('user.tips.name')" v-model="theForm.Vname" clearable  maxlength="32" class="fullwidth"> </el-input> 
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Vphone'">
              <el-form-item prop="Vphone">
                <el-input 
                  :placeholder="$t('user.tips.phone')"  v-model="theForm.Vphone" 
                  ref="Vphone"  class="inputBtn"  maxlength='11'   v-on:input="numberCheck('theForm','Vphone')" 
                  >     
                  <el-select v-model="theForm.Vcountrycode" slot="prepend" class="ccode-select">
                    <country-code />
                  </el-select>
                </el-input>
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Vemail'">
              <el-form-item prop="Vemail">
                <el-input :placeholder="$t('user.tips.email')" v-model="theForm.Vemail" clearable  maxlength="64" class="fullwidth"> </el-input> 
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Vunit'">
              <el-form-item prop="Vunit">
                <el-input :placeholder="$t('user.tips.unit')" v-model="theForm.Vunit" clearable  maxlength="64" class="fullwidth"> </el-input> 
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Vnation'">
              <el-form-item prop="Vnation">
                <el-select v-model="theForm.Vnation" style="width:100%" filterable popper-class="popper-nation">
                  <nation-list />
                </el-select>
              </el-form-item> 
            </el-row>
            <el-row v-if="type==='Vid'">
              <el-col :span="8">
                <el-form-item prop="Vidtype">
                  <el-select v-model="theForm.Vidtype" class="fullwidth" @change="onIDTypeChange">
                    <document-id></document-id>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="form-icon">&nbsp;</el-col>
              <el-col :span="15">
                <el-form-item prop="Vid">
                  <el-input v-model="theForm.Vid" :placeholder="$t('RegInfo.Vid')" ref="Vid" clearable  maxlength="18" class="fullwidth"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="type==='Vplate'">
              <el-form-item prop="Vplate">
                <el-input v-model="theForm.Vplate" :placeholder="$t('RegInfo.Vplate')" clearable  maxlength="12" class="fullwidth"></el-input>
              </el-form-item> 
            </el-row>    
            <div class="btn-save">
              <el-button type="primary" class="fullWidth" :loading="loading" round @click="onClickSave">{{$t('Save')}}</el-button>
            </div>
            <div style="height:20px"></div>
          </el-form>    
        </div> 
      
      </div>
    </div>
  </apppage-layout>
</template>
<script type="text/javascript">
import { mapState,mapGetters, mapActions } from 'vuex'
import { gRule } from '@/utils/validateRules.js'
import CountryCode from '@/components/CountryCode'
import DocumentId from '@/components/DocumentID'
import NationList from '@/components/NationList'

import ApppageLayout from '@/components/ApppageLayout'

export default {
  name:'ChangeUserInfo',
  components:{
    CountryCode,
    DocumentId,
    ApppageLayout,
    NationList
  },
  data () {
    return {
      refreshing:false,
      loading:false,
      type:'Ename',
      theForm:{
        'Ename':'',
        'Ephone':'',
        'Ecountrycode':'',
        'Edept':'',
        'Edivision':'',
        'Vname':'',
        'Vphone':'',
        'Vcountrycode':'',
        'Vunit':'',
        'Vemail':'',
        'Vidtype':'0',
        'Vid':'',
        'Vplate':'',
        'Vnation':''
      },
      theRules:{
        Ename:  gRule({required:true}),
        Edept: gRule({'configKey':'Edept'}),
        Edivision: gRule({'configKey':'Edivision'}),

        Vname:  gRule({required:true}),
        Vphone: gRule({'configKey':'Vphone'}),
        Vemail: gRule({'configKey':'Vemail','valid':'Email'}),
        Vid:    gRule({'configKey':'Vid','valid':'IdCard'}),
        Vunit:  gRule({'configKey':'Vunit'}),
        Vplate:  gRule({'configKey':'Vplate'}),
      },
    }
  },
  computed:{
    ...mapState(['userType']),
    ...mapGetters(['language','userInfo']),
  },
  watch: {
    "$route"(to, from){
      // console.log('to.name',to.name,'from.name',from.name)
      if (to.name == "changeUserInfo") {
        const query = this.$route.query
        this.initData(query.type || '');         
      }
    }
  },
  mounted() {
    const query = this.$route.query
    this.initData(query.type || '');
  },
  methods: {
    ...mapActions(['changeUserinfo']),
    initData(type){
      this.loading = false
      this.$refs['theForm'].clearValidate()
      if (type) {
        this.type = type
        this.theForm[type] = this.userInfo[type]
        if (type === 'Ephone') {
          this.theForm['Ecountrycode'] = this.userInfo['Ecountrycode']
        }
        else if(type === 'Vphone') {
          this.theForm['Vcountrycode'] = this.userInfo['Vcountrycode']
        }
        else if(type === 'Vid') {
          this.theForm['Vidtype'] = String(this.userInfo['Vidtype'])
        }
      }
    },
    async onClickSave () {
      let self = this
      this.$refs['theForm'].validate(function(valid){
        if (valid) {
          var changeType = self.type
          let reqData = {}
          reqData[changeType] = self.theForm[changeType]
          if (changeType == 'Ephone') {
            reqData['Ecountrycode'] = self.theForm['Ecountrycode']
          }
          else if (changeType == 'Vphone') {
            reqData['Vcountrycode'] = self.theForm['Vcountrycode']
          }
          else if (changeType == 'Vid') {
            reqData['Vidtype'] = parseInt(self.theForm['Vidtype'])
          }

          if (self.userType === 'v') {
            reqData['VVID'] = self.userInfo.VVID
          }
          else if (self.userType === 'e') {
            reqData['EHID'] = self.userInfo.EHID
          }
          self.changeUserinfo(reqData,changeType)
          self.loading = true
          setTimeout(() => {
            self.$router.goBack()
          }, 1000)          

        } else {
          return false;
        }
      }); 
    },
    numberCheck(key1,key2){
        if (key2) {this[key1][key2]=this[key1][key2].replace(/[^0-9]+/,'')}
        else{this[key1]=this[key1][key2].replace(/[^0-9]+/,'')}
    },
    vantDialogMsg(msg){
      Dialog.alert({
        message: msg,
      }).then(() => {
        // on close
      });
    },
    onIDTypeChange(idtype){
      if (idtype==='0' || idtype===0) {
        this.theRules.Vid = gRule({'configKey':'Vid','valid':'IdCard'})
      }
      else
        this.theRules.Vid = gRule({})
      if (this.$refs.theForm) {
       this.$refs.theForm.validateField('Vid') 
      }
    },
  }
}
</script>

<style scoped lang="scss">

.btn-save
{
  border-top: 1px solid $line;
  padding-top: 20px;
}
.popper-nation
{
  height: calc(100vh - 210px);
}
.form
{
  padding: 20px 10px 0 10px;
  background: #fff;
}
.changeinfo
{
  z-index: 1999;
}
.submit
{
  width: 95%;
  margin: 5px;
}
.submit_div
{
  padding: 20px 0;
}
.sitecontacts
{
  .bar-left{color: $mainclr;}
  .bar-right{color: $mainclr;}
}
.contactList
{
  margin: 10px;
  text-align: left;
}
.tips
{
  text-align: left;
  color: $form-icon;
  padding: 10px;
  font-size: 14px;
}
</style>