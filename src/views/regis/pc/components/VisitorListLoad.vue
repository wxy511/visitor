// 批量导入的弹窗
<template>
  <div class="vlist">
    <div slot="title" class="dialog-header">
      <el-upload
        ref="uploadexcel"
        action=""
        :limit="2"
        :file-list="FileList"
        accept=".xlsx,.xls,.XLS,.XLSX"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handUpaloadChange"
        style="display: inline-block"
      >
        <!-- 有待审批，应该是员工进入--批量导入---导入Excel 按钮 -->
        <el-button
          type="primary"
          slot="trigger"
          icon="el-icon-document"
          :loading="loadLoading"
          @click="handImportClick"
        >
          {{ $t("Regis.load.btnLoad") }}
        </el-button>
      </el-upload>
      <span class="tips">
        <i
          class="el-icon-warning"
          style="color: #e6a23c; font-size: 1.2rem"
        ></i>
        <span> {{ $t("Regis.load.tip1") }} </span>
        <a
          id="downloadExcel"
          class="welcomeTxt"
          href="/static/VisitorTemplate/GroupVisitorTemplate.xls"
          ><u>{{ $t("Regis.load.click") }}</u></a
        >
        <span>{{ $t("Regis.load.tip2") }} </span>
        <!-- <input type="file" accept="application/vnd.ms-excel" style="display:none" id="LoadExcelinput" onchange="importFile(this)"></input>         -->
      </span>
    </div>

    <el-table
      v-loading="tableloading"
      :data="vListTable"
      ref="vList"
      class="list-table"
      :empty-text="$t('NoData')"
      :cell-style="stateTableCellStyle"
    >
      <el-table-column
        :label="$t('RegInfo.Vname')"
        prop="Vname"
        align="left"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        :label="$t('RegInfo.Vunit')"
        prop="Vunit"
        align="left"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        :label="$t('RegInfo.Vphone')"
        align="left"
        :show-overflow-tooltip="true"
      >
        <div slot-scope="scope">
          <span>
            {{
              showPhone(scope.row.Vcountrycode, scope.row.Vphone, false)
            }}</span
          >
        </div>
      </el-table-column>

      <el-table-column align="right" type="operation">
        <div slot="header" slot-scope="scope">
          <el-input
            v-model="vListsearch"
            size="mini"
            prefix-icon="el-icon-search"
            :placeholder="$t('Visitor.pldSearch')"
          />
        </div>
        <div slot-scope="scope">
          <el-button
            size="mini"
            plain
            @click="vlistEdit($event, scope.$index, scope.row)"
            class="tablebtn"
            ><i class="el-icon-edit"></i
          ></el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="true"
      :hide-on-single-page="hideonepage"
      :background="location_cfg.page_bk"
      :page-size="vListPageSize"
      style="float: left; margin-top: 15px"
      :current-page="vListCurrentPage"
      @current-change="vlistPageChange"
      layout="total, prev, pager, next, jumper"
      :total="visitorList.length"
    >
    </el-pagination>
    <div style="height: 35px"></div>
    <el-divider></el-divider>

    <div slot="footer" class="dialog-footer">
      <el-alert
        :title="$t('Regis.load.excelError1')"
        type="error"
        show-icon
        center
        :closable="false"
        v-show="excelError"
        :description="$t('Regis.load.excelError2')"
        style="margin-bottom: 20px"
      >
      </el-alert>
      <div class="downloadExcel"></div>
      <!-- 提交按钮 -->
      <el-button type="primary" @click="onSubmitExcel" class="exclesubmit">{{
        $t("submit")
      }}</el-button>
      <!-- <el-button type="primary" @click="onSubmitExcel" class="btn-group-from">{{$t('submit')}}</el-button> -->
    </div>
    <el-drawer
      ref="drawerVInfo"
      :title="$t('Regis.' + vInfoType)"
      :visible.sync="detailsDrawerVisible"
      direction="rtl"
      custom-class="vinfo-drawer"
      :modal-append-to-body="true"
      :wrapperClosable="false"
      :append-to-body="true"
    >
      <div class="vinfo-drawer__content">
        <el-form
          :model="vForm"
          :rules="vRules"
          validate-on-rule-change
          ref="vForm"
          size="small"
          label-position="left"
          label-width="0px"
        >
          <div class="home-form-row">
            <div class="home-form-col">
              <el-row>
                <el-col :span="2" class="form-icon"
                  ><i class="el-icon-user"></i
                ></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vname">
                    <el-input
                      v-model="vForm.Vname"
                      :placeholder="$t('RegInfo.Vname')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft"
                  ><span class="redstart">*</span></el-col
                >
              </el-row>
              <el-row v-if="config.Vphone && config.Vphone.E">
                <el-col :span="2" class="form-icon"
                  ><i class="el-icon-mobile-phone"></i
                ></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vphone">
                    <el-input
                      :placeholder="$t('RegInfo.Vphone')"
                      v-model="vForm.Vphone"
                      ref="Vphone"
                      class="inputBtn"
                      maxlength="11"
                      v-on:input="numberCheck('vForm', 'Vphone')"
                    >
                      <el-select
                        v-model="vForm.Vcountrycode"
                        slot="prepend"
                        class="ccode-select"
                      >
                        <country-code />
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  class="paddingleft"
                  v-if="config.Vphone && config.Vphone.R"
                  ><span class="redstart">*</span></el-col
                >
              </el-row>
              <el-row v-if="config.Vemail && config.Vemail.E">
                <el-col :span="2" class="form-icon"
                  ><i class="el-icon-message"></i
                ></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vemail">
                    <el-input
                      v-model="vForm.Vemail"
                      :placeholder="$t('RegInfo.Vemail')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  class="paddingleft"
                  v-if="config.Vemail && config.Vemail.R"
                  ><span class="redstart">*</span></el-col
                >
              </el-row>
              <el-row v-if="config.Vunit && config.Vunit.E">
                <el-col :span="2" class="form-icon"
                  ><i class="el-icon-office-building"></i
                ></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vunit">
                    <el-input
                      v-model="vForm.Vunit"
                      :placeholder="$t('RegInfo.Vunit')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  class="paddingleft"
                  v-if="config.Vunit && config.Vunit.R"
                  ><span class="redstart">*</span></el-col
                >
              </el-row>
              <el-row v-if="config.Vnation && config.Vnation.E">
                <el-col :span="2" class="form-icon"
                  ><svg-icon
                    class-name="international-icon"
                    icon-class="icd-earth"
                /></el-col>
                <el-col :span="21">
                  <el-form-item prop="Vnation">
                    <el-select
                      v-model="vForm.Vnation"
                      class="fullWidth"
                      filterable
                      :disabled="
                        vInfoType === 'EditUserInfo' &&
                        config.Vid.R &&
                        vForm.Vid != ''
                      "
                    >
                      <nation-list />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  class="paddingleft"
                  v-if="config.Vnation && config.Vnation.R"
                  ><span class="redstart">*</span></el-col
                >
              </el-row>
              <el-row v-if="config.Vid && config.Vid.E">
                <el-col :span="2" class="form-icon"
                  ><i class="el-icon-postcard"></i
                ></el-col>
                <el-col :span="7">
                  <el-form-item prop="Vidtype">
                    <el-select
                      v-model="vForm.Vidtype"
                      class="fullwidth"
                      @change="onIDTypeChange"
                    >
                      <document-id></document-id>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="form-icon">&nbsp;</el-col>
                <el-col :span="13">
                  <el-form-item prop="Vid">
                    <el-input
                      v-model="vForm.Vid"
                      :placeholder="$t('RegInfo.Vid')"
                      ref="Vid"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  class="paddingleft"
                  v-if="config.Vid && config.Vid.R"
                  ><span class="redstart">*</span></el-col
                >
              </el-row>
              <el-row v-if="config.Vplate && config.Vplate.E">
                <el-col :span="2" class="form-icon">
                  <svg-icon icon-class="drive"></svg-icon>
                </el-col>
                <el-col :span="21">
                  <el-form-item prop="Vplate">
                    <el-input
                      v-model="vForm.Vplate"
                      :placeholder="$t('RegInfo.Vplate')"
                      maxlength="11"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="paddingleft"></el-col>
              </el-row>
            </div>
          </div>
        </el-form>
        <div class="vinfo-drawer__footer">
          <el-row :gutter="50">
            <el-col :span="12">
              <el-button @click="cancelForm" class="fullWidth">{{
                $t("reset")
              }}</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                type="primary"
                @click="onSubmit('vForm')"
                :loading="loading"
                class="fullWidth"
                >{{ $t("submit") }}</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { safeInput, trim } from "@/utils/GlobalFunction";
