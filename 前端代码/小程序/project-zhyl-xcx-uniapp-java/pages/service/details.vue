<!--服务下单详情-->
<template>
	<view class="pageCon serviceBox">
		<!-- 标题 -->
		<NavBar title="商品详情" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view :style="{'paddingTop':capsuleBottom +'px'}" v-if="netStatus">
			<view class="goodsDetail">
				<view class="img">
					<image :src="baseData.image"></image>
				</view>
				<view class="box detailCon">
					<view class="tit">{{baseData.name}}</view>
					<view class="con">{{baseData.nursingRequirement}}</view>
					<view class="info">
						<text class="font-col">￥</text>
						<text class="font-col font-size">{{decimalsReplenish(baseData.price)}}</text>
						<text>/{{baseData.unit}}</text>
					</view>
				</view>
			</view>
			<view class="box boxRadius formBox">
				<view class="item">
					<view class="label">
						服务家人
					</view>
					<view class="tip">必填</view>
					<view class="rightText dateSelect" @click="handleFamily('bottom')">
						<text v-if="formData.name">{{formData.name}}</text>
						<text v-else class="placeholder">请选择</text>
						<icon class="selectIcon"></icon>
					</view>
				</view>
				<view class="item">
					<view class="label">
						期望服务时间
					</view>
					<view class="tip">必填</view>
					<view class="rightText dateSelect" @click="handleTime('bottom')">
						<text v-if="nowDate">{{nowDate}}</text>
						<text v-else class="placeholder">请选择</text>
						<icon class="selectIcon"></icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 断网显示的页面 -->
		<net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>
		<!-- end -->
		<!-- 底部按钮 -->
		<view class="footBox">
			<view @click="handleSub" class="bt btnW">立即购买</view>
		</view>
		<!-- end -->
		<!-- 时间选择弹层 -->
		<PickerView ref="pickerPopup" :nowDate="nowDate" :ispicView="ispicView" @clearTime="clearTime"
			@bindPicker="bindPicker" @closePicView="closePicView"></PickerView>
		<!-- end -->
	</view>
	<!-- 选择家人弹层 -->
	<FamilyView ref="familyPopup" :serviceVal="serviceVal" :formData="formData" :allElderData="allElderData" @bindFamily="bindFamily"></FamilyView>
	<!-- end -->
	<!-- 绑定家人提示弹层 -->
	<LookPopup ref="popupLook"></LookPopup>
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
		onShow
	} from "@dcloudio/uni-app";
	import {
		useStore
	} from 'vuex';
	import {
		tostTip,
		getNow,
		getTime,
		addZero,
		decimalsReplenish,
		getTateTime,
		getTate
	} from '@/utils/index.js';
	// 接口
	import {
		getAllElderList
	} from '@/pages/api/family.js';
	import {
		goodsDetail,
		goodsViseiOrder,
	} from '@/pages/api/service.js';
	// 绑定家人弹层
	import LookPopup from '@/components/Binding/index.vue';
	// 家人选择弹层
	import FamilyView from '@/components/FamilyView/index.vue';
	// 时间选择弹层
	import PickerView from './components/PickerView.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const token = uni.getStorageSync('token')
	const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	const curRoute = routes[routes.length - 1].route //获取当前页面路由
	const baseData = ref({}); //列表数据
	const formData = ref({}); //表单数据
	const netStatus = ref(true) //判断有无网
	const goodsId = ref(null) //商品id
	const isClick = ref(false); //防止多次提交按钮
	const familyPopup = ref(null); //定义选择家人弹层ref
	const allElderData = ref([]) //获取所有家人
	const pickerPopup = ref(); //定义时间弹层
	const nowDate = ref(null); //当前日期
	const popupLook = ref(null); //定义没有绑定家人弹层ref
	let capsuleBottom = ref()
	const isFamily = ref(false) //触发的是不是服务家人选择
	const ispicView =  ref(false) //是否打开了时间弹层
	const serviceVal = ref('service')
	// ------定义方法------
	//胶囊底部距离头部的距离
	onLoad((option) => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 11
			}
		})
		if (option.id) {
			goodsId.value = option.id
		} else {
			if (option.item) {
				formData.value = JSON.parse(decodeURIComponent(option.item))
				goodsId.value = formData.value.projectId
				nowDate.value = getNow(formData.value.estimatedArrivalTime) + ' ' + getTime(formData.value
					.estimatedArrivalTime) //获取默认当天时间

			} else {
				if (users.goodsData.id) {
					goodsId.value = users.goodsData.id
				}
			}

		}




		getData();

	})
	onMounted(() => {
		// if (!formData.value.projectId) {
		// 	nowDate.value = getNow(new Date()) + ' ' + getTime(new Date()); //获取默认当天时间
		// }

	})
	// ------定义方法------
	// 获取所有家人
	const getElderList = async (type) => {
		await getAllElderList().then(res => {
			if (res.code === 200) {
				allElderData.value = res.data;
				if (allElderData.value.length === 0) {
					popupLook.value.popup.open()
				} else {
					if (isFamily.value) {
						familyPopup.value.popup.open(type);
					} else {
						pickerPopup.value.popup.open(type);
						ispicView.value = true
					}
					isFamily.value = false
				}
			}
		});
	}
	// 是否关闭了时间弹层
  const closePicView=()=>{
		ispicView.value = false
	}
	// 获取详情
	const getData = async type => {
		await goodsDetail(goodsId.value)
			.then(res => {
				if (res.code == 200) {
					const {
						data
					} = res;
					baseData.value = data
					store.commit('user/setGoodsData', baseData.value);
					netStatus.value = true
				}
			})
			.catch(err => {
				uni.showToast({
					title: err.msg,
					duration: 1000,
					icon: 'none'
				});
				netStatus.value = false
			});
	};
	// 断网刷新
	const handleToRefresh = () => {
		getData()
	}
	// 显示选择家人弹层
	const handleFamily = (type) => {
		if (!token) {
			store.commit('setRouter', curRoute)
			uni.redirectTo({
				url: '/pages/login/index'
			});
		} else {
			isFamily.value = true
			getElderList(type)
      

		}
	}
	// 显示期望服务时间弹层
	const handleTime = (type) => {
		if (!token) {
			store.commit('setRouter', curRoute)
			uni.redirectTo({
				url: '/pages/login/index'
			});
		} else {
			getElderList(type)
			console.log(nowDate.value)
			if(!nowDate.value){
				pickerPopup.value.getMon(new Date())
				pickerPopup.value.getDate(new Date())
				pickerPopup.value.getHour(new Date())
				pickerPopup.value.getMins(new Date())
			}
			
		}
	}
	// 立即购买
	const handleSub = async () => {
		// 		const newTime = new Date().getTime()
		// 		let date = getTate(nowDate.value); //把日期转为YYYY-MM-DD 00:00:00格式
		// 		let params = {
		// 			...formData.value,
		// 			amount: baseData.value.price,
		// 			estimatedArrivalTime: date,
		// 			projectId: goodsId.value
		// 		};
		// uni.navigateTo({
		// 	url: '/pages/service/orderVerify?item=' + encodeURIComponent(JSON.stringify(params))
		// });
		if (!isClick.value) {
			isClick.value = true;
			const data = formData.value;
			// 检查字段是否为空
			if (data.name === '' || !data.name) {
				tostTip('请选择家人');
				isClick.value = false;
				return false;
			} else if (nowDate.value === '' || !nowDate.value) {
				tostTip('请选择期望服务时间');
				isClick.value = false;
				return false;
			} else {
				isClick.value = true;
				let params = {
					...formData.value
				};
				await goodsViseiOrder(params).then(res => {
					if (res.code == 200) {
						const newTime = new Date().getTime()
								let date = getTate(nowDate.value); //把日期转为YYYY-MM-DD 00:00:00格式
								let params = {
									...formData.value,
									amount: baseData.value.price,
									estimatedArrivalTime: date,
									projectId: goodsId.value
								};
						isClick.value = false
						uni.navigateTo({
							url: '/pages/service/orderVerify?item=' + encodeURIComponent(JSON.stringify(params))
						});
					}else{
						isClick.value = false
						tostTip(res.msg)
					}
				}).catch(err => {})
						
			}
		}
	}
	// 时间段当前设为不选择
	const clearTime = () => {
		// time.value.activeTimeIndex = -1
	}
	// 获取时间弹层传过来的日期
	const bindPicker = (val,time) => {
		nowDate.value = getNow(getTateTime(val)) + ' ' + time.hour +':'+ addZero(time.mins);
		isClick.value = false;
		// getSearchList();
		// ispicView.value = true
		// time.value.getTimeState()
	};
	// 获取家人弹层传过来的家人名字
	const bindFamily = val => {
		formData.value.name = val.elderVo.name;
		formData.value.elderId = val.elderId;
	};
	// 列表页返回列表
	const handleToLink = () => {
		// uni.navigateBack({
		// 	delta: 1
		// });
		uni.reLaunch({
			url: `/pages/service/index`
		})

	}
</script>
<style src="./index.scss" lang="scss" scoped></style>