<template>
  <div class="site-form">
    <div class="sel-last" v-if="selectLast.length">
      <div class="div-title">
        {{$t('riskRegions.lastSel')}}
      </div>
      <div>
        <el-button class="last-item" round v-for="item in selectLast" :key="item.code" @click="onLastClick(item)" sizi="mini"> {{item.name}}</el-button>
      </div>       
    </div>
    <div class="sel-site">
      <div class="div-title">
        <!-- {{$t('riskRegions.listTitle')}} -->
      </div>
      <template>
        <el-tabs v-model="tabSel" @tab-click="onTabClick" >
          <el-tab-pane v-for="(item,index) in tabList" :label="item.name" :name="item.code" :key="item.code" :class="tabClass">
            <template v-if="tabList[index].data">
              <van-cell 
                v-for="region in item.data" 
                v-bind:class="selRegions==region.code?'cell selected':'cell'"
                :key ="region.code" 
                @click="onCellClick(region)" >
                <template #title>
                  <span v-if="region.data || region.city || region.county">
                    <i class="el-icon-arrow-right site-icon"></i>
                    {{region.name}}
                  </span>
                  <span v-else>
                    <i class="el-icon-location site-icon" ></i>
                    {{region.name}}
                    <i class="el-icon-check site-icon-selected" v-if="selRegions==region.code"></i>
                  </span>
                </template>
              </van-cell>
            </template>
            <template v-if="tabList[index].city">
              <van-cell 
                v-for="region in item.city" 
                v-bind:class="selRegions==region.code?'cell selected':'cell'"
                :key ="region.code" 
                @click="onCellClick(region)" >
                <template #title>
                  <span v-if="region.data || region.city || region.county">
                    <i class="el-icon-arrow-right site-icon"></i>
                    {{region.name}}
                  </span>
                  <span v-else>
                    <i class="el-icon-location site-icon" ></i>
                    {{region.name}}
                    <i class="el-icon-check site-icon-selected" v-if="selRegions==region.code"></i>
                  </span>
                </template>
              </van-cell>
            </template>
            <template v-if="tabList[index].county">
              <van-cell 
                v-for="region in item.county" 
                v-bind:class="(selRegions==region.code?'cell selected ':'cell ' )+ 'risk-level-'+ String(region.riskLevel||1)"
                :key ="region.code" 
                @click="onCellClick(region)" >
                <template #title>
                  <span v-if="region.data || region.city || region.county">
                    <i class="el-icon-arrow-right site-icon"></i>
                    {{region.name}}
                  </span>
                  <span v-else>
                    <i class="el-icon-location site-icon" ></i>
                    {{region.name}}
                    <span class="r_tag_hiddenLow" v-if="showLevel"> {{$t('riskRegions.level.-'+region.riskLevel)}} </span>
                    <i class="el-icon-check site-icon-selected" v-if="selRegions==region.code"></i>
                  </span>
                </template>
              </van-cell>
            </template>
            <!-- <template v-if="tabList[index].data.children&&tabList[index].data.children.length">
              <van-cell 
                v-for="site in tabList[index].data.children" 
                v-bind:class="{ selected: sync_selSite&&site.siteid&&sync_selSite.name==site.name}"
                :key ="site.value" 
                @click="onCellClick(site)" >
                <template #title>
                  <span v-if="!site.code">
                    <i class="el-icon-arrow-right site-icon" ></i> 
                    {{site.label}}
                  </span>
                  <span v-else>
                    <i class="el-icon-location site-icon" ></i>
                    <span >{{site.label}}</span>
                    <i class="el-icon-check site-icon-selected" v-if="sync_selSite&&sync_selSite.name==site.name"></i>
                  </span>
                </template>
              </van-cell>
            </template> -->
          </el-tab-pane>
        </el-tabs>
      </template> 
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapState,mapGetters } from 'vuex'

