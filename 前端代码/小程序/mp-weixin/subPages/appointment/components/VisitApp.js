"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const _sfc_main = {
  __name: "VisitApp",
  props: {
    // 房型信息
    formData: {
      type: Object,
      default: () => ({})
    },
    // 选择的时间
    nowDate: {
      type: String,
      default: ""
    }
  },
  emits: ["handleTime", "handleFamily"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const store = common_vendor.useStore();
    const users = store.state.user;
    const appType = users.appointmentType;
    const handleTime = (val) => {
      emit("handleTime", val);
    };
    const handleFamily = (val) => {
      emit("handleFamily", val);
    };
    const handleBlur = (e) => {
      let text = utils_index.warnBlank(e.detail.value);
      props.formData.name = text.substring(0, 10);
    };
    const handleVisiBlur = (e) => {
      let text = utils_index.warnBlank(e.detail.value);
      props.formData.visitor = text.substring(0, 10);
    };
    expose({});
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleBlur),
        b: __props.formData.name,
        c: common_vendor.o(($event) => __props.formData.name = $event.detail.value),
        d: __props.formData.mobile,
        e: common_vendor.o(($event) => __props.formData.mobile = $event.detail.value),
        f: common_vendor.unref(appType) === 0
      }, common_vendor.unref(appType) === 0 ? {
        g: common_vendor.o(handleVisiBlur),
        h: __props.formData.visitor,
        i: common_vendor.o(($event) => __props.formData.visitor = $event.detail.value)
      } : {
        j: common_vendor.t(__props.formData.visitor),
        k: common_vendor.o(($event) => handleFamily("bottom"))
      }, {
        l: common_vendor.t(__props.nowDate),
        m: common_vendor.o(($event) => handleTime("bottom"))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/appointment/components/VisitApp.vue"]]);
wx.createComponent(Component);
