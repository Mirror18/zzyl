<!--  -->
<template>
  <scroll-view class="scrollView" @scrolltolower="nextPage" scroll-y>
    <view class="wuDataDetail">
      <!-- 标题 -->
      <NavBar
        title="心率"
        :isShowBack="true"
        src="../../static/back@2x.png"
      ></NavBar>
      <view class="filter">
        <view class="dayOrWeek">
          <view
            class="day"
            :class="type === 'day' ? 'active' : ''"
            @click="handleType('day')"
            >日</view
          >
          <view
            class="week"
            @click="handleType('week')"
            :class="type === 'week' ? 'active' : ''"
            >周</view
          >
        </view>
        <view class="date">
          <picker mode="date" @change="handleChangeDay" :value="currentDay">
            {{ getTime('day', new Date(currentDay)) }}
          </picker>
          <image src="../../static/xiala2@2x.png" />
        </view>
      </view>
      <!-- 图标 -->
      <view class="charts-box">
        <view class="timeTitle">
          <view class="time">{{
            type === 'week' ? weekLeftTopTime : leftTopTime
          }}</view>
          <view class="date">{{
            type === 'week' ? leftTopTime : getTime('day', new Date(currentDay))
          }}</view>
        </view>
        <view class="dataTitle">
          <view class="left">
            <view class="data">{{ currentData }}</view>
            <view>次/分钟</view>
          </view>
        </view>
        <view class="charts">
          <qiun-data-charts
            type="area"
            :opts="opts"
            :chartData="chartData"
            :ontap="true"
            @getIndex="handleClick"
          />
        </view>
        <view class="normalTips"> 心率正常范围60~100次/分钟 </view>
      </view>
      <!-- 异常数据 -->
      <view class="unusual" v-if="unusualData.length">
        <view class="title">异常数据</view>

        <view class="item" :key="index" v-for="(item, index) in unusualData">
          <view class="left">
            <view class="shu">
              <view class="data">{{ item.dataValue }}</view>
              <view class="tips">
                <view>次/分钟</view>
              </view>
            </view>
          </view>
          <view class="right">{{ item.alarmTime }}</view>
        </view>
      </view>
      <!-- 空数据页面 -->
      <view v-else>
        <EmptyPage emptyInfo="暂无异常数据哦~" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { startOfDay, endOfDay, format } from 'date-fns';
// 无数据
import EmptyPage from '@/components/EmptyPage/index.vue';
import { elderBloodPresh, elderBloodPreshPing } from '@/pages/api/family.js';
const type = ref('day');
const chartData = ref({
  categories: [
    '00:00',
    '03:00',
    '06:00',
    '09:00',
    '12:00',
    '15:00',
    '18:00',
    '21:00',
  ],
  series: [
    {
      name: '心率',
      data: [],
    },
  ],
});
const isCanScroll = ref(true);
const unusualData = ref([]);
const currentData = ref(''); //左上角当前显示的数据，点击图标可以变化
const currentDay = ref(); //时间筛选器选择后的时间
const leftTopTime = ref(''); //左上角当前显示的时间，点击图标可以变化（日）
const weekLeftTopTime = ref(''); //左上角当前显示的时间，点击图标可以变化（周）

