<!--订单列表-->
<template>
	<view :style="{'paddingTop':capsuleBottom +'px'}">
		<!-- tabl切换 -->
		<scroll-view scroll-x="true" class="tabScroll" :scroll-into-view="scrollinto" :scroll-with-animation="true">
			<view class="itemTab box">
				<view class="tabBox" :class="activeIndex === 1 ? 'active' : ''">
					<view class="tabItem" :class="activeIndex === index ? 'active' : ''" v-for="(item, index) in billTabData"
						@click="changeTab(index)" :key="index">
						<view class="bLine"></view>
						{{ item.label }}
					</view>
				</view>
			</view>
			<view class="tabName">
				<!-- <view class="tabItem" :class="active === index ? 'active' : ''" v-for="(item, index) in itemNameData"
					@click="changeTabName(index,item.elderId)" :key="index">
					{{ item.elderVo.name }}
				</view> -->
				<view class="tabItem" @click="handleFamily('bottom')">{{orderName}}<uni-icons type="bottom" size="14"></uni-icons></view>
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
							
							<view class="itemCon">
								<view class="rText">
									<view class="itemTit tit "><text>{{item.billNo}}</text><text v-if="item.transactionStatus===0"
											class="font-col">待支付</text><text v-if="item.transactionStatus===1" class="font-col">已支付 </text><text
											v-if="item.transactionStatus===2">已关闭</text></view>
									<view class="tip"><span>{{item.billType===0?'月度账单':'费用账单'}}</span><span class="font-col">￥{{decimalsReplenish(item.billAmount)}}</span></view>
									<view class="info"><span>家人姓名：{{item.elderVo.name}}</span><span>账单月份：{{getNowMonth(item.billMonth)}}</span></view>
									<view class="info">创建时间：{{getAllTime(item.createTime)}}</view>
									<view class="info">支付截止时间：{{getAllTime(item.paymentDeadline)}}
									</view>
								</view>
							</view>
							<view class="foot">
								<!-- <span class="footLtext" v-if="item.transactionStatus===1">实付：<span class="font-col">￥{{decimalsReplenish(item.billAmount)}}</span></span> -->
								<span class="footLtext" v-if="item.transactionStatus===0">应付：<span class="font-col">￥{{decimalsReplenish(item.payableAmount)}}</span></span>
								<span class="bt bt-grey inputW" @click="handleDetail(item.id)">查看明细</span>
								<span v-if="item.transactionStatus===0&&item.billType===0" class="bt bt-orange inputW" @click="handleSub(item)">去支付</span>
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
		<!-- 账单详情弹层 -->
		<DetailView ref="detailPopup" :baseDate="baseDate"></DetailView>
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
		getAllTime,
		getNowMonth,
		decimalsReplenish
	} from '@/utils/index.js';
	import {
		onReachBottom,
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	// 组件
	import DetailView from './detail.vue'
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	import { billPay,getBillDetail } from '@/pages/api/bill.js';

	// 基础数据
	import {
		billTabData
	} from '@/utils/commonData.js';
	// 获取父组件值、方法
	const props = defineProps({
		itemData: {
			type: Array,
			default: () => []
		},
		orderName: {
			type: String,
			default: ''
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
	const emit = defineEmits(['setTabIndex', 'onReachBottom','setElderId','handleFamily']);
	const activeIndex = ref(0); //当前tab
	const active = ref(0) //名字切换
	const scrollinto = ref('tab0'); //tab切换
	const emptyInfo = ref('未找到相关数据');
	const isClick = ref(false); //防止多次提交按钮
	const detailPopup = ref(null)
	const contentText = ref({
		//加载状态说明
		contentdown: '上拉加载更多',
		contentrefresh: '努力加载中...',
		contentnomore: '- 没有更多了 -'
	});
	const pagesCount = ref(null)
	const baseDate = ref({
		checkInConfigVo:{}
	})//订单详情
	const elderId= ref('')
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
	// watch(()=>props.itemNameData,(newValue,oldValue)=>{
	// 	newValue.forEach((ele,i)=>{
	// 		if(ele.elderId===elderId.value){
	// 			active.value = i;
	// 		}
	// 	})
	// })
	// 切换tab
	const changeTab = index => {
		// 点击的还是当前数据的时候直接return
		if (activeIndex.value == index) {
			return;
		}
		activeIndex.value = index;
		emit('setTabIndex', index);
	};
	// // 名字切换
	// const changeTabName = (index,id) =>{
	// 	// 点击的还是当前数据的时候直接return
	// 	if (active.value == index) {
	// 		return;
	// 	}
	// 	active.value = index;
	// 	elderId.value = id
		
	// 	emit('setElderId', id);
	// }
	// 上拉刷新
	function scrolltoupperHandle() {
		emit('setTabIndex', index);
	}
	// 获取订单详情
	const getDetail = async(id)=>{
		await getBillDetail(id).then((res)=>{
			baseDate.value = res.data
		})
		// baseDate
	}
	// 去支付
	const handleSub = async(val) => {
		console.log(val)
		if (!isClick.value) {
			isClick.value = true;
			const params = {
				id:val.id,
				payableAmount:val.payableAmount
			}
			await billPay(params).then(res => {
				if(res.code===200){
						const params = JSON.parse(res.data.placeOrderJson)
						uni.requestPayment({
							timeStamp: String(params.timeStamp),
							nonceStr: params.nonceStr,
							package: params.package,
							paySign: params.paySign,
							signType: "RSA",
							success: function(res) {
								tostTip('支付成功');
								isClick.value = false
							},
							complete: function(val) {
								isClick.value = false
								if (val.errMsg === 'requestPayment:fail cancel') {
									tostTip('支付失败');
									
								}
							}
						})
				}
				
				
			}).catch(err => {
				uni.showToast({
					title: err.msg,
					duration: 1000,
					icon: 'none'
				});
			});
		
		}
	}
	// 进入订单详情
	const handleDetail = (id) => {
		detailPopup.value.popup.open('bottom');
		getDetail(id)
	}
	// 打开选择家人弹层
const handleFamily = (val)=>{
	emit('handleFamily',val)
}
	// 上下拉取
	onReachBottom(() => {
		emit('onReachBottom')
	});
	defineExpose({
		active
	})
</script>