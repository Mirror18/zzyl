<!--时间选择弹层-->
<template>
	<view class="timeSelect">
		<uni-popup ref="popup" @change="change">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="uni-title">
					预约日期
					<view class="close" @click="handleClose"></view>
				</view>
				{{selectValue}}
				<picker-view v-if="visible" :indicator-style="indicatorStyle" :value="selectValue" @change="bindChange" indicator-class="indicatorClass" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
					</picker-view-column>
				</picker-view>
				<view style="padding-bottom: 60rpx;"><button class="bt" @click="onSubmit">完成</button></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { getData, tostTip, getDsec, getTateSec } from '@/utils/index.js';
// 获取父组件值、方法
const props = defineProps({
	// 选择的时间
	nowDate: {
		type: String,
		default: ''
	},
	ispicView:{
		type: Boolean,
		default: false
	}
});
// ------定义变量------
const popup = ref(null); //ref定义
const emit = defineEmits();
const date = new Date(); //当前日期
const year = ref(date.getFullYear()); //获取当前年份
const month = ref(date.getMonth() + 1); //获取当前月
const day = ref(date.getDate()); //获取当前的日期
const selectValue = ref([0, 1, 1]); //当前的默认选择年月日从数组的第一个索引开始
const visible = true;
const indicatorStyle = `height: 50px`;
const isTime = ref(false); //判断选择的日期是不是大于等于当前日期
watch(props,(newValue,oldValue)=>{
	nextTick(()=>{
			const date = new Date(newValue.nowDate)
			const year = date.getFullYear()
			const month = date.getMonth()+1
			const day = date.getDate();
			months.value.forEach((ele,i)=>{
				if(month===ele){
					selectValue.value[1]=i
				}
			})
			days.value.forEach((v,index)=>{
				if(day===v){
					selectValue.value[2]=index
				}
			})
	})
	
})
const months = ref();
const years = ref([]);
const days = ref([]);
onMounted(() => {
	// 获取默认年
	for (let i = year.value; i <= date.getFullYear() + 10; i++) {
		years.value.push(i);
	}
	
	getMon();
	getDate();
});
// 获取默认月份
const getMon = () => {
	let m = [];
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	for (let i = 1; i <= 12; i++) {
		m.push(i);
	}
	months.value = m.splice(month); //删除当月前的月份
};
// 获取默认天数
const getDate = () => {
	const num = mGetDate(year.value, month.value, 0);
	const date = new Date();
	const yearData = date.getFullYear();
	const day = date.getDate() - 1;
	const mon = date.getMonth() + 1;
	let d = [];
	for (let i = 1; i <= num; i++) {
		d.push(i);
	}
	days.value = d.splice(day); //删除当天前的天数

};
// 获取个月份的天数函数
const mGetDate = (year, month) => {
	
	var m = new Date(year, month, 0);
	return m.getDate();
};
// ------定义方法------
// 选择日期
const bindChange = (e) => {
	// 如果时改的时年
	
	
	// //选择的时间与当前日期对比，如果小于当前日期禁止选择
	const val = e.detail.value;
	// 获取选择的年月日
	const y = years.value[val[0]];
	const m = months.value[val[1]];
	const d = days.value[val[2]];
	// // 获取当前的年月日
	const date = new Date();
	const yearData = date.getFullYear();
	const dayData = date.getDate() - 1;
	const mon = date.getMonth() + 1;
	const num = mGetDate(y, m);
	year.value = y;
	month.value = m;
	day.value = d;
	selectValue.value = val;
	
	let monBasedata = [];
	for (let monIndex = 1; monIndex <= 12; monIndex++) {
		monBasedata.push(monIndex);
	}
	let data = [];
	for (let dataIndex = 1; dataIndex <= num; dataIndex++) {
		data.push(dataIndex);
	}
	if (m > mon) {
		// console.log(days.value)
		days.value = data;
		// console.log(days.value)
		// selectValue.value[2] = d
	}else{
		days.value = data.splice(dayData); //删除当天前的天数
	}
	if (y > yearData) {
		days.value = data;
		months.value = monBasedata
	}else{
		months.value = monBasedata.splice(mon-1); //删除当月前的月份
	}
	
	

};
// 确认日期
const onSubmit = () => {
	let data = '';
	data = year.value + '.' + month.value + '.' + day.value;
	if (!isTime.value) {
		emit('bindPicker', data, { year: year.value, month: month.value, day: day.value });
		// 关闭弹层
		popup.value.close();
	} else {
		tostTip('日期不可小于当前日期');
	}
};
// 关闭 弹层
const handleClose = () => {
	// 没有任何选项，关闭弹层时候，当前选择状态设置为默认
	const date = new Date(props.nowDate);
	const yearData = date.getFullYear();
	const dayData = date.getDate();
	const mon = date.getMonth() + 1;
	// 天数默认
	days.value.forEach((ele, i) => {
		if (ele === dayData) {
			selectValue.value[2] = i;
		}
	});
	// 月份默认
	months.value.forEach((ele, i) => {
		if (ele === mon) {
			selectValue.value[1] = i;
		}
	});
	// 关闭弹层
	popup.value.close();
};
// 暴露给父组件
defineExpose({
	popup
});
</script>
