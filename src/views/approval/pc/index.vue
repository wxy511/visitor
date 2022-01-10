<template>
  <div>
    <div class="light-gray-background card-panel-white">
      <el-row class="record-query" :gutter="20">
        <el-col :span="18">
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
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="label">&nbsp;</div>
          <el-button
            type="primary"
            @click="handleSearch"
            class="btn-search"
            :disabled="tableloading"
          >
            <i v-show="tableloading" class="el-icon-loading icon"></i>
            <i v-show="!tableloading" class="el-icon-search icon" />
            {{ $t("Records.btnQuery") }}
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="light-gray-background card-panel-white">
      <el-table
        ref="recordTable"
        v-loading="tableloading"
        :element-loading-text="$t('approval.tips.groupApprove')"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :data="recordsList"
        class="table-class"
        :border="false"
        header-row-class-name="tableheaderrowclass"
        lazy
        :load="LazyLoad"
        row-key="key"
        :cell-style="stateTableCellStyle"
        :cell-class-name="tableCellName"
        :tree-props="{ children: 'group', hasChildren: 'GroupNum' }"
      >
        >
        <el-table-column :label="$t('RegInfo.Vdate')" align="left" width="300">
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
          :label="$t('approval.visitor')"
          prop="Vname"
          align="left"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-show="scope.row.GroupNum">{{
              scope.row.GroupNum + $t("approval.people")
            }}</span>
            <span v-show="!scope.row.GroupNum">
              <span
                v-if="scope.row.Vinblack && rights.Vinblack"
                class="black"
                >{{ scope.row.Vname }}</span
              >
              <span v-else>{{ scope.row.Vname }}</span>
            </span>
          </template>
        </el-table-column>
        <template v-if="py_config.riskRegions">
          <el-table-column
            :label="$t('riskRegions.tableLabel')"
            prop="regionsName"
            width="200"
            align="left"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-show="!scope.row.GroupNum">
                <span
                  v-show="scope.row.regionsName"
                  :class="'risk-level-' + scope.row.riskLevel"
                >
                  <span class="r_tag" v-if="scope.row.regionsName">
                    {{ $t("riskRegions.level.-" + scope.row.riskLevel) }}
                  </span>
                </span>
                <span>
                  {{ scope.row.regionsName || "" }}
                </span>
              </span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          :label="$t('approval.host')"
          prop="Ename"
          align="left"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column width="200" type="operation" :label="$t('operate')">
          <div slot-scope="scope" class="table-operate">
            <div
              style="display: inline-block"
              v-show="scope.row.approved === 100"
            >
              <confirm-popover
                :type="scope.row.bGroup ? 'pass' : 'passAll'"
                placement="bottom"
                :width="250"
                :context="scope.row"
                v-if="
                  !(
                    scope.row.Vinblack &&
                    rights.Vinblack &&
                    !scope.row.GroupNum
                  )
                "
                @onConfirm="onConfirm"
              >
                <div slot="title">{{ $t("approval.tips.pass") }}</div>
                <div slot="content" class="approvalPass">
                  <span>
                    {{
                      $t("approval.tips.passConfirm", {
                        num: scope.row.GroupNum
                          ? scope.row.GroupNum + $t("approval.people")
                          : scope.row.Vname,
                      })
                    }}
                  </span>
                </div>
                <template slot="reference">
                  <el-tooltip
                    class="item"
                    :open-delay="delay"
                    effect="light"
                    :content="
                      $t(
                        'approval.tips.' +
                          (scope.row.GroupNum ? 'passAll' : 'pass')
                      )
                    "
                    placement="bottom"
                  >
                    <el-button
                      plain
                      size="mini"
                      :class="!scope.row.GroupNum ? 'pass' : 'passAll'"
                    >
                      <!-- <i class="el-icon-s-check"></i> -->
                      <svg-icon icon-class="approve"></svg-icon>
                    </el-button>
                  </el-tooltip>
                </template>
              </confirm-popover>
              <!-- <el-divider direction="vertical"></el-divider> -->
              <confirm-popover
                :type="scope.row.bGroup ? 'reject' : 'rejectAll'"
                placement="bottom"
                :width="250"
                :context="scope.row"
                @onConfirm="onConfirm"
              >
                <div slot="title">{{ $t("approval.tips.reject") }}</div>
                <div slot="content" class="approvalPass">
                  <span>
                    {{
                      $t("approval.tips.rejectConfirm", {
                        num: scope.row.GroupNum
                          ? scope.row.GroupNum + $t("approval.people")
                          : scope.row.Vname,
                      })
                    }}
                  </span>
                </div>
                <template slot="reference">
                  <el-tooltip
                    class="item"
                    :open-delay="delay"
                    effect="light"
                    :content="
                      $t(
                        'approval.tips.' +
                          (scope.row.GroupNum ? 'rejectAll' : 'reject')
                      )
                    "
                    placement="bottom"
                  >
                    <el-button
                      plain
                      size="mini"
                      :class="!scope.row.GroupNum ? 'reject' : 'rejectAll'"
                    >
                      <svg-icon icon-class="Reject"></svg-icon>
                      <!-- <i class="el-icon-s-check"></i> -->
                    </el-button>
                  </el-tooltip>
                </template>
              </confirm-popover>
            </div>
            <div
              style="display: inline-block"
              v-show="scope.row.approved !== 100"
              class="status-text"
            >
              <span :class="' status' + String(scope.row.approved || 0)">
                {{
                  $t("approval.status.status" + String(scope.row.approved || 0))
                }}
              </span>
            </div>
            <div v-show="!scope.row.GroupNum" style="display: inline-block">
              <!-- <el-divider direction="vertical"></el-divider> -->
              <el-tooltip
                class="item"
                :open-delay="delay"
                effect="light"
                :content="$t('approval.tips.details')"
                placement="bottom"
              >
                <el-button
                  plain
                  size="mini"
                  @click="tableOperate('details', scope.row)"
                  class="details"
                >
                  <i class="el-icon-document"></i>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        :hide-on-single-page="false"
        :total="totalcount"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="getPageSize"
        :current-page.sync="pageindex"
        style="text-align: center; margin-top: 20px"
        :background="location_cfg.page_bk"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <div style="height: 20px"></div>
      <record-details :data="drawerInfo" ref="RecordDetails"></record-details>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { date_format } from "@/utils/GlobalFunction";
