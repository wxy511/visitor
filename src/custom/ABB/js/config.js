const location_config = {
    location_config:{
        page_bk:false,
        regis_group:true,
        logo:'logo.svg',
        reserved1:'riskRegions.tableLabel',
    },
    test_py_config:{
        'changeLng':true,
        'suffix':"@icdsecurity.com",
        'E_hostType':'q_email',//q_email q_name q_phone input
        'V_hostType':'q_email',//q_email q_name q_phone input
        'debug':false,
        'custom':'ABB',//ICD ABB
        'mainclr':'#ff000f',//#00664b #ff000f
        'approved':100,
        'regis_group':true,
        'e_otherHost':true,
        'IgnoreBlacklist':1, //访客提交预约时，忽视黑名单 0不忽视 1忽视
        'riskRegions':1,
        "noticeForUse":0
    }
}

export default location_config