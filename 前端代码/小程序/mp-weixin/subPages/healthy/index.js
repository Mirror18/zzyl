"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_api_family = require("../../pages/api/family.js");
require("../../utils/request.js");
require("../../utils/env.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  _component_NavBar();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bedNumber = common_vendor.ref("");
    const elderImg = common_vendor.ref("");
    const elderName = common_vendor.ref("");
    const remark = common_vendor.ref("");
    const roomType = common_vendor.ref("");
    const deviceName = common_vendor.ref("");
    const heartRate = common_vendor.ref({});
    const productKey = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      bedNumber.value = options.bedNumber;
      elderImg.value = options.elderImg;
      elderName.value = options.elderName;
      remark.value = options.remark;
      roomType.value = options.roomType;
      deviceName.value = options.deviceName;
      productKey.value = options.productKey;
      console.log(options, "options");
    });
    common_vendor.onMounted(() => {
      pages_api_family.deviceDetail({
        deviceName: deviceName.value,
        productKey: productKey.value
      }).then((res) => {
        heartRate.value.updateTime = Number(
          res.data.list.propertyStatusInfo[0].time
        );
        heartRate.value.dataValue = res.data.list.propertyStatusInfo[0].value;
      });
    });
    const handleDisabled = () => {
      return common_vendor.index.showToast({
        title: "程序员小哥哥正在开发中",
        duration: 1e3,
        icon: "none"
      });
    };
    const getTime = (type, time) => {
      const currentDate = time || /* @__PURE__ */ new Date();
      let formattedDate = "";
      if (type === "day") {
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        formattedDate = `${month}月${day}日`;
      } else {
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        formattedDate = `${hours}:${minutes}`;
      }
      return formattedDate;
    };
    const handleToDetail = () => {
      common_vendor.index.navigateTo({
        // url: `/subPages/wuDataDetail/index`,
        url: `/subPages/wuDataDetail/index?date=${common_vendor.format(
          new Date(heartRate.value.updateTime),
          "yyyy-MM-dd"
        )}&deviceName=${deviceName.value}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "健康数据",
          isShowBack: true,
          src: "../../static/back@2x.png"
        }),
        b: elderImg.value,
        c: common_vendor.t(elderName.value),
        d: common_vendor.t(remark.value),
        e: common_vendor.t(roomType.value),
        f: common_vendor.t(bedNumber.value),
        g: heartRate.value.updateTime
      }, heartRate.value.updateTime ? {
        h: common_vendor.t(getTime("day", new Date(heartRate.value.updateTime))),
        i: common_vendor.t(getTime("time", new Date(heartRate.value.updateTime)))
      } : {}, {
        j: common_vendor.t(Number(heartRate.value.dataValue) < 60 ? "偏低" : Number(heartRate.value.dataValue) > 110 ? "偏高" : "正常"),
        k: common_vendor.n(Number(heartRate.value.dataValue) < 60 || heartRate.value.dataValue > 100 ? "unNormal" : ""),
        l: common_vendor.t(heartRate.value.dataValue || "--"),
        m: common_vendor.o(handleToDetail),
        n: common_vendor.t(getTime("day", new Date(heartRate.value.updateTime))),
        o: common_vendor.t(getTime("time", new Date(heartRate.value.updateTime))),
        p: common_vendor.o(handleDisabled),
        q: common_vendor.t(getTime("day", new Date(heartRate.value.updateTime))),
        r: common_vendor.t(getTime("time", new Date(heartRate.value.updateTime))),
        s: common_vendor.o(handleDisabled),
        t: common_vendor.t(getTime("day", new Date(heartRate.value.updateTime))),
        v: common_vendor.t(getTime("time", new Date(heartRate.value.updateTime))),
        w: common_vendor.o(handleDisabled)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-44de5b56"], ["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/healthy/index.vue"]]);
wx.createPage(MiniProgramPage);
