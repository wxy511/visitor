<template>
  <div id="wrapper">
      <van-grid :column-num="3"
                :border="false">
        <van-grid-item v-for="nav in nav_list"
                      :key="nav.id"
                      :icon="nav.img"
                      :text="nav.name"
                      @click="gotoCategory(nav)" />
      </van-grid>
  </div>
</template>

<script type="text/javascript">
import { Toast } from 'vant';
export default {
  props: {
    nav_list: Array
  },
  data () {
    return {

    }
  },
  components: {

  },
  methods: {
    gotoCategory (nav) {
      if (nav.to) {
        this.$router.push(nav.to)
      }
      else{
          Toast({
            message: this.$t('ing'),
            duration: 800
          })        
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>

