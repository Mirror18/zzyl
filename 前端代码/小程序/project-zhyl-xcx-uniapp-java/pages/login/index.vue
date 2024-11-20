<!-- 手机短信登录页 -->
<template>
	<view class="loginBox">
		<!-- 头部导航栏 -->
		<NavBar title="登录" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<view :style="{'paddingTop':capsuleBottom +'px'}">
			<view class="logo-box">
				<image src="../../static/logo.png"></image>
			</view>

			<button class="open-dialog" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">微信快速登录</button>
			<!-- 服务条款及隐私政策弹窗 -->
			<uni-popup ref="popup" type="bottom" :safe-area="false">
				<view class="header">
					<view class="title">服务条款及隐私政策</view>
					<!-- <image src="../../static/guanbi.png" @click="handleClose"></image> -->
				</view>
				<view class="content">
					<view>
						在您注册成为中州养老会员的过程中您需要通过点击同意的形式在线签署
						<text>《中州养老服务条款》</text>
						、
						<text>《中州养老隐私政策》</text>
						请您务必仔细阅读充分理解条款内容后再点击同意尤其是以粗体并下划线标识的条款因为这些条款可能会明确您应履行的义务或对您的权利有所限制。
					</view>
					<view class="tips">请您注意：如果您不同意上述服务条款隐私政策或其中任何约定请您停止注册</view>
				</view>
				<view class="footer">
					<button class="cancel-btn btn" @click="handleClose">不同意</button>
					<button class="agree-btn btn" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">同意</button>
				</view>
			</uni-popup>
		</view>

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
		onLoad
	} from "@dcloudio/uni-app";
	// 接口
	import {
		login
	} from '../api/login.js';
	// 标题
	import NavBar from '@/components/Navbar/index.vue';
	// ------定义变量------
	const store = useStore(); //vuex获取储存数据
	const popup = ref();
	const router = ref(store.state.router);
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
	})
	const handleOpen = () => {
		popup.value.open();
	};
	// 去授权登录
	const decryptPhoneNumber = e => {
		// handleClose();
		wx.login({
			success(res) {
				//允许授权
				if (e.detail.errMsg === 'getPhoneNumber:ok' && e.target.errMsg === 'getPhoneNumber:ok') {
					uni.getUserInfo({
						success(val) {
							login({
									code: res.code,
									phoneCode: e.detail.code,
									nickName: val.userInfo.nickName
								})
								.then(res => {
									if (res.code === 200) {
										
										//将token存到缓存中，后续在统一请求头上加上token（短令牌）
										uni.setStorageSync('token', res.data.token);
										// 存储昵称
										uni.setStorageSync('nickName', res.data.nickName);
										console.log('token:',res.data.token)
										//长令牌
										// store.commit('user/setToken', res.token);
										//登录成功后跳转到首页
										// uni.navigateBack()
										
										if (router.value) {
											uni.redirectTo({
												url: '/' + router.value
											});
										}


									}
								})
						}
					})

				}
			}
		});
	};
	// 关闭
	const handleClose = () => {
		popup.value.close();
	};
	const handleToLink = () => {
		uni.navigateBack({
			delta: 1
		})
		// uni.redirectTo({
		// 	url: '/'+router.value
		// });
	}
</script>
<style src="./index.scss" lang="scss" scoped></style>