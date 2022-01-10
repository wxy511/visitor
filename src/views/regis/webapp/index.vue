<template>
  <div class="home-app-background">
    <div class="main-layout">
      <el-form :model="regForm" :rules="regRules" :size="size" ref="regForm" label-position="left" label-width="0px">    
        <el-card class="reg-card" shadow="never">
          <el-row  class="reg-card-header">
            <el-col :span='20' class="card-title">
              <span >{{ $t('RegInfo.visitInfo') }}</span>
            </el-col>
            <el-col :span='4' class="icon-right">                
              <!-- <i class="el-icon-arrow-right"></i> -->
            </el-col>
          </el-row>
          <div class="card-body">
            <el-row>
              <div class="reg-title-left">
                <i class="el-icon-place icon"></i>
              </div>
              <div class="reg-body-right">
                <el-form-item prop="Vbranch">
                  <el-select v-model="regForm.Vbranch" class="fullWidth" :placeholder="$t('RegInfo.placeholder.Vbranch')">
                    <el-option v-for="item in branchList" :value="item.code" :label="item.label" :key="item.code" v-show="!(item.show===0)"> 
                      <span >{{ language=='en'?item.en:item.cn }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>                   
              </div>
            </el-row>
            <el-row>
              <div class="reg-title-left">
                <i class="el-icon-date icon"></i>
              </div>
              <div class="reg-body-right">
                <el-form-item prop="Vdate">
                  <el-row>             
                    <el-col :span="11">
                        <el-date-picker :editable="false" v-model="regForm.startDate" :placeholder="$t('Regis.startDate')" style="width: 100%"
                        value-format="yyyyMMdd" :picker-options="pickerOptions" @change="startdatesel()"  ref="regStartDate" id="regStartDate">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2" class="textcenter"> - </el-col>
                    <el-col :span="11">
                      <el-date-picker :editable="false" v-model="regForm.endDate" :placeholder="$t('Regis.endDate')" style="width: 100%" ref="regEndDate" id="regEndDate"
                        value-format="yyyyMMdd" :picker-options="pickerEndOptions">
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </el-row>
            <div>
              <div class="reg-title-left">
                <i class="el-icon-chat-dot-round icon"></i>
              </div>
              <div class="reg-body-right">
                <el-form-item prop="Vpurpose">
                  <el-select v-model="regForm.Vpurpose" class="fullWidth" :placeholder="$t('RegInfo.placeholder.Vpurpose')">
                    <el-option v-for="item in purposeList" :label="item.label" :value="item.label" :key="item.label"> 
                      {{item.label}}
                    </el-option>
                    <el-option :label="$t('select.other')" value="9999"></el-option>
                  </el-select>
                </el-form-item>                   
              </div>
            </div>
            <div v-if="regForm.Vpurpose === '9999'">
              <div class="reg-title-left">
                <!-- <i class="el-icon-chat-dot-round icon"></i>
                <span class="title">{{ $t('RegInfo.Vpurpose') }}</span> -->
              </div>
              <div class="reg-body-right">
                  <el-form-item prop="otherPurpose">
                    <el-input v-model="regForm.otherPurpose" :placeholder="$t('RegInfo.placeholder.otherPurpose')" clearable maxlength='64'></el-input>
                  </el-form-item>                   
              </div>
            </div>

            <div v-if="userType === 'v'">
              <el-row v-if="py_config.riskRegions">
                <div class="reg-title-left-label">
                  <i class="el-icon-place icon"></i>
                  <span class="title">{{ $t('riskRegions.tableLabel') }}</span>
                </div>
                <div class="reg-body-right-label">
                  <el-form-item prop="riskRegions">
                    <div v-if="!VMyVisitingInfo.riskRegions">                                                 
                      <div class="table-text-btn" @click="onShowRiskRegions('addMe',0,VMyVisitingInfo)">
                        <i class="el-icon-plus"></i>
                      </div>
                    </div>
                    <div v-else>                                            
                      <div class="table-text" @click="onShowRiskRegions('modifyMe',0,VMyVisitingInfo)"> 
                        {{VMyVisitingInfo.riskRegions}}
                      </div>
                      <!-- <span :class="'risk-level-' + VMyVisitingInfo.riskLevel">
                        <span class="r_tag_hiddenLow"> {{$t('riskRegions.level.-'+VMyVisitingInfo.riskLevel)}} </span>
                      </span> -->
                    </div> 
                  </el-form-item>
                </div>
              </el-row>
              <el-row v-if="config.Vplate&&config.Vplate.E">
                <div class="reg-title-left">
                  <svg-icon icon-class="drive" class="icon"></svg-icon>
                  <!-- <span class="title">{{ $t('Regis.drive') }}</span> -->
                </div>
                <div class="reg-body-right">
                  
                  <el-form-item prop="Vplate">
                    <span class="label-title">{{ $t('Regis.drive') }}</span>
                    <el-switch
                      v-model="VMyVisitingInfo.bDrive"
                      active-color="#36a3f7"
                      @change="onChangeDrive($event,VMyVisitingInfo,0,'VMyVisitingPlate')"
                    />
                    <div v-show="VMyVisitingInfo.bDrive" style="display:inline-block;padding-left:15px">
                      <div v-show="!VMyVisitingInfo.Vplate">                         
                        <confirm-popover type="Vplate" trigger="manual" :context="userInfo" :index="0" @onConfirm="VMeAddPlate" ref="VMyVisitingPlate">
                          <div slot="title">{{ $t('Regis.addPlate') }}</div>                           
                          <div slot="reference" class="table-text-btn"><i class="el-icon-plus"></i></div>
                        </confirm-popover>
                      </div>
                      <div v-show="VMyVisitingInfo.Vplate">                         
                        <confirm-popover type="Vplate" trigger="manual" :context="userInfo" :index="0" @onConfirm="VMeModifyPlate" style="display: inline-block;">  
                          <div slot="title" >{{ $t('Regis.modifyPlate') }}</div>                          
                          <div slot="reference" class="table-text" > 
                            <span>{{VMyVisitingInfo.Vplate}}</span>
                          </div>                         
                        </confirm-popover> 
                      </div>
                    </div>                   
                  </el-form-item>
                </div>
              </el-row>
            </div>   
          </div>
        </el-card>

        <el-card class="reg-card" shadow="never" v-if="userType === 'v' || py_config.e_otherHost">
          <el-row  class="reg-card-header">
            <el-col :span='20' class="card-title">
              {{ $t('RegInfo.hostInfo') }}
            </el-col>
            <el-col :span='4' class="icon-right">                
              <!-- <i class="el-icon-arrow-right"></i> -->
            </el-col>
          </el-row>
          <div class="card-body">
            <div>
              <regis-host-info class="Eautocomplete" :size="size" :hostInfo="hostInfo" :type="py_config.hostType"></regis-host-info>
            </div>
          </div>
        </el-card>
        <el-card class="reg-card" shadow="never">
          <el-row  class="reg-card-header">
            <el-col :span='12' class="card-title">
              <span class="title" v-if="userType === 'e'">{{ $t('RegInfo.visitorInfo') }}</span>
              <span class="title" v-else>
                {{ $t('RegInfo.groupVisitor') }}
                <el-switch 
                  v-model="hasEntourage"
                  active-color="#36a3f7"
                  style="margin-left:10px"
                />
              </span>
            </el-col>
            <el-col :span='12' class="card-right">                
              <el-button
                v-if="hasEntourage || userType === 'e'"
                :size="size"
                type="regis" 
                class="btnAdd" 
                @click="showVisitorList_app"> 
                  <i class="el-icon-plus"></i> 
                  {{ $t('Regis.selVisitor') }} 
              </el-button>              
            </el-col>
          </el-row>
          <div class="card-body"  v-if="hasEntourage || userType === 'e'">
            <el-table
              :size="size"
              ref="selVisitorList"
              :data="selVisitorList"
              class="visitor-table"
              :empty-text="$t('Regis.selVEmpty')"
              :cell-style="stateTableCellStyle"
              stripe
              style="overflow-x: auto;"
              header-row-class-name="tableheaderrowclass"
            >
              <el-table-column label=" "  align="center" width="35" fixed="left">
                <div slot-scope="scope">
                  <span @click="vTableDelete_app(scope.$index, scope.row)" style="color: #F56C6C;font-size: 1.2rem" ><i class="el-icon-close"></i></span>
                </div>
              </el-table-column>
              <el-table-column fixed="left" width="130" prop="Vname" align="left" :show-overflow-tooltip="true">
                <template slot="header">
                  <div class="fixed-name-title tableheaderrowclass">
                    <span>{{$t('Regis.app.visitor')}}</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <span class="fixed-name">
                    {{scope.row.Vname}} <span v-show="scope.row.Vunit">( {{scope.row.Vunit}} ) </span>
                  </span>
                </template>
              </el-table-column>

              <template v-if="(config.Vplate && config.Vplate.E) || (py_config.riskRegions)">
                <template v-if="config.Vplate && config.Vplate.E">
                  <el-table-column width="55" :label="$t('Regis.drive')" align="left" :show-overflow-tooltip="false" prop="bDrive">
                    <template slot-scope="scope">
                      <div>
                        <el-switch 
                          v-model="selVisitorList[scope.$index]['bDrive']"
                          :key="scope.$index"
                          size="mini"
                          active-color="#36a3f7"
                          @change="onChangeDrive($event,scope.row,scope.$index,'drive' +  scope.$index)"/>
                      </div>
                    </template>
                  </el-table-column>         
                  <el-table-column :label="$t('RegInfo.Vplate')" prop="Vplate" align="left" :show-overflow-tooltip="false">
                    <template slot-scope="scope">
                      <div v-show="scope.row.bDrive">
                        <div v-show="!scope.row.Vplate">                         
                          <confirm-popover type="Vplate" trigger="manual" :context="scope.row" :index="scope.$index" @onConfirm="vTableAddPlate" :ref=" 'drive' +  scope.$index" >
                            <div slot="title">{{ $t('Regis.addPlate') }}</div>                           
                            <!-- <div slot="reference" class="table-text-btn" ><u>{{ $t('Regis.addVplate') }}</u></div> -->
                            <div slot="reference" class="table-text-btn" ><u><i class="el-icon-plus"></i></u></div>
                          </confirm-popover>
                        </div>
                        <div v-show="scope.row.Vplate">                         
                          <!-- <span style="margin-right: 5px;">{{scope.row.Vplate}}</span> -->
                          <confirm-popover type="Vplate" trigger="manual" :context="scope.row" :index="scope.$index" @onConfirm="vTableModifyPlate" style="display: inline-block;">  
                            <div slot="title" >{{ $t('Regis.modifyPlate') }}</div>                          
                            <div slot="reference" class="table-text" > <span>{{scope.row.Vplate}}</span></div>                            
                          </confirm-popover> 
                          <!-- <div class="table-text-btn" @click="vTableModifyPlate(scope.row)"><u>{{ $t('modify') }}</u></div> -->
                          <!-- <el-button type="text"> <u style="color:#36a3f7;margin-left:5px">{{ $t('modify') }}</u> </el-button> -->
                        </div>
                      </div>
                    </template> 
                  </el-table-column>
                </template>
                <template v-if="py_config.riskRegions">
                  <el-table-column  prop="riskRegions" align="left" width="150" :show-overflow-tooltip="false">
                    <div slot="header">
                      {{$t('riskRegions.tableLabel')}} 
                      <span style="color:red;font-size:18px">*</span>
                    </div>
                    <template slot-scope="scope">
                      <div>
                        <div v-if="!scope.row.riskRegions">                                                 
                          <div class="table-text-btn" @click="onShowRiskRegions('add',scope.$index,scope.row)"><i class="el-icon-plus"></i></div>
                        </div>
                        <div v-else>                                            
                          <div class="table-text" @click="onShowRiskRegions('modify',scope.$index,scope.row)"> {{scope.row.riskRegions}} </div>
                        </div>
                      </div>
                    </template> 
                  </el-table-column>
                </template>             
              </template>
              <template v-else>
                  <el-table-column :label="$t('RegInfo.Vphone')" prop="Vphone" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span>{{showPhone(scope.row.Vcountrycode,scope.row.Vphone)}}</span>
                    </template> 
                  </el-table-column>
              </template>
            </el-table>
          </div>
        </el-card>
      </el-form>
      <div class="form-submit" align="center">
        <el-button type="primary" round class="btn-submit" :disabled="loading" @click="submitRegis('regForm')"> 
          <i v-show="loading" class="el-icon-loading"></i>
          <span>{{ $t('submit') }} </span>
        </el-button>              
      </div>
      <!-- <div style="height:50px"></div> -->
    </div>
    <van-popup 
      v-model="popup_show" 
      round
      closeable
      position="bottom" 
      :style="{ 'height': '80%', 'overflow-y':'hidden','padding-top':'10px' }">
      <div style="margin:5px 0">
        <risk-regions ref="riskRegions" :showLevel="rights.riskLevel" :data='riskRegionsList' @onSel="onRegionsSel" tabClass="tab-pane-app"></risk-regions>
      </div>
    </van-popup> 
    <el-dialog :title="$t('Regis.result')" :visible.sync="dlgResultVisible"  :close-on-click-modal="false" fullscreen>
      <div>
        <submit-result ref="submitResult" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapGetters, mapActions } from 'vuex'
