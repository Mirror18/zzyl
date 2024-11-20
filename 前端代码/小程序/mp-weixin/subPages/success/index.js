"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  _component_NavBar();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    store.state.user;
    const orderId = common_vendor.ref(null);
    const netStatus = common_vendor.ref(true);
    const baseData = common_vendor.ref({});
    const dateTime = common_vendor.ref(null);
    const isback = common_vendor.ref(false);
    common_vendor.onLoad((option) => {
      baseData.value = JSON.parse(decodeURIComponent(option.item));
      orderId.value = baseData.value.id;
      dateTime.value = utils_index.getNow(baseData.value.estimatedArrivalTime) + " " + utils_index.getTime(baseData.value.estimatedArrivalTime);
    });
    common_vendor.onUnload(() => {
    });
    const goIndex = () => {
      isback.value = true;
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
      store.commit("setFootStatus", 0);
    };
    const goOrder = () => {
      isback.value = true;
      common_vendor.index.navigateTo({
        url: "/subPages/order/details?id=" + orderId.value
      });
    };
    const handleToLink = () => {
      isback.value = true;
      common_vendor.index.navigateTo({
        url: "/subPages/order/index"
      });
      store.commit("user/setOrderStatus", "");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "支付订单",
          isShowBack: true,
          handleToLink
        }),
        b: netStatus.value
      }, netStatus.value ? {
        c: common_vendor.t(dateTime.value),
        d: common_vendor.o(goIndex),
        e: common_vendor.o(goOrder)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ce8a374b"], ["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/success/index.vue"]]);
wx.createPage(MiniProgramPage);
