<template>
  <div>
    <div class="light-gray-background card-panel-white">
      <el-row class="record-query" :gutter="20">
        <el-col :span="8">
          <div class="label">{{ $t("Records.date") }}</div>
          <el-date-picker
            :editable="false"
            ref="queryDate"
            v-model="query.date"
            type="daterange"
            style="width: 100%"
            unlink-panels
            value-format="timestamp"
            range-separator=" - "
            :start-placeholder="$t('Records.startDate')"
            :end-placeholder="$t('Records.endDate')"
            :picker-options="regQuerypickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="label">{{ $t("Records.keyword") }}</div>
          <el-input
            v-model="query.keyword"
            :placeholder="$t('Records.pldkeyword' + userType)"
            maxlength="11"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6">
          <div class="label">{{ $t("regcode") }}</div>
          <el-input v-model="query.regcode" maxlength="10" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <div class="label">&nbsp;</div>
          <el-button
            type="primary"
            @click="handleSearch"
            class="btn-search"
            :disabled="loading"
          >
            <i v-show="loading" class="el-icon-loading icon"></i>
            <i v-show="!loading" class="el-icon-search icon" />
            {{ $t("Records.btnQuery") }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="light-gray-background card-panel-white">
      <el-tabs v-model="activeTab" @tab-click="tabsClick">
        <el-tab-pane
          v-for="item in tabsList"
          :name="item.name"
          :key="item.name"
        >
          <span slot="label" class="tabs-title">
            {{ $t("Records." + item.labelkey) }}
          </span>
          <keep-alive>
            <records-table
              :type="item.name"
              :ref="'table' + item.name"
            ></records-table>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import RecordsTable from "./components/RecordsTable";
import { date_format } from "@/utils/GlobalFunction";

export default {
  name: "records",
  components: {
    RecordsTable,
  },
  computed: {
    ...mapState([
      "mainclr",
      "py_config",
      "config",
      "TERMINAL",
      "lastPageSize",
      "userType",
    ]),
    ...mapGetters(["language", "showBranch", "userInfo"]),
  },
  data() {
    return {
      regQuerypickerOptions: {
        shortcuts: [
          {
            text: this.$t("Records.nextweek"),
            onClick: function (picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("Records.lastmonth"),
            onClick: function (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("Records.lastyear"),
            onClick: function (picker) {
              const end = new Date();
              const start = new Date();
              start.setYear(start.getFullYear() - 1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      query: {
        date: [],
        keyword: "",
        regcode: "",
      },
      loading: false,
      activeTab: "all",
      tabsList: [
        { labelkey: "tabs.all", name: "all" },
        { labelkey: "tabs.valid", name: "valid" },
        { labelkey: "tabs.visited", name: "visited" },
        { labelkey: "tabs.invalid", name: "invalid" },
      ],
      testdata: "",
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    var end = new Date();
    var start = new Date();
    const now = new Date();
    end.setTime(now.getTime() + 3600 * 1000 * 24 * 15);
    start.setTime(now.getTime() - 3600 * 1000 * 24 * 350);
    var { start, end } = this.setQueryHMS(start, end);
    this.query.date = [start.getTime(), end.getTime()];
    this.$nextTick(() => {
      this.tabsClick({ name: "all" });
    });
  },
  methods: {
    setQueryHMS(start, end) {
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      return { start, end };
    },
    initData() {},
    handleSearch() {
      this.loading = true;
      setTimeout(() => {
        this.queryRecord(this.activeTab);
        this.loading = false;
      }, 500);
    },
    queryRecord(type) {
      var reqData = {
        starttimeUTC: String(
          date_format(new Date(this.query.date[0]), "yyyyMMdd")
        ),
        endtimeUTC: String(
          date_format(new Date(this.query.date[1]), "yyyyMMdd")
        ),
      };
      if (this.query.keyword) {
        reqData.keyword = this.query.keyword;
        // reqData.keywordtype = 1
      }
      if (this.query.regcode) {
        reqData.regcode = this.query.regcode;
      }

      let ref = "table" + type;

      if (type == "valid") {
        reqData.onlyregister = 1;
        reqData.onlyapproved = 1;
        reqData.starttimeUTC = String(date_format(new Date(), "yyyyMMdd"));
      } else if (type == "invalid") {
        reqData.onlyInvalid = 1;
      } else if (type == "visited") {
        reqData.onlyrecord = 1;
      }

      // console.log(reqData)
      this.$nextTick(() => {
        if (this.$refs[ref]) {
          this.$refs[ref][0].initRecord(reqData);
        }
      });
    },
    tabsClick(tab) {
      this.queryRecord(tab.name);
    },
  },
};
</script>

<style lang="scss">
.record-query {
  max-width: 1200px;
  width: 100%;
  .label {
    font-size: 1rem;
    color: $spanclr;
    margin-bottom: 10px;
  }
  .btn-search {
    .icon {
      margin-right: 5px;
      font-weight: bold;
    }
  }
}
.tabs-title {
  font-size: 1.1rem;
}
</style>
