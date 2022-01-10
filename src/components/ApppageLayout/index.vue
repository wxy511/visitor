<template>
    <div v-if="embeddedAPP" :class=" 'embeddedAPP-fullpage '+customClass ">
      <slot name="backtop"></slot>
      <div class="embeddedAPP-body">
          <slot name="body"></slot>
      </div>
    </div>
    <div v-else :class=" 'webapp-fullpage '+customClass ">
      <slot name="backtop"></slot>
      <van-nav-bar :title="title"
                  :fixed=true
                  :border=false
                  @click-left="onClickLeft"
                  left-arrow
                  @click-right="onClickRight"
                  >
                  <template slot="left">
                      <span> <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i> </span>
                  </template>   
                  <template slot="right">
                      <span class="bar-right">
                          <slot name="right"></slot>
                          <span class="bar-right__text"> {{ rightText }} </span> 
                      </span>
                  </template>        
      </van-nav-bar>
      <div class="div-body">
          <slot name="body"></slot>
      </div>
    </div>
</template>
<script>

import { mapState  } from 'vuex'
const webappTitleList = ['records','recordDetails','selectVisitor','switchLanguage','Userinfo_E','changeUserInfo']
export default {
  name: 'ApppageLayout',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    title:{
      type:String,
      default:''
    },
    customClass:{
      type:String,
      default:''
    },
    rightText:{
      type:String,
      default:''
    },
    page:{
      type:String,
      default:''
    },
  },
  data(){
    return {

    }
  },
  computed: {
    ...mapState(['embeddedAPP']),
  },
  created() {
  },
  methods: {
    onClickLeft(){
        if (window.history.length <= 1) {
            this.$router.push({name:'home'})
            return false
        } else {
            this.$router.goBack()
        }
    },
    onClickRight(){
        this.$emit('onClickRight', this.page)
    }
  }
}
</script>
<style lang="scss">
.embeddedAPP-fullpage
{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    max-width: 600px;
    background-color: $bkclr;
    z-index: 999;
    overflow-y: auto;
    overflow-x: hidden;
    .embeddedAPP-header
    {
        height: 2.5rem;
        .bar-right
        {
            color: $mainclr;
            i{
                font-size: 1rem
            }
        }
    }
    .embeddedAPP-body{
        margin-top: 1px;
    }
    .van-nav-bar__text {
        color: $mainclr;
    }
    .van-nav-bar .van-icon {
      color: $mainclr;
    }
}
</style>