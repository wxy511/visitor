<template>
  <apppage-layout 
    :title="$t('Records.title.'+type)" 
    page="records" 
    customClass="record-content"
    @onClickRight="onClickRight">
    <!-- <div slot="right">
      <span class="bar-right">
          <i class="el-icon-search"></i>
      </span>      
    </div> -->
    <el-backtop slot="backtop" :target="'.'+scrollClass"></el-backtop>
    <div slot="body" :class="scrollClass" style="overflow-y:auto;overflow-x:hidden">
      <el-button  icon="el-icon-search" circle class="suspensionBtn" @click="onClickRight" key="btn"></el-button>
      <div 
        v-infinite-scroll="load" 
        :infinite-scroll-disabled="loading||noMore"
        infinite-scroll-distance="10"
        >
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

      <el-drawer
        ref="drawerVInfo"
        :title="$t('Records.btnQuery')" 
        :visible.sync="drawerVisible" 
        direction="rtl"
        custom-class="query-drawer"
        size="90%"
        :modal-append-to-body="true"
        :append-to-body="true"
        :withHeader="true"
      >
        <div class="vinfo-drawer__content">
          <p class="label">{{ $t('Records.date') }}</p>
          <el-row>
            <el-col :span="11">
              <el-date-picker
                :editable="false"
                ref="queryDate"
                v-model="query.startDate"
                style="width:100%"
                size="mini"
                value-format="yyyyMMdd"
                :placeholder="$t('Records.startDate')"
                :picker-options="pickerOptions">
              </el-date-picker>            
            </el-col>
            <el-col :span="2" class="textcenter"> - </el-col>
            <el-col :span="11">
              <el-date-picker
                :editable="false"
                ref="queryDate"
                v-model="query.endDate"
                style="width:100%"
                size="mini"
                value-format="yyyyMMdd"
                :placeholder="$t('Records.endDate')"
                :picker-options="pickerOptions">
              </el-date-picker>             
            </el-col>
          </el-row>
          <div v-if="type!='approval'">
            <p class="label">{{ $t('Records.keyword') }}</p>
            <el-row>
              <el-input size="mini" v-model="query.keyword" :placeholder="$t('Records.pldkeyword'+userType)" maxlength="11" clearable></el-input>
            </el-row>
            <p class="label">{{ $t('regcode') }}</p>
            <el-row>
              <el-input size="mini" v-model="query.regcode" maxlength="10" clearable></el-input>
            </el-row>
          </div>
          <div class="vinfo-drawer__footer">
            <el-divider ></el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button @click="cancelForm" class="fullWidth">{{ $t('reset') }}</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" @click="onSubmit('qForm')" :disabled="loading" class="fullWidth">
                  <i v-show="loading" class="el-icon-loading icon"></i>
                  <i v-show="!loading" class="el-icon-search icon" />
                  {{ $t('Records.btnQuery') }}
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-drawer>  
    </div>  
  </apppage-layout>
</template>

<script>

import { mapState,mapGetters } from 'vuex'
import RecordCard from '@/components/RecordCard'
import { s_RQuery,s_RPendingQuery  } from '@/api/api.js'
import { date_format } from '@/utils/GlobalFunction'
import ApppageLayout from '@/components/ApppageLayout'

