import i18n from "@/i18n/index";
export default {
  nationMap_en_code: state => state.nationMap_en_code,
  riskRegions_map: state => state.riskRegions.riskRegions_map,
  riskRegionsList: state => state.riskRegions.riskRegions_ele,
  lastRegionsList: state => state.riskRegions.lastRegions_ele,
  rights: state => state.rights,
  pcRoutes: state => state.permission.routes,
  webRoutes: state => state.permission.webRoutes,
  keepAliveRouterList: state => state.permission.keepAliveRouterList,

  language: state => state.layout.language,
  lastCountryCode: state => state.lastCountryCode,
  sync_xs_selVisitorList: state => state.sync_xs_selVisitorList,
  sync_record_details: state => state.sync_record_details,
  sync_pendding_group: state => state.sync_pendding_group,
  lastBranch: state => state.lastBranch,
  getPageSize: state => state.lastPageSize,
  name(state) {
    if (state.userInfo) {
      return state.userInfo.Vname || state.userInfo.Ename || 'Welcome'
    }
    return 'Welcome'
  },
  sidebar: state => state.layout.sidebar,
  user_complete: state => state.user_complete,
  userInfo: state => state.userInfo,
  userCustomerid: state => state.userInfo.customerid || state.sync_selCustomer.customerid || null,
  userRole: state => state.userInfo.role || 1,
  getSiteByID(state, siteid) {
    if (!siteid) return null
    state.customerSite.forEach(site => {
      if (site.siteid === siteid) return site
    });
  },
  showBranch: (state) => (code) => {
    if (!code) return code
    for (let index = 0; index < state.branchList.length; index++) {
      const item = state.branchList[index];
      if (code === item['code']) {
        return state.layout.language === 'cn' ? item['cn'] : item['en']
      }
    }
    return code
  },
  getPriority(state) {
    const PriorityList = [{
        'label': i18n.t('Priority.4'),
        'value': '4',
        'desc': i18n.t('Priority.4desc')
      },
      {
        'label': i18n.t('Priority.5'),
        'value': '5',
        'desc': i18n.t('Priority.5desc')
      },
      {
        'label': i18n.t('Priority.1'),
        'value': '1',
        'desc': i18n.t('Priority.1desc')
      }
    ]
    return PriorityList
  },
  branchList(state) {
    state.branchList.forEach(item => {
      item['label'] = state.layout.language == 'en' ? item['en'] : item['cn']
    });
    return state.branchList
  },
  purposeList(state) {
    state.purposeList.forEach(item => {
      item['label'] = state.layout.language == 'en' ? item['en'] : item['cn']
    });
    return state.purposeList
  },
  countrycodeList(state) {
    state.countrycodeList.sort(function (a, b) {
      var sortval = a[state.layout.language].localeCompare(b[state.layout.language])
      return sortval || false
    });
    state.countrycodeList.forEach(item => {
      item['nation'] = state.layout.language == 'en' ? item['en'] : item['cn']
      item['label'] = '+' + item['countrycode']
      item['img'] = '/static/images/svg/' + item['code2'] + '.svg'
    });
    return state.countrycodeList
  },
  nationList(state) {
    state.nationList.forEach(item => {
      item['label'] = state.layout.language == 'en' ? item['en'] : item['cn']
      item['img'] = '/static/images/svg/' + item['code2'] + '.svg'
    });
    return state.nationList
  },
}
