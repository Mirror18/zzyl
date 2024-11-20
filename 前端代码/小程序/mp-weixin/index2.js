"use strict";
const common_vendor = require("./common/vendor.js");
const utils_index = require("./utils/index.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "./uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "index",
  props: {
    phoneData: {
      type: String,
      default: ""
    }
  },
  setup(__props, { expose }) {
    const popup = common_vendor.ref(null);
    const closePopup = () => {
      popup.value.close();
    };
    const call = () => {
      utils_index.tostTip("该功能对接第三方，暂未实现");
    };
    expose({
      popup
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closePopup),
        b: common_vendor.o(call),
        c: common_vendor.sr(popup, "442df226-0", {
          "k": "popup"
        }),
        d: common_vendor.o(_ctx.change)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/components/uni-phone/index.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
