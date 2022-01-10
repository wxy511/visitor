<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="routerKeepAlive">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name||this.$route.path
    },
    routerKeepAlive() {
      var routerKeepAlive = ['add']
      return routerKeepAlive.toString()
      // return this.$store.getters.routerKeepAlive
    }
  }
}
</script>

<style scoped>
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
