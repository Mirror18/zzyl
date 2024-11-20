<!--预约列表-->
<template>
	<view class="pageCon appList appoBox itemListBox">
		<!-- 标题 -->
		<NavBar title="我的预约" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view v-if="netStatus">
			<List :itemData="itemData" @setTabIndex="setTabIndex" :moreStatus="moreStatus" :loading="loading"
				@handleCancel="handleCancel" @onReachBottom="onReachBottom"></List>
		</view>
		<!-- 断网显示的页面 -->
		<net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>
		<!-- 取消弹层 -->
		<CancelPopup ref="cancel" @subCancel="subCancel" :errorTipText="errorTipText"></CancelPopup>
		<!-- end -->
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';

	import {
		useStore
	} from 'vuex';
	import {
		getNow,
		getTime
	} from '@/utils/index.js';
	// 接口
	import {
		getList,
		cancelReservation,
		cancelCount,
	} from '@/pages/api/appointment.js';
	// 组件
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	// 取消弹层
	import CancelPopup from './components/CancelPopup.vue';
	// 列表
	import List from './components/list.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const cancel = ref(null); //定义取消弹层ref
	const itemData = ref([]); //预约数据
	const moreStatus = ref('more'); //加载更多状态 loading  more noMore
	const netStatus = ref(true);
	const loading = ref(false); // 是否展示加载更多
	const reservationId = ref(); //预约id
	const errorTipText = ref({
		title: '取消预约',
		text: '',
	}); //取消弹层显示的内容
	let params = reactive({
		pageNum: 1,
		pageSize: 10,
		status: ''
	});
	let pageNum = ref(1); //存放当前页
	const pages = ref(0); // 总页数
	const isSendRequest = ref(false); // 是否继续发送请求
	// ------定义方法------
	onMounted(() => {
		getNewData();
	});
	// 获取任务列表
	const getNewData = async (type) => {
		params = {
			pageSize: params.pageSize,
			pageNum: pageNum.value,
			status: params.status

		};
		if (isSendRequest.value) {
			return;
		}
		moreStatus.value = 'loading';
		loading.value = false;
		let infoParams = {};
		await getList(params)
			.then((res) => {
				if (res.code == 200) {
					const {
						data
					} = res;
					// items == null 会报错 把他处理掉

					const items = data.records == null ? [] : data.records;
					moreStatus.value = items.length < 10 ? 'no-more' : 'more';
					// 从第一页请求 清空之前的数据
					params.pageNum == 1 ? (itemData.value = undefined) : null;
					// 下拉数据合并
					itemData.value = itemData.value ? [...itemData.value, ...items] : items;
					// 如果 当前页面的数据已经全部数据了 那么停止拿数据
					pages.value = data.pages;
					if (data.pages === pageNum.value) {
						isSendRequest.value = true;
						moreStatus.value = 'noMore';
					}
					uni.stopPullDownRefresh();
					netStatus.value = true;
					loading.value = true;
				}
			})
			.catch((err) => {
				uni.showToast({
					title: err.msg,
					duration: 1000,
					icon: 'none',
				});
				netStatus.value = false;
			});
	};

	// 取消
	const subCancel = async () => {
		isSendRequest.value = false;
		await cancelReservation(reservationId.value)
			.then((res) => {
				if (res.code === 200) {
					getNewData();
					uni.showToast({
						title: '取消成功',
						duration: 1000,
						icon: 'none',
					});
				}
			})
			.catch((err) => {});
	};
	const setTabIndex = (index) => {
		const tab = users.appStatus;
		store.commit('user/setAppStatus', index);

		pageNum.value = tab == index ? pageNum.value + 1 : 1;
		if (index === 1) {
			params.status = 0; //待上门
		} else {
			params.status = ''
		}
		isSendRequest.value = false;
		getNewData();
	};
	// 上拉更多数据
	const onReachBottom = () => {
		if (pageNum.value >= pages.value) {
			moreStatus.value = 'noMore';
			return false;
		} else {
			moreStatus.value = 'loading';
			let times = setTimeout(() => {
				pageNum.value++;
				getNewData();
			}, 1000); //这里延时一秒在加载方法有个loading效果
		}
	};
	// 取消
	const handleCancel = (id) => {
		reservationId.value = id;
		handleCancelCount();
	};
	// 取消次数接口
	const handleCancelCount = async () => {
		await cancelCount().then((res) => {
			if (res.code === 200) {
				// 取消3次禁止预约，所以要拿3减去后端传的取消次数
				let data = 3 - res.data;
				cancel.value.popup.open();
				if (data <= 0) {
					errorTipText.value.text = '该账号今日已不可进行预约，是否还要继续？';
				} else {
					errorTipText.value.text = `取消${data}次后，该账号今日不可进行预约，是否还要继续？`;
				}
			}
		});
	};
	// 列表页返回预约列表
	const handleToLink = () => {
		if (users.appointmentType !== null) {
			store.commit('setFootStatus', 0);
			// uni.reLaunch({
			// 	url: '/pages/index/index'
			// })
			store.commit('user/setAppointmentType', null);
		} else {
			store.commit('setFootStatus', 3);
			// uni.reLaunch({
			// 	url: '/pages/my/index'
			// })
		}
		uni.navigateBack({
			delta: 2,
		});
	};
	// 断网刷新
	const handleToRefresh = () => {
		params.value.pageNum = 1;
		getNewData();
	};
</script>
<style src="./../index.scss" lang="scss" scoped></style>
<style>
	/* .swiperH {
	height: calc(100vh - 340rpx);
	padding-bottom: 26rpx;
} */
</style>