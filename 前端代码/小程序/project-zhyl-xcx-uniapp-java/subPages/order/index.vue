<!--订单列表-->
<template>
	<view class="pageCon appList itemListBox orderBox">
		<!-- 标题 -->
		<NavBar title="我的订单" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view v-if="netStatus">
			<List :itemData="itemData" @setTabIndex="setTabIndex" :moreStatus="moreStatus" :loading="loading"
				@handleDelete="handleDelete" @onReachBottom="onReachBottom"></List>
		</view>
		<!-- 断网显示的页面 -->
		<net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>
		<!-- 删除弹层 -->
		<DeletePopup ref="deleteRef" @handleSub="subDelete" :errorTipText="errorTipText"></DeletePopup>
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
		onShow,
		onLoad,
		onUnload
	} from "@dcloudio/uni-app";
	import {
		useStore
	} from 'vuex';
	import {
		getNow,
		getTime
	} from '@/utils/index.js';
	// 接口
	import {
		getOrderList,
		orderDelete
	} from '@/pages/api/order.js';
	// 组件
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	// 取消弹层
	import DeletePopup from '@/components/Operate/index.vue';
	// 列表
	import List from './components/list.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const pageData = getCurrentPages();
	const typeVal = ref(users.backLink)
	const deleteRef = ref(null); //定义取消弹层ref
	const itemData = ref([]); //预约数据
	const moreStatus = ref('more'); //加载更多状态 loading  more noMore
	const netStatus = ref(true)
	const loading = ref(false); // 是否展示加载更多
	const orderId = ref(); //预约id
	const errorTipText = ref({
		title: '',
		text: '您确定要删除订单么？'
	}); //取消弹层显示的内容
	let params = reactive({
		pageNum: 1,
		pageSize: 10
	});
	let pageNum = ref(1); //存放当前页
	const pages = ref(0); // 总页数
	const isSendRequest = ref(false); // 是否继续发送请求
	const isback = ref(false) //是否触发了左上角返回按钮
	// ------定义方法------
	onLoad((options) => {
		// typeVal.value = options.str
		// store.commit('user/setOrderType', false);
		// console.log(options)
		// getNewData()
	})
	onUnload(() => {
		// const val = users.backLink
		// console.log(val,isback.value,48596)
		// store.commit('setFootStatus', 0)
		// if(!isback.value){
		// 	if (val=== 'home') {
		// 	uni.reLaunch({
		// 		url: `/pages/index/index`
		// 	})
		// 	store.commit('setFootStatus', 0)
		// }
		// // if (page.value.str === 'home') {
		// // 	store.commit('setFootStatus', 0)
		// // 	uni.redirectTo({
		// // 	url: `/pages/index/index`
		// // })
		// // }

		// store.commit('user/setOrderStatus', '') //清除订单的当前状态
		// }

	})
	onShow(() => {

		params.status = users.orderStatus === '' ? '' : users.orderStatus
		console.log(users.orderStatus, 1122)
		getNewData()
	})
	// 获取任务列表
	const getNewData = async type => {

		params = {
			pageSize: params.pageSize,
			pageNum: pageNum.value,
			status: params.status
		};
		console.log(params, 112233)
		if (isSendRequest.value) {
			return;
		}
		moreStatus.value = 'loading'
		loading.value = false;
		let infoParams = {};
		await getOrderList(params)
			.then(res => {
				if (res.code == 200) {
					const {
						data
					} = res;
					// items == null 会报错 把他处理掉
					const items = data.records == null ? [] : data.records;
					moreStatus.value = items.length < 10 ? 'no-more' : 'more'
					// 从第一页请求 清空之前的数据
					params.pageNum == 1 ? (itemData.value = undefined) : null;
					// 下拉数据合并
					itemData.value = itemData.value ? [...itemData.value, ...items] : items;
					// 如果 当前页面的数据已经全部数据了 那么停止拿数据
					pages.value = data.pages;
					if (data.pages === pageNum.value) {
						isSendRequest.value = true;
						moreStatus.value = "noMore";
					}
					uni.stopPullDownRefresh()
					netStatus.value = true
					loading.value = true;
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

	// 确认删除
	const subDelete = async () => {
		isSendRequest.value = false
		await orderDelete(orderId.value)
			.then(res => {
				if (res.code === 200) {
					itemData.value = []
					pageNum.value = 1
					getNewData();
					deleteRef.value.popup.close()
					uni.showToast({
						title: '删除成功',
						duration: 1000,
						icon: 'none'
					});

				}
			})
			.catch(err => {});
	};
	// tab触发切换
	const setTabIndex = index => {
		const tab = users.orderStatus;
		if (index >= 1) {
			store.commit('user/setOrderStatus', index - 1);
			params.status = index - 1
		} else {
			store.commit('user/setOrderStatus', '');

		}
		pageNum.value = 1;
		// pageNum.value = tab == index ? pageNum.value + 1 : 1;


		if (index === 0) {
			params.status = ''
		}
		isSendRequest.value = false;
		getNewData();
	};
	// 上拉更多数据
	const onReachBottom = () => {
		if (pageNum.value >= pages.value) {
			moreStatus.value = "noMore";
			return false;
		} else {
			moreStatus.value = "loading";
			let times = setTimeout(() => {
				pageNum.value++;
				getNewData();
			}, 1000); //这里延时一秒在加载方法有个loading效果
		}
	};
	//删除
	const handleDelete = id => {
		orderId.value = id;
		deleteRef.value.popup.open()
	};
	// 列表页返回
	const handleToLink = () => {
		// 返回的时候需要把订单列表页的当前状态设置为0
		store.commit('user/setOrderStatus', '');
		// 如果是从首页进来的绑定页面，返回到首页，否则返回到绑定列表页
		console.log(typeVal.value,store.state.footStatus, 22222)
		isback.value = true //是否触发了左上角返回按钮
		if (typeVal.value === 'my') {
			store.commit('setFootStatus', 3)
			uni.navigateBack({
				delta: 1
			});
		} else {
			if (store.state.footStatus === 2||store.state.footStatus === 3) {
        uni.reLaunch({
        	url: `/pages/my/index`
        })
				store.commit('setFootStatus', 3)
			} else {
				store.commit('setFootStatus', 0)

				// if(typeVal.value === 'home'){
				// 	uni.navigateBack({
				// 		delta: 1
				// 	});
				// }else{
				uni.reLaunch({
					url: `/pages/index/index`
				})
				// }
			}

		}


	}
	// 断网刷新
	const handleToRefresh = () => {
		params.value.pageNum = 1;
		getNewData();
	};
</script>
<style src="./index.scss" lang="scss" scoped></style>