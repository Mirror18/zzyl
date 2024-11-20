"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    // 房型信息
    pagePath: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const store = common_vendor.useStore();
    common_vendor.ref("contact");
    common_vendor.ref(false);
    common_vendor.ref(400);
    const currentPage = common_vendor.ref(0);
    const tabbar = common_vendor.ref([
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/static/home.png",
        "selectedIconPath": "/static/homeHover.png"
      },
      {
        "pagePath": "/pages/family/index",
        "text": "家人",
        "iconPath": "/static/family.png",
        "selectedIconPath": "/static/familyHover.png"
      },
      {
        "pagePath": "/pages/service/index",
        "text": "服务",
        "iconPath": "/static/serve.png",
        "selectedIconPath": "/static/serveHover.png"
      },
      {
        "pagePath": "/pages/my/index",
        "text": "我的",
        "iconPath": "/static/my.png",
        "selectedIconPath": "/static/myHover.png"
      }
    ]);
    common_vendor.onShow(() => {
      currentPage.value = store.state.footStatus;
    });
    const changeTab = (item, index) => {
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].route;
      if (item.text !== "") {
        currentPage.value = index;
        console.log(item, index, 1111);
        store.commit("setFootStatus", index);
        const token = common_vendor.index.getStorageSync("token");
        store.commit("user/setAppointmentType", null);
        if (!token && index === 1) {
          if (curRoute === "pages/my/index") {
            store.commit("setFootStatus", 3);
          } else if (curRoute === "pages/index/index") {
            store.commit("setFootStatus", 0);
          } else if (curRoute === "pages/service/index") {
            store.commit("setFootStatus", 2);
          }
          store.commit("setRouter", curRoute);
          common_vendor.index.navigateTo({
            url: "/pages/login/index"
          });
        } else {
          common_vendor.index.reLaunch({
            url: item.pagePath
          });
        }
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabbar.value, (item, index, i0) => {
          return common_vendor.e(common_vendor.e({
            a: item.pagePath !== ""
          }, item.pagePath !== "" ? common_vendor.e({
            b: currentPage.value === index
          }, currentPage.value === index ? {
            c: item.selectedIconPath
          } : {
            d: item.iconPath
          }) : {
            e: item.iconPath
          }), {
            f: item.text !== ""
          }, item.text !== "" ? {
            g: common_vendor.t(item.text)
          } : {}, {
            h: common_vendor.n(currentPage.value === index ? "active" : ""),
            i: index,
            j: common_vendor.o(($event) => changeTab(item, index), index)
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/components/Foot/index.vue"]]);
exports.Component = Component;
