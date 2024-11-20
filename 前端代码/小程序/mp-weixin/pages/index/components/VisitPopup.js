"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "VisitPopup",
  setup(__props, { expose }) {
    const popup = common_vendor.ref(null);
    const handleClose = () => {
      popup.value.close();
    };
    expose({
      popup
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleClose),
        b: _ctx.type === "left" || _ctx.type === "right" ? 1 : "",
        c: common_vendor.sr(popup, "69b7c957-0", {
          "k": "popup"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/pages/index/components/VisitPopup.vue"]]);
wx.createComponent(Component);
