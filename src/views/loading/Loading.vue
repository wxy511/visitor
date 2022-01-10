<template>
  <div align="center" class="loading">
    <i class="el-icon-loading icon"></i>
  </div>
</template>
<script>
import {mapState, mapGetters , mapActions} from 'vuex'

import { testGet  } from '@/api/api.js'

export default {
  name: 'Loading',
  mounted() {
    this.initData()
  },
  data(){
    return {
      ret_url: undefined
    }
  },
  computed:{
    ...mapState(['TERMINAL','py_config','userType']),
    ...mapGetters(['rights','userInfo']),
  },
  watch: {
    $route: {
      handler: function(route) {
        let ret_url = route.query && route.query.redirect
        this.ret_url = ret_url
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'getConfig',
      'getBranch',
      'InitData',
      'initRights',
    ]),
    async initData () {
      let self = this
      if (!this.userInfo || !this.userType) {
        this.$router.push({name:'error'})
        return
      }
      
      if (this.$router.isBack) {
        this.$router.push({name:'add'})
      }
      else{
        //await this.getUserInfo();
        await this.InitData();
        await this.getConfig();
        if (this.py_config.riskRegions) {
          await this.$store.dispatch('riskRegions/initRegionsList')  
        }
        const query = this.$route.query || {}
        if (query.regcode) {
          if (this.TERMINAL === 'pc') {
            this.$router.push({name:'approval',query:{regcode:query.regcode}}) 
          }
          else{
            this.$router.push({name:'recordDetails',query:{regcode:query.regcode}}) 
          }
          return
        }
        
        setTimeout(function() {
          self.$router.push({'path':self.ret_url||'/registration/add'})
        }, 500);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loading
{
  margin-top: 20%;
  margin-bottom: 50px;
  .icon
  {
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>
