<template>
  <div>
    <el-option :label="$t('RegInfo.IDType.0')" value="0" > </el-option>
    <el-option :label="$t('RegInfo.IDType.1')" value="1" > </el-option>
    <el-option :label="$t('RegInfo.IDType.99')" value="99" > </el-option>
  </div>
</template>
<script>
export default {
  name: 'DocumentId',
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
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>