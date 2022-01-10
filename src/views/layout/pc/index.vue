<template>
  <div>
    <el-backtop></el-backtop>
    <topnav class="topnav-container" id='header' v-if="isTopNav"/>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar />
        </div>
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import topnav from './topnav'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    topnav
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar(){
      return this.$store.state.layout.sidebar
    },
    device() {
      return this.$store.state.layout.device
    },
    fixedHeader() {
      return this.$store.state.layout.fixedHeader
    },
    isTopNav(){
      return this.$store.state.layout.isTopNav
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.$store.state.layout.device === 'mobile'
      }
    }
  },
  created(){
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('layout/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/layout/mixin.scss";
  @import "~@/styles/layout/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    margin-top:$topnavHeight;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 65px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
