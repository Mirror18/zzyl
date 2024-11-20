<template>
	<!-- 公用底部 -->
	<view class="footBox">
		<view class="uni-tabbar">
			<view class="tabbar-item" :class="currentPage === index ? 'active' : ''" v-for="(item, index) in tabbar"
				:key="index" @tap="changeTab(item, index)">
				<view v-if="true" class="uni-tabbar__bd">
					<view class="uni-tabbar__icon" v-if="item.pagePath !== ''">
						<image v-if="currentPage === index" class="item-img" :src="item.selectedIconPath" />
						<image v-else class="item-img" :src="item.iconPath" />
					</view>
					<view v-else class="qrCode">
						<image :src="item.iconPath" />
					</view>
				</view>
				<view class="uni-tabbar__label" v-if="item.text !== ''">{{ item.text }}</view>
			</view>
		</view>
	</view>
	<!-- end -->
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import {
		useStore
	} from 'vuex';
	// 获取父组件值、方法
	const props = defineProps({
		// 房型信息
		pagePath: {
			type: String,
			required: true
		}
	});
	const store = useStore();
	const page = ref('contact');
	const showPage = ref(false);
	const containerHeight = ref(400);
	const currentPage = ref(0);
	// 底部列表配置   
	const tabbar = ref([{
			"pagePath": "/pages/index/index",
			"text": "首页",
			"iconPath": "/static/home.png",
			"selectedIconPath": "/static/homeHover.png"
		},
		{
			"pagePath": "/pages/family/index",
			"text": "家人",
			"iconPath": "/static/family.png",
			"selectedIconPath": "/static/familyHover.png"
		},
		{
			"pagePath": "/pages/service/index",
			"text": "服务",
			"iconPath": "/static/serve.png",
			"selectedIconPath": "/static/serveHover.png"
		},
		{
			"pagePath": "/pages/my/index",
			"text": "我的",
			"iconPath": "/static/my.png",
			"selectedIconPath": "/static/myHover.png"
		}
	]);
	onShow(()=>{
		currentPage.value = store.state.footStatus
	})
	// 切换事件
	const changeTab = (item, index) => {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].route //获取当前页面路由
		if (item.text !== '') {
			currentPage.value = index;
			
			console.log(item, index,1111)
			store.commit('setFootStatus', index)
			const token = uni.getStorageSync('token')
			store.commit('user/setAppointmentType', null); //清除从首页进入的预约当前状态
			if (!token && index === 1) {
				if(curRoute==='pages/my/index'){
					store.commit('setFootStatus', 3)
				}else if(curRoute==='pages/index/index'){
					store.commit('setFootStatus', 0)
				}else if(curRoute==='pages/service/index'){
					store.commit('setFootStatus', 2)
				}
				store.commit('setRouter',curRoute)
				uni.navigateTo({
					url: '/pages/login/index'
				});
			} else {
				uni.reLaunch({
					url: item.pagePath
				});
			}

		}
	};
</script>