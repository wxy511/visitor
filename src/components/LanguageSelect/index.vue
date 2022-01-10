<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="icd-earth" />
      <span class="lngtext"> {{$t('lng.'+language)}} </span>
      <!-- <i class="el-icon-caret-bottom" /> -->
    </div>
    <el-dropdown-menu slot="dropdown" class="lng-dropdown">
      <el-dropdown-item :disabled="language==='cn'" command="cn">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
//import i18n from '@/i18n'
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('layout/setLanguage', lang)
      document.title = this.$t('title')
      // this.$message({
      //   message: i18n.t('SwitchLanguage'),
      //   center: true,
      //   type: 'success'
      // })
    }
  }
}
</script>
<style scoped>
.lngtext
{
  font-size: 1rem;
}
.lng-dropdown
{
  min-width: 110px;
  text-align: center;
}
</style>