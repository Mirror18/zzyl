<!--家人列表-->
<template>
  <view class="pageCon appList familyBox">
    <!-- 标题 -->
    <NavBar title="我的家人" :isShowBack="false"></NavBar>
    <!-- end -->
    <view
      :style="{ paddingTop: capsuleBottom + 'px' }"
      v-if="netStatus"
      class="fBox"
    >
      <List
        :itemData="itemData"
        @setTabIndex="setTabIndex"
        :moreStatus="moreStatus"
        :loading="loading"
        @handleOpen="handleUnbind"
        @onReachBottom="onReachBottom"
      ></List>
      <view class="footBtn">
        <button class="bt" @click="handleBinding" v-if="loading">
          绑定家人
        </button>
      </view>
    </view>
    <!-- 断网显示的页面 -->
    <net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>
    <!-- 解除绑定弹层 -->
    <UnbindPopup
      ref="operate"
      @handleSub="subUnbind"
      :errorTipText="errorTipText"
    ></UnbindPopup>
    <!-- end -->
    <!-- footer -->
    <UniFooter :pagePath="'pages/family/index'"></UniFooter>
    <!-- end -->
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { tostTip } from '@/utils/index.js';
// 接口
import { getElderList, elderdeleteById } from '@/pages/api/family.js';
// 组件
import UnbindPopup from '@/components/Operate/index.vue';
// 列表
import List from './components/List.vue';
// ------定义变量------
const store = useStore(); //存储获取数据
const users = store.state.user; //获取存储数据
const operate = ref(null); //定义取消弹层ref
const itemData = ref([]); //列表数据
const moreStatus = ref('more'); //加载更多状态 loading  more noMore
const oldManId = ref(); //绑定id
const netStatus = ref(true);
const loading = ref(false); // 是否展示加载更多
const errorTipText = ref({
  text: '您确定要解除绑定吗？',
}); //弹层显示的内容
let params = reactive({
  pageNum: 1,
  pageSize: 10,
});
let pageNum = ref(1); //存放当前页
const pages = ref(0); // 总页数
const isSendRequest = ref(false); // 是否继续发送请求
let capsuleBottom = ref();
// ------定义方法------
//胶囊底部距离头部的距离
onLoad(() => {
  uni.getSystemInfo({
    success: (res) => {
      capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 18;
    },
  });
});
// ------定义方法------
onShow((e) => {
	itemData.value =[]
  getNewData();
});
// 获取任务列表
const getNewData = async (type) => {
  params = {
    ...params,
    pageNum: pageNum.value,
  };
  if (isSendRequest.value) {
    return;
  }
  moreStatus.value = 'loading';
  loading.value = false;
  let infoParams = {};
  await getElderList(params)
    .then((res) => {
      if (res.code == 200) {
        const { data } = res;
        // items == null 会报错 把他处理掉

        const items = data.records == null ? [] : data.records;
        moreStatus.value = items.length < 10 ? 'no-more' : 'more';
        // 从第一页请求 清空之前的数据
        params.page == 1 ? (itemData.value = undefined) : null;
        // 下拉数据合并
        itemData.value = itemData.value ? [...itemData.value, ...items] : items;
        // 如果 当前页面的数据已经全部数据了 那么停止拿数据
        pages.value = Number(data.pages);
        if (data.pages === pageNum.value) {
          isSendRequest.value = true;
          moreStatus.value = 'noMore';
        }
        uni.stopPullDownRefresh();
        netStatus.value = true;
        loading.value = true;
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.msg,
        duration: 1000,
        icon: 'none',
      });
      netStatus.value = false;
    });
};
// 断网刷新
const handleToRefresh = () => {
  params.value.pageNum = 1;
  getNewData();
};
// 上拉更多数据
const onReachBottom = () => {
	console.log(pageNum.value,pages.value,123)
  if (pageNum.value >= pages.value) {
    moreStatus.value = 'noMore';
    return false;
  } else {
    moreStatus.value = 'loading';
    let times = setTimeout(() => {
      pageNum.value++;
      getNewData();
    }, 1000); //这里延时一秒在加载方法有个loading效果
  }
};
// 确定解绑
const subUnbind = async () => {
  await elderdeleteById(oldManId.value).then((res) => {
    if (res.code === 200) {
      tostTip('解绑成功');
      setTimeout(() => {
        operate.value.popup.close();
				params.page = 1
        getNewData();
        clearTimeout();
      }, 1000);
    }
  });
};
// 绑定操作
const handleUnbind = (id) => {
  oldManId.value = id;
  operate.value.popup.open();
};
// 绑定家人
const handleBinding = () => {
  uni.navigateTo({
    url: '/pages/family/binding',
  });
};
// // 列表页返回预约列表
// const handleToLink = () => {
// 	uni.redirectTo({
// 		url: '/pages/index/index'
// 	});
// }
</script>
<style src="./index.scss" lang="scss" scoped></style>
