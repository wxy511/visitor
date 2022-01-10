/**
 * 提交预约：
 * reserved1: name
 * reserved2：code
 */

const location_config = {
    location_config:{
        page_bk:true, //分页背景色
        logo:'logo.svg', //logo
        reserved1:'riskRegions.tableLabel',
    },
    test_py_config:{
        'changeLng':true,//是否可以切换语言
        'suffix':"@icdsecurity.com",//邮箱后缀
        'E_hostType':'q_email',//员工查询方式q_email q_name q_phone input
        'V_hostType':'input',//访客填写员工信息方式 q_email q_name q_phone input
        'debug':false, //开启vConsole
        'custom':'UNNC',//客户
        'mainclr':'#005597',//主题色
        'approved':100, //100 需要审批
        'regis_group':true, //excel批量导入访客信息
        'e_otherHost':false, //员工代他人预约
        'IgnoreBlacklist':1, //访客提交预约时，忽视黑名单 0不忽视 1忽视
        'riskRegions':false,
        "testReport":1,
        "noticeForUse":1
    }
}

export default location_config