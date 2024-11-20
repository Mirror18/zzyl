<!--预约列表-->
<template>
  <view>
    <!-- 列表 -->
    <view class="main">
      <!-- 垂直滚动区域  scroll和swiper的高度都要给且是一样的高度-->
      <view v-if="itemData.length > 0">
        <scroll-view scroll-y="true">
          <view class="timeList">
            <view
              class="box boxRadius item"
              v-for="(item, index) in itemData"
              :key="index"
            >
              <view class="itemCon">
                <view class="head"
                  ><image :src="item.elderVo.image"></image
                ></view>
                <view class="rText">
                  <view class="tit"
                    >{{ item.elderVo.name
                    }}<view class="tag">{{ item.remark }}</view></view
                  >
                  <view class="info"
                    >床位：{{
                      item.roomVo &&
                      item.roomVo.typeName !== undefined &&
                      item.bedVo &&
                      item.bedVo.bedNumber !== undefined
                        ? item.roomVo.typeName +
                          '-' +
                          item.bedVo.bedNumber +
                          '床'
                        : '--'
                    }}</view
                  >
                </view>
              </view>
              <view class="foot">
                <span class="bt bt-grey inputW" @click="handleBill(item)"
                  >我的账单</span
                >
                <span
                  class="bt bt-grey inputW"
                  v-if="
                    item.deviceVos.filter(
                      (item) => item.productKey === 'j0rkM5mCanO'
                    ).length
                  "
                  @click="
                    handleToHealthyData(
                      item.bedVo.bedNumber,
                      item.remark,
                      item.elderVo.name,
                      item.elderVo.image,
                      item.roomVo.typeName,
                      item.deviceVos.filter(
                        (item) => item.productKey === 'j0rkM5mCanO'
                      ).length
                        ? item.deviceVos.filter(
                            (item) => item.productKey === 'j0rkM5mCanO'
                          )[0].deviceName
                        : '',
                      item.deviceVos.filter(
                        (item) => item.productKey === 'j0rkM5mCanO'
                      ).length
                        ? item.deviceVos.filter(
                            (item) => item.productKey === 'j0rkM5mCanO'
                          )[0].productKey
                        : ''
                    )
                  "
                  >健康数据</span
                >
                <span class="bt bt-grey inputW" @click="handleUnbind(item.id)"
                  >解绑</span
                >
              </view>
            </view>
          </view>

          <!-- 下拉加载更多Lodding -->
          <view v-if="itemData.length > 6"
            ><uni-load-more :status="moreStatus" :content-text="contentText"
          /></view>
          <!-- end -->
        </scroll-view>
      </view>
      <!-- 无数据显示 -->
      <view v-if="itemData.length === 0 && loading"
        ><EmptyPage :emptyInfo="emptyInfo"
      /></view>
      <!-- end -->
    </view>
    <!-- end -->
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getNow, getTime } from '@/utils/index.js';
import { onReachBottom, onShow, onLoad } from '@dcloudio/uni-app';
// 组件
// 无数据
import EmptyPage from '@/components/EmptyPage/index.vue';
// 获取父组件值、方法
const props = defineProps({
  itemData: {
    type: Array,
    default: () => [],
  },
  moreStatus: {
    type: String,
    default: 'noMore',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
// ------定义变量------
const store = useStore(); //存储获取数据
const users = store.state.user; //获取存储数据
const emit = defineEmits(['handleOpen']);
const emptyInfo = ref('您暂时没有绑定的家人~');
const contentText = ref({
  //加载状态说明
  contentdown: '上拉加载更多',
  contentrefresh: '努力加载中...',
  contentnomore: '- 没有更多了 -',
});
// ------定义方法------
// 打开取消弹层
const handleUnbind = (id) => {
  emit('handleOpen', id);
};
// 我的账单
const handleBill = (val) => {
  store.commit('setFootStatus', 1); //底部选择为家人
  store.commit('user/setBackLike', 'family'); //设置是从首页进入到的订单页面
  uni.navigateTo({
    url: `/subPages/bill/index?id=${val.elderId}&name=${val.elderVo.name}`,
  });
};
// 上下拉取
onReachBottom(() => {
  emit('onReachBottom');
});
//健康数据
const handleToHealthyData = (
  bedNumber,
  remark,
  elderName,
  elderImg,
  roomType,
  deviceName,
  productKey
) => {
  uni.navigateTo({
    url: `/subPages/healthy/index?bedNumber=${bedNumber}&remark=${remark}&elderName=${elderName}&elderImg=${elderImg}&roomType=${roomType}&deviceName=${deviceName}&productKey=${productKey}`,
  });
};
</script>

<style></style>
