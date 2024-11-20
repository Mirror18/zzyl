<!-- 首页 -->
<template>
	<view class="homePage">
		<!-- 标题 -->
		<NavBar title="中州养老" :isShowBack="false"></NavBar>
		<!-- end -->
		<view class="main homeMain" :style="{'paddingTop':capsuleBottom +'px'}">
			<!-- banner -->
			<view class="homeBanner"><image src="../../static/banner.png"></image></view>
			<!-- end -->
			<!-- 入住咨询 -->
			<view class="homeConsult">
				<view class="img"></view>
				<view class="rText">
					<view class="tit">入驻咨询</view>
					<view>贴心服务 欢迎咨询</view>
				</view>
				<view class="bt btn" @click="handlePhone('bottom')">立即咨询</view>
			</view>
			<!-- end -->
			<!-- 探访参观 -->
			<view class="mt-20"><Appointment></Appointment></view>
			<!-- end -->
			<!-- 快速菜单 -->
			<view class="mt-20"><FastMenu @isToken="isToken"></FastMenu></view>
			<!-- end -->
			<!-- 热门房型 -->
			<scroll-view scroll-y="true">
				<HotList :base-data="baseData"></HotList>
			</scroll-view>
			<!-- end -->
			
		</view>
		
		<!-- footer -->
			<UniFooter :pagePath="'pages/index/index'"></UniFooter>
			<!-- end -->
			<!-- 电话弹层 -->
			<phone ref="phone" ></phone>
			<!-- end -->
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow, onPullDownRefresh,onLoad,onUnload } from '@dcloudio/uni-app';
import { useStore } from 'vuex';

// 接口api
import { getHotHoust } from '../api/index.js';
// 组件
import Phone from "@/components/uni-phone/index.vue" //拨打电话
// 快速入口
import FastMenu from './components/FastMenu.vue';
// 热门房型
import HotList from './components/HotList.vue';
// 预约
import Appointment from './components/Appointment.vue';
const store = useStore(); //vuex获取、储存数据
const baseData = ref([]); //热门房型数据
const enabled = ref(true);
const triggered = ref(false);
const freshing = ref(false)
const statusBarHeight = ref(0)
const phone = ref(null)
//胶囊底部距离头部的距离
	let capsuleBottom = ref()
// ------生命周期------
onShow(() => {
	getHotList();
});
onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
	})
// ------定义方法------
// 获取房型信息
const getHotList = async () => {
	await getHotHoust({ status: 1 }).then(res => {
		if (res.code === 200) {
			baseData.value = res.data;
			triggered.value = false;
			enabled.value = false;
		}
	});
};
onPullDownRefresh(() => {
	setTimeout(() => {
		getHotList();
		uni.stopPullDownRefresh(); //关闭刷新状态
	}, 200);
});
// 是否登录
const isToken=(val)=>{
	store.commit('setRouter','pages/index/index')
	uni.navigateTo({
		url: uni.getStorageSync('token') ? val : '/pages/login/index'
	});
}
//立即咨询
const handlePhone = (type) => {
		phone.value.popup.open('center')
	}
// 暴露给父组件
defineExpose({});
</script>
<style src="./index.scss" lang="scss" scoped></style>
