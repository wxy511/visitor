<template>
    <el-drawer
      ref="drawerVInfo"
      :title="$t('Records.details.title')" 
      :visible.sync="detailsDrawerVisible" 
      direction="rtl"
      :class=" 'record-'+ data.status"
      :custom-class=" 'rinfo-drawer r_border-left_small'  "
      :modal-append-to-body="true"
      :wrapperClosable="true"
      :append-to-body="true"
      :with-header="false"
    >
      <el-row class="rinfo-drawer__header r_text">
        <el-col :span="( data.status==='invalid' || data.status==='cancel' || data.status==='reject') ?24:12" class="left">
          <span class="r_text">
            <span style="padding-left:0px">{{ data.regcode }}</span>
            <span style="padding-left:10px">
              (
                {{ $t('Records.status.'+data.status)}}
                <span v-show="headerRightShow === 'noApproval' ">,  {{ $t('Records.status.noApproval')}} </span>
                <span v-show="headerRightShow === 'noVisit' ">,  {{ $t('Records.status.noVisit')}} </span>
              )
            </span>
          </span>
        </el-col>
        <el-col :span="12" class="right" v-show="headerRightShow === 'cancel' ">
          <div  class="right" style="margin-top:5px">
            <confirm-popover type="cancelReg" placement="bottom" :width="250" :context="data" @onConfirm="onCancelReg">  
              <div slot="content" class="cancelTip">
                <i class="el-icon-warning" style="color:#E6A23C;font-size: 1.2rem;"></i>
                <span >
                  {{$t('Records.tips.cancelConfirm' ,{ name:data.Vname,date:data.showVdate})}}
                </span>
              </div>            
              <el-button slot="reference" size="mini" type="danger" class="btn" >{{$t('Records.details.cancel')}}</el-button>
            </confirm-popover>
          </div>
        </el-col>
      </el-row>
      <div class="rinfo-drawer__content">
        <el-timeline>
          <el-timeline-item placement="top" hide-timestamp  color="#00c090">
            <span class="title">
              {{ $t('RegInfo.visitInfo') }}
            </span>
            <div class="reg-card">
              <details-item :label="$t('RegInfo.Vbranch')" :icon="'el-icon-place'" :value="showBranch(data.Vbranch)"/>
              <details-item :label="$t('RegInfo.Vdate')" :icon="'el-icon-date'" :value="data.showVdate"/>
              <details-item :label="$t('RegInfo.Vpurpose')" :icon="'el-icon-chat-dot-round'" :value="data.Vpurpose"/>
              <details-item :label="$t('RegInfo.Vplate')" :svg="'drive'" :value="data.Rplate" v-show="data.Rplate"/>
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp :color="mainclr" >
            <span class="title">{{ $t('RegInfo.hostInfo') }}</span>
            <div class="reg-card">
              <details-item :label="$t('RegInfo.Ename')" :icon="'el-icon-user'" :value="data.Ename"/>
              <details-item :label="$t('RegInfo.Eemail')" :icon="'el-icon-message'" :value="data.Eemail"/>
              <details-item 
                v-show="data.Ephone" 
                :label="$t('RegInfo.Ephone')" 
                :icon="'el-icon-mobile-phone'" 
                :value="showPhone(data.Ecountrycode,data.Ephone)"
              />
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp  color="#409eff">
            <div>
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
                icon="el-icon-place" 
                :label="$t('riskRegions.tableLabel')" 
                type="risk"
                :showRiskLevel="rights.riskLevel"
                :recordData="data"
              />
            </div>
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp  :color="mainclr" v-show="data.status==='visited'">
            <span class="title">{{ $t('Records.checkinfo') }}</span>
            <div class="reg-card">
              <details-item :label="$t('Records.status.Rtimein')" :value="data.showRtimein"/>
              <details-item :label="$t('Records.status.Rplacein')" :value="data.Rplacein"/>
              <div v-show="data.showRtimeout">
                <details-item :label="$t('Records.status.Rtimeout')" :value="data.showRtimeout"/>
                <details-item :label="$t('Records.status.Rplaceout')" :value="data.Rplaceout"/>
              </div>
            </div>
          </el-timeline-item>
          <el-timeline-item  placement="top" hide-timestamp  color="#00c090">
            <span class="title">{{ $t('other') }}</span>
            <div class="reg-card">
              <details-item :label="$t('Records.details.applytime')"  :value="data.showApplytime"/>
              <details-item v-show="data.showOpertime" :label="$t('Records.operType.'+data.status)"  :value="data.showOpertime"/>
              <details-item v-show="data.status === 'valid'" :label="$t('QRcode')"  type="qrcode" :value="data.regcode"/>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="rinfo-drawer__footer">
      </div>
    </el-drawer>
