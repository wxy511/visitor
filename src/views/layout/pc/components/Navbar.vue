<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />

    <!-- <modify-info
      ref="modifyinfo"
      class="modify-info"
      @edituserinfo="ModifyUserInfo"
    /> -->
    <div class="right-menu" v-if="!isTopNav">
      <template>
        <language-select class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="user-name">
          <i class="el-icon-s-custom" />
          {{ name }}
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              {{ $t('Home') }}
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="Modify">
            <span style="display:block;">{{ $t('modify') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <div class="lanaguage-button" style="margin-right: 25px">
      <el-button type="primary" icon="el-icon-edit" circle style="margin-top: 5px" @click.native.prevent="changeLanguage" />
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LanguageSelect from '@/components/LanguageSelect'
// import ModifyInfo from '@/components/ModifyUserInfo'
// import { GetUsers } from '@/api/administrator/user-management'
import i18n from '@/i18n'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    LanguageSelect,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'language',
    ]),
    routesData() {
      return this.routes
    },
    isTopNav(){
      return this.$store.state.layout.isTopNav
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('layout/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // eslint-disable-next-line
      if (process.env.NODE_ENV === 'development') {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    },
    Modify() {
      const self = this 
      // 根据id查询userinfo传到子组件
      const SendData = { userid: Number(self.userid) }
      GetUsers(SendData).then(response => {
        const res = response
        if (res.error === 0) {
          const Data = res.user[0]
          self.$refs.modifyinfo.UpdateDateSelfModify(Data, 'self')
        } else {
          self.$message({
            message: i18n.t('Administrator.UsersFailedGetUserInfo'),
            center: true,
            type: 'error'
          })
          self.$refs.modifyinfo.UpdateDateSelfModify('error')
        }
      })
    },
    ModifyUserInfo(data) {
      // const self = this
      if (data === 0) {
        this.$message({
          message: i18n.t('Configuration.SaveSuccess'),
          center: true,
          type: 'success'
        })
      } else if (data === 'oldpwd error') {
        this.$message({
          message: i18n.t('Error.OldPasswordError'),
          center: true,
          type: 'error'
        })
      } else if (data === 'error') {
        this.$message({
          message: i18n.t('Configuration.SaveFailed'),
          center: true,
          type: 'error'
        })
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
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  text-align: left;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      .goUserInfo
      {
        cursor:pointer;
      }

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
