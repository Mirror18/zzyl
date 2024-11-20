<!--账单列表-->
<template>
	<view class="pageCon appList itemListBox billBox">
		<!-- 标题 -->
		<NavBar title="我的账单" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view v-if="netStatus">
			<List ref="list" :itemData="itemData" :orderName="orderName" @handleFamily="handleFamily"
				@setTabIndex="setTabIndex" @setElderId="setElderId" :moreStatus="moreStatus" :loading="loading"
				@handleDelete="handleDelete" @onReachBottom="onReachBottom"></List>
		</view>
		<!-- 断网显示的页面 -->
		<net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>

	</view>
	<!-- 选择老人弹层 -->
	<FamilyView ref="familyPopup" :serviceVal="billVal"  :formData="formData" :allElderData="itemNameData" @bindFamily="setElderId"></FamilyView>
	<!-- end -->
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
		getAllElderList
	} from '@/pages/api/family.js';
	import {
		getBillList
	} from '@/pages/api/bill.js';
	// 组件
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	// 列表
	import List from './components/list.vue';
	// 家人选择弹层
	import FamilyView from '@/components/FamilyView/index.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const pageData = getCurrentPages();
	const typeVal = ref(users.backLink)
	const list = ref(null); //定义取消弹层ref
	const itemData = ref([]); //数据
	const itemNameData = ref([]) //动态tab
	const moreStatus = ref('more'); //加载更多状态 loading  more noMore
	const netStatus = ref(true)
	const loading = ref(false); // 是否展示加载更多
	const orderId = ref(); //订单id
	const orderName = ref('全部')
	const formData = ref({})
	const billVal = ref('bill')
	let params = reactive({
		pageNum: 1,
		pageSize: 10,
		transactionStatus: 0,
		elderId: ''
	});
	let pageNum = ref(1); //存放当前页
	const pages = ref(0); // 总页数
	const isSendRequest = ref(false); // 是否继续发送请求
	const isback = ref(false) //是否触发了左上角返回按钮
	const familyPopup = ref(null); //定义选择家人弹层ref
	// ------定义方法------
	onLoad((option) => {
		if (option.id !== undefined) {
			params.elderId = option.id
			formData.value.elderId = option.id
			orderName.value = option.name
		}
	})
	onShow(() => {

		// params.status = users.orderStatus === '' ? '' : users.orderStatus
		// console.log(users.orderStatus, 1122)
		getNewData()
	})
	// 获取所有家人
	const getElderList = async () => {
		await getAllElderList().then(res => {
			if (res.code === 200) {
				// 获取动态tab
				itemNameData.value = res.data;
				// if (itemData.value.length > 0) {
					const obj = {
						elderVo: {
							elderId: -1,
							name: '全部'
						}
					}
					itemNameData.value.unshift(obj)
				// }
			}
		});
	}
	// 获取任务列表
	const getNewData = async type => {

		params = {
			pageSize: params.pageSize,
			pageNum: pageNum.value,
			transactionStatus: params.transactionStatus,
			elderId: params.elderId
		};
		if (isSendRequest.value) {
			return;
		}
		moreStatus.value = 'loading'
		loading.value = false;
		let infoParams = {};
		await getBillList(params)
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

	// const unique = (arr)=>{
	// 	return arr.filter(
	// 	  (obj, index) =>
	// 	    arr.findIndex((item) => item.elderVo.name === obj.elderVo.name) === index
	// 	)
	// }
	// tab触发切换
	const setTabIndex = index => {
		console.log(index)
		const tab = users.orderStatus;
		if (index >= 2) {
			store.commit('user/setOrderStatus', index - 1);
			params.transactionStatus = index - 1
		} else {
			store.commit('user/setOrderStatus', '');
			params.transactionStatus = index
		}
		pageNum.value = 1;


		if (index === 2) {
			params.transactionStatus = ''
		}
		isSendRequest.value = false;
		orderName.value = '全部'
		params.elderId = ''
		list.value.active = 0
		getNewData();
	};
	// 获取老人id搜索账单
	const setElderId = (val) => {
		orderName.value = val.elderVo.name
		if (val.elderVo.elderId === -1) {
			params.elderId = ''
			formData.value.elderId = -1
		} else {
			formData.value.elderId = val.elderId
			params.elderId = val.elderId
		}

		getNewData();
	}
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
	// 列表页返回
	const handleToLink = () => {
		// 返回的时候需要把订单列表页的当前状态设置为0
		store.commit('user/setOrderStatus', '');
		// 如果是从首页进来的绑定页面，返回到首页，否则返回到绑定列表页
		isback.value = true //是否触发了左上角返回按钮
		if (typeVal.value === 'my') {
			store.commit('setFootStatus', 3)
			uni.navigateBack({
				delta: 1
			});
		} else if (typeVal.value === 'family') {
			store.commit('setFootStatus', 1)
			uni.reLaunch({
				url: `/pages/family/index`
			})
		}else{
			if (store.state.footStatus === 2 || store.state.footStatus === 3) {
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
	// 打开选择家人弹层
	const handleFamily = type => {
		console.log(familyPopup.value)
		familyPopup.value.popup.open(type);
		getElderList()
	};
	// 断网刷新
	const handleToRefresh = () => {
		params.value.pageNum = 1;
		getNewData();
	};
</script>
<style src="./index.scss" lang="scss" scoped></style>