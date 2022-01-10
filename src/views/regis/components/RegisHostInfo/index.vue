<template>
  <div v-if="type === 'q_email'">
    <el-autocomplete
      :size="size"
      v-model="hostInfo.Eemail"
      popper-class="elist-autocomplete"
      :fetch-suggestions="queryHost"
      prefix-icon="el-icon-search"
      @select="hostlistSelect"
      :placeholder="$t('Regis.placeholder.fuzzysearch')"
      class="Eautocomplete"
    >
      <!-- <el-select v-model="select" slot="append" placeholder="请选择">
        <el-option :label="py_config.suffix" :value="py_config.suffix"></el-option>
        <el-option label="订单号" value="2"></el-option>
        <el-option label="用户电话" value="3"></el-option>
      </el-select> -->
      <template slot="append" v-if="type === 'q_email'">{{
        py_config.suffix
      }}</template>
      <template slot-scope="scope">
        <div class="list-name">{{ scope.item.Ename }}</div>
        <span class="list-email">{{ scope.item.Eemail }}</span>
      </template>
    </el-autocomplete>
    <p
      style="color: red; font-size: 0.8rem; margin-top: 0"
      v-show="hostInfo.notfound"
    >
      <span>{{ $t("Regis.placeholder.notfoundHost") }}</span>
    </p>
  </div>
  <div v-else-if="type === 'input'">
    <el-input
      v-model="hostInfo.Eemail"
      :placeholder="$t('Regis.placeholder.q_input')"
      class="Eautocomplete"
    >
      <template slot="append">{{ py_config.suffix }}</template>
    </el-input>
  </div>
</template>
<script>
import { s_EQuery } from "@/api/api.js";
import DetailsItem from "@/components/DetailsItem/DetailsItem_APP.vue";
import { mapState, mapGetters } from "vuex";
import { str_gblen } from "@/utils/GlobalFunction.js";

export default {
  name: "HostInfo",
  components: {
    DetailsItem,
  },
  props: {
    type: {
      type: String,
      default: "q_email",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hostInfo: {
      type: Object,
      default: {},
    },
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      showEname: false,
      select: "",
    };
  },
  computed: {
    ...mapState(["config", "userType", "py_config"]),
    ...mapGetters(["showBranch", "userInfo"]),
  },
  created() {},
  methods: {
    hostlistSelect: function (item) {
      let self = this;
      self.hostInfo.Eemail = item.Eemail.split("@")[0];
      self.hostInfo.EHID = item.EHID;
      self.hostInfo.Ename = item.Ename;
    },
    // queryHost:function(queryString, cb){
    //   let self = this
    //   return self.queryHostInfo(queryString, cb)
    // },
    queryHost: function (queryString, cb) {
      let self = this;
      const type = self.type;
      self.hostInfo.notfound = false;
      let strLeng = 4;
      if (type == "q_phone") {
        strLeng = 8;
      }
      if (str_gblen(queryString) < strLeng) {
        // self.hostInfo.notfound = true
        self.hostInfo.EHID = 0;
        cb([]);
        return;
      }
      var reqdata = {};
      if (type == "q_email") {
        reqdata = { Eemail: queryString };
      }
      setTimeout(() => {
        s_EQuery(reqdata)
          .then(function (response) {
            if (response.error == 0 && response.emp) {
              self.hostInfo.notfound = false;
              self.hostInfo.lastsearch = queryString;
              let _emp = [];
              if (response.emp) {
                response.emp.forEach(function (item, index) {
                  if (item.Eemail) {
                    let _e = item.Eemail.split("@");
                    if (_e[1] && "@" + _e[1] == self.py_config["suffix"]) {
                      _emp.push(item);
                    }
                  }
                });
              }
              cb(_emp);
            } else {
              cb([]);
              self.hostInfo.EHID = 0;
              if (response.error !== 0) {
                self.toastMsg("erGeneral", "el-icon-close", "center");
              } else {
                self.hostInfo.notfound = true;
              }
            }
          })
          .catch(function (error) {
            cb([]);
            self.hostInfo.EHID = 0;
            self.toastMsg("erGeneral", "el-icon-close", "center");
          });
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.elist-autocomplete {
  width: 100%;
  li {
    line-height: normal;
    padding: 7px;
    .list-name {
      text-overflow: ellipsis;
      overflow: hidden;
      color: $spanclr;
      font-size: 16px;
    }
    .list-email {
      font-size: 14px;
      color: $form-icon;
    }
    .highlighted .list-email {
      color: #ddd;
    }
  }
}
.Eautocomplete {
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
}
</style>