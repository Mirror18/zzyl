<!--预约列表-->
<template>
	<view>
		<!-- 列表 -->
		<view class="main">
			<!-- 垂直滚动区域  scroll和swiper的高度都要给且是一样的高度-->
			<view>
				<scroll-view scroll-y="true">
					<view class="timeList">
						<view class="box boxRadius item" v-for="(item, index) in itemData" :key="index">
							<view class="itemTit"><text>{{item.contractNo}}</text><text v-if="item.status===0"
									class="font-col">未生效</text><text v-if="item.status===1" class="font-col">生效中</text><text
									v-if="item.status===2">已过期</text><text v-if="item.status===3">已失效</text></view>
							<view class="itemCon">
								<view class="head">
									<image :src="item.elderVo.image"></image>
								</view>
								<view class="rText">
									<view class="tit">{{item.name}}</view>
									<view class="info">家人：{{item.elderVo.name}}</view>
									<view class="info">签约日期：{{getNow(item.signDate)}}</view>
									<view class="info">有效期：{{getNow(item.startTime)}}~{{getNow(item.endTime)}}</view>
								</view>
							</view>
							<view class="foot">
								<text v-if="item.status===3">解除时间：{{getNow(item.releaseDate)}}</text>
								<span class="bt bt-grey inputW" @click="previewPdf(item.pdfUrl)">查看</span>
								<span class="bt bt-grey inputW" @click="handleDownload(item)">下载</span>
							</view>
						</view>
					</view>

					<!-- 下拉加载更多Lodding -->
					<view v-if="itemData.length>6"><uni-load-more :status="moreStatus" :content-text="contentText" /></view>
					<!-- end -->
				</scroll-view>
			</view>
			<!-- 无数据显示 -->
			<view v-if="itemData.length===0&&loading">
				<EmptyPage :emptyInfo="emptyInfo" />
			</view>
			<!-- end -->
			<!-- <web-view v-if="allUrl" :src="allUrl"></web-view> -->
		</view>
		<!-- end -->
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue';
	import {
		useStore
	} from 'vuex';
	import {
		tostTip,
		getNow,
		getTime
	} from '@/utils/index.js';
	// 组件
	// 无数据
	import EmptyPage from '@/components/EmptyPage/index.vue';
	// 获取父组件值、方法
	const props = defineProps({
		itemData: {
			type: Array,
			default: () => []
		},
		moreStatus: {
			type: String,
			default: 'noMore'
		},
		loading: {
			type: Boolean,
			default: false
		}
	});
	// ------定义变量------
	const store = useStore(); //存储获取数据
	const users = store.state.user; //获取存储数据
	const emit = defineEmits(['handleOpen']);
	const emptyInfo = ref('您暂时没有合同信息哦~');
	const isClick = ref(false)
	const contentText = ref({
		//加载状态说明
		contentdown: '上拉加载更多',
		contentrefresh: '努力加载中...',
		contentnomore: '- 没有更多了 -'
	});
	// ------定义方法------
	const previewPdf = (url) => {
		uni.showToast({
			title: '努力加载中...',
			icon: 'loading',
			mask: true
		});
		if (!isClick.value) {
			isClick.value = true
			uni.downloadFile({
				url: url, //文件地址
				success: function(res) {
					var filePath = res.tempFilePath;
					
					if (res.errMsg === 'downloadFile:ok') {
						
						setTimeout(()=>{
							uni.hideLoading();
							isClick.value = false
						},3000)
						
						uni.openDocument({
							filePath: filePath,
							showMenu: false, //这个参数可设置你预览的文件能否被直接转发，此次是设置是否展示分享菜单
							success: function(res) {}
						});
					}

				}
			})
		}

	}
	// 下载
	const handleDownload = (item) => {
		emit('handleOpen', item)
		// uni.showToast({
		// 	title: '努力加载中...',
		// 	icon: 'loading',
		// 	mask: true
		// });
		// uni.downloadFile({
		// 	url,
		// 	success: (res) => {
		// 		if (res.statusCode == 200) {
		// 			console.log('下载成功', res);
		// 			let filePath = res.tempFilePath;
		// 			uni.saveFile({
		// 				tempFilePath: filePath,
		// 				success: function(file) {
		// 					console.log('file-success', file.savedFilePath);
		// 					// 满足测试条件，取消下载任务。
		// 					if (file.errMsg === 'saveFile:ok') {
		// 						// downloadTask.abort();
		// 						uni.hideLoading()
		// 						tostTip('下载成功');
		// 					}
		// 					uni.getSavedFileList({
		// 					  success: function (resList) {
		// 					    console.log(resList,46546545);
		// 					  }
		// 					})
		// 					setTimeout(() => {
		// 						//打开文档查看
		// 						uni.openDocument({
		// 							filePath: file.savedFilePath,
		// 							success: function(v) {
		// 								// console.log('打开文档成功');
		// 							}
		// 						});
		// 					}, 3000)
		// 				}
		// 			});
		// 		}
		// 	}
		// })

	}
</script>

<style></style>