<template>
  <div>
    <el-option
      v-for="item in countrycodeList"
      :key="item.countrycode"
      :label="item.label"
      :value="item.countrycode"
      class="ccode-option"
    >
      <img :src="item.img" width="30" height="20">
      <span class="nation">{{item.nation}}</span><span class="label">{{item.label}}</span>
    </el-option>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CountryCode',
  props: {
    // countrycodeList: {
    //   type: Array,
    //   default: []
    // },
    disabled: {
      type: Boolean,
      default: false
    },
    phone:{
      type:String,
      default:''
    }
  },
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters(['countrycodeList']),
  },
  methods: {
    numberCheck:function(key1,key2){
      if (key2) {this[key1][key2]=this[key1][key2].replace(/[^0-9]+/,'')}
      else{this[key1]=this[key1][key2].replace(/[^0-9]+/,'')}
    },
  }
}
</script>
<style lang="scss" scoped>

.submitbtn
{
  min-width: 250px;
  float: right;
}
.username
{
  text-align: left;
}
</style>