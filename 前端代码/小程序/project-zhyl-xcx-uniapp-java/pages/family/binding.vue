<!--绑定-->
<template>
	<view class="pageCon appBox">
		<!-- 标题 -->
		<NavBar title="绑定家人" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
		<!-- end -->
		<view class="main" :style="{'paddingTop':capsuleBottom +'px'}">
			<view class="box boxRadius">
				<!-- 表单 -->
				<BoundForm :nowDate="nowDate" :formData="formData" @handleTime="handleTime" @handleFamily="handleFamily">
				</BoundForm>
				<!-- end -->
			</view>
			<view class="footBtn">
				<view @click="handleSub" class="bt">立即绑定</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		tostTip
	} from '@/utils/index.js';
	import {
		validateIdentityCard
	} from '@/utils/validate.js';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	// 接口
	import {
		elderBinging
	} from '@/pages/api/family.js';
	import {
		useStore
	} from 'vuex';
	// 组件
	// 表单
	import BoundForm from './components/BoundForm.vue';
	// ------定义变量------
	const store = useStore();
	const formData = ref({}); //表单数据
	const isClick = ref(false); //防止多次触发按钮
	const pages = getCurrentPages();
	const page = ref()
	//胶囊底部距离头部的距离
	let capsuleBottom = ref()
	// ------定义方法------
	onLoad(() => {
		uni.getSystemInfo({
			success: (res) => {
				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
			}
		})
		page.value = pages[pages.length - 1].options
	})

	// 预约
	const handleSub = async () => {
		if (!isClick.value) {
			isClick.value = true;
			const baseData = formData.value;
			// 检查字段是否为空
			if (baseData.name === '' || !baseData.name) {
				tostTip('绑定内容不能为空');
				isClick.value = false;
				return false;
			} else if (baseData.idCard === '' || !baseData.idCard) {
				tostTip('绑定内容不能为空');
				isClick.value = false;
				return false;
			} else if (baseData.remark === '' || !baseData.remark) {
				tostTip('绑定内容不能为空');
				isClick.value = false;
				return false;
			} else {
				isClick.value = false;
				// 校验手机格式
				if (!validateIdentityCard(baseData.idCard)) {
					tostTip('身份证号格式错误');
					return false;
				} else {
					await elderBinging(baseData).then(res => {
						if (res.code === 200) {
							tostTip('绑定成功');
							clearFrom(); //清空表单
							setTimeout(() => {
								store.commit('setFootStatus', 1)
								uni.navigateTo({
									url: '/pages/family/index'
								});
								clearTimeout()
							}, 500)

						} else {
							tostTip(res.msg);
						}
					});

				}
			}
		}
	};
	// 清空表单
	const clearFrom = () => {
		formData.value = {};
	};
	// 列表页返回预约列表
	const handleToLink = () => {
		// 如果是从首页进来的绑定页面，返回到首页，否则返回到绑定列表页
		if (page.value.str !== 'home') {
			store.commit('setFootStatus', 1)
		}
		uni.navigateBack({
			delta: 1
		});
	}
</script>
<style src="./index.scss" lang="scss" scoped></style>