import {data,methods} from '@/views/regis/regis.js'
import ConfirmPopover from '@/components/ConfirmPopover'
import CountryCode from '@/components/CountryCode'
import RegisHostInfo from './../components/RegisHostInfo'
import RiskRegions from '@/components/RiskRegions'
import SubmitResult from './components/SubmitResult'

export default {
  name:'regis',
  components:{
    CountryCode,
    ConfirmPopover,
    RegisHostInfo,
    RiskRegions,
    SubmitResult
  },
  computed:{
    ...mapState(['mainclr','py_config','config','TERMINAL','stateTableCellStyle','userType','rights']),
    ...mapGetters([
      'language',
      'riskRegionsList',
      'branchList',
      'purposeList',
      'countrycodeList',
      'userInfo',
      'lastBranch',
      'sync_xs_selVisitorList'
    ]),
  },
  data:data,
  created(){
    this.vueCreated('app')
  },
  // watch:{
    // "$route"(to, from){
    //   console.log(from.name,to.name )
    //   if (from.name=='user' && to.name == 'add') {
    //     let self = this
    //     var val = this.language
    //     console.log('route-language:',val)
    //     this.purposeList.forEach(item => {
    //       item.label = val === 'en' ? item.en:item.cn
    //       if (self.regForm.Vpurpose!='' && (self.regForm.Vpurpose == item['en'] || self.regForm.Vpurpose == item['cn'])) {
    //         self.regForm.Vpurpose = item['label']
    //       }
    //     });      
    //   }
    // }
  // },
  methods:{
    ...mapActions(['sync_updateSelVList']),
    ...methods
  },
  watch:{
    sync_xs_selVisitorList:function(val) {
      this.onSelVisitors(val||[])
    },
    "$route"(to, from){
      if (from.name=='user' && to.name == 'add') {
        let self = this
        var val = this.language
        this.purposeList.forEach(item => {
          item.label = val === 'en' ? item.en:item.cn
          if (self.regForm.Vpurpose!='' && (self.regForm.Vpurpose == item['en'] || self.regForm.Vpurpose == item['cn'])) {
            self.regForm.Vpurpose = item['label']
          }
        });      
      }
    }
  },
}
</script>


