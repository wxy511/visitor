<template>
  <div class="top-navbar">
    <!-- <img :src="logo" class="sidebar-logo"> -->
    <!-- <svg-icon iconClass="logoabb" class="sidebar-logo"/> -->
    <img :src="logo" class="sidebar-logo">
    <span class="sidebar-title"> 
      <!-- {{ $t('title') }}  -->
    </span>
    <!-- <modify-info
      ref="modifyinfo"
      class="modify-info"
      @edituserinfo="ModifyUserInfo"
    /> -->
    <div class="right-menu">
      <span v-if="approvalNotify" class="right-menu-item hover-effect">
        <!-- <el-popover
          placement="bottom"
          title="标题"
          width="200"
          trigger="manual"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          v-model="visible">
          <el-button slot="reference" @click="visible = !visible">手动激活</el-button>
        </el-popover>         -->
      </span>
      <template>
        <language-select class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="user-name">
          <i class="el-icon-s-custom" />
          {{ username }}
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              {{ $t('Home') }}
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="Modify">
            <span style="display:block;">{{ $t('user.userinfo') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <change-userinfo ref="ChangeUserinfoDlg" @onModify="onModify"></change-userinfo>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LanguageSelect from '@/components/LanguageSelect'
import ChangeUserinfo from '@/components/ChangeUserinfo'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    LanguageSelect,
    ChangeUserinfo
  },
  data() {
    return {
      // logo:require(`@/custom/${process.env.VUE_APP_BUILD_VERSION}/img/${this.location_cfg.logo}`),
      logo:'',
      username:'',
      approvalNotify:false
    }
  },
  computed: {
    ...mapState([
        'location_cfg',
    ]),
    ...mapGetters([
      'sidebar',
      'name',
      'language',
      'rights'
    ]),
    routesData() {
      return this.routes
    }
  },
  created() {
    this.username = this.name
    this.logo = require('@/custom/'+process.env.VUE_APP_BUILD_VERSION+'/img/'+this.location_cfg.logo)
    if (this.rights['approval'] === undefined || this.rights['approval'] === true)
    {
      this.approvalNotify = true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('layout/toggleSideBar')
    },
    async logout() {
      if (process.env.NODE_ENV === 'development') {
        this.$router.push('/login')
      }
      else{
        window.location.href = '/logout/'
      }
    },
    Modify() {
      const self = this
      self.$refs['ChangeUserinfoDlg'].initData()
    },
    onModify(name){
      if (name) {
        this.username = name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lngtext
{
  font-size: 1rem;
}
.user-dropdown
{
  min-width: 110px;
  text-align: center;
}
.top-navbar
{
  background: $navbar-bk-clr !important;
  .right-menu-item
  {
    color: $navbar-font-clr !important;
  }
  .sidebar-title
  {
    color: $navbar-font-clr !important;
  }
}
// .sidebar-logo {
//   width: auto;
//   height: 40px;
//   vertical-align: middle;
//   //margin-right: 12px;
//   margin: 5px;
//   padding: 1px;
// }
// .navbar {
//   height: 50px;
//   overflow: hidden;
//   position: relative;
//   background: #fff;
//   text-align: left;
//   box-shadow: 0 1px 4px rgba(0,21,41,.08);
//   width: 100%;

//   .hamburger-container {
//     line-height: 46px;
//     height: 100%;
//     float: left;
//     cursor: pointer;
//     transition: background .3s;
//     -webkit-tap-highlight-color:transparent;

//     &:hover {
//       background: rgba(0, 0, 0, .025)
//     }
//   }

//   .breadcrumb-container {
//     float: left;
//   }

//   .right-menu {
//     float: right;
//     height: 100%;
//     line-height: 50px;

//     &:focus {
//       outline: none;
//     }

//     .right-menu-item {
//       display: inline-block;
//       padding: 0 8px;
//       height: 100%;
//       font-size: 18px;
//       color: #5a5e66;
//       vertical-align: text-bottom;

//       .goUserInfo
//       {
//         cursor:pointer;
//       }

//       &.hover-effect {
//         cursor: pointer;
//         transition: background .3s;

//         &:hover {
//           background: rgba(0, 0, 0, .025)
//         }
//       }
//     }

//     .avatar-container {
//       margin-right: 30px;

//       .avatar-wrapper {
//         margin-top: 5px;
//         position: relative;

//         .user-avatar {
//           cursor: pointer;
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//         }

//         .el-icon-caret-bottom {
//           cursor: pointer;
//           position: absolute;
//           right: -20px;
//           top: 25px;
//           font-size: 12px;
//         }
//       }
//     }
//   }
// }
</style>