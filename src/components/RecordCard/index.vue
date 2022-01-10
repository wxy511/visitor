<template>
  <div :class="cardClass" @click="onClickRecord">
    <el-row  class="card-header">
      <el-col :span='18' class="title">
        <span class="r_border-left_small">{{data.showVdate}}</span>
      </el-col>
      <el-col :span='6' class="icon-right">                
        <i class="el-icon-arrow-right" style="float:right"></i>
      </el-col>
    </el-row>
    <div class="card-body">
      <!-- <img class="bannerBg" v-if="data.Vinblack && rights.Vinblack" :src="blackImgSrc"> -->
      <details-item v-show="showVbranch"  :showLabel="true" :label="$t('RegInfo.Vbranch')"  :value="showBranch(data.Vbranch)"/>
      <details-item v-show="showApproveVName" :valueClass="valueClass" :showLabel="true" :label="$t('approval.visitor')"  :value="showApproveVName"/>
      <details-item v-show="type == 'approvalGroup'" :showLabel="true" :label="$t('approval.contact')"  :value="showPhone(data.Vcountrycode,data.Vphone)"/>
      <details-item v-show="showUnit" :showLabel="true" :label="$t('RegInfo.Vunit')"  :value="data.Vunit"/>
      <details-item :label="$t('approval.host')" :showLabel="true"  :value="data.Ename"/>
    </div>
  </div>
</template>
<script>
import { showPhone,recordFormat } from '@/utils/visitor'
import DetailsItem from '@/components/DetailsItem/DetailsItem_APP.vue'
import { mapState, mapGetters} from 'vuex'

export default {
  name: 'RecordCard',
  components:{
    DetailsItem,
  },
  props: {
    type:{
      type:String,
      default:'e'
    },
    data:{
      type:Object,
      default:{}
    },
  },
  data(){
    return {
      showEname:false,
      blackImgSrc:require('@/assets/basic/black.png')
    }
  },
  computed: {
    ...mapState(['config','userType','rights']),
    ...mapGetters(['showBranch','userInfo']),
    cardClass(){
      return 'record-card record-'+this.data.status
    },
    valueClass(){
      if (!this.data.GroupNum && this.data.Vinblack && this.rights.Vinblack) {
        return 'black'
      }
      return ''
    },
    showApproveVName(){
      if (this.data.GroupNum) {
        return this.data.GroupNum + this.$t('approval.people')
      }
      else {
        return this.data.Vname
      }
    },
    showUnit(){
      if (this.userType==='v' || this.data.GroupNum) {
        return false
      }
      return true
    },
    showVbranch(){
      if (this.type == 'approvalGroup') {
        return false
      }
      return true
    }
  },
  created(){
    this.data = recordFormat(this.data)
    if (this.userType === 'v') {
      this.showEname = true
    }
    else{
      if (this.userInfo.EHID && this.userInfo.EHID!=this.data.EHID) {
        this.showEname = true
      }
    }
  },
  methods: {
    showPhone,
    onClickRecord(){
      if (!this.data.GroupNum) {
        this.$store.state.sync_record_details = this.data
        this.$router.push({name:'recordDetails',query:{regcode:this.data.regcode}})        
      }
      else{
        this.$store.state.sync_pendding_group = this.data
        this.$router.push({name:'approval',query:{id:this.data.id,visitor:this.showApproveVName}})         
      }
    },
    update(data){
      this.data = recordFormat(data)
      if (this.type === 'v') {
        this.showEname = true
      }
      else{
        if (this.userInfo.EHID && this.userInfo.EHID!=this.data.EHID) {
          this.showEname = true
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
$status-left-width:5px;
.record-card
{
  margin: 10px 0;
  background: white;
  text-align: left;
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  .card-header
  {
    padding-bottom:10px ;
    border-bottom: 1px solid $line;
    margin-bottom: 10px;
    .icon-right{text-align: right;}
    .title
    {
      text-align: left;
      font-size: 14px;
    }
  }
  .card-body{
    
  }
}
</style>