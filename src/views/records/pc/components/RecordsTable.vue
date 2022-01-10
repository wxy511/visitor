<template>
  <div>
    <el-table
      ref="recordTable"
      v-loading="tableloading"
      :data="recordsList"
      class="table-class"
      :border="false"
      header-row-class-name="tableheaderrowclass"
      :row-class-name="TableRowClassName"
      :cell-style="stateTableCellStyle"
      :cell-class-name="tableCellName"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column :label="$t('regcode')" align="left" width="150">
        <template slot-scope="scope">
          <span class="r_border-left"></span>{{ scope.row.regcode }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('RegInfo.Vdate')" align="left">
        <template slot-scope="scope">
          <span>{{ showRegData(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('RegInfo.Vbranch')" align="left">
        <template slot-scope="scope">
          <span>{{ showBranch(scope.row.Vbranch) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RegInfo.Vpurpose')"
        prop="Vpurpose"
        align="left"
      >
      </el-table-column>
      <el-table-column
        :label="$t('RegInfo.Vname')"
        prop="Vname"
        align="left"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <template v-if="userType === 'e'">
        <el-table-column
          :label="$t('RegInfo.Vunit')"
          prop="Vunit"
          align="left"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </template>
      <el-table-column
        :label="$t('RegInfo.host')"
        prop="Ename"
        align="left"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        v-if="type === 'visited'"
        :label="$t('Records.status.Rtimein')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.showRtimein || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('Records.status.label')"
        align="left"
        width="100"
      >
        <template slot-scope="scope">
          <span class="r_text">{{
            $t("Records.status." + scope.row.status)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        type="operation"
        :label="$t('Records.details.title')"
      >
        <div slot-scope="scope">
          <el-button
            plain
            size="mini"
            @click="showDetails(scope.row)"
            class="tablebtn"
            ><i class="el-icon-document"></i
          ></el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-pagination
      :hide-on-single-page="false"
      :total="totalcount"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="getPageSize"
      style="text-align: center; margin-top: 20px"
      :background="location_cfg.page_bk"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pageindex"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <div style="height: 20px"></div>
    <record-details
      :data="drawerInfo"
      ref="RecordDetails"
      :py_config="py_config"
    ></record-details>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { showTimeZone } from "@/utils/reqDataTrans";
import { s_RQuery } from "@/api/api.js";
import { recordFormat, format_riskLevel } from "@/utils/visitor";
import RecordDetails from "@/components/RecordDetails";

export default {
  name: "RecordsTable",
  components: {
    RecordDetails,
  },
  props: {
    type: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      cancelRegTip: "",
      detailsDrawerVisible: false,
      tableloading: false,
      queryReqData: null,
      recordsList: [],
      totalcount: 0,
      pageindex: 1,
      drawerInfo: {},
    };
  },
  computed: {
    ...mapState([
      "mainclr",
      "config",
      "TERMINAL",
      "stateTableCellStyle",
      "location_cfg",
      "userType",
      "py_config",
      "rights",
    ]),
    ...mapGetters(["language", "showBranch", "getPageSize", "riskRegions_map"]),
    headerRightShow() {
      if (this.drawerInfo.status === "valid") {
        return "cancel";
      } else if (this.drawerInfo.status === "invalid") {
        if (this.drawerInfo.approved == 100) {
          return "noApproval";
        } else if (this.drawerInfo.approved == 0) {
          return "noVisit";
        }
      }
    },
  },
  created() {},
  methods: {
    ...mapActions(["setLastPageSize"]),
    tableCellName({ row, column, rowIndex, columnIndex }) {
      if (
        column.property == "Vname" &&
        row.Vinblack &&
        this.rights.Vinblack &&
        !row.GroupNum
      ) {
        return "table-cell-black";
      }
      return "table-cell";
    },
    initRecord(queryReqData) {
      this.queryReqData = queryReqData;
      this.UpdateRecord(queryReqData);
    },
    UpdateRecord(queryReqData, pageindex = null, pagesize = null) {
      queryReqData.pageindex = pageindex || this.pageindex;
      queryReqData.pagesize = pagesize || this.getPageSize;
      this.tableloading = true;
      this.recordsList = [];
      this.totalcount = 0;
      let self = this;
      s_RQuery(queryReqData)
        .then(function (response) {
          if (!response.reg) {
            response.reg = [];
          }
          var recordsList = [];
          response.reg.forEach((item) => {
            recordsList.push(recordFormat(item));
          });
          self.recordsList = recordsList;
          self.totalcount = response.totalcount || 0;
          self.pageindex = queryReqData.pageindex;
          self.tableloading = false;
        })
        .catch(function (error) {
          self.tableloading = false;
        });
    },
    errorGeneral() {
      this.$message({
        type: "error",
        showClose: true,
        message: this.$t("erGeneral"),
      });
    },
    onCancelReg(data, response) {
      this.drawerInfo.status = "cancel";
      this.UpdateRecord(this.queryReqData);
    },
    TableRowClassName({ row, rowIndex }) {
      return "record-" + row.status;
    },
    onChangeCheck(val) {
      this.results = val ? this.errorData : this.fullData;
    },
    showRegData(row) {
      let _Vdate = String(row["Vdate"]);
      var showVdate =
        _Vdate.substr(0, 4) +
        "/" +
        _Vdate.substr(4, 2) +
        "/" +
        _Vdate.substr(6, 2);
      if (row["Vtime"]) {
        let _end = row["Vtime"] + 200;
        let _time = String(row["Vtime"]);
        let sub = _time.substr(0, _time.length - 2);
        let stimeS = _time.replace(sub, sub + ":");
        showVdate = showVdate + " " + stimeS;
      }
      return showTimeZone(showVdate, row["TimeZoneValue"]);
    },
    handleCurrentChange(val) {
      this.UpdateRecord(this.queryReqData, val, this.getPageSize);
    },
    handleSizeChange(val) {
      this.setLastPageSize(val);
      this.UpdateRecord(this.queryReqData, val, 1);
    },
    showDetails(row) {
      if (this.py_config.riskRegions) {
        row = format_riskLevel(row, this.riskRegions_map);
      }
      this.drawerInfo = row;
      this.$refs["RecordDetails"].visible();
      this.detailsDrawerVisible = true;
    },
  },
};
</script>
<style lang="scss">
@import "@/styles/define.scss";
$status-left-width: 5px;
$drawer-left-width: 3px;
.table-class .table-cell-black {
  background-color: #e5e5e5 !important;
  border-bottom: 1px solid #fafaf3;
}
.cancelTip {
  padding: 10px;
  margin-bottom: 10px;
  font-size: 15px;
}
.table-class {
  width: 100%;
  overflow-y: auto;
}

.tablebtn {
  height: 28px;
  width: 30px;
  text-align: center;
  padding: 3px;
  margin: 0 2px;
  font-size: 1rem;
  color: $mainclr2;
  border-collapse: $mainclr2;
}
.rinfo-drawer {
  min-width: 500px;
  padding: 15px 10px;
}

.rinfo-drawer__content {
  border-top: 1px solid $line;
  padding: 15px 10px;
  .title {
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-size: 1rem;
    font-weight: lighter;
    color: #08263a;
  }
  .reg-card {
    margin: 10px 0;
    padding-top: 5px;
    padding-left: 5px;
    width: 100%;
  }
}
.rinfo-drawer__header {
  font-size: 1.3rem;
  padding-bottom: 15px;
  overflow-y: auto;
  .left {
    float: left;
    height: 40px;
    line-height: 40px;
  }
  .right {
    line-height: 40px;
    .btn {
      float: right;
    }
  }
}
</style>