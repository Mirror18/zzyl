<!--时间选择弹层-->
<template>
	<view class="timeSelect detailsBox">
		<uni-popup ref="popup">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="uni-title">
					账单周期 <span class="day">{{baseDate.totalDays}}天</span> <span
						class="time">{{getNow(baseDate.billStartTime)}}~{{getNow(baseDate.billEndTime)}}</span>
					<view class="close" @click.stop="handleClose"></view>
				</view>
				<view class="billCon">
					<view class="con">
						<view class="item">
							<label>床位费</label><label class="col">{{baseDate.lname}}</label><label><label>+</label>￥{{decimalsReplenish(baseDate.checkInConfigVo.bedCost)}}</label>
						</view>
						<view class="item">
							<label>护理费</label><label class="col">{{baseDate.typeName}}</label><label><label>+</label>￥{{decimalsReplenish(baseDate.checkInConfigVo.nursingCost)}}</label>
						</view>
						<view class="item">
							<label>其他费用</label><label class="col">其他</label><label><label>+</label>￥{{decimalsReplenish(baseDate.checkInConfigVo.otherCost)}}</label>
						</view>
					</view>
					<view class="con">
						<view class="item">
							<label>医保支付</label><label><label>-</label>￥{{decimalsReplenish(baseDate.checkInConfigVo.medicalInsurancePayment)}}</label>
						</view>
						<view class="item">
							<label>政府补贴</label><label><label>-</label>￥{{decimalsReplenish(baseDate.checkInConfigVo.governmentSubsidy)}}</label>
						</view>
					</view>
					<view class="con">
						<view class="item">
							<label>每月应付</label><label>￥{{decimalsReplenish(baseDate.checkInConfigVo.monthCost)}}</label></view>
						<view class="item"><label>本期应付</label><label>￥{{decimalsReplenish(baseDate.currentCost)}}</label></view>
						<view class="item"><label>押金</label><label><label>+</label>￥{{decimalsReplenish(baseDate.depositAmount)}}</label></view>
						<view class="item"><label>账单金额</label><label>￥{{decimalsReplenish(baseDate.billAmount)}}</label></view>
						<view class="item"><label>预缴款支付</label><label><label>-</label>￥{{decimalsReplenish(baseDate.prepaidAmount)}}</label></view>
						<!-- <view class="item" v-if="baseDate.otherAmount"><label>小程序/线下</label><label><label>-</label>￥{{decimalsReplenish(baseDate.otherAmount)}}</label></view> -->
					</view>
					<view class="con pay">
						<view class="item"><label>应付金额</label><label
								class="amount"><label>￥</label><label>{{decimalsReplenish(baseDate.payableAmount)}}</label></label></view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		computed,
		nextTick
	} from 'vue';
	import {
		getData,
		tostTip,
		getDsec,
		getTateSec,
		getNow,
		decimalsReplenish
	} from '@/utils/index.js';
	import {
		getTateTime
	} from '@/utils/index.js'
	// 获取父组件值、方法
	const props = defineProps({
		// 选择的时间
		baseDate: {
			type: Object,
			default: () => ({})
		},
		isPoput: {
			type: Boolean,
			default: false
		}
	});
	// ------定义变量------
	const popup = ref(null); //ref定义
	const emit = defineEmits();
	const visible = ref(true);
	const indicatorStyle = `height: 50px`;
	// ------定义方法------
	watch(
		() => props.baseDate,
		(newValue, oldValue) => {
			console.log(newValue)
		}
	);
	// 关闭 弹层
	const handleClose = () => {
		// // 关闭弹层
		popup.value.close();
	};
	// 暴露给父组件
	defineExpose({
		popup,
		visible
	});
</script>