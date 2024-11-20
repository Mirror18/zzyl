"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_load_more + EmptyPage)();
}
const EmptyPage = () => "../../../components/EmptyPage/index.js";
const _sfc_main = {
  __name: "List",
  props: {
    itemData: {
      type: Array,
      default: () => []
    },
    moreStatus: {
      type: String,
      default: "noMore"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["handleOpen"],
  setup(__props, { emit }) {
    const store = common_vendor.useStore();
    store.state.user;
    const emptyInfo = common_vendor.ref("您暂时没有绑定的家人~");
    const contentText = common_vendor.ref({
      //加载状态说明
      contentdown: "上拉加载更多",
      contentrefresh: "努力加载中...",
      contentnomore: "- 没有更多了 -"
    });
    const handleUnbind = (id) => {
      emit("handleOpen", id);
    };
    const handleBill = (val) => {
      store.commit("setFootStatus", 1);
      store.commit("user/setBackLike", "family");
      common_vendor.index.navigateTo({
        url: `/subPages/bill/index?id=${val.elderId}&name=${val.elderVo.name}`
      });
    };
    common_vendor.onReachBottom(() => {
      emit("onReachBottom");
    });
    const handleToHealthyData = (bedNumber, remark, elderName, elderImg, roomType, deviceName, productKey) => {
      common_vendor.index.navigateTo({
        url: `/subPages/healthy/index?bedNumber=${bedNumber}&remark=${remark}&elderName=${elderName}&elderImg=${elderImg}&roomType=${roomType}&deviceName=${deviceName}&productKey=${productKey}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.itemData.length > 0
      }, __props.itemData.length > 0 ? common_vendor.e({
        b: common_vendor.f(__props.itemData, (item, index, i0) => {
          return common_vendor.e({
            a: item.elderVo.image,
            b: common_vendor.t(item.elderVo.name),
            c: common_vendor.t(item.remark),
            d: common_vendor.t(item.roomVo && item.roomVo.typeName !== void 0 && item.bedVo && item.bedVo.bedNumber !== void 0 ? item.roomVo.typeName + "-" + item.bedVo.bedNumber + "床" : "--"),
            e: common_vendor.o(($event) => handleBill(item), index),
            f: item.deviceVos.filter((item2) => item2.productKey === "j0rkM5mCanO").length
          }, item.deviceVos.filter((item2) => item2.productKey === "j0rkM5mCanO").length ? {
            g: common_vendor.o(($event) => handleToHealthyData(item.bedVo.bedNumber, item.remark, item.elderVo.name, item.elderVo.image, item.roomVo.typeName, item.deviceVos.filter((item2) => item2.productKey === "j0rkM5mCanO").length ? item.deviceVos.filter((item2) => item2.productKey === "j0rkM5mCanO")[0].deviceName : "", item.deviceVos.filter((item2) => item2.productKey === "j0rkM5mCanO").length ? item.deviceVos.filter((item2) => item2.productKey === "j0rkM5mCanO")[0].productKey : ""), index)
          } : {}, {
            h: common_vendor.o(($event) => handleUnbind(item.id), index),
            i: index
          });
        }),
        c: __props.itemData.length > 6
      }, __props.itemData.length > 6 ? {
        d: common_vendor.p({
          status: __props.moreStatus,
          ["content-text"]: contentText.value
        })
      } : {}) : {}, {
        e: __props.itemData.length === 0 && __props.loading
      }, __props.itemData.length === 0 && __props.loading ? {
        f: common_vendor.p({
          emptyInfo: emptyInfo.value
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/pages/family/components/List.vue"]]);
wx.createComponent(Component);