<style lang="scss" scoped>
@import '@/styles/define.scss';
.home-app-background
{
  // background: $mainclr;
  text-align: left;
  width: 100%;
  overflow-x: hidden;
  min-height: 50px;
  .reg-card
  {
    border-radius: 6px;
    background: white;
    margin-bottom: 5px;
    &-header
    {
      border-bottom: 1px solid $line;
      padding-bottom: 10px;
      margin-bottom: 15px;
      .card-title{
        color: $form-icon;
        font-size: 1rem;
      }
      .card-right
      {
        float: right;
        .btnAdd
        {
          float: right;
        }
      }
    }
    .reg-title-left
    {
      width: 40px;
      float:left;
      height: 32px;
      line-height: 32px;
      color:$form-icon;
      .title{
        font-size: 1rem;
        color:$form-icon;
      }
      .icon
      {
        font-size: 1.5rem;
        margin-right:10px
      }
    }
    .reg-body-right{
      margin-left: 40px;
      width: 100%;
      max-width: 900px;
      padding-right: 40px;
    }

    .reg-title-left-label
    {
      width: 100px;
      float:left;
      height: 32px;
      line-height: 32px;
      color:$form-icon;
      .title{
        font-size: 0.9rem;
        color:$form-icon;
      }
      .icon
      {
        font-size: 1.5rem;
        margin-right:10px
      }
    }
    .reg-body-right-label{
      margin-left: 100px;
      width: 100%;
      max-width: 900px;
      padding-right: 100px;
    }
    .label-title{
      font-size: 0.9rem;
      color:$form-icon;
      margin-right: 10px;
    }
  }
}
.form-submit
{
  margin: 30px 0;
  .btn-submit
  {
    width: 90%;
    max-width: 350px;
    font-size: 1rem;
  }
}
.table-text-btn{
  color: rgb(54, 163, 247);
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  border:1px solid rgb(54, 163, 247);
  padding: 3px;
  border-radius: 3px;
}
.table-text
{
  border-bottom:1px solid rgb(54, 163, 247);
  color: rgb(54, 163, 247);
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  line-height: 1;
  padding: 3px;
}
.visitor-table
{
  width: 100%;
  max-width: 900px;
  margin-bottom: 10px;
  max-height: 800px;
  overflow-y: auto;
  .fixed-name
  {
    min-height: 33px;
    line-height: 33px;
  }
}
</style>