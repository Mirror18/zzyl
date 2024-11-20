<!--参观预约-->
<template>
	<view class="pageCon appBox">
		<!-- 标题 -->
		<NavBar :title="appType === 0 ? '参观预约' : '探访预约'" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view class="main"  :style="{'paddingTop':capsuleBottom +'px'}">
			<view class="box boxRadius">
				<!-- 表单 -->
				<VisitApp :nowDate="nowDate" :formData="formData" @handleTime="handleTime" @handleFamily="handleFamily"></VisitApp>
				<!-- end -->
				<!-- 时间段选择 -->
				<TimeSelect :nowDate="nowDate" :appType="appType" ref="time" @getTime="getDateTime" :allTimeAll="allTimeAll"></TimeSelect>
				<!-- end -->
			</view>
			<view class="footBtn"><view @click="handleSub" class="bt">预约</view></view>
		</view>
		<!-- 时间选择弹层 -->
		<PickerView ref="pickerPopup" :nowDate="nowDate" :ispicView="ispicView" @clearTime="clearTime" @bindPicker="bindPicker"></PickerView>
		<!-- end -->
		<!-- 选择家人弹层 -->
		<FamilyView ref="familyPopup" :formData="formData" :allElderData="allElderData" @bindFamily="bindFamily"></FamilyView>
		<!-- end -->
		
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getNow, tostTip, getTate, getDsec, getTime,getTateTime } from '@/utils/index.js';
import { isPhone } from '@/utils/validate.js';
import { onLoad } from '@dcloudio/uni-app';
// 接口
import { addReservation, getAllList } from '@/pages/api/appointment.js';
import { getAllElderList } from '@/pages/api/family.js';
// 组件
// 参观预约表单
import VisitApp from './components/VisitApp.vue';
// 时间选择弹层
import PickerView from './components/PickerView.vue';
// 家人选择弹层
import FamilyView from '@/components/FamilyView/index.vue';
// 时间段选择
import TimeSelect from './components/TimeSelect.vue';
// ------定义变量------
const store = useStore(); //存储获取数据
const users = store.state.user; //获取存储数据
const pickerPopup = ref(); //定义时间弹层
const time = ref(null); //定义时间段选择ref
const familyPopup = ref(null); //定义选择家人弹层ref
const formData = ref({}); //表单数据
const nowDate = ref(); //当前日期
const appType = users.appointmentType; //获取参观类型：参观预约0、探访预约1
const timeText = ref('');
const isClick = ref(false); //防止多次触发预约按钮
const allTimeAll = ref([]); //日期查询的列表
const ispicView = ref(false)
const allElderData= ref([])//获取所有家人
//胶囊底部距离头部的距离
	let capsuleBottom = ref()
// ------定义方法------
onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
	})
onMounted(() => {
	nowDate.value = getNow(new Date()); //获取默认当天时间
	getSearchList()
});

// 预约
const handleSub = async () => {
	if (!isClick.value) {
		isClick.value = true;
		const baseData = formData.value;
		// 检查字段是否为空
		if (baseData.name === '' || !baseData.name) {
			tostTip('预约内容不能为空');
			isClick.value = false;
			return false;
		} else if (baseData.mobile === '' || !baseData.mobile) {
			tostTip('预约内容不能为空');
			isClick.value = false;
			return false;
		} else if (baseData.visitor === '' || !baseData.visitor) {
			tostTip('预约内容不能为空');
			isClick.value = false;
			return false;
		} else if (timeText.value === '' || !timeText.value) {
			tostTip('预约内容不能为空');
			isClick.value = false;
			return false;
		} else {
			isClick.value = false;
			// 校验手机格式
			if (!isPhone(baseData.mobile)) {
				tostTip('手机号格式错误');
				return false;
			} else {
				const newTime = new Date().getTime()
				let date = getTate(nowDate.value, timeText.value); //把日期转为YYYY-MM-DD 00:00:00格式
				let type = users.appointmentType === 0 ? 0 : 1; //判断是参观预约还是探访预约
				const oldTime = new Date(date).getTime()
				
				if(newTime>oldTime){
					tostTip('预约时间需大于当前时间');
				}else{
					
					let params = {
						...baseData,
						type: type, //参观预约
						time: date
					};
					clearFrom(); //清空表单
					
					await addReservation(params).then(res => {
						if (res.code === 200) {
							tostTip('预约成功');
							clearFrom(); //清空表单
							uni.redirectTo({
								url: '/subPages/appointment/list/index'
							});
						} else {
							tostTip(res.msg);
						}
					});
				}
				
			}
		}
	}
	// uni.redirectTo({
	// 	url: '/subPages/appointment/list/index'
	// });
};
// 清空表单
const clearFrom = () => {
	formData.value = {};
	nowDate.value = getNow(new Date());
	time.value.activeIndex = 0;
	time.value.activeAmIndex = -1;
	time.value.activePmIndex = -1;
};
// // 检查有没有预约过的时间段
const getSearchList = async () => {
	const baseData = formData.value;
	let time = getDsec(nowDate.value);
	let params = {
		time: time
	};
	allTimeAll.value=[]
	await getAllList(params)
		.then(res => {
			if (res.code === 200) {
				if(!res.data){
					allTimeAll.value =[]
				}else{
					allTimeAll.value =res.data
				}
				
			}
		})
		.catch(() => {});
};
// 获取所有家人
const getElderList = async()=>{
	await getAllElderList().then(res => {
		if (res.code === 200) {
			allElderData.value = res.data;
		}
	});
}
// 打开时间弹层
const handleTime = type => {
	pickerPopup.value.popup.open(type);
	// pickerPopup.value.visible=true
};
// 打开选择家人弹层
const handleFamily = type => {
	familyPopup.value.popup.open(type);
	getElderList()
};
// 获取时间弹层传过来的日期
const bindPicker = val => {
	nowDate.value = getNow(getTateTime(val));
	isClick.value = false;
	getSearchList();
	ispicView.value = true
	// time.value.getTimeState()
};
// 时间段当前设为不选择
const clearTime=()=>{
	time.value.activeTimeIndex = -1
}
// 获取家人弹层传过来的家人名字
const bindFamily = val => {
	formData.value.visitor = val.elderVo.name;
	formData.value.elderId = val.elderId;
};
// 选择的时间段
const getDateTime = val => {
	timeText.value = val;
};
// 列表页返回预约列表
const handleToLink = ()=>{
	// uni.reLaunch({
	// 	url: '/pages/index/index'
	// });
	uni.navigateBack({
		delta: 1
	});
}
</script>
<style src="./index.scss" lang="scss" scoped></style>