export default {
  bane:'records',
  components:{
    RecordCard,
    ApppageLayout
  },
  data () {
    return {
      type:'all',
      loading:false,
      recordList:[],
      noMore:false,

      queryReqData:null,
      queryReqData_load:null,
      totalcount:0,
      pageindex:1,
      pagesize:10,
      
      //Search
      drawerVisible:false,
      query:{
        startDate:'',
        endDate:'',
        keyword:'',
        regcode:''
      },
      pickerOptions: {},
      scrollClass:''
    }
  },
  watch: {
    "$route"(to, from){
      if (from.name!='recordDetails' && to.name == 'records') {
        this.initData()           
      }
    }
  },
  computed:{
    ...mapState(['config','userType','embeddedAPP']),
    ...mapGetters(['language','showBranch','userInfo']),
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted() {
  },
  created() {
    this.initData()
    this.scrollClass = this.embeddedAPP?'record-infinite-scroll-embeddedAPP':'record-infinite-scroll'
  },
  methods:{
    initData(){
      this.recordList = []
      this.pageindex = 1
      
      const query = this.$route.query || {}
      this.type = query.type || 'all'
      if (this.type === 'approval') {
        this.pickerOptions = {
          disabledDate:function(time) {
            let _nowdata = parseInt(date_format(new Date(),'yyyyMMdd'))
            let _checkdata = parseInt(date_format(time,'yyyyMMdd'))
            return _checkdata < _nowdata
          } 
        }
        var end = new Date();
        const now = new Date();
        end.setTime(now.getTime() + 3600 * 1000 * 24 * 30);
        this.query.startDate = date_format(now,'yyyyMMdd')
        this.query.endDate = date_format(end,'yyyyMMdd')
      }
      else{
        this.pickerOptions = {}
      }

      this.queryReqData = query
      this.queryReqData_load = query
      this.loading = true
      setTimeout(() => {
        this.queryData(query || null)
      }, 500)
    },
    queryData_approval(reqData){
      reqData['pageindex'] = this.pageindex++
      reqData['pagesize'] = this.pagesize
      reqData['startTime'] = this.query.startDate
      reqData['endTime'] = this.query.endDate
      let self = this
      s_RPendingQuery(reqData).then(function (response) {   
        if (!response.reg) {
          response.reg = []
        }
        self.recordList = self.recordList.concat(response.reg)
        self.totalcount = response.totalcount||0
        self.loading = false
        self.drawerVisible = false
        self.noMore = (response.reg.length < reqData['pagesize'])
      })
      .catch(function (error) { 
        self.loading = false    
      });
    },
    queryData(reqData){
      if (!reqData) {
        if (!this.queryReqData_load) {
          return
        }
        reqData = this.queryReqData_load
      }

      if (this.type === 'approval') {
        return this.queryData_approval(reqData)
      }
      reqData['pageindex'] = this.pageindex++
      reqData['pagesize'] = this.pagesize
      let self = this
      s_RQuery(reqData).then(function (response) {   
        if (!response.reg) {
          response.reg = []
        }
        self.recordList = self.recordList.concat(response.reg)
        self.totalcount = response.totalcount||0
        self.loading = false
        self.drawerVisible = false
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
        this.$router.push({'name':'add'})
      }
      else{
        this.$router.goBack();
      }
    },
    onClickRight(){
      this.drawerVisible = true
    },
    cancelForm(){
      this.query = {
        startDate:'',
        endDate:'',
        keyword:'',
        regcode:''
      }
    },
    onSubmit(){
      this.recordList = []
      this.pageindex = 1
      this.queryReqData_load = JSON.parse(JSON.stringify(this.queryReqData))
      if (this.query.keyword) {
        this.queryReqData_load.keyword = this.query.keyword
        this.queryReqData_load.keywordtype = 1 
      }
      if (this.query.regcode) {
        this.queryReqData_load.regcode = this.query.regcode
      }
      if (this.query.startDate) {
        this.queryReqData_load.starttimeUTC = String(this.query.startDate)
      }
      if (this.query.endDate) {
        this.queryReqData_load.endtimeUTC = String(this.query.endDate)
      }
      this.loading = true
      setTimeout(() => {
        this.queryData(null)
      }, 500)
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
.record-infinite-scroll-embeddedAPP
{
  padding:0 5px;
  height:calc(100vh - 0.5rem)
}
.query-drawer
{
  // width: 90%;
  // min-width: 300px;
  width:300px;
  overflow-y: auto;
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
.suspensionBtn{
  position: fixed;
  top: 5rem;
  right: 0.5rem;
  z-index: 2;
  filter:Alpha(opacity=0.7); 
  -moz-opacity:0.7;
  opacity:0.7;
}
</style>
