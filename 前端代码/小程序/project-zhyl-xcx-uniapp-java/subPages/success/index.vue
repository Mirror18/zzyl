<template>
	<view class="pageCon appBox successBox">
		<!-- 标题 -->
		<NavBar title="支付订单" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view class="success_content" v-if="netStatus">
			<view class="success_info">
				<image class="success_icon" src="../../static/success.png" mode=""></image>
				<view class="success_title"> 下单成功 </view>
				<view class="word-box">
					<text class="word_bottom">预计<text class="word_date">{{ dateTime}}</text>服务，请耐心等待~～</text>
				</view>
				<!-- 按钮操作 -->
				<view class="footBtn">
					<view class="bt bt-black inputW2" @click="goIndex"> 返回首页 </view>
					<view class="bt inputW2" @click="goOrder"> 查看订单 </view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';
	import {
		useStore
	} from 'vuex';
	import {
		onLoad,
		onShow,
		onUnload,
		onBackPress
	} from "@dcloudio/uni-app";
	import {
		getNow,
		getTime
	} from '@/utils/index.js';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const orderId = ref(null)
	const netStatus = ref(true) //判断有无网
	const baseData = ref({}) //基本数据
	const dateTime = ref(null) //期望服务时间
	const isback = ref(false) //是否触发了左上角返回按钮
	// ------定义方法------
	onLoad((option) => {
		baseData.value = JSON.parse(decodeURIComponent(option.item));
		orderId.value = baseData.value.id;
		dateTime.value = getNow(baseData.value.estimatedArrivalTime) + ' ' + getTime(baseData.value.estimatedArrivalTime)
	})
	onUnload(() => {
		// if (!isback.value) {
		// 	uni.navigateTo({
		// 		url: '/subPages/order/index'
		// 	})
		// 	// store.commit('user/setBackLike', 'detail');
		// }
 //  store.commit('setFootStatus', 0)
	// store.commit('user/setOrderStatus', '');
	})
	// 回首页
	const goIndex = () => {
		isback.value = true
		uni.reLaunch({
			url: "/pages/index/index",
		});
		store.commit('setFootStatus', 0)
	}
	// 查看订单
	const goOrder = () => {
		isback.value = true
		uni.navigateTo({
			url: "/subPages/order/details?id=" + orderId.value,
		});
		// store.commit('user/setBackLike', 'detail');
	}
	// 列表页返回订单列表
	const handleToLink = () => {
		isback.value = true
		uni.navigateTo({
			url: "/subPages/order/index",
		});
		store.commit('user/setOrderStatus', '');
	}
</script>
<style src="./index.scss" lang="scss" scoped></style>
<style lang="scss">
	page {
		background-color: var(--neutral-color-white) !important;
	}
</style>