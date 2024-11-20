"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const _sfc_main = {
  __name: "BoundForm",
  props: {
    // 房型信息
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["handleTime", "handleFamily"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const store = common_vendor.useStore();
    store.state.user;
    const handleInput = (e) => {
      props.formData.name = utils_index.warnBlank(e.detail.value).substring(0, 10);
    };
    const handleCard = (e) => {
      props.formData.remark = utils_index.warnBlank(e.detail.value).substring(0, 10);
    };
    expose({});
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleInput),
        b: __props.formData.name,
        c: common_vendor.o(($event) => __props.formData.name = $event.detail.value),
        d: __props.formData.idCard,
        e: common_vendor.o(($event) => __props.formData.idCard = $event.detail.value),
        f: common_vendor.o(handleCard),
        g: __props.formData.remark,
        h: common_vendor.o(($event) => __props.formData.remark = $event.detail.value)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/pages/family/components/BoundForm.vue"]]);
wx.createComponent(Component);
