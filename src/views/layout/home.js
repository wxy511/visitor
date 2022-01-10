
export function mounted() {
    this._initData()
    this.internalMounted()
}

export function created() {
    this.tabbarSelected(this.$route.name)
}

export const watch = {
    $route: {
        handler(val, oldval) {
        this.tabbarSelected(val.name)
        }
    },
    deep: true
}
 
export const data = {
    msg: 'ICD Visitor System',
    currIndex:1,
    currName:'nav',
    active:'nav',
    tabbars: [
    {
        name: 'nav',
        title: 'home.nav',
        normal: 'nav-home',
        active: 'nav-home-sel'
    },
    {
        name: 'record',
        title: 'home.records',
        normal: 'records',
        active: 'records-sel',
    },
    {
        name: 'case',
        title: 'home.case',
        normal: 'case',
        active: 'case-sel'
    },
    // {
    //   name: 'site',
    //   title: 'home.site',
    //   normal: require('@/icons/svg/site.svg'),
    //   active: require('@/icons/svg/site-sel.svg')
    // },
    {
        name: 'userinfo',
        title: 'home.userinfo',
        normal: 'user',
        active: 'user-sel'
    }
    ]
}

export const methods = {
    tab(index, name) {
      this.currIndex = index
      this.currName= name
      this.$router.push(name)
    },
    async _initData () {
      //this.getCountryCode();
      let token = this.$route.query.token || ''
    },
    tabbarSelected(name) {
      this.active = name
    },
    handleCommand(command) {
        if (command == "cn") {
            this.$i18n.locale = "cn";
            this.$store.dispatch("setLanguage", "cn");
            Locale.use('zh-CN', zhCN);
        } else {
            this.$i18n.locale = "en";
            this.$store.dispatch("setLanguage", "en");
            Locale.use('en-US', enUS);
        }
    }
}

