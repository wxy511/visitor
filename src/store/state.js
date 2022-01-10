export default {
/*
    [sync_ 前缀]为多页面数据同步
    [_ele  后缀]为element-ui需求结构
*/
    keepAliveRouterList:[],
    elementSize:'',
    app:null,
    hasInit:false,
    embeddedAPP:false,

    location_cfg:{},
    py_config:{},
    config:{},
    rights:{},

    mainclr:'#0f6349',
    TERMINAL:'pc',
    stateTableCellStyle:{padding:'5px 0'},
    lastPageSize:20,
    lastCountryCode:'86',
    lastBranch:'',
    
    userType:null,
    userInfo:{},
    user_complete:true,
    navList:[],

    branchList:[],
    purposeList:[],
    countrycodeList:[],
    nationList:[],
    nationMap_en_code:{},
    nationMap_code_obj:{},

    sync_xs_selVisitorList:[],
    sync_record_details:null,
    sync_pendding_group:null,

    noticeForUse_url:'',
    token:'aa703c1d6927e15a98d86765744b50532a6203666d9ecfb811176babd809c03e', //HOST
    //token:'911e7068601985d129f4113706e164affe939a82a96ca0344634d2a5949d4180', // visitor
}