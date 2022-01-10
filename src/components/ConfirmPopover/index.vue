<template>
  <el-popover
    :placement="placement"
    :width="width"
    :trigger="trigger"
    v-model="visible"
    :disabled="disabled"
    @show="onShow"
  >
    <div class="title"><slot name="title"></slot></div>
    <slot name="content"></slot>
    <div v-if="type === 'Vplate'">
      <el-input
        v-model="input"
        :placeholder="$t(placeholderKey)"
        maxlength="16"
        clearable
      ></el-input>
    </div>
    <!-- <div v-if="type==='reject' || type==='rejectAll'  ">
        
        <el-input v-model="input_reject" :placeholder="$t('pldReject')" maxlength="16" clearable></el-input>
      </div> -->
    <div class="footer">
      <el-button size="mini" type="text" @click="visible = false">{{
        $t("cancel")
      }}</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="onBtnOK()"
        :disabled="loading"
      >
        <i v-show="loading" class="el-icon-loading"></i>
        {{ $t("ok") }}
      </el-button>
    </div>
    <div
      slot="reference"
      style="display: inline-block"
      @click="popoverVisible()"
    >
      <slot name="reference"></slot>
    </div>
  </el-popover>
</template>
<script>
import { s_VUpdate, s_RCancel } from "@/api/api.js";
import { mapGetters } from "vuex";

/**
 * type:
 * Vplate
 * cancelReg
 */
export default {
  name: "ConfirmPopover",
  components: {},
  props: {
    width: {
      type: Number,
      default: 200,
    },
    index: {
      type: Number,
      default: 0,
    },
    placement: {
      type: String,
      default: "top",
    },
    trigger: {
      type: String,
      default: "manual",
    },
    context: {
      type: Object,
      default: {},
    },
    type: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // visible:{
    //   type:Boolean,
    //   default:false
    // },
  },
  data() {
    return {
      //trigger:'manual',
      v_switch: false,
      visible: false,
      input: "",
      placeholder: "",
      placeholderKey: "RegInfo.placeholder.Vplate",
      loading: false,
      input_reject: "",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    if (this.type == "Vplate") {
    }
  },
  methods: {
    popoverVisible() {
      this.visible = true;
    },
    onChangeSwitch(val) {
      this.visible = true;
    },
    onVisible() {
      //this.trigger = 'manual'
      this.$nextTick(() => {
        this.visible = true;
      });
      console.log("onVisible");
    },
    onShow() {
      this.input = "";
    },
    onBtnOK() {
      if (this.type == "Vplate") {
        this.upDateVisitor();
      } else if (this.type == "cancelReg") {
        this.cancelReg();
      } else if (
        this.type == "passAll" ||
        this.type == "pass" ||
        this.type == "rejectAll" ||
        this.type == "reject"
      ) {
        this.$emit("onConfirm", this.context, this.index, this.type);
        this.visible = false;
      }
    },
    upDateVisitor() {
      let self = this;
      let reqData = { Vplate: this.input };

      var VVID = this.context.VVID || this.context.VV_ID || null;

      if (!VVID) {
        VVID = this.userInfo.VVID || this.userInfo.VV_ID || null;
        self.$emit("onConfirm", self.context, self.index, self.input);
        this.visible = false;
        return;
      }

      // if (!VVID) {
      //   // self.$message({
      //   //   type: "error",
      //   //   message: self.$t("erGeneral"),
      //   // });
      //   // this.$emit('send',!VVID)
      //   self.$emit("onConfirm", self.context, self.index, self.input);
      //   this.visible = false;
      //   return;
      // }
      reqData["VVID"] = VVID;
      s_VUpdate(reqData)
        .then((response) => {
          if (response.error == 0 && response.VV_ID) {
            self.$emit("onConfirm", self.context, self.index, self.input);
            self.visible = false;
          } else {
            self.$message({
              type: "error",
              message: self.$t("erGeneral"),
            });
          }
        })
        .catch((error) => {
          self.$message({
            type: "error",
            message: self.$t("erGeneral"),
          });
        });
    },
    errorGeneral() {
      this.$message({
        type: "error",
        showClose: true,
        message: this.$t("erGeneral"),
      });
    },
    cancelReg() {
      let self = this;
      let reqData = {
        regcode: this.context.regcode,
        Vdate: this.context.Vdate,
        state: -1,
      };
      s_RCancel(reqData)
        .then(function (response) {
          if (response.error === 0) {
            self.$message({
              type: "success",
              showClose: true,
              message: self.$t("Records.tips.cancel"),
            });
            self.$emit("onConfirm", self.context, response);
            self.visible = false;
          } else {
            self.errorGeneral();
          }
        })
        .catch(function (error) {
          console.log(error);
          self.errorGeneral();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.popover {
  padding-top: 10px;
}
.title {
  color: $form-icon;
  margin-bottom: 10px;
  font-weight: bold;
}
.footer {
  text-align: right;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid $line;
}
</style>