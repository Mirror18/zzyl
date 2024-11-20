<template>
	<view class="net-fail" :style="{'paddingTop':capsuleBottom +'px'}">
		<image src='../../static/wuwang.png' />
		<p class="tips">网络开小差了</p>
		<div class="btn" @click="handleTo">重新加载</div>
	</view>
</template>

<script setup>
	let capsuleBottom = ref()
	// ------定义方法------
	//胶囊底部距离头部的距离
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 18
			}
		})
	})
	// 获取父组件值、方法
	const props = defineProps({
		handleToRefresh: { //用于自定义跳转
			type: Function
		}
	})
	//重新加载
	const handleTo = () => {
		props.handleToRefresh()
	}
</script>

<style src="./index.scss" lang="scss" scoped></style>
