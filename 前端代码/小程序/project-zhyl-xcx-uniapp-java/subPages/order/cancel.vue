<!--选择原因-->
<template>
	<view class="pageCon cancelBox">
		<!-- 标题 -->
		<NavBar :title="title" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view :style="{'paddingTop':capsuleBottom +'px'}">

			<view class="radioList">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in cancelCauseData" :key="index">
						<view>{{item.label}}</view>
						<view>
							<radio color="#FE6A3D" :value="item.label" />
						</view>
					</label>
				</radio-group>
			</view>
			<view class="footBtn">
				<view @click="handleSub" class="bt" :class="isCurrent?'':'forbid'">提交</view>
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
		onLoad,
		onUnload
	} from "@dcloudio/uni-app";
	// 基本数据
	import {
		cancelCauseData,
	} from '@/utils/commonData.js';
	import {
		tostTip
	} from '@/utils/index.js';
	// 接口
	import {
		cancelOrder,
		orderRefund
	} from '@/pages/api/order.js'
	import {
		useStore
	} from 'vuex';
	// 组件
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const isSendRequest = ref(false); // 是否继续发送请求
	const isCurrent = ref(false) //提交按钮默认置灰
	const cancelData = ref('') //要取消的内容
	const orderId = ref(null) //订单id
	const type = ref(null) //用来区分是取消还是退款
	const title= ref('')//标题
	const tradingOrderNo = ref('')//交易号
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	// ------定义方法------
	onLoad((option) => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 10
			}
		})
		
		orderId.value = option.id
		tradingOrderNo.value = option.tradingOrderNo
		type.value = option.type
		// 判断是取消还是退款
		if(type.value==='4'){
			title.value = '取消原因'
		}else{
			title.value = '退款原因'
		}
	})
	// onUnload(() => {
	// 	store.commit('user/setBackLike', 'cancel');
	// })
	// 触发选择事件
	const radioChange = (e) => {
		cancelData.value = e.detail.value
		isCurrent.value = true
	}
	// 确定操作
	const handleSub = async () => {
		
		if (isCurrent.value) {
			if (!isSendRequest.value) {
				isSendRequest.value = true
				let parent = {}
				if (type.value === '4') {
					// 取消订单
					parent = {
						...parent,
						orderId:orderId.value,
						reason: cancelData.value
					}
					
					await cancelOrder(parent).then((res) => {
						if (res.code === 200) {
							tostTip('取消成功');
							setTimeout(() => {
								isSendRequest.value = false
								uni.navigateTo({
									url: `/subPages/order/index`
								})
							}, 1000)
						}else{
							tostTip(res.msg);
						}
					})
				} else {
					// 退款
					parent = {
						...parent,
						tradingOrderNo: tradingOrderNo.value,
						tradingChannel: cancelData.value,
					}
					await orderRefund(parent).then((res) => {
						if (res.code === 200) {
							tostTip('退款成功');
							setTimeout(() => {
								isSendRequest.value = false
								uni.navigateTo({
									url: `/subPages/order/index`
								})
							}, 1000)
						}else{
							tostTip(res.msg);
						}
					})
				}
			}
		}
	};
	// 列表页返回订单列表
	const handleToLink = () => {
		uni.navigateBack({
			delta: 1
		});
	}
</script>
<style src="./index.scss" lang="scss" scoped></style>