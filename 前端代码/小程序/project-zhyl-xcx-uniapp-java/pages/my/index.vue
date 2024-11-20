<!-- 首页 -->
<template>
	<view class="myPage">
		<!-- 标题 -->
		<!-- <NavBar title="中州养老" :isShowBack="false"></NavBar> -->
		<!-- end -->
		<view class="main" :style="{'paddingTop':capsuleBottom +'px'}">
			<view class="head" @click="handleClick">
				<image src="../../static/head.png"></image>
				<view class="text">{{token&&nickName?nickName:'立即登录'}}</view>
			</view>
			<view class="box boxRadius">
				<!-- 我的订单 -->
				<view class="order">
					<view class="lText">我的订单</view>
					<view class="rText" @click="handleOrder('')">查看全部<icon class="selectIcon iconOpacity"></icon>
					</view>
				</view>
				<!-- end -->
				<!-- 快速导航 -->
				<FastMenu @handle-order="handleOrder"></FastMenu>
				<!-- end -->

			</view>
			<!-- 我的快递导航 -->
			<view class="box boxRadius">
				<MyMenu @handle-app="handleApp" @handle-contract="handleContract" @handle-bill="handleBill"></MyMenu>
			</view>
			<!-- end -->
			<view class="myFootBtn" v-if="token&&nickName">
				<button class="bt bt-white" @click="handleOut">退出登录</button>
			</view>
		</view>
		<!-- 退出弹层 -->
		<DeletePopup ref="operate" @handleSub="subUnbind" :errorTipText="errorTipText"></DeletePopup>
		<!-- end -->
		<!-- footer -->
		<UniFooter :pagePath="'pages/my/index'"></UniFooter>
		<!-- end -->
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onShow,
		onPullDownRefresh,
		onLoad,
		onNavigationBarButtonTap
	} from '@dcloudio/uni-app';
	// 接口api
	import {
		getHotHoust
	} from '../api/index.js';
	import {
		useStore
	} from 'vuex';
	// 组件
	// 快速入口
	import FastMenu from './components/FastMenu.vue';
	import MyMenu from './components/MyMenu.vue';

	// 操作
	import DeletePopup from '@/components/Operate/index.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const operate = ref(null); //定义取消弹层ref
	const nickName = ref(null) //昵称
	const token = ref(null) //token
	const errorTipText = ref({
		text: '您真的要退出登录吗？'
	}); //弹层显示的内容
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	// ------生命周期------
	onShow(() => {
		// 获取nickName
		nickName.value = uni.getStorageSync('nickName')
		// 获取token
		token.value = uni.getStorageSync('token')
	});
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
	})
	// ------定义方法------
	// 确定退出
	const subUnbind = () => {
		store.dispatch('user/loginOut')
		operate.value.popup.close()
		nickName.value = null
		token.value = null
	}
	// 如果没有登录，进入登录页面
	const handleClick = () => {
		if (!token.value && !nickName.value) {
			goLogin()
		}
	}
	// 退出确认弹层
	const handleOut = () => {
		operate.value.popup.open()
	}
	// 订单列表页
	const handleOrder = (val) => {
		console.log(val)
		if (val != undefined) {
      
			store.commit('user/setOrderStatus', val);
		}
		if (!token.value && !nickName.value) {
			goLogin()
		}else{
			store.commit('user/setBackLike','my')
			uni.navigateTo({
				url: '/subPages/order/index'
			});
		}
	}
	// 我的预约
	const handleApp = () => {
		if (!token.value && !nickName.value) {
			goLogin()
		} else {
			uni.navigateTo({
				url: '/subPages/appointment/list/index'
			});
		}
	}
	// 我的合同
	const handleContract = () => {
		if (!token.value && !nickName.value) {
			goLogin()
		} else {
			uni.navigateTo({
				url: '/subPages/contract/index'
			});
		}

	}
	// 我的账单
	const handleBill = () => {
		if (!token.value && !nickName.value) {
			goLogin()
		}else{
			store.commit('user/setBackLike','my')
			uni.navigateTo({
				url: '/subPages/bill/index'
			});
		}
	}
	// 进入登录页
	const goLogin = () => {
		store.commit('setRouter', 'pages/my/index')
		uni.navigateTo({
			url: '/pages/login/index'
		});

	}
	// 暴露给父组件
	defineExpose({});
</script>
<style src="./index.scss" lang="scss" scoped></style>