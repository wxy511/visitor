<template>
  <apppage-layout 
    :title="$t('Records.details.title')" 
    page="RecordDetails" 
    :customClass=" 'record-content record-' + data.status"
    @onClickRight="onClickRight">
    <div slot="right">
        <span class="bar-right" v-show="data.status === 'valid' ">
        <confirm-popover type="cancelReg" placement="bottom" :width="250" :context="data" @onConfirm="onCancelReg">  
          <div slot="content" class="cancelTip">
            <i class="el-icon-warning" style="color:#E6A23C;font-size: 1.2rem;"></i>
            <span >
              {{$t('Records.tips.cancelConfirm' , { name:data.Vname,date:data.showVdate})}}
            </span>
          </div>            
          <el-button slot="reference" size="mini" type="danger" class="btn" plain>{{$t('Records.details.cancel')}}</el-button>
        </confirm-popover>
        </span> 
    </div>
    <div slot="body" class="record-infinite-scroll" style="overflow-y:auto;overflow-x:hidden">
      <el-row class="rinfo__header  r_border-left" v-if="data.status==='pending'">
        <el-col :span="8" class="left">
          <span>
            <span style="padding-left:0px;float:left" class="r_text">{{ $t('Records.status.'+data.status)}}</span>
          </span>
        </el-col>
        <el-col :span="16" class="right table-operate" v-if="rights['approval'] === undefined || rights['approval'] === true">
          <confirm-popover
            type="reject" 
            placement="bottom" 
            :width="250"
            :context="data" 
            @onConfirm="onConfirm"> 
            <div slot="title">{{$t('approval.tips.reject')}} </div>
            <div slot="content" class="approvalPass">
              <span >
                {{$t('approval.tips.rejectConfirm' ,{ num:data.Vname} )}}
              </span>
            </div>
            <template slot="reference">
              <el-button size="mini" class="reject" >
                <!-- <i class="el-icon-s-check"></i> -->
                <svg-icon icon-class='Reject'></svg-icon>
                <span class="text"> {{$t('approval.tips.reject')}} </span>
              </el-button>                          
            </template>                
          </confirm-popover>
          <confirm-popover
            type="pass" 
            placement="bottom" 
            :width="250"
            :context="data" 
            v-if="!(data.Vinblack && rights.Vinblack)"
            @onConfirm="onConfirm"> 
            <div slot="title">{{$t('approval.tips.pass')}} </div>
            <div slot="content" class="approvalPass">
              <span >
                {{$t('approval.tips.passConfirm' ,{ num:data.Vname} )}}
              </span>
            </div>
            <template slot="reference">
              <el-button size="mini" class="pass" >
                <!-- <i class="el-icon-s-check"></i> -->
                <svg-icon icon-class='approve'></svg-icon>
                <span class="text"> {{$t('approval.tips.pass')}} </span>
              </el-button>
            </template>                
          </confirm-popover>
        </el-col>
      </el-row>
      <el-row class="rinfo__header  r_border-left" v-else>
        <el-col :span="16" class="left">
          <span style="padding-left:0px;float:left">

            <span style="font-size:14px">{{ $t('regcode') + ': '}}</span>
            <span style="font-size:16px">{{ data.regcode }}</span>
          </span>
        </el-col>
        <el-col :span="8" class="right">
          <span style="padding-right:10px;float:right" class="r_text">{{ $t('Records.status.'+data.status)}}</span>
        </el-col>
      </el-row>
      <div class="record-item">
        <el-timeline>
          <el-timeline-item placement="top" hide-timestamp  color="#00c090">
            <span class="title">
              {{ $t('RegInfo.visitInfo') }}  
            </span>
            <div class="reg-card">
              <details-item :label="$t('RegInfo.Vbranch')" :showLabel="showLabel" :icon="'el-icon-place'" :value="showBranch(data.Vbranch)"/>
              <details-item :label="$t('RegInfo.Vdate')" :showLabel="showLabel" :icon="'el-icon-date'" :value="data.showVdate"/>
              <details-item :label="$t('RegInfo.Vpurpose')" :showLabel="showLabel" :icon="'el-icon-chat-dot-round'" :value="data.Vpurpose"/>
              <details-item :label="$t('RegInfo.Vplate')" :showLabel="showLabel" :svg="'drive'" :value="data.Rplate" v-show="data.Rplate"/>
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp :color="mainclr" >
            <span class="title">{{ $t('RegInfo.hostInfo') }}</span>
            <div class="reg-card">
              <details-item :label="$t('RegInfo.Ename')" :showLabel="showLabel" :icon="'el-icon-user'" :value="data.Ename"/>
              <details-item :label="$t('RegInfo.Eemail')" :showLabel="showLabel" :icon="'el-icon-message'" :value="data.Eemail"/>
              <details-item 
                v-show="data.Ephone"
                :showLabel="showLabel"
                :label="$t('RegInfo.Ephone')" 
                :icon="'el-icon-mobile-phone'"
                :value="showPhone(data.Ecountrycode,data.Ephone)"
              />
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp  color="#409eff">
            <span class="title">{{ $t('RegInfo.visitorInfo') }}
              <span v-if="data.Vinblack && rights.Vinblack"><strong> ( {{ $t('Visitor.Vinblack') }} ) </strong>  </span>
            </span>
            <img class="bannerBg" v-if="data.Vinblack && rights.Vinblack" :src="blackImgSrc">
            <div class="reg-card">
              <details-item :label="$t('RegInfo.Vname')" :icon="'el-icon-user'" :value="data.Vname"/>
              <details-item :label="$t('RegInfo.Vunit')" :icon="'el-icon-office-building'" :value="data.Vunit"/>
              <details-item :label="$t('RegInfo.Vphone')" :icon="'el-icon-mobile-phone'" :value="showPhone(data.Vcountrycode,data.Vphone)"/>
              <details-item :label="$t('RegInfo.Vemail')" :icon="'el-icon-message'" :value="data.Vemail"/>
              <details-item v-show="data.Vnation" :label="$t('RegInfo.Vnation')" svg="icd-earth" type="Vnation" :value="data.Vnation"/>
              <details-item v-show="data.Vid" :label="$t('RegInfo.Vid')" icon="el-icon-postcard" type="Vid" :recordData="data"/>                         
              <details-item 
                v-if="py_config.riskRegions" 
                :showLabel="showLabel" 
                icon="el-icon-place" 
                :label="$t('riskRegions.tableLabel')" 
                type="risk"
                :showRiskLevel="rights.riskLevel"
                :recordData="data"/>
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp  :color="mainclr" v-show="data.status==='visited'">
            <span class="title">{{ $t('Records.checkinfo') }}</span>
            <div class="reg-card">
              <details-item :label="$t('Records.status.Rtimein')" :showLabel="true" :value="data.showRtimein"/>
              <details-item :label="$t('Records.status.Rplacein')" :showLabel="true" :value="data.Rplacein"/>
              <div v-show="data.showRtimeout">
                <details-item :label="$t('Records.status.Rtimeout')" :showLabel="true" :value="data.showRtimeout"/>
                <details-item :label="$t('Records.status.Rplaceout')" :showLabel="true" :value="data.Rplaceout"/>
              </div>
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp  color="#00c090">
            <span class="title">{{ $t('other') }}</span>
            <div class="reg-card">
              <details-item :label="$t('Records.details.applytime')" :showLabel="true" :value="data.showApplytime"/>
              <details-item v-show="data.showOpertime" :label="$t('Records.operType.'+data.status)" :showLabel="true"  :value="data.showOpertime"/>
              <details-item v-if="data.status === 'valid'" :label="$t('QRcode')" :showLabel="true"  type="qrcode" :value="data.regcode"/>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </apppage-layout>
