<!--选择原因-->
<template>
	<view class="pageCon detailsBox">
		<!-- 标题 -->
		<NavBar title="订单详情" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view :style="{'paddingTop':capsuleBottom +'px'}">
			<view class="operateTip">
				<!-- 待支付 -->
				<view v-if="baseData.status===0">
					<view class="tit">订单待支付</view>
					<view>请在{{ rocallTime }}内完成支付，超时将取消订单</view>
				</view>
				<!-- end -->
				<!-- 待执行 -->
				<view v-if="baseData.status===1&&!baseData.refundRecordVo.refundStatus">
					<view class="tit">订单待服务</view>
					<view>中州养老机构将竭诚为您服务</view>
				</view>
				<!-- end -->
				<!-- 待执行退款中 -->
				<view v-if="baseData.status===1&&baseData.refundRecordVo.refundStatus===1">
					<view class="tit">订单退款中</view>
					<view>预计2个工作日退回原账户</view>
				</view>
				<!-- end -->
				<!-- 待执行退款失败 -->
				<view v-if="baseData.status===1&&baseData.refundRecordVo.refundStatus===3">
					<view class="tit">退款失败</view>
					<view>{{baseData.refundRecordVo.refundMsg}}</view>
				</view>
				<!-- end -->
				<!-- 已执行 -->
				<view v-if="baseData.status===2">
					<view class="tit">订单已执行</view>
				</view>
				<!-- end -->
				<!-- 已完成 -->
				<view v-if="baseData.status===3">
					<view class="tit">订单已完成</view>
				</view>
				<!-- end -->
				<!-- 订单已经关闭 -->
				<view v-if="baseData.status===4">
					<view class="tit">订单已关闭</view>
					<view>关闭原因：{{baseData.reason?baseData.reason:'超时未支付'}}</view>
				</view>
				<!-- end -->
				<!-- 已退款 -->
				<view v-if="baseData.status===5">
					<view class="tit">订单已退款</view>
				</view>
				<!-- end -->
			</view>
			<view class="box projectBox">
				<view class="projectInfo">
					<view class="head">
						<image :src="baseData.nursingProjectVo.image"></image>
					</view>
					<view class="rText">
						<view class="tit">{{baseData.nursingProjectVo.name}}</view>
						<view class="projectFee">
							¥{{decimalsReplenish(baseData.amount)}}<text class="hour">/{{baseData.nursingProjectVo.unit}}</text>
						</view>
					</view>
				</view>
				<view class="foot"><text>实付款</text><text class="font-col">¥{{decimalsReplenish(baseData.amount)}}</text></view>
			</view>
			<view class="mt-20 box orderInfo">
				<view class="orderList">
					<view class="item"><text>期望服务时间</text>
						<view>{{getAllTime(baseData.estimatedArrivalTime)}}</view>
					</view>
					<view class="item"><text>服务家人</text>
						<view>{{baseData.elderVo.name}}</view>
					</view>
					<view class="item" v-if="baseData.remark"><text>备注</text>
						<view>{{baseData.remark}}</view>
					</view>
				</view>
				<view class="orderList">
					<view class="item"><text>订单编号</text>
						<view>{{baseData.orderNo}}</view>
					</view>
					<view class="item"><text>下单时间</text>
						<view>{{getAllTime(baseData.createTime)}}</view>
					</view>
					<view class="item" v-if="baseData.status===3"><text>完成时间</text>
						<view>{{getAllTime(baseData.updateTime)}}</view>
					</view>
				</view>
				<!-- 手动关闭有关闭原因，用来区分是手动关闭还是超时关闭 -->
				<view class="orderList" v-if="baseData.status===4&&baseData.reason">
					<view class="item"><text>关闭时间</text>
						<view>{{getAllTime(baseData.updateTime)}}</view>
					</view>
				</view>
				<!-- end -->
				<!-- 退款中、退款失败、或者退款成功 -->
				<view class="orderList" v-if="(baseData.status===1&&baseData.refundRecordVo.refundStatus)||baseData.status===5">
					<view v-if="(baseData.status===1&&baseData.refundRecordVo.refundStatus)||baseData.status===5">
						<view class="item"><text>退款原因</text>
							<view>{{baseData.refundRecordVo.memo}}</view>
						</view>
						<view class="item"><text>申请时间</text>
							<view>{{getAllTime(baseData.refundRecordVo.createTime)}}</view>
						</view>
					</view>
					<!-- end -->
					<!-- 退款成功 -->
					<view v-if="baseData.status===5">
						<view class="item"><text>退款金额</text>
							<view>¥{{decimalsReplenish(baseData.refundRecordVo.refundAmount)}}</view>
						</view>
						<view class="item"><text>退款时间</text>
							<view>{{getAllTime(baseData.refundRecordVo.updateTime)}}</view>
						</view>
					</view>
				</view>
				<!-- end -->
			</view>
			<!-- 执行记录 -->
			<view class="mt-20 box orderInfo" v-if="baseData.status===2||baseData.status===3">
				<view class="orderList">
					<view class="item"><text>执行人</text>
						<view>{{baseData.nursingTaskVo.creator}}</view>
					</view>
					<view class="item"><text>执行时间</text>
						<view>{{getAllTime(baseData.nursingTaskVo.updateTime)}}</view>
					</view>
					<view class="item"><text>执行记录</text>
						<view>{{baseData.nursingTaskVo.mark}}</view>
					</view>
					<view class="item"><text>执行图片</text>
						<view class="img"><image :src="baseData.nursingTaskVo.taskImage"></image></view>
					</view>
				</view>
			</view>
			<!-- end -->
		</view>
		<view class="footBox detailFoot" v-if="baseData.status===0||baseData.status===2||(baseData.status===1&&!baseData.refundRecordVo.refundStatus)||(baseData.status===1&&baseData.refundRecordVo.refundStatus===3)"><span
				class="bt btSmall bt-grey inputW" @click="handleCancel" v-if="baseData.status===0">取消订单</span>
			<span class="bt btSmall bt-orange inputW" @click="handlePay" v-if="baseData.status===0">去支付</span>
			<span class="bt btSmall bt-grey inputW" @click="handleRefund"
				v-if="(baseData.status===1&&!baseData.refundRecordVo.refundStatus)||(baseData.status===1&&baseData.refundRecordVo.refundStatus===3)">退款</span>
			<span class="bt btSmall bt-grey inputW" v-if="baseData.status===2" @click="handleService">联系客服</span>
		</view>
	</view>
	<!-- 电话弹层 -->
	<phone ref="phone" ></phone>
	<!-- end -->
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';
	import {
		onLoad,
		onShow,
		onHide,
		onUnload
	} from "@dcloudio/uni-app";
	import {
		getAllTime,
		decimalsReplenish
	} from '@/utils/index.js';
	// 接口
	import {
		getOrderDetail
	} from '@/pages/api/order.js'
	import {
		useStore
	} from 'vuex';
	// 组件
	import Phone from "@/components/uni-phone/index.vue" //拨打电话
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const isSendRequest = ref(false); // 是否继续发送请求
	const baseData = ref({
		nursingProjectVo: {},
		elderVo: {}
	}) //订单详情数据
	const orderId = ref(null) //订单id
	const times = ref(null)
	const rocallTime = ref('') //倒计时
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	const typeVal = ref(users.backLink)
	const isback = ref(false) //是否触发了左上角返回按钮
	const phone = ref(null)
	// ------定义方法------
	onLoad((option) => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 10
			}
		})
		orderId.value = option.id
		getDetail()
	})
	onUnload(() => {
		// 这块跳转比较特殊，有两个入口进入此页面，一个是购买商品后又支付页面进入，另外一个是从订单页面的支付页进入此页面
		// 如果触发了左上角的返回按钮， 不执行此跳转
		// console.log(isback.value, 11258)
		// if (!isback.value) {
		// 	if (typeVal.value === 'home') {
		// 		// store.commit('user/setBackLike', 'detail');
		// 		uni.navigateTo({
		// 			url: '/subPages/order/index'
		// 		})
		// 	}
		// }
		// store.commit('user/setOrderStatus', '') //清除订单的当前状态
	})
	// 获取订单详情
	const getDetail = async () => {
		await getOrderDetail(orderId.value).then((res) => {
			if (res.code === 200) {
				baseData.value = res.data
				console.log(baseData.value)
				runTimeBack(baseData.value.createTime)
			}
		})
	}
	// 取消订单
	const handleCancel = () => {
		handleNavigate(orderId.value, 4)
	}
	// 去支付
	const handlePay = () => {
		// store.commit('user/setBackLike', 'detail');
		uni.navigateTo({
			url: '/subPages/pay/index?item=' + encodeURIComponent(JSON.stringify(baseData.value))
		});
	}
	// 退款
	const handleRefund = () => {
		handleNavigate(orderId.value, 5)
	}
	// 联系客服
	const handleService = (type) => {
phone.value.popup.open('center')
	}
	// 取消、退款原因页面
	const handleNavigate = (id, num) => {
		uni.navigateTo({
			url: `/subPages/order/cancel?id=${id}&type=${num}&tradingOrderNo=${baseData.value.tradingOrderNo}`
		});
	}
	// 订单倒计时
	const runTimeBack = () => {
		const end = Date.parse(baseData.value.createTime.replace(/-/g, "/"));
		const now = Date.parse(new Date());
		const m15 = 15 * 60 * 1000;
		const msec = m15 - (now - end);
		if (msec < 0) {
			clearTimeout(times.value);
		} else {
			let min = parseInt((msec / 1000 / 60) % 60);
			let sec = parseInt((msec / 1000) % 60);
			if (min < 10) {
				min = "0" + min;
			} else {
				min = min;
			}
			if (sec < 10) {
				sec = "0" + sec;
			} else {
				sec = sec;
			}
			rocallTime.value = min + "分" + sec + "秒";
			if (min >= 0 && sec >= 0) {
				
				times.value = setTimeout(function() {
					runTimeBack();
				}, 1000);
				if (min === '00' && sec === '00') {
					// 订单超时后刷新详情
					getDetail()
					clearTimeout(times.value);
					return;
				}
			}
		}
	}
	// 列表页返回订单列表
	const handleToLink = () => {
		console.log(typeVal.value)
		isback.value = true //是否触发了左上角返回按钮
		// if (users.isOrderType) {
		// 	store.commit('user/setBackLike', 'detail');
		// 	uni.navigateTo({
		// 		url: `/subPages/order/index`
		// 	})
		// }else 
			// uni.navigateTo({
			// 	url: `/subPages/order/index`
			// })
		if(typeVal.value==='back'||typeVal.value==='detail'||typeVal.value==='goods'||typeVal.value==='home'){
			uni.redirectTo({
				url: `/subPages/order/index`
			})
		}else {
			uni.navigateBack({
				delta: 1
			});
		}

	}
</script>
<style src="./index.scss" lang="scss" scoped></style>