import { gRule } from "@/utils/validateRules.js";
import CountryCode from "@/components/CountryCode";
import DocumentId from "@/components/DocumentID";
import NationList from "@/components/NationList";

import { showPhone } from "@/utils/visitor.js";
import { mapState, mapGetters } from "vuex";
import XLSX from "xlsx"; //引入xlsx

import { s_GetVList, s_VUpdate, s_VDelete } from "@/api/api.js";

export default {
  name: "VisitorListLoad",
  components: { CountryCode, DocumentId, NationList },
  props: {
    visitorType: {
      type: String,
      default: "v",
    },
  },
  data() {
    return {
      FileList: [],
      href: "/static/VisitorTemplate/GroupVisitorTemplate.xls",
      excelError: false,
      loadLoading: false,
      visitorListFull: [],
      visitorList: [],
      vListTable: [], //Table Data
      loading: false,
      tableloading: false,
      vInfoType: "newVisitor", //EditUserInfo newVisitor
      vListsearch: "",
      vListPageSize: 12,
      vListCurrentPage: 1,
      hideonepage: false,
      selList: [],
      vForm: {
        Vname: "",
        Vcountrycode: "86",
        Vphone: "",
        Vemail: "",
        Vidtype: "0",
        Vid: "",
        Vunit: "",
        Vplate: "",
        Vnation: "CHN",
      },
      vRules: {
        Vname: gRule({ configKey: "Vname" }),
        Vphone: gRule({ configKey: "Vphone" }),
        Vemail: gRule({ configKey: "Vemail", valid: "Email" }),
        Vid: gRule({ configKey: "Vid", valid: "IdCard" }),
        Vunit: gRule({ configKey: "Vunit" }),
      },
      selVArray: [],

      detailsDrawerVisible: false,
      vFormInit: {
        Vname: "",
        Vcountrycode: "86",
        Vphone: "",
        Vemail: "",
        Vidtype: "0",
        Vid: "",
        Vunit: "",
      },
      drawerInfo: {},
      editInfo: null,
      editIndex: 0,
      queryVListByEHID: {},
    };
  },
  computed: {
    ...mapState(["mainclr", "config", "stateTableCellStyle", "location_cfg"]),
    ...mapGetters([
      "countrycodeList",
      "language",
      "lastCountryCode",
      "nationMap_en_code",
    ]),
  },
  watch: {
    vListsearch: function (val) {
      this.getVisitorList(val, 1, null);
    },
  },
  methods: {
    showPhone,
    async initData() {},
    clearnData() {
      this.visitorListFull = [];
      this.vListTable = [];
      this.vListsearch = "";
      this.vListCurrentPage = 1;
      this.FileList = [];
    },
    changeIDVaild(idtype) {
      if (idtype === "0" || idtype === 0) {
        this.vRules.Vid = gRule({ configKey: "Vid", valid: "IdCard" });
      } else this.vRules.Vid = gRule({ configKey: "Vid" });
      if (this.$refs.vForm) {
        this.$nextTick(() => {
          this.$refs.vForm.validateField("Vid");
        });
      }
    },
    onIDTypeChange(val) {
      this.changeIDVaild(val);
    },
    clearSelectionRow(row) {},
    unique(arr) {
      const res = new Map();
      return arr.filter(
        (a) => !res.has(a.VVID || a.VV_ID) && res.set(a.VVID || a.VV_ID, a)
      );
    },
    // 提交按钮所调用的方法
    onSubmitExcel() {
      this.$emit("onSelVisitors", this.visitorListFull);
    },
    getVisitorList(search, page, index) {
      let self = this;
      var vlist = [];
      if (search) {
        self.visitorListFull.forEach((data) => {
          var filter1 =
            data.Vname.toLowerCase().includes(search.toLowerCase()) ||
            (data.Vunit || "").toLowerCase().includes(search.toLowerCase()) ||
            (data.Vphone || "").includes(search);

          if (filter1) {
            vlist.push(data);
          }
        });
        self.visitorList = JSON.parse(JSON.stringify(vlist));
      } else if (search == "") {
        self.visitorList = self.visitorListFull;
        vlist = self.visitorList;
      } else {
        vlist = self.visitorList;
      }
      page = page || this.vListCurrentPage;
      index = index || this.vListPageSize;
      if (vlist.length < (page - 1) * index) {
        page = 1;
      }

      this.vListTable = vlist.slice((page - 1) * index, page * index);
    },
    onSubmit(formName) {
      let self = this;
      this.$refs[formName].validate(function (valid) {
        if (valid) {
          let reqData = self.initFormData(self.vForm, self.editInfo || {});
          self.detailsDrawerVisible = false;
          self.visitorListFull[self.editIndex] = reqData;
        }
      });
    },
    vlistPageChange(val) {
      let self = this;
      self.vListCurrentPage = val;
      self.getVisitorList(null, val, null);
    },
    getRowVVID(row) {
      return String(row.VV_ID || row.VVID || 0);
    },
    vlistEdit(event, index, row) {
      let self = this;
      event.stopPropagation();
      this.setDrawInfo(row, index);
      this.detailsDrawerVisible = true;
      this.changeIDVaild(row.Vidtype);
    },
    vlistDelete(row) {
      let self = this;
      const VVID = row.VV_ID || row.VVID;
      let reqData = {
        visitor: [{ VV_ID: VVID }],
      };
      s_VDelete(reqData)
        .then((response) => {
          if (response.error == 0) {
            self.selVArray.forEach((item) => {
              let _vvid = item.VV_ID || item.VVID || 0;
              if (_vvid && _vvid == VVID) {
                this.$emit("onDeltVisitor", reqData["visitor"]);
              }
            });
            self.initData(self.queryVListByEHID);
          }
        })
        .catch((error) => {
          console.log(error);
          self.$message({
            type: "error",
            message: self.$t("erGeneral"),
          });
        });
    },
    onClickDelete(event, row) {
      event.stopPropagation();
    },
    vlistRowClick(row, column, event) {
      this.$refs.vList.toggleRowSelection(row);
    },
    vListSelectionChange(val) {
      let self = this;
      self.selVArray = val;
    },
    vListSelect(selection, row) {
      row.bCheck = selection;
    },
    cancelForm() {
      this.vForm = JSON.parse(JSON.stringify(this.initFormData(this.editInfo)));
    },
    initFormData(data, submitData = null) {
      if (!data) {
        data = {};
      }
      var forminfo = submitData || {};
      for (var key in this.config) {
        if (key.substr(0, 1) === "V") {
          if (this.config[key]["E"]) {
            forminfo[key] = data[key] || "";
            if (key == "Vidtype") {
              forminfo[key] = String(data[key] || 0);
            } else if (key == "Vcountrycode") {
              forminfo[key] = data[key] || this.lastCountryCode || "86";
            } else if (key == "Vnation") {
              forminfo[key] = data[key] || "CHN";
            } else {
              forminfo[key] = data[key] || "";
            }
          }
        }
      }
      return forminfo;
    },
    setDrawInfo(data, index) {
      var drawinfo = this.initFormData(data);
      this.editInfo = data;
      this.editIndex = index;
      this.vForm = JSON.parse(JSON.stringify(drawinfo));
    },
    onAddNewVisitor() {
      this.vInfoType = "newVisitor";
      this.setDrawInfo(null);
      this.detailsDrawerVisible = true;
      this.changeIDVaild(0);
    },
    numberCheck(key1, key2) {
      if (key2) {
        this[key1][key2] = this[key1][key2].replace(/[^0-9]+/, "");
      } else {
        this[key1] = this[key1][key2].replace(/[^0-9]+/, "");
      }
    },
    handImportClick() {},
    handUpaloadChange(file, fileList) {
      this.FileList = [];
      this.FileList.push(file);
      this.ImportReport(file.raw);
    },
    ImportReport(file) {
      var self = this;
      self.vListsearch = "";
      self.tableloading = true;
      self.loadLoading = true;
      var reader = new FileReader();
      reader.onerror = (e) => {
        self.$message({
          message: this.$t("Regis.load.loadError"),
          center: true,
          type: "error",
        });
        self.tableloading = false;
        self.loadLoading = false;
      };

      reader.onload = (e) => {
        const data = e.target.result;
        /* eslint-disable */
        const wb = XLSX.read(data, { type: "binary" });
        var excelData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        var tableData = [];
        for (var i = 1; i < excelData.length; i++) {
          var Vinfo = {};
          if (excelData[i]["VisitorName"] !== undefined) {
            var VName = String(excelData[i]["VisitorName"]);
            if (VName.length > 64) {
              excelData[i]["VisitorName"] = VName.substr(0, 60) + "...";
            }
            Vinfo["Vname"] = safeInput(excelData[i]["VisitorName"]);
            if (excelData[i]["Company"]) {
              var VUnit = String(excelData[i]["Company"]);
              if (VUnit.length > 64) {
                excelData[i]["Company"] = VUnit.substr(0, 60) + "...";
              }
              Vinfo["Vunit"] = safeInput(excelData[i]["Company"] || "");
            }

            if (excelData[i]["CellphoneNO"]) {
              var VPhone = String(excelData[i]["CellphoneNO"]);
              VPhone = trim(VPhone);
              if (VPhone.length > 20) {
                VPhone = VPhone.substr(0, 16) + "...";
              }
              VPhone = VPhone.replace(/[\W]/, "");
              excelData[i]["CellphoneNO"] = VPhone;
              Vinfo["Vphone"] = VPhone || "";
            }
            if (excelData[i]["CountryCode"]) {
              Vinfo["Vcountrycode"] = String(excelData[i]["CountryCode"] || "");
            }

            if (excelData[i]["Country"]) {
              let Vnation = String(excelData[i]["Country"] || "");
              if (self.nationMap_en_code[Vnation]) {
                Vinfo["Vnation"] = self.nationMap_en_code[Vnation]["code"];
              }
            }

            if (excelData[i]["DocumentType"] != undefined) {
              if (excelData[i]["DocumentType"] == "Chinese ID card") {
                Vinfo["Vidtype"] = 0;
              } else if (excelData[i]["DocumentType"] == "Passport") {
                Vinfo["Vidtype"] = 1;
              } else {
                Vinfo["Vidtype"] = 3;
              }
            }

            if (excelData[i]["DocumentID"]) {
              Vinfo["Vid"] = String(excelData[i]["DocumentID"] || "")
                .replace(/[\W]/, "")
                .toUpperCase();
            }

            if (excelData[i]["Email"]) {
              Vinfo["Vemail"] = trim(safeInput(excelData[i]["Email"] || ""));
            }
            Vinfo["index"] = i;
            Vinfo["addMeLoad"] = false;
            Vinfo["modifyMeLoad"] = false;
            Vinfo["riskRegions"] = "";
            Vinfo["Vplate"] = "";
            // Vinfo["bDrive"] = "";
            // Vinfo["drive"] = "";

            tableData.push(Vinfo);
          }
        }

        self.visitorListFull = tableData;

        console.log(tableData);
        self.tableloading = false;
        self.loadLoading = false;
        self.getVisitorList(self.vListsearch, 1, null);
      };
      reader.readAsBinaryString(file);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/define.scss";
.list-table {
  overflow-y: auto;
  max-height: calc(100vh - 300px);
  min-height: 200px;
}
.btn-group-from {
  margin-right: 5px;
}
.downloadExcel {
  display: inline-block;
  padding-left: 10px;
  color: #606266;
}
.dialog-header {
  text-align: left;
  padding-bottom: 10px;
  margin-top: -10px;
  border-bottom: 1px solid $line;
  .tips {
    margin-left: 10px;
    a {
      color: blue;
    }
  }
}
.dialog-footer {
  text-align: left;
  padding-bottom: 10px;
  .exclesubmit {
    float: right;
    margin-top: -10px;
    font-size: 1rem;
    min-width: 150px;
  }
}
.pointer {
  cursor: pointer;
}
.clrWhite {
  color: white;
}
.submitbtn {
  min-width: 250px;
  float: right;
}
.username {
  text-align: left;
}
.tablebtn {
  height: 28px;
  width: 30px;
  text-align: center;
  padding: 7px 7px;
  margin: 0 2px;
}
.vinfo-drawer {
  width: 500px;
  overflow-y: auto;
  padding-bottom: 20px;
  .form-regions {
    color: $form-icon;
    font-size: 1rem;
  }
}
.tips {
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
  .yes {
    color: red;
  }
  .no {
    color: $user-value;
  }
}
.errortip {
  color: red;
  font-size: 16px;
  margin-top: 10px;
  text-align: right;
}
.vinfo-drawer__content {
  padding: 0 20px;
}
.vinfo-drawer__footer {
  margin-top: 20px;
  border-top: 1px solid $line;
  padding-top: 20px;
}
.vlist {
  .bottom-btn-bk {
    margin-top: 20px;
  }
  .btn-add {
    margin-right: 10px;
  }
}
.home-form-row {
  .form-icon {
    font-size: 1.8rem;
    text-align: left;
    color: $form-icon;
  }
  .redstart {
    color: red;
    padding-right: 5px;
    padding-left: 5px;
  }
}
</style>