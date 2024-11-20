<!--时间tab切换-->
<template>
	<!-- 时间段 -->
	<view class="timeBox">
		<view class="tabBox" :class="activeIndex === 1 ? 'active' : ''">
			<view class="tabItem" :class="activeIndex === index ? 'active' : ''" v-for="(item, index) in tabList" @click="changeTab(index)" :key="index">
				<view class="bLine"></view>
				{{ item.label }}
			</view>
		</view>
		<!-- 上午 -->
		<view class="timeList" v-if="activeIndex === 0">
			<!-- 选中状态判断：超过的时间段和预约满的时间（次数剩0次）段置灰禁止选择 -->
			<view
				v-for="item in timeAm"
				:key="item.value"
				class="item"
				:class="[activeTimeIndex === item.value && !item.disabled&&item.count!==0 ? 'active' : '', item.disabled||item.count===0&&appType!==1 ? 'disabledActive' : '']"
				@click="handleAm(item)"
			>
				{{ appType!==1&&item.count===0?'已约满':item.label }}
			</view>
		</view>
		<!-- end -->
		<!-- 下午 -->
		<view class="timeList" v-if="activeIndex === 1">
			<!-- 已经选择过的时间段selectActive -->
			<view
				v-for="item in timePm"
				:key="item.value"
				class="item"
				:class="[activeTimeIndex === item.value && !item.disabled&&item.count!==0 ? 'active' : '', item.disabled||item.count===0&&appType!==1 ? 'disabledActive' : '']"
				@click="handleAm(item)"
			>
				<view class="icon"></view>
				{{ appType!==1&&item.count===0?'已约满':item.label }}
			</view>
		</view>
		<!-- end -->
	</view>
	<!-- end -->
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { getData, tostTip, timeToSec,getTime } from '@/utils/index.js';
// 基础数据
import { timeTabData, timeBaseData} from '@/utils/commonData.js';
// 获取父组件值、方法
const props = defineProps({
	// 选择的时间
	nowDate: {
		type: String,
		default: ''
	},
	allTimeAll: {
		type: Array,
		default: () => []
	},
	// 是探访预约还是参观预约
	appType:{
		type:Number,
		default: 0
	}
});
// ------定义变量------
const emit = defineEmits(['getTime']);
const activeIndex = ref(0); //tab选择
const activeAmIndex = ref(-1); //上午当前选择的
const activePmIndex = ref(-1); //下午当前选择的
const activeTimeIndex = ref(-1)
//tab常量
const tabList = ref(timeTabData); //获取时间tab数据
const timeAm = ref(timeBaseData.slice(0,9)); //获取上午时间段
const timePm = ref(timeBaseData.slice(9,21)); //获取下午时间段
const timeData = ref(''); //接受父组件传过来的当前选择的时间
const allTime = ref([]); //当天所有预约的时间段
onMounted(() => {
	nextTick(() => {
		// getTimeState(); //判断是上午还是下午
	});
});
// 先监听父级传来的日期变化，默认是当天
watch(
	() => props.nowDate,
	(newValue, oldValue) => {
		timeData.value = newValue;
		settleData(); //判断时间段是否超时
		// getTimeState()
	}
);
// 先监听父级传来的所有已经预约完的时间段
watch(
	() => props.allTimeAll,
	(newValue, oldValue) => {
		if (newValue) {
			allTime.value = newValue;
			settleData(); //判断时间段是否超时
		}
	}
);
// ------定义方法------
// 判断时间段是否 超时了,如果超时置灰禁止选择
const settleData = () => {
	//当前时间
	let timeNow = new Date();
	//获取年
	let years = timeNow.getFullYear();
	//获取月
	let months = timeNow.getMonth() + 1;
	//获取当天日期
	let days = timeNow.getDate();
	// 获取小时
	let hours = timeNow.getHours();
	// 获取分
	let mins = timeNow.getMinutes();
	// 获取秒
	let secs = timeNow.getSeconds();
	// 获取当前的年月日时间戳
	let ymsData = years + '/' + months + '/' + days;
	const sameDay = new Date(ymsData).getTime();
	// 获取选择后的年月日时间戳
	const selectValue = timeData.value.split(".")
	const selectYear = selectValue[0]
	const selectMonths = selectValue[1]
	const selectDays = selectValue[2]
	const selectTime = new Date(selectYear+'/'+selectMonths+'/'+selectDays).getTime();
	// 获取分钟数,用来做判断是否过来当前的时间段
	let timeNum = hours * 60 + mins;
	// 判断选择时间是否大于当天，如果大于天，默认的tab要设置为上午
	// 判断目前是上午还是下午,如果是下午tab切换到下午12:00-18:00
	if (sameDay < selectTime||hours > 8 && hours <= 12) {
		activeIndex.value = 0;
	} else {
		activeIndex.value = 1;
	}
	
	// 判断当天的时间段是否过了,如果超时了,当前时间段置灰不能选择
	timeBaseData.forEach((time)=>{
		// 把时间转为分钟
		const t = timeToSec(time.label);
		// 如果选择时间是当天的判断逻辑
		if (sameDay === selectTime) {
			// 当前的时间段，小于当前时间段的逻辑
			if (timeNum > Number(t)) {
				time.disabled = true; //自定义禁止选择属性
			} else {
				time.disabled = false;
			}
		}
		//如果选择时间小于当天的判断逻辑
		else if (sameDay > selectTime) {
			time.disabled = true; //自定义禁止选择属性
		} else {
			time.disabled = false; //自定义禁止选择属性
		}
		if (allTime.value.length > 0) {
			allTime.value.forEach(val => {
				let t=getTime(val.time)
				if(t===time.label&&props.appType!==1){
					time.count = Number(val.count)
				}
			});
		}else{
			time.count = null
		}
	})
	// // 判断是否过了上午的时间段,如果超时了,当前时间段置灰不能选择
	// for (let i = 0; i < timeAmData.length; i++) {
	// 	// 把时间转为分钟
	// 	const t = timeToSec(timeAmData[i].label);
	// 	// 如果选择时间是当天的判断逻辑
	// 	if (sameDay === selectTime) {
	// 		// 当前的时间段，小于当前时间段的逻辑
	// 		if (timeNum > Number(t)) {
	// 			timeAmData[i].disabled = true; //自定义禁止选择属性
	// 		} else {
	// 			timeAmData[i].disabled = false;
	// 		}
	// 	}
	// 	//如果选择时间小于当天的判断逻辑
	// 	else if (sameDay > selectTime) {
	// 		timeAmData[i].disabled = true; //自定义禁止选择属性
	// 	} else {
	// 		timeAmData[i].disabled = false; //自定义禁止选择属性
	// 	}
	// 	if (allTime.value.length > 0) {
	// 		allTime.value.forEach(val => {
	// 			let time=getTime(val.time)
	// 			if(time===timeAmData[i].label){
	// 				timeAmData[i].count = val.count
					
	// 			}
	// 		});
	// 	}
	// }
	// // 判断是否过了下午的时间段,如果超时了,当前时间段置灰不能选择
	// for (let i = 0; i < timePmData.length; i++) {
	// 	// 把时间转为分钟
	// 	const t = timeToSec(timePmData[i].label);
	// 	// 如果选择时间是当天的判断逻辑
	// 	if (sameDay === selectTime) {
	// 		// 当前的时间段，小于当前时间段的逻辑
	// 		if (timeNum > Number(t)) {
	// 			timePmData[i].disabled = true; //自定义禁止选择属性
	// 		} else {
	// 			timePmData[i].disabled = false;
	// 		}
	// 	}
	// 	//如果是时间小于当天时间禁止选择时间段
	// 	else if (sameDay > selectTime) {
	// 		timePmData[i].disabled = true; //自定义禁止选择属性
	// 	} else {
	// 		timePmData[i].disabled = false; //自定义禁止选择属性
	// 	}
	// }
};
// 判断目前是上午还是下午,如果是下午tab切换到下午12:00-18:00
const getTimeState = () => {
	let timeNow = new Date();
	// 获取小时
	let hours = timeNow.getHours();
	// 获取分
	let mins = timeNow.getMinutes();
	// 设置默认
	let text = '';
	if (hours > 8 && hours <= 12) {
		activeIndex.value = 0;
	} else if (hours > 12 && hours <= 18) {
		activeIndex.value = 1;
	}
	
};
// 切换tab
const changeTab = index => {
	activeIndex.value = index;
};
// 选择时间段
const handleAm = (item, index) => {
	// 可选择的状态添加样式
	// console.log(!item.disabled,item.count)
	if (!item.disabled&&item.count!==0) {
		// console.log(!item.disabled&&item.count!==0)
		activeTimeIndex.value = item.value;
		emit('getTime', item.label);
	}
};
// // 选择下午时间
// const handlePm = (item, index) => {
// 	// 可选择的状态添加样式
// 	if (!item.disabled) {
// 		activePmIndex.value = index;
// 		emit('getTime', item.label);
// 	}
// };
// 暴露给父组件
defineExpose({
	settleData,
	activeIndex,
	activeAmIndex,
	activePmIndex,
	activeTimeIndex
	// getTimeState
});
</script>

<style>
.picker-view {
	width: 750rpx;
	height: 600rpx;
	margin-top: 20rpx;
	padding-bottom: 120rpx;
}
.item {
	line-height: 100rpx;
	text-align: center;
}
</style>
