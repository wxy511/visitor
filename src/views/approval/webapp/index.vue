<template>
  <apppage-layout 
    :title="$t('Records.title.'+type)" 
    page="approvalGroup" 
    customClass="record-content"
    @onClickRight="onClickRight">
    <el-backtop slot="backtop" target=".record-infinite-scroll"></el-backtop>
    <div slot="body" class="record-infinite-scroll" style="overflow:auto" :loading="bodyloading">
      <el-row  class="rinfo__header record-pending">
        <el-col :span="8" class="left r_border-left">
          <span style="padding-left:0px;float:left" class="r_text">{{ $t('Records.status.pending')}}</span>
        </el-col>
        <el-col :span="16" class="right table-operate">
          <confirm-popover
            type="reject" 
            placement="bottom" 
            :context="queryReqData" 
            @onConfirm="onConfirm"> 
            <div slot="title">{{$t('approval.tips.rejectAll')}} </div>
            <div slot="content" class="approvalPass">
              <span >
                {{$t('approval.tips.rejectConfirm' ,{ num:visitor} )}}
              </span>
            </div>
            <template slot="reference">
              <el-button size="mini" class="reject fullWidth">
                <!-- <i class="el-icon-s-check"></i> -->
                <svg-icon icon-class='Reject'></svg-icon>
                <span class="text"> {{$t('approval.tips.rejectAll')}} </span>
              </el-button>                      
            </template>                
          </confirm-popover>

          <confirm-popover
            type="pass" 
            placement="bottom" 
            :context="queryReqData" 
            @onConfirm="onConfirm"> 
            <div slot="title">{{$t('approval.tips.passAll')}} </div>
            <div slot="content" class="approvalPass">
              <span >
                {{$t('approval.tips.passConfirm' ,{ num:visitor} )}}
              </span>
            </div>
            <template slot="reference">
              <el-button size="mini" class="pass fullWidth" >
                <!-- <i class="el-icon-s-check"></i> -->
                <svg-icon icon-class='approve'></svg-icon>
                <span class="text"> {{$t('approval.tips.passAll')}} </span>
              </el-button>
            </template>                
          </confirm-popover>        
        </el-col>
      </el-row>
      <div>
        <record-card 
          :type="type" 
          v-for="(data,index) in recordList" 
          :key="index" 
          :data="data"
        >
        </record-card>
      </div>
      <p v-if="loading"> <i class="el-icon-loading"></i></p>
      <p v-if="noMore && !loading" class="nodata">
        <span v-show="recordList.length">
          {{$t('Records.noMore')}}
        </span>
        <span v-show="!recordList.length">
          {{$t('NoData')}}
        </span>
      </p>
    </div>  
  </apppage-layout>
</template>

<script>

import { mapState,mapGetters } from 'vuex'
import RecordCard from '@/components/RecordCard'
import { s_RPendingPass,s_RPendingReject,s_RPendingQuery  } from '@/api/api.js'
import { date_format } from '@/utils/GlobalFunction'
import ApppageLayout from '@/components/ApppageLayout'
import ConfirmPopover from '@/components/ConfirmPopover'

export default {
  bane:'approval',
  components:{
    RecordCard,
    ApppageLayout,
    ConfirmPopover
  },
  data () {
    return {
      type:'approvalGroup',
      loading:false,
      recordList:[],
      noMore:false,

      queryReqData:null,
      queryReqData_load:null,
      totalcount:0,
      pageindex:1,
      pagesize:10,

      visitor:'',
      bodyloading:false
    }
  },
  watch: {
    "$route"(to, from){
      if (to.name == 'approval') {
        this.initData()           
      }
    }
  },
  computed:{
    ...mapState(['config','userType']),
    ...mapGetters(['language','showBranch','userInfo']),
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted() {
  },
  created() {
    this.initData()
  },
  methods:{
    initData(){
      this.recordList = []
      this.pageindex = 1
      
      const query = this.$route.query || {}
      if (!query.id) {
        this.$router.push({name:'home'})
        return
      }
      this.visitor = query.visitor
      this.queryReqData = {
        'LeaderID':parseInt(query.id)
      }
      this.queryReqData_load = this.queryReqData
      this.loading = true
      setTimeout(() => {
        this.queryData(this.queryReqData || null)
      }, 500)
    },
    queryData(reqData){
      if (!reqData) {
        if (!this.queryReqData_load) {
          return
        }
        reqData = this.queryReqData_load
      }
      reqData['pageindex'] = this.pageindex++
      reqData['pagesize'] = this.pagesize
      let self = this
      s_RPendingQuery(reqData).then(function (response) {   
        if (!response.reg) {
          response.reg = []
        }
        self.recordList = self.recordList.concat(response.reg)
        self.totalcount = response.totalcount||0
        self.loading = false
        self.noMore = (response.reg.length < reqData['pagesize'])
      })
      .catch(function (error) { 
        self.loading = false    
      });
    },
    load(){
      this.loading = true
      setTimeout(() => {
        this.queryData(null)
      }, 1000)
    },
    onClickLeft () {
      if (!this.$route.query) {
        this.$router.push({'name':'user'})
      }
      else{
        this.$router.goBack();
      }
    },
    onClickRight(){

    },
    onConfirm(data,index,type){
      this.GroupApprove(data.id,type)
    },
    async GroupApprove(leaderID,type){
      var self = this
      self.bodyloading = true
      for (let index = 0; index < this.recordsList.length; index++) {
        const item = this.recordsList[index];
        if (item['approved'] == 100) {
          await self.recordApprove(item,type,false)
        }          
      } 
      self.initData()
      self.bodyloading = false
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
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
.record-infinite-scroll
{
  margin-top:2.5rem;
  padding:0 5px;
  height:calc(100vh - 3rem)
}
.query-drawer
{
  // width: 90%;
  // min-width: 300px;
  width:300px
}
.vinfo-drawer__content
{
  width: 100%;
  padding: 10px;
  margin-top:-10px;
  border-top: 1px solid $line;
  .label
  {
    margin-bottom: 5px;
    font-size: 14px;
    color: $form-icon;
    padding: 5px 0;
  }
}
.vinfo-drawer__footer
{
  margin-top:20px
}
.empty
{
  padding: 30px 0;
}
.nodata
{
  font-size: 14px;
  color: #494949;
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

.table-operate
{
  padding-top:6px;
  height: 40px;
  right:0;
  background-color: #FFF;
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
