<!--合同列表-->
<template>
	<view class="pageCon appList contractBox itemListBox">
		<!-- 标题 -->
		<NavBar title="我的合同" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view :style="{'paddingTop':capsuleBottom +'px'}" v-if="netStatus">
			<List :itemData="itemData" :moreStatus="moreStatus" :loading="loading"
				@handleOpen="handleDownload" @onReachBottom="onReachBottom"></List>
		</view>
		<!-- 断网显示的页面 -->
		<net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>
		<!-- pdf下载弹层 -->
		<PdfPopup ref="popup" @handleSub="subUnbind" :pdfData="pdfData"></PdfPopup>
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
		onLoad,
		onShow
	} from "@dcloudio/uni-app";
	import {
		useStore
	} from 'vuex';
	import {
		tostTip
	} from '@/utils/index.js';
	// 接口
	import {
		getContractList
	} from '@/pages/api/contract.js';
	// 组件
	// 列表
	import List from './components/List.vue';
	// pdf弹层
	import PdfPopup from './components/PdfPopup.vue';
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const popup =  ref(null)
	const itemData = ref([]); //列表数据
	const moreStatus = ref('more'); //加载更多状态 loading  more noMore
	const loading = ref(false); // 是否展示加载更多
	const netStatus = ref(true)
	const listId = ref(); //合同id
	let params = reactive({
		pageNum: 1,
		pageSize: 10
	});
	let pageNum = ref(1); //存放当前页
	const pages = ref(0); // 总页数
	const isSendRequest = ref(false); // 是否继续发送请求
	const pdfData= ref({})//pdf 名称
	let capsuleBottom = ref()
	// ------定义方法------
	//胶囊底部距离头部的距离
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 13
			}
		})
	})
	// ------定义方法------
	onShow(() => {
		getNewData();
	});
	// 获取任务列表
	const getNewData = async type => {
		params = {
			...params,
			page: pageNum.value,
		};
		if (isSendRequest.value) {
			return;
		}
		moreStatus.value = 'loading'
		loading.value = false;
		let infoParams = {};
		await getContractList(params)
			.then(res => {
				if (res.code == 200) {
					
					const {
						data
					} = res;
					// items == null 会报错 把他处理掉
					
					const items = data.records == null ? [] : data.records;
					moreStatus.value = items.length < 10 ? 'no-more' : 'more'
					// 从第一页请求 清空之前的数据
					params.page == 1 ? (itemData.value = undefined) : null;
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
				// loading.value = false;
			});
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
	// 列表页返回预约列表
	const handleToLink = () => {
		// uni.reLaunch({
		// 	url: '/pages/my/index'
		// });
		uni.navigateBack({
			delta: 1
		});
	}
	// 下载
	const handleDownload = (val)=>{
		pdfData.value = val
		popup.value.popup.open()
	}
	// 断网刷新
const handleToRefresh = () => {
  params.value.pageNum = 1;
  getNewData();
};
</script>
<style src="./index.scss" lang="scss" scoped></style>