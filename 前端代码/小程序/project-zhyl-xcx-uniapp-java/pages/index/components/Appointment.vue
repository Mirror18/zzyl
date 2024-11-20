<!--预约-->
<template>
	<view class="dvanceMenu">
		<view class="seekDvance" @click="handleVisit(1)">
			<view class="dvance"></view>
			<view class="rText">
				<view class="tit">探访预约</view>
				<view>老人家属预约拜访</view>
			</view>
		</view>
		<view class="visitDvance" @click="handleVisit(0)">
			<view class="dvance"></view>
			<view class="rText">
				<view class="tit">参观预约</view>
				<view>预约参观养老院</view>
			</view>
		</view>
		<!-- 参观预约取消次数达到上线提示弹层 -->
		<VisitPopup ref="popupVisit"></VisitPopup>
		<!-- end -->
		<!-- 探访预约没有绑定家人提示弹层 -->
		<LookPopup ref="popupLook"></LookPopup>
		<!-- end -->
	</view>
</template>
<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		useStore
	} from 'vuex';
	// 接口
	import {
		cancelCount
	} from '@/pages/api/appointment.js';
	import {
		getAllElderList
	} from '@/pages/api/family.js';
	// 组件
	// 取消次数达到上线
	import VisitPopup from './VisitPopup.vue';
	// 探视没有绑定家人弹层
	import LookPopup from '@/components/Binding/index.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const popupVisit = ref(null); //定义参观预约次数超次数弹层ref
	const popupLook = ref(null); //定义探视预约没有绑定家人弹层ref
	const isClick = ref(false); //防止多次点击
	const typeVal = ref(null)
	const allElderData = ref([]) //获取所有家人
	const token = ref(null)
	onShow(() => {
		token.value = uni.getStorageSync('token')
		if(token.value){
			getElderList()
		}
		
	})
	// ------定义方法------
	// 跳转到预约页面 0参观预约1探访预约
	const handleVisit = type => {
		typeVal.value = type
		if (!isClick.value) {
			isClick.value = true;
			handleCancelCount();
			if (type === 0) {
				store.commit('user/setAppointmentType', 0);
			} else {
				store.commit('user/setAppointmentType', 1);

			}
			let times = setTimeout(() => {
				isClick.value = false;
				clearTimeout(times)
			}, 3000)
		}
	};
	// 获取所有家人
	const getElderList = async () => {
		await getAllElderList().then(res => {
			if (res.code === 200) {
				allElderData.value = res.data;
				
			}
		});
	}
	// 取消次数接口
	const handleCancelCount = async () => {
		console.log(123)
		await cancelCount().then(res => {
			console.log(res.data)
			if (res.code === 200) {
				let data = res.data;
				
				if (data >= 3) {
					popupVisit.value.popup.open();
				} else {
					console.log(token.value,456)
					if (token.value) {
						if (allElderData.value.length === 0 && typeVal.value === 1) {
							popupLook.value.popup.open()
						} else {
							uni.navigateTo({
								url: '/subPages/appointment/index'
							});
						}
					} else {
						uni.navigateTo({
							url: '/pages/login/index'
						});
					}
				}
			}else{
				store.commit('setRouter','pages/index/index')
			}
		});
	};
</script>