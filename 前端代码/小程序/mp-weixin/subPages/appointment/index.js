"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
const utils_validate = require("../../utils/validate.js");
const pages_api_appointment = require("../../pages/api/appointment.js");
const pages_api_family = require("../../pages/api/family.js");
require("../../utils/request.js");
require("../../utils/env.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  _component_NavBar();
}
if (!Math) {
  (VisitApp + TimeSelect + PickerView + FamilyView)();
}
const VisitApp = () => "./components/VisitApp.js";
const PickerView = () => "./components/PickerView2.js";
const FamilyView = () => "../../components/FamilyView/index.js";
const TimeSelect = () => "./components/TimeSelect.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    const users = store.state.user;
    const pickerPopup = common_vendor.ref();
    const time = common_vendor.ref(null);
    const familyPopup = common_vendor.ref(null);
    const formData = common_vendor.ref({});
    const nowDate = common_vendor.ref();
    const appType = users.appointmentType;
    const timeText = common_vendor.ref("");
    const isClick = common_vendor.ref(false);
    const allTimeAll = common_vendor.ref([]);
    const ispicView = common_vendor.ref(false);
    const allElderData = common_vendor.ref([]);
    let capsuleBottom = common_vendor.ref();
    common_vendor.onLoad(() => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 12;
        }
      });
    });
    common_vendor.onMounted(() => {
      nowDate.value = utils_index.getNow(/* @__PURE__ */ new Date());
      getSearchList();
    });
    const handleSub = async () => {
      if (!isClick.value) {
        isClick.value = true;
        const baseData = formData.value;
        if (baseData.name === "" || !baseData.name) {
          utils_index.tostTip("预约内容不能为空");
          isClick.value = false;
          return false;
        } else if (baseData.mobile === "" || !baseData.mobile) {
          utils_index.tostTip("预约内容不能为空");
          isClick.value = false;
          return false;
        } else if (baseData.visitor === "" || !baseData.visitor) {
          utils_index.tostTip("预约内容不能为空");
          isClick.value = false;
          return false;
        } else if (timeText.value === "" || !timeText.value) {
          utils_index.tostTip("预约内容不能为空");
          isClick.value = false;
          return false;
        } else {
          isClick.value = false;
          if (!utils_validate.isPhone(baseData.mobile)) {
            utils_index.tostTip("手机号格式错误");
            return false;
          } else {
            const newTime = (/* @__PURE__ */ new Date()).getTime();
            let date = utils_index.getTate(nowDate.value, timeText.value);
            let type = users.appointmentType === 0 ? 0 : 1;
            const oldTime = new Date(date).getTime();
            if (newTime > oldTime) {
              utils_index.tostTip("预约时间需大于当前时间");
            } else {
              let params = {
                ...baseData,
                type,
                //参观预约
                time: date
              };
              clearFrom();
              await pages_api_appointment.addReservation(params).then((res) => {
                if (res.code === 200) {
                  utils_index.tostTip("预约成功");
                  clearFrom();
                  common_vendor.index.redirectTo({
                    url: "/subPages/appointment/list/index"
                  });
                } else {
                  utils_index.tostTip(res.msg);
                }
              });
            }
          }
        }
      }
    };
    const clearFrom = () => {
      formData.value = {};
      nowDate.value = utils_index.getNow(/* @__PURE__ */ new Date());
      time.value.activeIndex = 0;
      time.value.activeAmIndex = -1;
      time.value.activePmIndex = -1;
    };
    const getSearchList = async () => {
      formData.value;
      let time2 = utils_index.getDsec(nowDate.value);
      let params = {
        time: time2
      };
      allTimeAll.value = [];
      await pages_api_appointment.getAllList(params).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            allTimeAll.value = [];
          } else {
            allTimeAll.value = res.data;
          }
        }
      }).catch(() => {
      });
    };
    const getElderList = async () => {
      await pages_api_family.getAllElderList().then((res) => {
        if (res.code === 200) {
          allElderData.value = res.data;
        }
      });
    };
    const handleTime = (type) => {
      pickerPopup.value.popup.open(type);
    };
    const handleFamily = (type) => {
      familyPopup.value.popup.open(type);
      getElderList();
    };
    const bindPicker = (val) => {
      nowDate.value = utils_index.getNow(utils_index.getTateTime(val));
      isClick.value = false;
      getSearchList();
      ispicView.value = true;
    };
    const clearTime = () => {
      time.value.activeTimeIndex = -1;
    };
    const bindFamily = (val) => {
      formData.value.visitor = val.elderVo.name;
      formData.value.elderId = val.elderId;
    };
    const getDateTime = (val) => {
      timeText.value = val;
    };
    const handleToLink = () => {
      common_vendor.index.navigateBack({
        delta: 1
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: common_vendor.unref(appType) === 0 ? "参观预约" : "探访预约",
          isShowBack: true,
          handleToLink
        }),
        b: common_vendor.o(handleTime),
        c: common_vendor.o(handleFamily),
        d: common_vendor.p({
          nowDate: nowDate.value,
          formData: formData.value
        }),
        e: common_vendor.sr(time, "e98dc5bd-2", {
          "k": "time"
        }),
        f: common_vendor.o(getDateTime),
        g: common_vendor.p({
          nowDate: nowDate.value,
          appType: common_vendor.unref(appType),
          allTimeAll: allTimeAll.value
        }),
        h: common_vendor.o(handleSub),
        i: common_vendor.unref(capsuleBottom) + "px",
        j: common_vendor.sr(pickerPopup, "e98dc5bd-3", {
          "k": "pickerPopup"
        }),
        k: common_vendor.o(clearTime),
        l: common_vendor.o(bindPicker),
        m: common_vendor.p({
          nowDate: nowDate.value,
          ispicView: ispicView.value
        }),
        n: common_vendor.sr(familyPopup, "e98dc5bd-4", {
          "k": "familyPopup"
        }),
        o: common_vendor.o(bindFamily),
        p: common_vendor.p({
          formData: formData.value,
          allElderData: allElderData.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e98dc5bd"], ["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/appointment/index.vue"]]);
wx.createPage(MiniProgramPage);
