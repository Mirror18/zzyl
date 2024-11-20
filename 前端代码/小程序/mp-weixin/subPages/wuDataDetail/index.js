"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_api_family = require("../../pages/api/family.js");
require("../../utils/request.js");
require("../../utils/env.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  (_component_NavBar + _easycom_qiun_data_charts2)();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  (_easycom_qiun_data_charts + EmptyPage)();
}
const EmptyPage = () => "../../components/EmptyPage/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const type = common_vendor.ref("day");
    const chartData = common_vendor.ref({
      categories: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00"
      ],
      series: [
        {
          name: "心率",
          data: []
        }
      ]
    });
    const isCanScroll = common_vendor.ref(true);
    const unusualData = common_vendor.ref([]);
    const currentData = common_vendor.ref("");
    const currentDay = common_vendor.ref();
    const leftTopTime = common_vendor.ref("");
    const weekLeftTopTime = common_vendor.ref("");
    const params = common_vendor.ref({
      deviceName: "cexinlva",
      functionId: "HeartRate",
      pageNum: 1,
      pageSize: 10
      // startTime: startOfDay(new Date()).getTime(),
      // endTime: endOfDay(new Date()).getTime(),
    });
    common_vendor.onLoad((options) => {
      currentDay.value = options.date;
      params.value.startTime = common_vendor.startOfDay(new Date(currentDay.value)).getTime();
      params.value.endTime = common_vendor.endOfDay(new Date(currentDay.value)).getTime();
      params.value.deviceName = options.deviceName;
    });
    common_vendor.onMounted(() => {
      getHeartData();
    });
    const opts = common_vendor.ref({
      color: ["#FE6A3D", "#6F8FFF"],
      padding: [15, 10, 10, 0],
      duration: 1e3,
      update: true,
      legend: {
        show: false
      },
      xAxis: {
        disableGrid: true,
        axisLineColor: "#F4F4F4",
        rotateAngle: 45,
        rotateLabel: true,
        marginTop: 10
      },
      yAxis: {
        gridColor: "#F4F4F4",
        gridType: "solid",
        dashLength: 2,
        showTitle: true,
        splitNumber: 5,
        data: [
          {
            title: "次",
            titleFontColor: "#878787",
            titleFontSize: 11,
            titleOffsetY: -5,
            titleOffsetX: -10,
            axisLine: false,
            fontColor: "#878787",
            fontSize: 11,
            min: 0,
            max: 150
          }
        ]
      },
      extra: {
        area: {
          type: "curve",
          addLine: true,
          width: 2,
          gradient: true,
          activeType: "hollow"
        },
        tooltip: {
          showBox: false
          // legendShow: false,
          // borderRadius: 7,
          // boxPadding: 8,
        }
      }
    });
    const handleType = (val) => {
      type.value = val;
      isCanScroll.value = true;
      params.value.pageNum = 1;
      unusualData.value = [];
      let n = 1;
      if (val === "day") {
        chartData.value.categories = [
          "00:00",
          "03:00",
          "06:00",
          "09:00",
          "12:00",
          "15:00",
          "18:00",
          "21:00"
        ];
      } else {
        params.value.endTime = common_vendor.endOfDay(new Date(currentDay.value)).getTime();
        params.value.startTime = common_vendor.startOfDay(new Date(currentDay.value)).getTime() - 864e5 * 6;
        chartData.value.categories = [
          getTime("day", new Date(new Date(currentDay.value))),
          getTime("day", new Date(new Date(currentDay.value).getTime() - 864e5)),
          getTime(
            "day",
            new Date(new Date(currentDay.value).getTime() - 864e5 * 2 * n)
          ),
          getTime(
            "day",
            new Date(new Date(currentDay.value).getTime() - 864e5 * 3 * n)
          ),
          getTime(
            "day",
            new Date(new Date(currentDay.value).getTime() - 864e5 * 4 * n)
          ),
          getTime(
            "day",
            new Date(new Date(currentDay.value).getTime() - 864e5 * 5 * n)
          ),
          getTime(
            "day",
            new Date(new Date(currentDay.value).getTime() - 864e5 * 6 * n)
          )
        ].reverse();
      }
      chartData.value.series[0].data = [];
      getHeartData();
    };
    const handleClick = (e) => {
      if (e.currentIndex.index === -1)
        return;
      currentData.value = chartData.value.series[0].data.length ? chartData.value.series[0].data[e.currentIndex.index] || "--" : 0;
      if (type.value === "day") {
        leftTopTime.value = chartData.value.categories.length ? chartData.value.categories[e.currentIndex.index] : 0;
      } else {
        weekLeftTopTime.value = chartData.value.categories.length ? chartData.value.categories[e.currentIndex.index] : "--";
      }
      console.log(e, "eeeeeeeeee");
    };
    const handleChangeDay = (e) => {
      if (type.value === "day") {
        params.value.startTime = common_vendor.startOfDay(new Date(e.detail.value)).getTime();
        params.value.endTime = common_vendor.endOfDay(new Date(e.detail.value)).getTime();
      } else {
        params.value.endTime = common_vendor.endOfDay(new Date(e.detail.value)).getTime();
        params.value.startTime = common_vendor.startOfDay(new Date(e.detail.value)).getTime() - 864e5 * 6;
      }
      currentDay.value = e.detail.value;
      handleType(type.value);
      console.log(e, common_vendor.startOfDay(new Date(e.detail.value)).getTime(), "eeeeeeeeee");
    };
    const getHeartData = () => {
      (type.value === "day" ? pages_api_family.elderBloodPresh : pages_api_family.elderBloodPreshPing)({
        ...params.value
        // status: 0,
      }).then((res) => {
        const data = res.data.records;
        if (type.value === "day") {
          let result = data.length ? data.slice(0, 8).map((item) => Math.round(Number(item.dataValue))).reverse() : [];
          chartData.value.series[0].data = result;
          currentData.value = data.length ? Math.round(Number(data[0].dataValue)) : "--";
          leftTopTime.value = chartData.value.categories[7];
        } else {
          let arr = [null, null, null, null, null, null, null];
          if (data.length) {
            data.map((item, index) => {
              let findIndex = chartData.value.categories.findIndex(
                (item1) => item1 === item.data
              );
              if (findIndex !== -1) {
                arr[findIndex] = Math.round(Number(item.dataValue));
              }
            });
          }
          chartData.value.series[0].data = arr;
          currentData.value = arr.length ? Math.round(Number(arr[arr.length - 1])) || "--" : "--";
          leftTopTime.value = `${chartData.value.categories[0]}-${chartData.value.categories[6]}`;
          weekLeftTopTime.value = chartData.value.categories[6];
        }
        getUnusualData();
        console.log(data);
      });
    };
    const getUnusualData = (val) => {
      if (!isCanScroll.value)
        return;
      pages_api_family.elderBloodPresh({ ...params.value, status: 1, ...val }).then((res) => {
        const data = res.data.records;
        unusualData.value = unusualData.value.concat(data);
        if (data.length < 10) {
          isCanScroll.value = false;
        }
        console.log(unusualData.value, "unusualData.value");
      });
    };
    const nextPage = () => {
      params.value.pageNum = params.value.pageNum + 1;
      getUnusualData({ pageNum: params.value.pageNum });
      console.log("下一页");
    };
    const getTime = (type2, time) => {
      const currentDate = time || /* @__PURE__ */ new Date();
      let formattedDate = "";
      if (type2 === "day") {
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        formattedDate = `${month}月${day}日`;
      } else {
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        const seconds = currentDate.getSeconds().toString().padStart(2, "0");
        formattedDate = `${hours}:${minutes}:${seconds}`;
      }
      return formattedDate;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "心率",
          isShowBack: true,
          src: "../../static/back@2x.png"
        }),
        b: common_vendor.n(type.value === "day" ? "active" : ""),
        c: common_vendor.o(($event) => handleType("day")),
        d: common_vendor.o(($event) => handleType("week")),
        e: common_vendor.n(type.value === "week" ? "active" : ""),
        f: common_vendor.t(getTime("day", new Date(currentDay.value))),
        g: common_vendor.o(handleChangeDay),
        h: currentDay.value,
        i: common_vendor.t(type.value === "week" ? weekLeftTopTime.value : leftTopTime.value),
        j: common_vendor.t(type.value === "week" ? leftTopTime.value : getTime("day", new Date(currentDay.value))),
        k: common_vendor.t(currentData.value),
        l: common_vendor.o(handleClick),
        m: common_vendor.p({
          type: "area",
          opts: opts.value,
          chartData: chartData.value,
          ontap: true
        }),
        n: unusualData.value.length
      }, unusualData.value.length ? {
        o: common_vendor.f(unusualData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.dataValue),
            b: common_vendor.t(item.alarmTime),
            c: index
          };
        })
      } : {
        p: common_vendor.p({
          emptyInfo: "暂无异常数据哦~"
        })
      }, {
        q: common_vendor.o(nextPage)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ee2bfac7"], ["__file", "E:/project/康乐养老/project-zhyl-xcx-uniapp-java/subPages/wuDataDetail/index.vue"]]);
wx.createPage(MiniProgramPage);