import {
  s_RPendingQuery,
  s_RPendingPass,
  s_RPendingReject,
} from "@/api/api.js";
import RecordDetails from "@/components/RecordDetails";
import ConfirmPopover from "@/components/ConfirmPopover";
import { recordFormat, format_riskLevel } from "@/utils/visitor";

export default {
  name: "approval",
  components: {
    RecordDetails,
    ConfirmPopover,
  },
  data() {
    return {
      delay: 500,
      drawerInfo: {},
      loading: false,
      tableloading: false,
      queryReqData: null,
      recordsList: [],
      totalcount: 0,
      pageindex: 1,
      pagesize: 20,
      pickerOptions: {
        disabledDate: function (time) {
          let _nowdata = parseInt(date_format(new Date(), "yyyyMMdd"));
          let _checkdata = parseInt(date_format(time, "yyyyMMdd"));
          return _checkdata < _nowdata;
        },
      },
      query: {
        date: [],
        keyword: "",
        regcode: "",
      },
      TableParentMap: new Map(),
    };
  },
  computed: {
    ...mapState([
      "mainclr",
      "py_config",
      "config",
      "TERMINAL",
      "lastPageSize",
      "stateTableCellStyle",
      "location_cfg",
      "rights",
    ]),
    ...mapGetters([
      "language",
      "showBranch",
      "userInfo",
      "getPageSize",
      "riskRegions_map",
    ]),
  },
  created() {
    var end = new Date();
    var start = new Date();
    const now = new Date();
    end.setTime(now.getTime() + 3600 * 1000 * 24 * 30);
    var { start, end } = this.setQueryHMS(start, end);
    this.query.date = [start.getTime(), end.getTime()];
    this.initData();
  },
  mounted() {},
  methods: {
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
    setQueryHMS(start, end) {
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      return { start, end };
    },
    initData() {
      this.queryRecord();
    },
    handleCurrentChange(val) {
      this.UpdateRecord(this.queryReqData, val, this.getPageSize);
    },
    handleSizeChange(val) {
      this.setLastPageSize(val);
      this.UpdateRecord(this.queryReqData, 1, val);
    },
    showRegData(row) {
      if (row.bGroup) {
        return "";
      }

      if (row.TimeSpace) {
        var dateArray = row.TimeSpace.split("-");
        var _showDate = dateArray[0];
        _showDate =
          _showDate.substr(0, 4) +
          "/" +
          _showDate.substr(4, 2) +
          "/" +
          _showDate.substr(6, 2);

        if (dateArray.length > 1) {
          var _endDate = dateArray[1];
          _endDate =
            _endDate.substr(0, 4) +
            "/" +
            _endDate.substr(4, 2) +
            "/" +
            _endDate.substr(6, 2);
          _showDate = _showDate + " - " + _endDate;
        }

        return _showDate;
      }
      return "";
    },
    handleSearch() {
      this.queryRecord();
    },
    tableOperate(type, row) {
      if (type == "details") {
        this.drawerInfo = recordFormat(row);
        this.$refs["RecordDetails"].visible();
      } else {
        this.recordApprove(row, type, true);
        this.refreshLoadTree(row.groupid || row.id);
      }
    },
    async GroupApprove(leaderID, type) {
      var self = this;
      var reqData = {
        startTime: String(
          date_format(new Date(this.query.date[0]), "yyyyMMdd")
        ),
        endTime: String(date_format(new Date(this.query.date[1]), "yyyyMMdd")),
        LeaderID: leaderID,
      };
      self.tableloading = true;
      var response = await s_RPendingQuery(reqData);
      if (response && response.error == 0) {
        var recordsList = response.reg || [];
        for (let index = 0; index < recordsList.length; index++) {
          const item = recordsList[index];
          if (item["approved"] == 100 && !item["Vinblack"]) {
            await self.recordApprove(item, type, false);
          }
        }
      }
      self.initData();
      self.tableloading = false;
    },
    async recordApprove(data, type, showMsg = true) {
      var self = this;
      var reqData = {
        regcode: data.regcode,
      };
      var response = null;
      var msg = null;
      if (type == "pass") {
        response = await s_RPendingPass(reqData);
        msg = self.$t("approval.tips.passSuccs");
      } else if (type == "reject") {
        response = await s_RPendingReject(reqData);
        msg = self.$t("approval.tips.rejectSuccs");
      }

      if (response && response.error == 0 && showMsg && msg) {
        self.$message({
          type: "success",
          message: msg,
        });
      }
    },
    queryRecord() {
      var self = this;
      this.tableloading = true;
      var reqData = {
        startTime: String(
          date_format(new Date(this.query.date[0]), "yyyyMMdd")
        ),
        endTime: String(date_format(new Date(this.query.date[1]), "yyyyMMdd")),
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      };
      var nowtime = String(new Date().getTime() / 1000);
      s_RPendingQuery(reqData)
        .then(function (response) {
          var recordsList = response.reg || [];
          recordsList.forEach((item) => {
            if (self.py_config.riskRegions) {
              item = format_riskLevel(item, self.riskRegions_map);
            }
            item["key"] =
              String(item["id"]) + "-" + nowtime + "-" + item["regcode"];
          });
          self.recordsList = recordsList;
          self.totalcount = response.totalCount || 0;
          self.tableloading = false;
        })
        .catch(function (error) {
          self.$message({
            type: "error",
            showClose: true,
            message: self.$t("erGeneral"),
          });
          self.tableloading = false;
        });
    },
    LazyLoad(tree, treeNode, resolve) {
      this.TableParentMap.set(tree.id, { tree, treeNode, resolve });
      var self = this;
      var reqData = {
        // startTime:String(date_format(new Date(this.query.date[0]),'yyyyMMdd')),
        // endTime:String(date_format(new Date(this.query.date[1]),'yyyyMMdd')),
        LeaderID: tree.id,
      };
      var nowtime = String(new Date().getTime() / 1000);
      s_RPendingQuery(reqData)
        .then(function (response) {
          var recordsList = response.reg || [];
          recordsList.forEach((item) => {
            if (self.py_config.riskRegions) {
              item = format_riskLevel(item, self.riskRegions_map);
            }
            item["bGroup"] = true;
            item["key"] =
              String(item["id"]) + "-" + nowtime + "-" + item["regcode"];
          });
          resolve(recordsList);
        })
        .catch(function (error) {
          resolve([]);
        });
    },
    refreshLoadTree(parentId) {
      const { tree, treeNode, resolve } = this.TableParentMap.get(parentId);
      if (tree) {
        this.LazyLoad(tree, treeNode, resolve);
      }
    },
    async onConfirm(data, index, type) {
      if (type == "pass" || type == "reject") {
        await this.recordApprove(data, type);
        this.refreshLoadTree(data.groupid || data.id);
      } else if (type == "passAll") {
        console.log(data);
        this.GroupApprove(data.id, "pass");
      } else if (type == "rejectAll") {
        this.GroupApprove(data.id, "reject");
      }
    },
  },
};
</script>