export default {
  name:'RiskRegions',
  props: {
    type:{
      type:String,
      default:''
    },
    data:{
      type:Array,
      default:[]
    },
    tabClass:{
      type:String,
      default:'tab-pane-pc'
    },
    showLevel:{
      type:Boolean,
      default:false
    },
    // select:{
    //   type:Object,
    //   default:{}
    // },
    // selectLast:{
    //   type:Array,
    //   default:[]
    // }
  },
  data () {
    return {
      loading:false,
      tabList:[],
      tabSel:'',
      lastSel:[],
      siteList:[],
      selRegions:null,
      nowList:{children:[]},
      selectLast:[],
      context_index:null,
      context_data:null,
      context_type:null,
    }
  },
  computed: {
    ...mapGetters(['language','riskRegions_map','lastRegionsList']),
  },
  created(){
  },
  methods: {
    getLevelClass(item){
      if (item.code) {
        var county = this.riskRegions_map[item.code]
        if (county && county.riskLevel && county.riskLevel!==1) {
          return 'risk-level-'+String(county.riskLevel)
        }
      }

      return 'risk-level-1'
    },
    initSel(context_type,selCode,context_index,context_data){
      this.context_type = context_type
      this.context_index = context_index
      this.context_data = context_data
      this.selectLast = this.lastRegionsList
      let tablist = []
      let tabSel = null 
      let regionsJson = this.data || []
      tablist.push({"name":this.$t('riskRegions.defultSelect'),"code":"999",'data':regionsJson})
      
      if(selCode)
      {
        const countryCode = selCode.substr(0,2)+'0000000000'
        const cityCode = selCode.substr(0,4)+'00000000'
        regionsJson.forEach(country => {
          if (country.code === countryCode && country.city) {
            tablist.push({"name":country['name'],"code":country['code'],'city':country.city})
            country.city.forEach(city => {
              if (city.code === cityCode && city.county) {
                tablist.push({"name":city['name'],"code":city['code'],'county':city.county})
                city.county.forEach(item => {
                  if (item.code) {
                    var county = this.riskRegions_map[item.code]
                    if (county) {
                      item['riskLevel'] = county['riskLevel'] ||1
                    }
                    else
                      item['riskLevel'] = 1
                  }
                });

                // city.county.forEach(county => {
                //   if (county.code === selCode) {
                //     tabSel = county.code
                //   }
                // });            
              }
            });            
          }
        });  
      }

      this.tabList = tablist
      this.selRegions = selCode
      // this.nowList = tablist[tablist.length-1].data
      this.tabSel = tablist[tablist.length-1].code
    },
    onTabClick(item){
      let index = parseInt(item.index)
      this.tabList = this.tabList.slice(0,index+1)
      this.tabSel = item.name
    },
    onLastClick(item){
      this.$emit('onSel',item,this.context_type,this.context_index,this.context_data)
    },
    onCellClick(item){
      let newTab = null      
      if (item.data) {
        newTab = {"name":item['name'],"code":item['code'],'data':item.data}
      }
      else if (item.city) {
        newTab = {"name":item['name'],"code":item['code'],'city':item.city}
      }
      else if (item.county) {
        newTab = {"name":item['name'],"code":item['code'],'county':item.county}
        newTab.county.forEach(item => {
          if (item.code) {
            var county = this.riskRegions_map[item.code]
            if (county) {
              item['riskLevel'] = county['riskLevel'] ||1
            }
            else
              item['riskLevel'] = 1
          }
        });
      }
      else{
        this.selRegions = item.code

        item.provinceCn = this.tabList[1].name
        item.cityCn = this.tabList[2].name
        item.fullName = this.tabList[1].name + '/'+this.tabList[2].name + '/' + item.name
        this.$store.dispatch("riskRegions/setLastSel",item);
        this.$emit('onSel',item,this.context_type,this.context_index,this.context_data)
      }

      if(newTab)
      {
        this.tabList.push(newTab)
        this.tabSel = item.code
      }
    }
  },
}
</script>
<style scoped lang="scss">

.tab-pane-pc
{
  max-height: 800px;
  overflow-y: auto;
  border-bottom: 1px solid $line;
  padding-bottom: 10px;
}

.tab-pane-app
{
  max-height: calc(80vh - 200px);;
  overflow-y: auto;
  border-bottom: 1px solid $line;
}
.site-form
{
  border-top: 1px solid $line;
  padding-top:10px;
  margin-top:-25px;
  text-align: left;
  overflow-y: hidden;
  .title
  {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #333;
    height: 40px;
    line-height: 40px;
  }
  .div-title{
    text-align: left;
    color: $form-icon;
    font-size: 14px;
  }
  .sel-last
  {
    padding: 10px;
    .last-item
    {
      height: 25px;
      padding: 0 15px;
      line-height: 25px;
      border-radius: 25px;
      margin: 10px 10px 0 0;
      text-align: center;
      background: #f7f7f7;
      color: $spanclr;
      font-size: 12px;
    }
  }
  .sel-site
  {
    padding:10px ;
    margin-bottom:20px ;
    .cell
    {
      cursor: pointer;
      padding: 5px 16px !important;
    }
    i{
      color: $form-icon;
      font-size: 1rem;
    }
    .selected
    {
      color: $mainclr;
      background: $mainclr3;
      i{
        color: $mainclr;
        font-size: 1.2rem;
      }
      .site-icon-selected
      {
        float: right;
        font-weight: bold;
      }
    }
  }
}
</style>