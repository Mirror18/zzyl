"use strict";
const common_vendor = require("../../../common/vendor.js");
const pages_api_appointment = require("../../api/appointment.js");
const pages_api_family = require("../../api/family.js");
require("../../../utils/request.js");
require("../../../utils/env.js");
if (!Math) {
  (VisitPopup + LookPopup)();
}
const VisitPopup = () => "./VisitPopup.js";
const LookPopup = () => "../../../components/Binding/index.js";
const _sfc_main = {
  __name: "Appointment",
  setup(__props) {
    const store = common_vendor.useStore();
    const popupVisit = common_vendor.ref(null);
    const popupLook = common_vendor.ref(null);
    const isClick = common_vendor.ref(false);
    const typeVal = common_vendor.ref(null);
    const allElderData = common_vendor.ref([]);
    const token = common_vendor.ref(null);
    common_vendor.onShow(() => {
      token.value = common_vendor.index.getStorageSync("token");
      if (token.value) {
        getElderList();
      }
    });
    const handleVisit = (type) => {
      typeVal.value = type;
      if (!isClick.value) {
        isClick.value = true;
        handleCancelCount();
        if (type === 0) {
          store.commit("user/setAppointmentType", 0);
        } else {
          store.commit("user/setAppointmentType", 1);
        }
        let times = setTimeout(() => {
          isClick.value = false;
          clearTimeout(times);
        }, 3e3);
      }
    };
    const getElderList = async () => {
      await pages_api_family.getAllElderList().then((res) => {
        if (res.code === 200) {
          allElderData.value = res.data;
        }
      });
    };
    const handleCancelCount = async () => {
      console.log(123);
      await pages_api_appointment.cancelCount().then((res) => {
        console.log(res.data);
        if (res.code === 200) {
          let data = res.data;
          if (data >= 3) {
            popupVisit.value.popup.open();
          } else {
            console.log(token.value, 456);
            if (token.value) {
              if (allElderData.value.length === 0 && typeVal.value === 1) {
                popupLook.value.popup.open();
              } else {
                common_vendor.index.navigateTo({
                  url: "/subPages/appointment/index"
                });
              }
            } else {
              common_vendor.index.navigateTo({
                url: "/pages/login/index"
              });
            }
          }
        } else {
          store.commit("setRouter", "pages/index/index");
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => handleVisit(1)),
        b: common_vendor.o(($event) => handleVisit(0)),
        c: common_vendor.sr(popupVisit, "cf4cf54e-0", {
          "k": "popupVisit"
        }),
        d: common_vendor.sr(popupLook, "cf4cf54e-1", {
          "k": "popupLook"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/pages/index/components/Appointment.vue"]]);
wx.createComponent(Component);
