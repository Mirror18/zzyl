<!-- 养老院介绍 -->
<template>
	<view class="homeIntro">
		<!-- 标题 -->
		<NavBar title="养老院介绍" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view class="main homeMain" :style="{'paddingTop':capsuleBottom +'px'}">
			<view class="map">
				<image src="../../static/map.jpg"></image>
			</view>
			<view class="con">
				<view class="head">
					<view class="tit">中州养老</view>
					<view>北京市神州去宜居街道188号</view>
				</view>
				<view class="info">
					<view class="item"><label><icon class="type"></icon>机构类别：</label>
						<view>护理型养老机构</view>
					</view>
					<view class="item"><label><icon class="acreage"></icon>占地面积：</label>
						<view>50,000平方米</view>
					</view>
					<view class="item"><label class="old"><icon class="oldMan"></icon>收住老人：</label>
						<view>特困人员，优抚，残疾，部分失能，完全失能，能力完好，其他</view>
					</view>
					<view class="item"><label><icon class="total"></icon>床位总数：</label>
						<view>500张</view>
					</view>
					<view class="item"><label><icon class="time"></icon>营业时间：</label>
						<view>08:00-18:00</view>
					</view>
				</view>
				<view class="img">
					<image src="../../static/pic-01.png"></image>
					<image src="../../static/pic-02.png"></image>
					<image src="../../static/pic-03.png"></image>
				</view>
				<view class="footBtn">
					<view @click="handlePhone('bottom')" class="bt">致电咨询</view>

				</view>
			</view>
		</view>
		<!-- 电话弹层 -->
		<phone ref="phone" ></phone>
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
		onUnload
	} from '@dcloudio/uni-app';
	import {
		useStore
	} from 'vuex';
	// 组件
	import Phone from "@/components/uni-phone/index.vue" //拨打电话
	const store = useStore(); //vuex获取、储存数据
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	const phone = ref(null)
	// ------生命周期------
	onShow(() => {});
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
	})
	// ------定义方法------
	// 致电
	const handlePhone = (type) => {
		phone.value.popup.open('center')
	}

	// 暴露给父组件
	defineExpose({});
</script>
<style lang="scss">
	page {
		background: #fff;
		color: #151515;
	}
</style>
<style src="./index.scss" lang="scss" scoped></style>