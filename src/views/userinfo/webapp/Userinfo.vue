<template>
  <div class="g-gray-background backgrd-gradient">
    <div class="user-info">
      <div style="height:10px"></div>
      <div class="header" @click="onShowUserInfo">
        <div class="left">
          <div v-if="userType === 'e' ">
            <el-row class="title">{{userInfo.Ename}}</el-row>
            <el-row class="subtitle">{{userInfo.Eemail}}</el-row>
          </div>
          <div v-else>
            <el-row class="title">{{userInfo.Vname}}</el-row>
            <!-- <el-row class="subtitle">{{ showPhone(userInfo.Vcountrycode,userInfo.Vphone,true) }}</el-row> -->
            <el-row class="subtitle">{{ userInfo.Vunit }}</el-row>

          </div>
        </div>
        <div class="right"> <i class="el-icon-arrow-right"></i> </div>
      </div>
    </div>
    <div class="record-content">
      <el-row class="record-content-header">
        <el-col :span="12">
          <span class="title"> {{$t('nav.record')}}</span>
        </el-col>
        <el-col :span="12" class="more">
          <el-button type="text" class="btn-more" @click="onShowRecord('all')">{{$t('Records.tabs.all')}}<i class="el-icon-arrow-right"></i></el-button>
        </el-col>
      </el-row>
      <el-row class="record-row">
        <el-col :span="tabSpan" v-for="tab in tabsList" :key="tab.name">
          <div @click="onShowRecord(tab.name)" :class=" 'record-'+ tab.name">
            <!-- <i class="fullWidth el-icon-time icon mainclr"></i> -->
            <svg-icon :icon-class=" 'record-' + tab.name" class="icon fullWidth r_text" /><br>
            <span class="text fullWidth"> {{$t('Records.'+ tab.labelkey)}} </span>
          </div>
        </el-col>
      </el-row>
      &nbsp;
    </div>
    <div class="today-record-content">
      <el-row class="today-record-content-header">
        <el-col :span="18">
          <span class="title"> {{$t('user.todayEvents')}}</span>
        </el-col>
        <el-col :span="6">
          <span class="refresh" @click="refreshToday"> <i class="el-icon-refresh"></i> </span>
        </el-col>
      </el-row>
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
    </div>
  </div>
</template>
<script>
import { mapState , mapGetters } from 'vuex'
import { date_format } from '@/utils/GlobalFunction'
import { showPhone } from '@/utils/visitor.js'
import { s_RQuery  } from '@/api/api.js'
import RecordCard from '@/components/RecordCard'

