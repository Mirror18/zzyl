"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  _component_NavBar();
}
if (!Math) {
  Phone();
}
const Phone = () => "../../components/uni-phone/index2.js";
const _sfc_main = {
  __name: "index",
  setup(__props, { expose }) {
    common_vendor.useStore();
    let capsuleBottom = common_vendor.ref();
    const phone = common_vendor.ref(null);
    common_vendor.onShow(() => {
    });
    common_vendor.onLoad(() => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 12;
        }
      });
    });
    const handlePhone = (type) => {
      phone.value.popup.open("center");
    };
    expose({});
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "养老院介绍",
          isShowBack: true,
          handleToLink: _ctx.handleToLink
        }),
        b: common_vendor.o(($event) => handlePhone()),
        c: common_vendor.unref(capsuleBottom) + "px",
        d: common_vendor.sr(phone, "bd219101-1", {
          "k": "phone"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bd219101"], ["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/introduce/index.vue"]]);
wx.createPage(MiniProgramPage);