<style lang="scss">
.table-class .table-cell-black {
  background-color: #e5e5e5 !important;
  border-bottom: 1px solid #fafaf3;
}
.status-text {
  width: 85px;
  text-align: center;
}
.record-query {
  max-width: 600px;
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

.tablebtn {
  height: 28px;
  width: 30px;
  text-align: center;
  padding: 3px;
  margin: 0 2px;
  font-size: 1rem;
}

.table-operate {
  .details {
    @extend .tablebtn;
    color: $icon-details;
    border-color: rgba($icon-details, 0.3);
  }
  .passAll {
    @extend .tablebtn;
    color: $record-valid;
    border-color: $record-valid;
    background: rgba($record-valid, 0.1);
  }
  .rejectAll {
    @extend .tablebtn;
    color: $record-reject;
    border-color: $record-reject;
    background: rgba($record-reject, 0.1);
  }
  .pass {
    @extend .tablebtn;
    color: $record-valid;
    border-color: rgba($record-valid, 0.4);
  }
  .reject {
    @extend .tablebtn;
    color: $record-reject;
    border-color: rgba($record-reject, 0.4);
  }
}
.status0 {
  color: $record-valid;
}
.status-1 {
  color: $record-cancel;
}
.status-100 {
  color: $record-reject;
}
</style>