const params = ref({
  deviceName: 'cexinlva',
  functionId: 'HeartRate',
  pageNum: 1,
  pageSize: 10,
  // startTime: startOfDay(new Date()).getTime(),
  // endTime: endOfDay(new Date()).getTime(),
});
onLoad((options) => {
  currentDay.value = options.date;
  params.value.startTime = startOfDay(new Date(currentDay.value)).getTime();
  params.value.endTime = endOfDay(new Date(currentDay.value)).getTime();
  params.value.deviceName = options.deviceName;
});
onMounted(() => {
  // currentDay.value = format(new Date(), 'yyyy-MM-dd');
  getHeartData();
});
const opts = ref({
  color: ['#FE6A3D', '#6F8FFF'],
  padding: [15, 10, 10, 0],
  duration: 1000,
  update: true,
  legend: {
    show: false,
  },
  xAxis: {
    disableGrid: true,
    axisLineColor: '#F4F4F4',
    rotateAngle: 45,
    rotateLabel: true,
    marginTop: 10,
  },
  yAxis: {
    gridColor: '#F4F4F4',
    gridType: 'solid',
    dashLength: 2,
    showTitle: true,
    splitNumber: 5,
    data: [
      {
        title: '次',
        titleFontColor: '#878787',
        titleFontSize: 11,
        titleOffsetY: -5,
        titleOffsetX: -10,
        axisLine: false,
        fontColor: '#878787',
        fontSize: 11,
        min: 0,
        max: 150,
      },
    ],
  },
  extra: {
    area: {
      type: 'curve',
      addLine: true,
      width: 2,
      gradient: true,
      activeType: 'hollow',
    },
    tooltip: {
      showBox: false,
      // legendShow: false,
      // borderRadius: 7,
      // boxPadding: 8,
    },
  },
});
//日周切换
const handleType = (val) => {
  type.value = val;
  //重置数据
  isCanScroll.value = true;
  params.value.pageNum = 1;
  unusualData.value = [];
  let n = 1;
  if (val === 'day') {
    chartData.value.categories = [
      '00:00',
      '03:00',
      '06:00',
      '09:00',
      '12:00',
      '15:00',
      '18:00',
      '21:00',
    ];
    params.value.endTime = endOfDay(new Date(currentDay.value)).getTime();
    params.value.startTime = startOfDay(new Date(currentDay.value)).getTime();
  } else {
    params.value.endTime = endOfDay(new Date(currentDay.value)).getTime();
    params.value.startTime =
      startOfDay(new Date(currentDay.value)).getTime() - 86400000 * 6;
    chartData.value.categories = [
      getTime('day', new Date(new Date(currentDay.value))),
      getTime('day', new Date(new Date(currentDay.value).getTime() - 86400000)),
      getTime(
        'day',
        new Date(new Date(currentDay.value).getTime() - 86400000 * 2 * n)
      ),
      getTime(
        'day',
        new Date(new Date(currentDay.value).getTime() - 86400000 * 3 * n)
      ),
      getTime(
        'day',
        new Date(new Date(currentDay.value).getTime() - 86400000 * 4 * n)
      ),
      getTime(
        'day',
        new Date(new Date(currentDay.value).getTime() - 86400000 * 5 * n)
      ),
      getTime(
        'day',
        new Date(new Date(currentDay.value).getTime() - 86400000 * 6 * n)
      ),
    ].reverse();
  }
  chartData.value.series[0].data = [];
  getHeartData();
};
const handleClick = (e) => {
  if (e.currentIndex.index === -1) return;
  currentData.value = chartData.value.series[0].data.length
    ? chartData.value.series[0].data[e.currentIndex.index] || '--'
    : 0;
  if (type.value === 'day') {
    leftTopTime.value = chartData.value.categories.length
      ? chartData.value.categories[e.currentIndex.index]
      : 0;
  } else {
    weekLeftTopTime.value = chartData.value.categories.length
      ? chartData.value.categories[e.currentIndex.index]
      : '--';
  }

  console.log(e, 'eeeeeeeeee');
};
//时间选择器改变日期
const handleChangeDay = (e) => {
  if (type.value === 'day') {
    params.value.startTime = startOfDay(new Date(e.detail.value)).getTime();
    params.value.endTime = endOfDay(new Date(e.detail.value)).getTime();
  } else {
    params.value.endTime = endOfDay(new Date(e.detail.value)).getTime();
    params.value.startTime =
      startOfDay(new Date(e.detail.value)).getTime() - 86400000 * 6;
  }

  currentDay.value = e.detail.value;
  handleType(type.value);
  // getHeartData();
  console.log(e, startOfDay(new Date(e.detail.value)).getTime(), 'eeeeeeeeee');
};
//H获取心率数据
const getHeartData = () => {
  // chartData.value.series[0].data = [1, 90, 150];
  //获取图表心率数据
  (type.value === 'day' ? elderBloodPresh : elderBloodPreshPing)({
    ...params.value,
    // status: 0,
  }).then((res) => {
    const data = res.data.records;

    if (type.value === 'day') {
      let result = data.length
        ? data
            .slice(0, 8)
            .map((item) => Math.round(Number(item.dataValue)))
            .reverse()
        : [];
      chartData.value.series[0].data = result;
      // chartData.value.series[0].data = [1, 2, 150];
      currentData.value = data.length
        ? Math.round(Number(data[0].dataValue))
        : '--';
      leftTopTime.value = chartData.value.categories[7];
      // currentDay.value = data.length
      //   ? format(new Date(data[0].updateTime), 'yyyy-MM-dd')
      //   : format(new Date(), 'yyyy-MM-dd');
      // params.value.startTime = startOfDay(new Date(currentDay.value)).getTime();
      // params.value.endTime = endOfDay(new Date(currentDay.value)).getTime();
    } else {
      //只有当值为null坐标轴上才会没有值，当选为周时，将返回的有周的数据写入到x轴对应的y值
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
      currentData.value = arr.length
        ? Math.round(Number(arr[arr.length - 1])) || '--'
        : '--';
      leftTopTime.value = `${chartData.value.categories[0]}-${chartData.value.categories[6]}`;
      weekLeftTopTime.value = chartData.value.categories[6];
    }
    getUnusualData();
    console.log(data);
  });
};
//获取异常数据
const getUnusualData = (val) => {
  if (!isCanScroll.value) return;
  elderBloodPresh({ ...params.value, status: 1, ...val }).then((res) => {
    const data = res.data.records;
    unusualData.value = unusualData.value.concat(data);
    if (data.length < 10) {
      isCanScroll.value = false;
    }
    console.log(unusualData.value, 'unusualData.value');
  });
};
const nextPage = () => {
  params.value.pageNum = params.value.pageNum + 1;
  getUnusualData({ pageNum: params.value.pageNum });
  console.log('下一页');
};
//获取当前日期的月日格式和时分秒格式
const getTime = (type, time) => {
  const currentDate = time || new Date();
  let formattedDate = '';
  if (type === 'day') {
    // 获取月份和日期，并确保它们以两位数的格式显示
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    formattedDate = `${month}月${day}日`;
  } else {
    // 获取小时、分钟和秒，并确保它们以两位数的格式显示
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    formattedDate = `${hours}:${minutes}:${seconds}`;
  }
  return formattedDate;
};
</script>
<style src="./index.scss" lang="scss" scoped></style>
