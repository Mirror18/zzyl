<!--  -->
<template>
  <view class="healthy">
    <!-- 标题 -->
    <NavBar
      title="健康数据"
      :isShowBack="true"
      src="../../static/back@2x.png"
    ></NavBar>
    <!-- 老人基础信息 -->
    <view class="baseInfo">
      <image :src="elderImg"></image>
      <view class="content">
        <view class="contentTop">
          <view class="name">{{ elderName }}</view>
          <view class="relation">{{ remark }}</view>
        </view>
        <view class="contentBottom">
          床位：
          <text>{{ roomType }}-{{ bedNumber }}床</text>
        </view>
      </view>
    </view>
    <!-- 物模型信息（血压真数据其他假数据） -->

    <view class="wuData">
      <view class="wuDataItem" @click="handleToDetail">
        <view class="top">
          <image src="../../static/icon-xzjk@2x.png"></image>
          <view v-if="heartRate.updateTime">
            <view class="text">{{
              getTime('day', new Date(heartRate.updateTime))
            }}</view>
            <view class="text">{{
              getTime('time', new Date(heartRate.updateTime))
            }}</view>
          </view>
        </view>
        <view class="label">心率</view>
        <view
          class="normal"
          :class="
            Number(heartRate.dataValue) < 60 || heartRate.dataValue > 100
              ? 'unNormal'
              : ''
          "
          >{{
            Number(heartRate.dataValue) < 60
              ? '偏低'
              : Number(heartRate.dataValue) > 110
              ? '偏高'
              : '正常'
          }}</view
        >
        <view class="data">
          <text>{{ heartRate.dataValue || '--' }}</text>
          <text class="unit">次/分</text>
        </view>
      </view>
      <view class="wuDataItem" @click="handleDisabled">
        <view class="top">
          <image src="../../static/icon-xueya@2x.png"></image>
          <view>
            <view class="text">{{
              getTime('day', new Date(heartRate.updateTime))
            }}</view>
            <view class="text">{{
              getTime('time', new Date(heartRate.updateTime))
            }}</view>
          </view>
        </view>
        <view class="label">血压</view>
        <view class="normal unNormal">血压偏高</view>
        <view class="data">
          <text>140/87</text>
          <text class="unit">mmHg</text>
        </view>
      </view>
      <view class="wuDataItem" @click="handleDisabled">
        <view class="top">
          <image src="../../static/icon-xy@2x.png"></image>
          <view>
            <view class="text">{{
              getTime('day', new Date(heartRate.updateTime))
            }}</view>
            <view class="text">{{
              getTime('time', new Date(heartRate.updateTime))
            }}</view>
          </view>
        </view>
        <view class="label">血氧</view>
        <view class="normal">正常</view>
        <view class="data">
          <text>98</text>
          <text class="unit">％</text>
        </view>
      </view>
      <view class="wuDataItem" @click="handleDisabled">
        <view class="top">
          <image src="../../static/icon-tw@2x.png"></image>
          <view>
            <view class="text">{{
              getTime('day', new Date(heartRate.updateTime))
            }}</view>
            <view class="text">{{
              getTime('time', new Date(heartRate.updateTime))
            }}</view>
          </view>
        </view>
        <view class="label">体温</view>
        <view class="normal unNormal">低温</view>
        <view class="data">
          <text>35.4</text>
          <text class="unit">℃</text>
        </view>
      </view>
    </view>
    <!-- 对某些指标的介绍 -->
    <view class="introduce">
      <image src="../../static/pic-xy@2x.png"></image>
      <view class="content"
        >血压是血液循环对身体动脉壁的压力。高血压是指血压过高，定义为多次重复测量后诊室收缩压>140
        mmHg和 (或)
        诊室舒张压>90mmHg。只有一次诊室血压高不能诊断高血压通常需要1~4周内进行2~3次测量血压
      </view>
    </view>
    <view class="introduce">
      <image src="../../static/pic-xt@2x.png"></image>
      <view class="content"
        >血糖是指人体血液中葡萄糖的浓度，机体许多组织、脏器都是以葡萄糖来作为能源，尤其是大脑细胞，主要的能源是依靠葡萄糖，所以血液中葡萄糖的浓度应该在一个恒定的水平，过高、过低对机体来说都是一个病态
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { format } from 'date-fns';
import { deviceDetail } from '@/pages/api/family.js';
const bedNumber = ref('');
const elderImg = ref('');
const elderName = ref('');
const remark = ref('');
const roomType = ref('');
const deviceName = ref('');
const heartRate = ref({});
const productKey = ref('');

onLoad((options) => {
  bedNumber.value = options.bedNumber;
  elderImg.value = options.elderImg;
  elderName.value = options.elderName;
  remark.value = options.remark;
  roomType.value = options.roomType;
  deviceName.value = options.deviceName;
  productKey.value = options.productKey;
  console.log(options, 'options');
});
onMounted(() => {
  deviceDetail({
    deviceName: deviceName.value,
    productKey: productKey.value,
  }).then((res) => {
    heartRate.value.updateTime = Number(
      res.data.list.propertyStatusInfo[0].time
    );
    heartRate.value.dataValue = res.data.list.propertyStatusInfo[0].value;
    // console.log(new Date(heartRate.value.updateTime).getHours(), '---');
  });
});
//程序暂未开发
const handleDisabled = () => {
  return uni.showToast({
    title: '程序员小哥哥正在开发中',
    duration: 1000,
    icon: 'none',
  });
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
    formattedDate = `${hours}:${minutes}`;
  }
  return formattedDate;
};
const handleToDetail = () => {
  uni.navigateTo({
    // url: `/subPages/wuDataDetail/index`,
    url: `/subPages/wuDataDetail/index?date=${format(
      new Date(heartRate.value.updateTime),
      'yyyy-MM-dd'
    )}&deviceName=${deviceName.value}`,
  });
};
</script>
<style src="./index.scss" lang="scss" scoped></style>
