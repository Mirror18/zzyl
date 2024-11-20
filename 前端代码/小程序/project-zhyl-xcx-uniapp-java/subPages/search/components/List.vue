<!--下单列表-->
<template>
	<view>
		<!-- 列表 -->
		<view class="main">
			<!-- 垂直滚动区域  scroll和swiper的高度都要给且是一样的高度-->
			<view v-if="itemData.length>0">
				<scroll-view scroll-y="true">

					<view class="serachList">
						<view v-for="(item,index) in itemData" :key="index" class="item" @click.stop="handleList(item.name)">
							<uni-icons class="input-uni-icon" type="search" size="16" />{{item.name}}</view>
					</view>

					<!-- 下拉加载更多Lodding -->
					<view v-if="itemData.length>6"><uni-load-more :status="moreStatus" :content-text="contentText" /></view>
					<!-- end -->
				</scroll-view>
			</view>
			<!-- 无数据显示 -->
			<view v-if="itemData.length===0&&loading&&isHistory">
				<EmptyPage :emptyInfo="emptyInfo" />
			</view>
			<!-- end -->
		</view>
		<!-- end -->
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue';
	import {
		useStore
	} from 'vuex';
	import {
		getNow,
		getTime,
		decimalsReplenish
	} from '@/utils/index.js';
	// 组件
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	// 获取父组件值、方法
	const props = defineProps({
		// 列表数据
		itemData: {
			type: Array,
			default: () => []
		},
		moreStatus: {
			type: String,
			default: 'noMore'
		},
		loading: {
			type: Boolean,
			default: false
		},
		isHistory:{
			type: Boolean,
			default: false
		}
	});
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const emit = defineEmits(['handleOpen','handleClear','handleList','handleBlur']);
	const emptyInfo = ref('暂无相关内容哦～');
	const contentText = ref({
		//加载状态说明
		contentdown: '上拉加载更多',
		contentrefresh: '努力加载中...',
		contentnomore: '- 没有更多了 -'
	});
	// ------定义方法------
	// 打开取消弹层
	const handleUnbind = id => {
		emit('handleOpen', id);
	};
	// 进入列表页
	const handleList = (val) => {
		emit('handleBlur')
		emit('handleList',val)
	}
</script>