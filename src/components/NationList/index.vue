<template>
  <div>
    <el-option
      v-for="item in nationList"
      :key="item.code"
      :label="item.label"
      :value="item.code"
      class="ccode-option"
    >
      <!-- <img :src="item.img" width="30" height="20"> -->
      <span class="nation">{{item.label}}</span>
    </el-option>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NationList',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters(['nationList']),
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

.submitbtn
{
  min-width: 250px;
  float: right;
}
.username
{
  text-align: left;
}
</style>