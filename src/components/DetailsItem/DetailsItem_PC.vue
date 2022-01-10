<template>
    <el-row class="d-item">
        <div class="reg-title-left">
            <i :class="'icon '+icon" v-show="icon"></i>
            <svg-icon :icon-class="svg" v-show="svg" class="icon"></svg-icon>
            <span class="title">{{ label }}</span>
        </div>
        <div class="reg-body-right">
            <span v-show="type=='span'" class="value">{{ value }}</span>
            <span v-if="type=='Vid'" class="value">{{ showVid() }}</span>
            <span v-if="type=='Vnation'" class="value">{{ showNation(value) }}</span>
            <span v-if="type=='risk'" :class="'risk-level-' + recordData.riskLevel">
              <span class="value" >{{ recordData.regionsName }}</span>
              <span class="r_tag" v-if="recordData.regionsName && showRiskLevel"> {{$t('riskRegions.level.-'+recordData.riskLevel)}} </span>
            </span>

            <div v-if="type=='qrcode'">
                <vue-qr :text="value" :size="150" :margin="2"></vue-qr>
            </div>
        </div>
    </el-row>
</template>
<script>
import VueQr from 'vue-qr'
import { showID } from '@/utils/visitor'
import { mapState , mapGetters } from 'vuex'

//nationMap_code_obj
export default {
  name: 'DetailsItem',
  components: { VueQr },
  props: {
    icon:{
      type:String,
      default:''
    },
    svg:{
      type:String,
      default:''
    },
    label:{
      type:String,
      default:''
    },
    value:{
      type:String,
      default:''
    },
    showRiskLevel:{
      type:Boolean,
      default:true
    },
    recordData:{
      type:Object,
      default:function (){return {}},
      required: false
    },
    type:{
      type:String,
      default:'span'
    },
  },
  data(){
    return {
      riskInfo:{
        'riskLevel':1,
        'name':''
      }
    }
  },
  computed: {
    ...mapState(['nationMap_code_obj']),
    ...mapGetters(['language']),
  },
  methods: {
    showID,
    showVid(){
      var Vid = this.showID(this.recordData.Vid)
      if (!Vid) {
        return ''
      }

      if (this.recordData.Vidtype) {
        Vid = this.$t('RegInfo.IDType.'+String(this.recordData.Vidtype || 99)) + ' - ' + Vid
      }
      
      return Vid
    },
    showNation(code){
      if (code && this.nationMap_code_obj[code]) {
        return this.nationMap_code_obj[code][this.language] || ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/define.scss';
  .d-item
  {
    width: 100%;
    .reg-title-left
    {
      width: 150px;
      float:left;
      height: 30px;
      line-height: 30px;
      color:$form-icon;
      .title{
        font-size: 0.9rem;
        color:$form-icon;
      }
      .icon
      {
        font-size: 1.2rem;
        margin-right:10px
      }
    }
    .reg-body-right{
      margin-left: 150px;
      width: 100%;
      max-width: 900px;
      padding-right: 200px;
      .value
      {
        font-size: 0.9rem;
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>