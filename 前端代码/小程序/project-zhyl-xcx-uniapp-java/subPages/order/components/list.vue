<!--订单列表-->
<template>
	<view :style="{'paddingTop':capsuleBottom +'px'}">
		<!-- tabl切换 -->
		<scroll-view scroll-x="true" class="tabScroll" :scroll-into-view="scrollinto" :scroll-with-animation="true">
			<view class="itemTab box">
				<view class="tabBox" :class="activeIndex === 1 ? 'active' : ''">
					<view class="tabItem" :class="activeIndex === index ? 'active' : ''" v-for="(item, index) in orderTabData"
						@click="changeTab(index)" :key="index">
						<view class="bLine"></view>
						{{ item.label }}
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- end -->
		<!-- 列表 -->
		<view class="main">
			<!-- 垂直滚动区域  scroll和swiper的高度都要给且是一样的高度-->
			<view>
				<scroll-view scroll-y="true">
					<view class="timeList">
						<view class="box boxRadius item" v-for="(item, index) in itemData" :key="index">
							<view class="itemCon" @click.stop="handleDetail(item.id)">
								<view class="head">
									<image :src="item.nursingProjectVo.image"></image>
								</view>
								<view class="rText">
									<view class="itemTit tit "><text>{{item.nursingProjectVo.name}}</text><text v-if="item.status===0"
											class="font-col">待支付</text><text v-if="item.status===1" class="font-col">待执行 </text><text
											v-if="item.status===2">已执行</text><text v-if="item.status===3">已完成</text><text
											v-if="item.status===4">已关闭</text><text v-if="item.status===5">已退款</text></view>
									<view class="info">服务家人：{{item.elderVo.name}}</view>
									<view class="info">期望服务时间：{{getNow(item.estimatedArrivalTime)}} {{getTime(item.estimatedArrivalTime)}}
									</view>
									<view class="amount">实付款<span class="font-col">￥{{decimalsReplenish(item.amount)}}</span></view>
								</view>
							</view>
							<view class="foot" v-if="item.status===0">
								<span class="bt bt-grey inputW" @click="handleCancel(item)">取消订单</span>
								<span class="bt bt-orange inputW" @click="handlePay(item)">去支付</span>
								
								
							</view>
							<view class="foot" v-if="(item.status===1&&!item.refundRecordVo.refundStatus)||(item.status===1&&item.refundRecordVo.refundStatus===3)">
								<span class="bt bt-grey inputW"									
									@click="handleRefund(item)">退款</span>
							</view>
							<view class="foot" v-if="item.status!==0&&item.status!==1">
								<span class="bt bt-grey inputW"
									@click="handleDelete(item.id)">删除</span>
							</view>
						</view>
					</view>

					<!-- 下拉加载更多Lodding -->
					<view v-if="itemData.length>6"><uni-load-more :status="moreStatus" :content-text="contentText" /></view>
					<!-- end -->
				</scroll-view>
			</view>
			<!-- 无数据显示 -->
			<view v-if="itemData.length===0&&loading">
				<EmptyPage :emptyInfo="emptyInfo" />
			</view>
			<!-- end -->
			<!-- <web-view v-if="allUrl" :src="allUrl"></web-view> -->
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
	import {
		onReachBottom,
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	// 组件
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	// 基础数据
	import {
		orderTabData
	} from '@/utils/commonData.js';
	// 获取父组件值、方法
	const props = defineProps({
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
		}
	});
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const emit = defineEmits(['setTabIndex', 'onReachBottom', 'handleDelete']);
	const activeIndex = ref(users.orderStatus===''?0:users.orderStatus+1); //当前tab
	const scrollinto = ref('tab0'); //tab切换
	const emptyInfo = ref('未找到相关任务');
	const contentText = ref({
		//加载状态说明
		contentdown: '上拉加载更多',
		contentrefresh: '努力加载中...',
		contentnomore: '- 没有更多了 -'
	});
	const pagesCount = ref(null)
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	// ------定义方法------
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
		let pages = getCurrentPages()
		pagesCount.value = pages.length
	})
	// 切换tab
	const changeTab = index => {
		// 点击的还是当前数据的时候直接return
		if (activeIndex.value == index) {
			return;
		}
		activeIndex.value = index;
		emit('setTabIndex', index);
	};
	// 上拉刷新
	function scrolltoupperHandle() {
		emit('setTabIndex', index);
	}
	// 进入取消页面
	const handleCancel = (item) => {
		handleNavigate(item, 4)
	};
	// 进入退款原因页面
	const handleRefund = (item) => {
		handleNavigate(item, 5)
	}
	// 取消、退款原因页面
	const handleNavigate = (item, num) => {
		// store.commit('user/setBackLike', 'cancel');
		uni.navigateTo({
			url: `/subPages/order/cancel?id=${item.id}&type=${num}&tradingOrderNo=${item.tradingOrderNo}`
		});
	}
	//删除
	const handleDelete = (id) => {
		emit('handleDelete', id)
	}
	// 去支付
	const handlePay = (val) => {
		// store.commit('user/setBackLike', 'list');
		uni.navigateTo({
			url: '/subPages/pay/index?item=' + encodeURIComponent(JSON.stringify(val))
		});
	}
	// 进入订单详情
	const handleDetail = (id) => {
		// if (pagesCount.value >= 10) {
		// 	uni.redirectTo({
		// 		url: `/subPages/order/details?id=${id}`
		// 	});
		// }else{
		// 	uni.navigateTo({
		// 		url: `/subPages/order/details?id=${id}`
		// 	})
		// }
    uni.navigateTo({
    	url: `/subPages/order/details?id=${id}`
    })
	}
	// 上下拉取
	onReachBottom(() => {
		emit('onReachBottom')
	});
</script>