</template>
<script>

import { mapState,mapGetters } from 'vuex'
import DetailsItem from '@/components/DetailsItem/DetailsItem_APP.vue'
import ConfirmPopover from '@/components/ConfirmPopover'
import ApppageLayout from '@/components/ApppageLayout'

import { s_RPendingPass , s_RPendingReject ,s_RQuery } from '@/api/api.js'
import { showPhone , recordFormat ,format_riskLevel } from '@/utils/visitor'
export default {
  name:'RecordDetails',
  components:{
    DetailsItem,
    ConfirmPopover,
    ApppageLayout
  },
  data () {
    return {
      loading:false,
      data:{},
      showLabel:false,
      blackImgSrc:require('@/assets/basic/black.png')
    }
  },
  computed:{
    ...mapState(['config','userType','mainclr','py_config','rights']),
    ...mapGetters(['language','showBranch','userInfo','sync_record_details','rights','riskRegions_map']),
  },
  watch: {
    "$route"(to, from){
      if (to.name == 'recordDetails') {
        this.initData()           
      }
    }
  },
  mounted() {
  },
  created() {
    this.initData()
  },
  methods:{
    showPhone,
    initData(){
      const query = this.$route.query || {}
      var reqData = {'regcode':query.regcode,'singleresponse':1}
      if (1) {
        //this.$router.push({name:'home'})
        let self = this
        s_RQuery(reqData).then(function (response) {   
          if (!response.reg) {
            self.$router.push({name:'add'})
          }
          else{
            self.data = recordFormat(response.reg[0])
            self.data = format_riskLevel(self.data,self.riskRegions_map)
          }
        })
        .catch(function (error) { 
          self.$router.push({name:'add'})  
        });        
      }
      else{
        this.data = this.sync_record_details
      }
    },
    onClickLeft(){this.$router.goBack()},
    onClickRight(){},
    onCancelReg(){
      this.data.status = 'cancel'
    },
    async onConfirm(data,index,type){
      if (type == 'pass' || type == 'reject' ) {
        await this.recordApprove(data,type)
        this.initData()
      }
    },
    async recordApprove(data,type,showMsg=true){
      var self = this
      var reqData = {
        regcode:data.regcode
      }
      var response = null
      var msg = null 
      if (type == 'pass') {
        response = await s_RPendingPass(reqData)
        msg = self.$t('approval.tips.passSuccs')  
      }
      else if (type == 'reject') {
        response = await s_RPendingReject(reqData)
        msg = self.$t('approval.tips.rejectSuccs')
      }

      if (response && response.error == 0 && showMsg && msg) {
        self.$message({
          type: 'success',
          message: msg
        })          
      }
    },
  }
}
</script>

