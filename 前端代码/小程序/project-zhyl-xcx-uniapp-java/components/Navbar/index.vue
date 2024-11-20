<!-- 头部导航组件 -->
<template>
	<view class="navBar" :style="{'height':all}">
		<view :style="{'paddingTop':capsuleTop+'px','marginBottom':capsuleBottom+'px',height:capsuleHeight+'px'}">
			<view class="title">
				{{title}}
				<image :src='src' @click="handleTo" v-if="isShowBack"></image>
			</view>
			<view class="box searchBox" v-if="isShowSearch">
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
					<input confirm-type="search" class="nav-bar-input" type="text" v-model="searchVal" placeholder="搜索"
						@confirm="handleSearch" @tap="handleSearch" />
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		nextTick,
		watch,
		computed
	} from 'vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	// 获取父组件值、方法
	const props = defineProps({
		title: {
			type: String,
			default: '',
		},
		handleToLink: { //用于自定义跳转
			type: Function
		},
		src: {
			type: String,
			default: '../../static/arrows.png',
		},
		isShowBack: {
			type: Boolean,
		},
		// 是否显示搜索
		isShowSearch: {
			type: Boolean,
		},
		params:{
			type:Object,
			default:(()=>{})
		}
	})
	//设备栏高度
	let deviceNavHeight = ref()
	//胶囊顶部距离头部的距离
	let capsuleTop = ref()
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	//导航栏高度
	let all = ref()
	const searchVal = ref(props.name)
	//胶囊高度
	let capsuleHeight = ref()
	onLoad((option) => {
		uni.getSystemInfo({
			success: (res) => {
				deviceNavHeight.value = res.statusBarHeight
				capsuleTop.value = uni.getMenuButtonBoundingClientRect().top
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom - 8
				all.value = (capsuleTop.value + capsuleBottom.value - deviceNavHeight.value + 14) + 'px'
				capsuleHeight.value = uni.getMenuButtonBoundingClientRect().height
			}
		})
		
	})
	onShow(()=>{
		if(props.params!==undefined){
			searchVal.value = props.params.name
		}
		
	})
	const handleSearch=()=>{
		// uni.navigateTo({
		// 	url: '/subPages/search/index'
		// });
		uni.redirectTo({
					url: `/subPages/search/index?name=${searchVal.value}`
				})
	}
	//头部导航跳转
	const handleTo = () => {
		if (props.handleToLink) {
			props.handleToLink()
		} else {
			uni.navigateBack()
		}
	}
</script>

<style src="./index.scss" lang="scss" scoped></style>