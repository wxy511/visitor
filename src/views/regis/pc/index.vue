<template>
  <div class="light-gray-background card-panel-white card-panel-min-full">
    <div class="pre-regis">
      <el-form
        :model="regForm"
        :rules="regRules"
        ref="regForm"
        label-position="left"
        label-width="0px"
      >
        <el-timeline>
          <!-- 来访信息 -->
          <el-timeline-item
            placement="top"
            hide-timestamp
            size="large"
            color="#00c090"
            :icon="timelineicon"
          >
            <span class="title">{{ $t("RegInfo.visitInfo") }}</span>
            <el-card shadow="hover" class="reg-card">
              <el-row>
                <div class="reg-title-left">
                  <i class="el-icon-place icon"></i>
                  <span class="title">{{ $t("RegInfo.Vbranch") }}</span>
                </div>
                <div class="reg-body-right">
                  <el-form-item prop="Vbranch">
                    <el-select
                      v-model="regForm.Vbranch"
                      class="fullWidth"
                      :placeholder="$t('RegInfo.placeholder.Vbranch')"
                    >
                      <el-option
                        v-for="item in branchList"
                        :value="item.code"
                        :label="item.label"
                        :key="item.code"
                        v-show="!(item.show === 0)"
                      >
                        <span>{{ language == "en" ? item.en : item.cn }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-row>
              <el-row>
                <div class="reg-title-left">
                  <i class="el-icon-date icon"></i>
                  <span class="title">{{ $t("RegInfo.Vdate") }}</span>
                </div>
                <div class="reg-body-right">
                  <el-form-item prop="Vdate">
                    <el-row>
                      <el-col :span="11">
                        <el-date-picker
                          :editable="false"
                          v-model="regForm.startDate"
                          :placeholder="$t('Regis.startDate')"
                          style="width: 100%"
                          value-format="yyyyMMdd"
                          :picker-options="pickerOptions"
                          @change="startdatesel()"
                          ref="regStartDate"
                          id="regStartDate"
                        >
                        </el-date-picker>
                      </el-col>
                      <el-col :span="2" class="textcenter"> - </el-col>
                      <el-col :span="11">
                        <el-date-picker
                          :editable="false"
                          v-model="regForm.endDate"
                          :placeholder="$t('Regis.endDate')"
                          style="width: 100%"
                          ref="regEndDate"
                          id="regEndDate"
                          value-format="yyyyMMdd"
                          :picker-options="pickerEndOptions"
                        >
                        </el-date-picker>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-row>
              <el-row>
                <div class="reg-title-left">
                  <i class="el-icon-chat-dot-round icon"></i>
                  <span class="title">{{ $t("RegInfo.Vpurpose") }}</span>
                </div>
                <div class="reg-body-right">
                  <el-form-item prop="Vpurpose">
                    <el-select
                      v-model="regForm.Vpurpose"
                      class="fullWidth"
                      :placeholder="$t('RegInfo.placeholder.Vpurpose')"
                    >
                      <el-option
                        v-for="item in purposeList"
                        :label="item.label"
                        :value="item.label"
                        :key="item.label"
                      >
                        {{ item.label }}
                      </el-option>
                      <el-option
                        :label="$t('select.other')"
                        value="9999"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-row>
              <el-row v-if="regForm.Vpurpose === '9999'">
                <div class="reg-title-left">
                  <!-- <i class="el-icon-chat-dot-round icon"></i>
                  <span class="title">{{ $t('RegInfo.Vpurpose') }}</span> -->
                </div>
                <div class="reg-body-right">
                  <el-form-item prop="otherPurpose">
                    <el-input
                      v-model="regForm.otherPurpose"
                      :placeholder="$t('RegInfo.placeholder.otherPurpose')"
                      clearable
                      maxlength="64"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-row>

              <div v-if="userType === 'v'">
                <el-row v-if="py_config.riskRegions">
                  <div class="reg-title-left">
                    <i class="el-icon-place icon"></i>
                    <span class="title">{{
                      $t("riskRegions.tableLabel")
                    }}</span>
                  </div>
                  <div class="reg-body-right">
                    <el-form-item prop="riskRegions">
                      <div v-if="!VMyVisitingInfo.riskRegions">
                        <div
                          class="table-text-btn"
                          @click="
                            onShowRiskRegions('addMe', 0, VMyVisitingInfo)
                          "
                        >
                          <i class="el-icon-plus"></i>
                        </div>
                      </div>
                      <div v-else>
                        <div
                          class="table-text"
                          @click="
                            onShowRiskRegions('modifyMe', 0, VMyVisitingInfo)
                          "
                        >
                          {{ VMyVisitingInfo.riskRegions }}
                        </div>
                        <!-- <span :class="'risk-level-' + VMyVisitingInfo.riskLevel">
                        <span class="r_tag_hiddenLow"> {{$t('riskRegions.level.-'+VMyVisitingInfo.riskLevel)}} </span>
                      </span> -->
                      </div>
                    </el-form-item>
                  </div>
                </el-row>
                <el-row v-if="config.Vplate && config.Vplate.E">
                  <div class="reg-title-left">
                    <svg-icon icon-class="drive" class="icon"></svg-icon>
                    <span class="title">{{ $t("Regis.drive") }}</span>
                  </div>
                  <div class="reg-body-right">
                    <el-form-item prop="Vplate">
                      <el-switch
                        v-model="VMyVisitingInfo.bDrive"
                        active-color="#36a3f7"
                        @change="
                          onChangeDrive(
                            $event,
                            VMyVisitingInfo,
                            0,
                            'VMyVisitingVplate'
                          )
                        "
                      />
                      <div
                        v-show="VMyVisitingInfo.bDrive"
                        style="display: inline-block; padding-left: 15px"
                      >
                        <div v-show="!VMyVisitingInfo.Vplate">
                          <confirm-popover
                            type="Vplate"
                            :context="VMyVisitingInfo"
                            :index="0"
                            trigger="manual"
                            @onConfirm="VMeAddPlate"
                            ref="VMyVisitingVplate"
                          >
                            <div slot="title">{{ $t("Regis.addPlate") }}</div>
                            <div slot="reference" class="table-text-btn">
                              <i class="el-icon-plus"></i>
                            </div>
                          </confirm-popover>
                        </div>
                        <div v-show="VMyVisitingInfo.Vplate">
                          <confirm-popover
                            type="Vplate"
                            trigger="manual"
                            :context="VMyVisitingInfo"
                            :index="0"
                            @onConfirm="VMeModifyPlate"
                            style="display: inline-block"
                          >
                            <div slot="title">
                              {{ $t("Regis.modifyPlate") }}
                            </div>
                            <div slot="reference" class="table-text">
                              <span>{{ VMyVisitingInfo.Vplate }}</span>
                            </div>
                          </confirm-popover>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </el-row>
              </div>
            </el-card>
          </el-timeline-item>
          <!-- 接访人 -->
          <el-timeline-item
            v-if="userType === 'v' || py_config.e_otherHost"
            placement="top"
            hide-timestamp
            size="large"
            :color="mainclr"
            :icon="timelineicon"
          >
            <span class="title">{{ $t("RegInfo.hostInfo") }}</span>
            <el-card shadow="hover" class="reg-card">
              <regis-host-info
                :size="size"
                :hostInfo="hostInfo"
                :type="py_config.hostType"
              ></regis-host-info>
            </el-card>
          </el-timeline-item>
          <!-- 访客信息 -->
          <el-timeline-item
            placement="top"
            hide-timestamp
            size="large"
            color="#409eff"
            :icon="timelineicon"
          >
            <span class="title" v-if="userType === 'e'">{{
              $t("RegInfo.visitorInfo")
            }}</span>
            <span class="title" v-else>
              {{ $t("RegInfo.groupVisitor") }}
              <el-switch
                v-model="hasEntourage"
                active-color="#36a3f7"
                style="margin-left: 10px"
              />
            </span>
            <el-card
              shadow="hover"
              class="reg-card"
              v-if="hasEntourage || userType === 'e'"
            >
              <div class="visitor-table-div">
                <!-- 新增/选择访客按钮 -->
                <el-button
                  type="regis"
                  class="btnAdd"
                  @click="showVisitorList_pc"
                  :disabled="!!selVisitorList_Load.length"
                >
                  <i class="el-icon-plus"></i> {{ $t("Regis.selVisitor") }}
                </el-button>
                <!-- 批量导入按钮 -->
                <el-button
                  type="primary"
                  class="btnAdd"
                  v-if="py_config.regis_group"
                  @click="showLoadVisitor_pc"
                  :disabled="!!selVisitorList.length"
                  icon="el-icon-document"
                >
                  {{ $t("Regis.loadVisitor") }}
                </el-button>
                <!-- 清空按钮 -->
                <el-button
                  type="danger"
                  class="btnDelete"
                  @click="deleteAllVisitor"
                  icon="el-icon-delete"
                  plain
                >
                  {{ $t("Regis.deleteall") }}
                </el-button>
                <!-- 新增/选择访客的table -->
                <el-table
                  ref="selVisitorList"
                  :data="selVisitorList"
                  class="visitor-table"
                  v-if="!selVisitorList_Load.length"
                  stripe
                  :cell-style="stateTableCellStyle"
                  header-row-class-name="tableheaderrowclass"
                >
                  <el-table-column type="index" width="50"> </el-table-column>
                  <el-table-column
                    :label="$t('RegInfo.Vname')"
                    prop="Vname"
                    align="left"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('RegInfo.Vunit')"
                    prop="Vunit"
                    align="left"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('RegInfo.Vphone')"
                    prop="Vphone"
                    align="left"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        showPhone(scope.row.Vcountrycode, scope.row.Vphone)
                      }}</span>
                    </template>
                  </el-table-column>
                  <template v-if="config.Vplate && config.Vplate.E">
                    <!-- 驾车 -->
                    <el-table-column
                      :label="$t('Regis.drive')"
                      align="left"
                      :show-overflow-tooltip="true"
                      prop="bDrive"
                      width="60"
                    >
                      <template slot-scope="scope">
                        <div>
                          <!-- v-model="scope.row.bDrive" :active-text="scope.row.Vplate"-->
                          <el-switch
                            v-model="selVisitorList[scope.$index]['bDrive']"
                            :key="scope.$index"
                            active-color="#36a3f7"
                            @change="
                              onChangeDrive(
                                $event,
                                scope.row,
                                scope.$index,
                                'drive' + scope.$index
                              )
                            "
                          />
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 车牌号 -->
                    <el-table-column
                      :label="$t('RegInfo.Vplate')"
                      prop="Vplate"
                      align="left"
                      :show-overflow-tooltip="true"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <div v-show="scope.row.bDrive">
                          <div v-show="!scope.row.Vplate">
                            <confirm-popover
                              type="Vplate"
                              trigger="manual"
                              :context="scope.row"
                              :index="scope.$index"
                              @onConfirm="vTableAddPlate"
                              :ref="'drive' + scope.$index"
                            >
                              <div slot="title">{{ $t("Regis.addPlate") }}</div>
                              <!-- 添加车牌号，弹窗-->
                              <div slot="reference" class="table-text-btn">
                                <i class="el-icon-plus"></i>
                                <!-- 那个加号按钮，点击输入车牌-->
                              </div>
                            </confirm-popover>
                          </div>
                          <div v-show="scope.row.Vplate">
                            <!-- <span style="margin-right: 5px;">{{scope.row.Vplate}}</span> -->
                            <confirm-popover
                              type="Vplate"
                              trigger="manual"
                              :context="scope.row"
                              :index="scope.$index"
                              @onConfirm="vTableModifyPlate"
                              style="display: inline-block"
                            >
                              <!-- 修改车牌号 -->
                              <div slot="title">
                                {{ $t("Regis.modifyPlate") }}
                              </div>
                              <div slot="reference" class="table-text">
                                <!-- <i class="el-icon-edit"></i> -->
                                <!-- <span style="margin-right: 5px;">{{scope.row.Vplate}}</span> -->
                                <span>{{ scope.row.Vplate }}</span>
                              </div>
                            </confirm-popover>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                  <!-- 来自 -->
                  <template v-if="py_config.riskRegions">
                    <el-table-column
                      prop="riskRegions"
                      align="left"
                      :show-overflow-tooltip="true"
                    >
                      <div slot="header">
                        {{ $t("riskRegions.tableLabel") }}
                        <span style="color: red; font-size: 18px">*</span>
                      </div>
                      <template slot-scope="scope">
                        <div>
                          <div v-if="!scope.row.riskRegions">
                            <div
                              class="table-text-btn"
                              @click="
                                onShowRiskRegions(
                                  'add',
                                  scope.$index,
                                  scope.row
                                )
                              "
                            >
                              <i class="el-icon-plus"></i>
                            </div>
                          </div>
                          <div v-else>
                            <div
                              class="table-text"
                              @click="
                                onShowRiskRegions(
                                  'modify',
                                  scope.$index,
                                  scope.row
                                )
                              "
                            >
                              {{ scope.row.riskRegions }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                  <!-- 移除 -->
                  <el-table-column
                    :label="$t('Regis.remove')"
                    align="center"
                    width="100"
                  >
                    <div slot-scope="scope">
                      <span
                        @click="vTableDelete(scope.$index, scope.row)"
                        style="color: #f56c6c; font-size: 1.2rem"
                        ><i class="el-icon-close"></i
                      ></span>
                    </div>
                  </el-table-column>
                  <!--  diffrentEnd -->
                </el-table>
                <!-- 批量导入的table -->
                <el-table
                  ref="selVisitorList_Load"
                  :data="selVisitorList_Load"
                  class="visitor-table"
                  v-if="!!selVisitorList_Load.length"
                  stripe
                  :cell-style="stateTableCellStyle"
                  header-row-class-name="tableheaderrowclass"
                >
                  <el-table-column type="index" width="50"> </el-table-column>
                  <el-table-column
                    :label="$t('RegInfo.Vname')"
                    prop="Vname"
                    align="left"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('RegInfo.Vunit')"
                    prop="Vunit"
                    align="left"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('RegInfo.Vphone')"
                    prop="Vphone"
                    align="left"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        showPhone(scope.row.Vcountrycode, scope.row.Vphone)
                      }}</span>
                    </template>
                  </el-table-column>
                  <!-- add start-->
                  <template v-if="config.Vplate && config.Vplate.E">
                    <!-- 驾车 -->
                    <el-table-column
                      :label="$t('Regis.drive')"
                      align="left"
                      :show-overflow-tooltip="true"
                      prop="bDrive"
                      width="60"
                    >
                      <template slot-scope="scope">
                        <div>
                          <el-switch
                            v-model="
                              selVisitorList_Load[scope.$index]['bDrive']
                            "
                            :key="scope.$index"
                            active-color="#36a3f7"
                            @change="
                              onChangeDrive(
                                $event,
                                scope.row,
                                scope.$index,
                                'drive' + scope.$index
                              )
                            "
                          />
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 车牌号 -->
                    <el-table-column
                      :label="$t('RegInfo.Vplate')"
                      prop="Vplate"
                      align="left"
                      :show-overflow-tooltip="true"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <div v-show="scope.row.bDrive">
                          <div v-show="!scope.row.Vplate">
                            <confirm-popover
                              type="Vplate"
                              trigger="manual"
                              :context="scope.row"
                              :index="scope.$index"
                              @onConfirm="vTableAddPlate_Load"
                              :ref="'drive' + scope.$index"
                            >
                              <div slot="title">{{ $t("Regis.addPlate") }}</div>
                              <!-- <div slot="reference" class="table-text-btn" ><u>{{ $t('Regis.addVplate') }}</u></div> -->
                              <div slot="reference" class="table-text-btn">
                                <i class="el-icon-plus"></i>
                                <!-- 加号按钮，点击输入车牌号 -->
                              </div>
                            </confirm-popover>
                          </div>
                          <div v-show="scope.row.Vplate">
                            <!-- <span style="margin-right: 5px;">{{scope.row.Vplate}}</span> -->
                            <confirm-popover
                              type="Vplate"
                              trigger="manual"
                              :context="scope.row"
                              :index="scope.$index"
                              @onConfirm="vTableModifyPlate_Load"
                              style="display: inline-block"
                            >
                              <div slot="title">
                                {{ $t("Regis.modifyPlate") }}
                              </div>
                              <div slot="reference" class="table-text">
                                <!-- <i class="el-icon-edit"></i> -->
                                <!-- <span style="margin-right: 5px;">{{scope.row.Vplate}}</span> -->
                                <span>{{ scope.row.Vplate }}</span>
                              </div>
                            </confirm-popover>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </template>

                  <template v-if="py_config.riskRegions">
                    <!-- 来自 -->
                    <el-table-column
                      prop="riskRegions"
                      align="left"
                      :show-overflow-tooltip="true"
                    >
                      <div slot="header">
                        {{ $t("riskRegions.tableLabel") }}
                        <span style="color: red; font-size: 18px">*</span>
                      </div>
                      <template slot-scope="scope">
                        <div>
                          <div v-if="!scope.row.riskRegions">
                            <div
                              class="table-text-btn"
                              @click="
                                onShowRiskRegions(
                                  'addMeLoad',
                                  scope.$index,
                                  scope.row
                                )
                              "
                            >
                              <i class="el-icon-plus"></i>
                            </div>
                          </div>
                          <div v-else>
                            <div
                              class="table-text"
                              @click="
                                onShowRiskRegions(
                                  'modifyMeLoad',
                                  scope.$index,
                                  scope.row
                                )
                              "
                            >
                              {{ scope.row.riskRegions }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                  <!-- 移除 -->
                  <!-- <el-table-column
                    :label="$t('Regis.remove')"
                    align="center"
                    width="100"
                  >
                    <div slot-scope="scope">
                      <span
                        @click="vTableDelete_Load(scope.$index, scope.row)"
                        style="color: #f56c6c; font-size: 1.2rem"
                        ><i class="el-icon-close"></i
                      ></span>
                    </div>
                  </el-table-column> -->
                  <!-- add End -->
                </el-table>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <!-- 页面最下方的提交按钮 -->
        <div class="form-submit" align="center">
          <el-divider></el-divider>
          <el-button
            type="primary"
            round
            class="btn-submit"
            :disabled="loading"
            @click="submitRegis('regForm')"
          >
            <i v-show="loading" class="el-icon-loading"></i>
            <span>{{ $t("submit") }} </span>
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 新增/选择访客的弹窗 -->
    <el-dialog
      top="4vh"
      :title="$t('Regis.VisitorList')"
      :visible.sync="dlgVisible"
      :close-on-click-modal="false"
    >
      <div class="visitor-list">
        <visitor-list
          ref="VList"
          visitorType="V"
          @onSelVisitors="onSelVisitors"
          @onDeltVisitor="onDeltVisitor"
          @onUpdateVisitor="onUpdateVisitor"
        ></visitor-list>
      </div>
    </el-dialog>
    <!-- 导入Excel的弹窗 -->
    <el-dialog
      top="4vh"
      custom-class="VExceldialog"
      width="70%"
      :visible.sync="dlgVisible_Load"
      :close-on-click-modal="false"
    >
      <div class="visitor-list">
        <visitor-list-load
          ref="VListLoad"
          visitorType="V"
          @onSelVisitors="onSelVisitors_Load"
        ></visitor-list-load>
      </div>
    </el-dialog>
    <!-- 出错的弹窗  -->
    <el-dialog
      top="4vh"
      :title="$t('Regis.result')"
      custom-class="VExceldialog"
      width="70%"
      :visible.sync="dlgResultVisible"
      :close-on-click-modal="false"
    >
      <div>
        <submit-result ref="submitResult" />
      </div>
    </el-dialog>
    <!-- 来自，选择城市地区的显示弹窗 -->
    <el-dialog
      top="10vh"
      :title="$t('riskRegions.selTitle')"
      custom-class="VRiskRegionsdialog"
      width="70%"
      :visible.sync="dlgRiskRegionsVisible"
      :close-on-click-modal="false"
    >
      <div>
        <risk-regions
          ref="riskRegions"
          :showLevel="rights.riskLevel"
          :data="riskRegionsList"
          @onSel="onRegionsSel"
          tabClass="tab-pane-pc"
        ></risk-regions>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import VisitorList from "./components/VisitorList";
import VisitorListLoad from "./components/VisitorListLoad";
import RegisHostInfo from "./../components/RegisHostInfo";
import RiskRegions from "@/components/RiskRegions";

import CountryCode from "@/components/CountryCode";
import SubmitResult from "./components/SubmitResult";
import ConfirmPopover from "@/components/ConfirmPopover";
import { data, methods } from "@/views/regis/regis.js?@";

export default {
  name: "add",
  components: {
    VisitorList,
    CountryCode,
    SubmitResult,
    ConfirmPopover,
    VisitorListLoad,
    RegisHostInfo,
    RiskRegions,
  },
  data: data,
  computed: {
    ...mapState([
      "mainclr",
      "py_config",
      "config",
      "TERMINAL",
      "stateTableCellStyle",
      "location_cfg",
      "userType",
      "rights",
    ]),
    ...mapGetters([
      "language",
      "branchList",
      "purposeList",
      "countrycodeList",
      "userInfo",
      "lastBranch",
      "riskRegionsList",
    ]),
  },
  watch: {
    language: function (val) {
      let self = this;
      this.purposeList.forEach((item) => {
        item.label = val === "en" ? item.en : item.cn;
        if (
          self.regForm.Vpurpose != "" &&
          (self.regForm.Vpurpose == item["en"] ||
            self.regForm.Vpurpose == item["cn"])
        ) {
          self.regForm.Vpurpose = item["label"];
        }
      });
    },
  },
  created() {
    this.vueCreated("pc");
  },
  methods: methods,
};
</script>

<style lang="scss">
.VExceldialog {
  max-width: 1200px;
}
// .table-text-btn{
//   color: rgb(54, 163, 247);
//   text-decoration: underline;
//   font-size: 14px;
//   cursor: pointer;
//   font-weight: 500;
//   text-align: center;
//   display: inline-block;
//   line-height: 1;
//   white-space: nowrap;
// }
.table-text-btn {
  color: rgb(54, 163, 247);
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid rgb(54, 163, 247);
  padding: 3px;
  border-radius: 3px;
}
.table-text {
  border-bottom: 1px solid rgb(54, 163, 247);
  color: rgb(54, 163, 247);
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  line-height: 1;
  padding: 3px;
}
.pre-regis {
  padding: 20px;
  .title {
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-size: 20px;
    font-weight: lighter;
    color: #08263a;
  }
  .reg-card {
    margin: 20px 0;
    padding-top: 10px;
    padding-left: 10px;
    width: 100%;
    .reg-title-left {
      width: 200px;
      float: left;
      height: 40px;
      line-height: 40px;
      color: $form-icon;
      .title {
        font-size: 1rem;
        color: $form-icon;
      }
      .icon {
        font-size: 1.5rem;
        margin-right: 10px;
      }
    }
    .reg-body-right {
      margin-left: 200px;
      width: 100%;
      max-width: 900px;
      padding-right: 200px;
    }
  }
  .Eautocomplete {
    width: 50%;
    max-width: 400px;
    margin-bottom: 10px;
  }
}
.visitor-table-div {
  width: 100%;
  max-width: 900px;
}
.visitor-table {
  width: 100%;
  max-width: 900px;
  margin-bottom: 10px;
  max-height: 800px;
  overflow-y: auto;
  overflow-x: auto;
}

.btnAdd {
  margin-bottom: 10px;
}
.btnDelete {
  margin-bottom: 10px;
  float: right;
}
.form-submit {
  max-width: 960px;
  .btn-submit {
    width: 90%;
    max-width: 250px;
    font-size: 1.2rem;
  }
}
.el-switch__label.is-active {
  color: #606266;
}
</style>