</template>
<script>
import DetailsItem from '@/components/DetailsItem/DetailsItem_PC.vue'
import ConfirmPopover from '@/components/ConfirmPopover'
import { mapState,mapGetters,mapActions } from 'vuex'
import { showPhone } from '@/utils/visitor'

export default {
  name: 'RecordDetails',
  components:{
    DetailsItem,
    ConfirmPopover
  },
  props: {
    type:{
      type:String,
      default:'all'
    },
    data:{
      type:Object,
      default:{}
    },
  },
  data(){
    return {
      cancelRegTip:'',
      detailsDrawerVisible:false,
      tableloading:false,
      queryReqData:null,
      recordsList:[],
      totalcount:0,
      pageindex:1,
      drawerInfo:{},
      blackImgSrc:require('@/assets/basic/black.png')
      // headerRightShow:''
    }
  },
  computed: {
    ...mapState(['mainclr','config','TERMINAL','stateTableCellStyle','py_config','rights', 'userType']),
    ...mapGetters(['language','showBranch','getPageSize','riskRegions_map']),
    headerRightShow(){
      if (this.data.status === 'valid') {
        return 'cancel'
      }
      else if (this.data.status === 'invalid') {
        if (this.data.approved == 100) {
          return 'noApproval'
        }
        else if (this.data.approved == 0) {
          return 'noVisit'
        }
      }
    }
  },
  created(){
  },
  methods: {
    ...mapActions([
        'setLastPageSize'
    ]),
    showPhone,
    visible(){
      this.detailsDrawerVisible = true
      // if (this.drawerInfo.status === 'valid') {
      //   this.headerRightShow = 'cancel'
      // }
      // else if (this.drawerInfo.status === 'invalid') {
      //   if (this.drawerInfo.approved == 100) {
      //     this.headerRightShow = 'noApproval'
      //   }
      //   else if (this.drawerInfo.approved == 0) {
      //     this.headerRightShow = 'noVisit'
      //   }
      // }
    },
    UpdateRecord(queryReqData,pageindex=null,pagesize=null){
      queryReqData.pageindex = pageindex || this.pageindex
      queryReqData.pagesize = pagesize || this.getPageSize
      this.tableloading = true
      this.recordsList = []
      this.totalcount = 0
      let self = this
      s_RQuery(queryReqData).then(function (response) {   
        if (!response.reg) {
          response.reg = []
        } 
        var recordsList = []
        response.reg.forEach(item => {
          recordsList.push(recordFormat(item))
        });
        self.recordsList = recordsList
        self.totalcount = response.totalcount||0
        self.pageindex = queryReqData.pageindex
        self.tableloading = false
      })
      .catch(function (error) { 
        self.$message({
          type: 'error',
          showClose: true,
          message: this.$t('erGeneral'),
        });
        self.tableloading = false      
      });      
    },
    errorGeneral(){
      this.$message({
        type: 'error',
        showClose: true,
        message: this.$t('erGeneral'),
      });         
    },
    onCancelReg(data,response){
      this.data.status = 'cancel'
      this.$emit('onCancelReg', data,response)
    },
  }
}
</script>
<style lang="scss">
@import '@/styles/define.scss';
$status-left-width:5px;
$drawer-left-width:3px;
.cancelTip
{
  padding:10px;
  margin-bottom:10px;
  font-size: 15px;
}
.table-class
{
  width: 100%;
  overflow-y: auto;
}

.tablebtn{
  height: 28px;
  width: 30px;
  text-align: center;
  padding: 3px;
  margin: 0 2px;
  font-size: 1rem;
  color: $mainclr;
  border-collapse: $mainclr;
}
.rinfo-drawer
{
  min-width: 500px;
  padding: 15px 10px;
  overflow-y: auto;
}

.rinfo-drawer__content
{
  border-top: 1px solid $line;
  padding: 15px 10px;
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
  .black
  {
    background-color: #eff0f0;
    // background-image: ;
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
.rinfo-drawer__header
{
  font-size: 1.3rem;
  padding-bottom: 15px;
  overflow-y: auto;
  .left{
    float: left;
    height: 40px;
    line-height: 40px;
  }
  .right{
    line-height: 40px;
    .btn{
      float: right;
    }
  }
}
</style>