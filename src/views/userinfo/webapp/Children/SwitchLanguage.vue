<template>
  <apppage-layout :title="$t('switchLanguage')" page="switchLanguage">
    <div slot="right"></div>
    <div slot="body">
      <van-radio-group v-model="radio" @change="onSelLngChange">
        <van-cell-group>
          <van-cell :title="$t('lng.cn')"
                    clickable
                    @click="radio = 'cn'">
          <template #right-icon>
            <van-radio slot="right-icon"
                       name="cn" 
                       :checked-color="mainclr"/>
          </template>

          </van-cell>
          <van-cell :title="$t('lng.en')"
                    clickable
                    @click="radio = 'en'">
            <van-radio slot="right-icon"
                       name="en"
                       :checked-color="mainclr" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </apppage-layout>
</template>
<script type="text/javascript">
import { Toast } from 'vant'
import Cookies from "js-cookie";
// 设置vant的多语言
import { Locale } from 'vant';
import enUS from 'vant/lib/locale/lang/en-US';
import zhCN from 'vant/lib/locale/lang/zh-CN';
import localeELE from 'element-ui/lib/locale'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import { mapState ,mapGetters} from 'vuex'
import ApppageLayout from '@/components/ApppageLayout'

export default {
  name:'switchLanguage',
  components:{ApppageLayout},
  data () {
    return {
      radio: 'en'
    }
  },
  computed: {
    ...mapState(['mainclr']),
    ...mapGetters(['language']),
  },
  created(){
    this.radio = this.language
  },
  methods: {
    // 返回按钮
    onClickLeft () {
      this.$router.goBack();
    },
    // 保存
    onClickSave () {
      if (this.radio == "cn") {
        this.$i18n.locale = "cn";
        this.$store.dispatch("setLanguage", "cn");
        Locale.use('zh-CN', zhCN);
      } else {
        this.$i18n.locale = "en";
        this.$store.dispatch("setLanguage", "en");
        Locale.use('en-US', enUS);
        
      }
      this.$router.back();
    },
    onSelLngChange(value){
      if (this.radio == "cn") {
        this.$i18n.locale = "cn";
        this.$store.dispatch("setLanguage", "cn");
        Locale.use('zh-CN', zhCN);
        localeELE.use('zh-cn',zhLocale)
      } else {
        this.$i18n.locale = "en";
        this.$store.dispatch("setLanguage", "en");
        Locale.use('en-US', enUS);
        localeELE.use('en',enLocale)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/define.scss';
.van-nav-bar__text {
    color: $mainclr;
}
.van-nav-bar .van-icon {
  color: $mainclr;
}
</style>