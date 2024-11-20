"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "des",
  props: {
    // 选择的时间
    nowDate: {
      type: String,
      default: ""
    },
    ispicView: {
      type: Boolean,
      default: false
    }
  },
  setup(__props, { expose, emit }) {
    const props = __props;
    const popup = common_vendor.ref(null);
    const date = /* @__PURE__ */ new Date();
    const year = common_vendor.ref(date.getFullYear());
    const month = common_vendor.ref(date.getMonth() + 1);
    const day = common_vendor.ref(date.getDate());
    const selectValue = common_vendor.ref([0, 1, 1]);
    const visible = true;
    const indicatorStyle = `height: 50px`;
    const isTime = common_vendor.ref(false);
    common_vendor.watch(props, (newValue, oldValue) => {
      common_vendor.nextTick$1(() => {
        const date2 = new Date(newValue.nowDate);
        date2.getFullYear();
        const month2 = date2.getMonth() + 1;
        const day2 = date2.getDate();
        months.value.forEach((ele, i) => {
          if (month2 === ele) {
            selectValue.value[1] = i;
          }
        });
        days.value.forEach((v, index) => {
          if (day2 === v) {
            selectValue.value[2] = index;
          }
        });
      });
    });
    const months = common_vendor.ref();
    const years = common_vendor.ref([]);
    const days = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      for (let i = year.value; i <= date.getFullYear() + 10; i++) {
        years.value.push(i);
      }
      getMon();
      getDate();
    });
    const getMon = () => {
      let m = [];
      const date2 = /* @__PURE__ */ new Date();
      date2.getFullYear();
      const month2 = date2.getMonth();
      for (let i = 1; i <= 12; i++) {
        m.push(i);
      }
      months.value = m.splice(month2);
    };
    const getDate = () => {
      const num = mGetDate(year.value, month.value);
      const date2 = /* @__PURE__ */ new Date();
      date2.getFullYear();
      const day2 = date2.getDate() - 1;
      date2.getMonth() + 1;
      let d = [];
      for (let i = 1; i <= num; i++) {
        d.push(i);
      }
      days.value = d.splice(day2);
    };
    const mGetDate = (year2, month2) => {
      var m = new Date(year2, month2, 0);
      return m.getDate();
    };
    const bindChange = (e) => {
      const val = e.detail.value;
      const y = years.value[val[0]];
      const m = months.value[val[1]];
      const d = days.value[val[2]];
      const date2 = /* @__PURE__ */ new Date();
      const yearData = date2.getFullYear();
      const dayData = date2.getDate() - 1;
      const mon = date2.getMonth() + 1;
      const num = mGetDate(y, m);
      year.value = y;
      month.value = m;
      day.value = d;
      selectValue.value = val;
      let monBasedata = [];
      for (let monIndex = 1; monIndex <= 12; monIndex++) {
        monBasedata.push(monIndex);
      }
      let data = [];
      for (let dataIndex = 1; dataIndex <= num; dataIndex++) {
        data.push(dataIndex);
      }
      if (m > mon) {
        days.value = data;
      } else {
        days.value = data.splice(dayData);
      }
      if (y > yearData) {
        days.value = data;
        months.value = monBasedata;
      } else {
        months.value = monBasedata.splice(mon - 1);
      }
    };
    const onSubmit = () => {
      let data = "";
      data = year.value + "." + month.value + "." + day.value;
      if (!isTime.value) {
        emit("bindPicker", data, { year: year.value, month: month.value, day: day.value });
        popup.value.close();
      } else {
        utils_index.tostTip("日期不可小于当前日期");
      }
    };
    const handleClose = () => {
      const date2 = new Date(props.nowDate);
      date2.getFullYear();
      const dayData = date2.getDate();
      const mon = date2.getMonth() + 1;
      days.value.forEach((ele, i) => {
        if (ele === dayData) {
          selectValue.value[2] = i;
        }
      });
      months.value.forEach((ele, i) => {
        if (ele === mon) {
          selectValue.value[1] = i;
        }
      });
      popup.value.close();
    };
    expose({
      popup
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleClose),
        b: common_vendor.t(selectValue.value),
        c: visible
      }, {
        d: common_vendor.f(years.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        e: common_vendor.f(months.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        f: common_vendor.f(days.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        g: indicatorStyle,
        h: selectValue.value,
        i: common_vendor.o(bindChange)
      }, {
        j: common_vendor.o(onSubmit),
        k: _ctx.type === "left" || _ctx.type === "right" ? 1 : "",
        l: common_vendor.sr(popup, "3056a119-0", {
          "k": "popup"
        }),
        m: common_vendor.o(_ctx.change)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/appointment/components/des.vue"]]);
wx.createPage(MiniProgramPage);