export default {
  name:'user',
  components:{
    RecordCard,
  },
  mounted() {
  },
  watch: {
    // "$route"(to, from){
    //   if (to.name == 'user') {
    //     this.initData()           
    //   }
    // }
  },
  data () {
    return {
      currIndex:1,
      active:1,
      showLogout:true,
      tabsList:[
        {labelkey:'tabs.valid',name:'valid'},
        {labelkey:'tabs.visited',name:'visited'},
        {labelkey:'tabs.invalid',name:'invalid'},
      ],
      tabSpan:8,

      loading:false,
      recordList:[],
      noMore:false,
      queryReqData:null,
      queryReqData_load:null,
      totalcount:0,
      pageindex:1,
      pagesize:10,
      type:'all'
    }
  },
  computed: {
    ...mapState(['mainclr','config','userType']),
    ...mapGetters(['language','userInfo','rights']),
  },
  created(){
    if (this.rights['approval'] === undefined || this.rights['approval'] === true) {
      this.tabsList.push({labelkey:'tabs.approval',name:'approval'})
      this.tabSpan = 6
    }
    this.initData()
  },
  methods: {
    showPhone,
    refreshToday(){
      this.initData()
    },
    initData(){
      this.pageindex = 1
      this.recordList = []
      var query = {
        'starttimeUTC':String(date_format(new Date(),'yyyyMMdd')),
        'endtimeUTC':String(date_format(new Date(),'yyyyMMdd'))
      }
      this.queryReqData = query
      this.queryReqData_load = query
      this.loading = true
      setTimeout(() => {
        this.queryData(query || null)
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
      s_RQuery(reqData).then(function (response) {   
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
    onShowRecord(type){
      var reqData = {
        'type':type
      }
      if (type == 'valid') {
        reqData.onlyregister = 1
        reqData.onlyapproved = 1
        reqData.starttimeUTC = String(date_format(new Date(),'yyyyMMdd'))
      }
      else if (type == 'invalid') {
        reqData.onlyInvalid = 1
      }
      else if (type == 'visited') {
        reqData.onlyrecord = 1
      }
      else if (type == 'approval') {
        reqData.onlyrecord = 1
      }
      this.$router.push({ name: 'records' ,query:reqData});
    },
    onShowUserInfo() {
      this.$router.push({ name: 'Userinfo_E' });
    },
    onSwitchLanguage () {
      this.$router.push({ name: 'switchLanguage' });
    },
    onComplaint(){
      this.$router.push({ name: 'complaint' });
    },
    logout(){

    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/styles/define.scss';
.approval
{
  color: $mainclr;
}
.backgrd-gradient
{
  // height: 100%;
  // min-height: calc(100vh - 500px);
  // background: -webkit-linear-gradient($mainclr 30%, $mainclr2 60% ,$bkclr 90%);/* Safari 5.1 - 6.0 */ 
  // background: -o-linear-gradient($mainclr 30%, $mainclr2 60% ,$bkclr 90%); /* Opera 11.1 - 12.0 */ 
  // background: -moz-linear-gradient($mainclr 30%, $mainclr2 60% ,$bkclr 90%); /* Firefox 3.6 - 15 */
  // background: linear-gradient($mainclr 30%, $mainclr2 60% ,$bkclr 90%); /* 1f9476 */  
}
.user-info
{
  background: -webkit-linear-gradient($gradient1 30%, $gradient2 60% ,$gradient3 90%);/* Safari 5.1 - 6.0 */ 
  background: -o-linear-gradient($gradient1 30%, $gradient2 60% ,$gradient3 90%); /* Opera 11.1 - 12.0 */ 
  background: -moz-linear-gradient($gradient1 30%, $gradient2 60% ,$gradient3 90%); /* Firefox 3.6 - 15 */
  background: linear-gradient($gradient1 30%, $gradient2 60% ,$gradient3 90%); /* 1f9476 */  
  height: 200px;
  .header
  {
    text-align: left;
    padding:15px 20px;
    // height: 100px;
    .left
    {
      width: 100%;
      float:left;
      // height: 40px;
      // line-height: 40px;
      margin-right: 100px;
      color:$form-icon;
      .title{
        font-size: 1.3rem;
        color:white;
        margin-bottom: 5px;
      }
      .subtitle
      {
        font-size: 0.9rem;
        color:white;        
      }
      .icon
      {
        font-size: 1.5rem;
        margin-right:10px;
      }
    }
    .right{
      position: absolute;
      right: 0;
      top:40px;
      width: 50px;
      display: inline-block;
      padding-right: 10px;
      color:white;
    }
  }
}
.today-record-content{
  margin-top: 10px;
  background: white;
  border-radius:10px;
  padding: 5px;
  margin-left:10px;
  margin-right:10px;
  .nodata
  {
    font-size: 14px;
    color: #494949;
  }
  &-header{
    border-bottom: 1px solid $line;
    text-align: left;
    padding: 0 10px;
    line-height: 37px;
    margin-bottom: 20px;
    font-size: 14px;
    .title{
      color: $spanclr;
    }
    .refresh
    {
      float: right;
      color: $mainclr;
      padding-right: 5px;
      font-size: 1.2rem;
    }
    .btn-more
    {
      float: right;
    }
  }
}
.record-content
{
  background: white;
  margin-top:-100px;
  z-index: 99;
  border-radius:20px;
  padding: 5px;
  margin-left:10px;
  margin-right:10px;
  // border-top-left-radius:30px;
  // border-top-right-radius:30px;
  &-header{
    border-bottom: 1px solid $line;
    text-align: left;
    padding: 0 10px;
    line-height: 37px;
    margin-bottom: 20px;
    font-size: 14px;
    .title{
      color: $spanclr;
    }
    .more
    {
      float: right;
      color: $mainclr;
    }
    .btn-more
    {
      float: right;
    }
  }
  .record-row
  {
    .icon
    {
      font-size: 2rem;
      padding-bottom: 5px;
      width: 40px;
      height: 40px;
      // min-height: 50px;
    }
    .text
    {
      font-size: 0.8rem;
      color:$form-icon ;
    }
    // padding: 30px 10px;
  }
}
.other
{
  margin-top:20px;
  .btnLogout
  {
    margin-top: 15px;
    width: 100%;
  }
}
.mainbody{
  height: 100%;
}
.titleclass
{
  width: 100px;
}
.lngCell
{
  margin-top: 5px;
}
.logoutCell
{
  margin-top: 5px;
  padding: 5px 0;
}

.record-content .van-cell__title
{
    flex: 0 0 100px;
    text-align: left;
    span{
      display: inline-block;
      word-break: break-all;      
    }
}
.van-cell__left-icon {
  color: #969799;
  font-size: 1.2rem;
}
.router-slider-enter-active,
.router-slider-leave-active {
  transition: all 0.3s;
}

.router-slider-enter,
.router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>