<style scoped lang="scss">
$status-left-width:5px;
.bannerBg{
  height: 100%;
  width: auto;
  opacity: 0.1;
  z-index: 1;
  position: absolute;
  right: 0;
  overflow-x: hidden;
  overflow-Y: hidden;
}
.record-item
{
  width: 100%;
  background: #fff;
  border-top: 1px solid $line;
  padding: 15px 10px;
  text-align: left;
  .title{
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-size: 1rem;
    font-weight: lighter;
    color: #08263a;
  }
  .reg-card
  {
    margin:10px 0;
    padding-top:5px;
    padding-left:5px;
    width: 100%;
  }
}
.rinfo__header
{
  font-size: 1rem;
  padding-bottom: 25px 0;
  background: #fff;
  margin-bottom: 5px;
  .left{
    float: left;
    height: 40px;
    line-height: 40px;
  }
  .right{
    line-height: 40px;
    padding-right: 5px;
    float: right;
    .btn{
      margin-top: 5px;
    }
  }
}
.tablebtn{
  height: 28px;
  text-align: center;
  padding: 3px 10px;
  margin-left: 5px;
  font-size: 1rem;
  float: right;
  width: 100px;

  .text
  {
    font-size: 0.8rem;
  }
}

.table-operate
{
  padding-top:6px;
  height: 40px;
  right:0;
  .details
  {
    @extend .tablebtn;
    color: $icon-details;
    border-color: rgba($icon-details, 0.3);
  }
  .pass
  {
    @extend .tablebtn;
    color: white;
    background-color: $record-valid;
    border-color: $record-valid;
  }
  .reject
  {
    @extend .tablebtn;
    color: $record-reject;
    // background-color: $record-reject;
    border-color: $record-reject;
  }
  .reject:focus
  {
    background-color:white
  }
}
</style>
