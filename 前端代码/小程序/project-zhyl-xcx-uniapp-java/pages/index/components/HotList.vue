<!--房型-->
<template>
	<view class="hotHouse">
		<view class="tit">热门房型</view>
		<view class="hotList">
			<view class="item" v-for="(item,index) in baseData" :key="index">
				<view class="img">
					<image :src="item.photo"></image>
					<view class="title">{{item.name}}</view>
				</view>
				<view class="text">{{item.introduction}}</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// ------定义变量------
// 获取父组件值、方法
const props = defineProps({
	// 房型信息
	baseData: {
		type: Array,
		default: () => []
	}
});
</script>
