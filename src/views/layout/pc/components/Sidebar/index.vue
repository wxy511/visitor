<!--
 * @Descripttion: 
 * @version: 
 * @Author: Bing
 * @Date: 2020-10-21 09:13:29
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-23 13:22:18
-->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      > -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        active-text-color="#1f9476"
        mode="vertical"
      >
        <!--  是否全部展开       :default-openeds="OpenMenue" -->
        
        <sidebar-item v-for="route in pcRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/layout/variables.scss'

export default {
  components: { SidebarItem, Logo },
  mounted() {
    let openedsList = []
    this.pcRoutes.forEach(function(item,index){
      if(item.meta && item.meta.opened)
      {
        openedsList.push(item.path)
      }
    });
    this.openedsList = openedsList
  },
  data(){
    return {
      openedsList:[]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'pcRoutes'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // OpenMenue() {
    //   const openMenueArry = []
    //   this.$store.getters.rights_routes.forEach(function(item, index) {
    //     if (typeof (item.children) !== 'undefined') {
    //       if (item.children.length > 1) {
    //         openMenueArry.push(item.path)
    //       }
    //     }
    //   })
    //   return openMenueArry
    // },
    showLogo() {
      return this.$store.state.layout.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
