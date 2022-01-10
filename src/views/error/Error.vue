<template>
  <div>
    <div class="g-gray-background" id='record'>
      <div align="center">
        Record
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {},
  created() {
    //通过路由跳转绑定Tabbar的选中
    //this.tabbarSelected(this.$route.name)
  },
  watch: {
    // 监听路由变化,保证路由跳转Tabbar选中正常
    // $route: {
    //   handler(val, oldval) {
    //     this.tabbarSelected(val.name)
    //   }
    // },
    // deep: true
  },
  data () {
    return {
      msg: 'Welcome to mobile',
      currIndex:1,
      active:1
    }
  }
}
</script>

<style>
#record {
  padding-bottom: 3rem;
  color: black;
  height: 100%;
  /* .head {
    margin-top: -3rem;
    width: 100%;
  } */
}
</style>
