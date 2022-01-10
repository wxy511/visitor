<template>
  <div class="g-gray-background" align="center">
    <div class="webapp-layout">
      <van-tabbar
      v-model="active"
      :safe-area-inset-bottom="true"
      :active-color="mainclr"
      style="box-shadow:0 -2px 3px -1px rgb(0 0 0 / 5%);z-index: 5;"
      >
        <van-tabbar-item
          v-for="(item, index) in tabbars"
          :key="item.name"
          :id="item.name"
          :name="item.name"
          @click="tab(index, item)"
        >
          <span :class="currName == item.name ? 'nav' : ''">{{
            $t(item.title)
          }}</span>
          <template slot="icon" slot-scope="props">
            <svg-icon :iconClass="props.active ? item.active : item.normal" :class="currName == item.name ? 'nav' : ''" />
          </template>
        </van-tabbar-item>
      </van-tabbar>

      <div class="main-body-app">
        <transition :name="transitionName" :mode="mode" :include="keepAliveRouterList">
          <keep-alive >
            <router-view :key="key"/>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions,mapGetters} from 'vuex'
import {getLanguage} from "@/i18n/index";

export default {
  name: 'Layout',
  data () {
    return {
      msg: 'ICD VISITOR SYSTEM',
      currIndex:1,
      currName:'nav',
      active:'nav',
      tabbars: [],
      transitionName: 'slide-right',
      mode:'',
    }
  },
  mounted() {
    this.initNav()
    //this._initData()
  },
  created() {
    this.tabbarSelected(this.$route.name)
  },
  computed: {
    ...mapState([
        'userInfo',
        'language',
        'mainclr'
    ]),
    ...mapGetters(['webRoutes','keepAliveRouterList']),
    key(){
      return this.$route.fullpath;
    },
    mobile(){
      return document.body.clientWidth<800
    }
  },
  watch:{
    '$route' (route, from){

      if (route.name == 'add'  || route.name == 'user') {
        this.tabbarSelected(route.name)
      }
      let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
      if ((route.name == 'home' || route.name == 'add'  || route.name == 'user')&&(from.name == 'home' || from.name == 'add'  || from.name == 'user') ) {
        this.transitionName ='router-slider' //router-slider
        this.mode = 'out-in'
      }
      else{
        // if ((route.name == 'home' || route.name == 'add'  || route.name == 'user')&&(from.name == 'home') ) {
        //   isBack = true
        // }
        if(isBack) {
          this.transitionName = 'slide-right'
          this.mode = ''
        } else {
  　      this.transitionName = 'slide-left'
          this.mode = ''
  　　　}

      }

      // console.log(isBack,this.transitionName,this.mode )
　　  this.$router.isBack = false
    },
  },
  methods: {
    ...mapActions([
        'getUserInfo',
        'getCountryCode'
    ]),
    tab(index, item) {
      this.currIndex = index
      this.currName= item.name
      //this.$router.push(item.path)
      this.$router.push({'name':item.name})
    },
    initNav(){
      this.tabbars = this.webRoutes
    },
    async _initData () {
      this.$store.dispatch("setLanguage", getLanguage());
      let token = this.$route.query.token || ''
    },
    tabbarSelected(name) {
      this.active = name
      this.currName = name
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/define.scss';
.main-body-app
{
  margin-bottom: 55px;
}
.van-tabbar-item--active
{
  background-color: #F7F7F7;
}
.nav
{
  color: $mainclr;
}
.tab-menu
{
  text-align: left;
  height: 100%;
  width: 240px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-right: 1px solid #d1d6d4;
  background: #fff;
}
.L-webapp-layout{
    position: relative;
    height: 100%;
    width: 90%;
    margin-left: 242px;
    max-width: 600px;
}

.el-title
{
  font-size: 1rem;padding-left: 10px;
  width: 100%;
}
.webapp-layout
{
  width: 100%;
  max-width: 600px;
  overflow-x: hidden;
  /* background: #fafafc; */
}
.van-tabbar--fixed {
    position: fixed;
    bottom: 0;
    right:0;
    left: 0;
    margin:auto;
}
@keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-moz-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-o-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.moveToCart {
  animation: mymove 0.5s ease-in-out;
}

</style>
