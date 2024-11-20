<!--取消次数达到上线提示-->
<template>
	<uni-popup ref="popup" class="uniPopupBox">
		<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
			<view class="popupCon">
				<!-- <view class="popIcon">
					<icon></icon>
				</view> -->
				<view class="tip">您暂时没有绑定的家人</view>
			</view>
			<view class="popupFoot" @click="handleClose">去绑定</view>
		</view>
	</uni-popup>
</template>
<script setup>
import { ref, onMounted } from 'vue';
	import {
		useStore
	} from 'vuex';
// ------定义变量------
const store = useStore(); //vuex获取、储存数据
const popup = ref(null);//定义弹层ref
// ------定义方法------
// 关闭弹层
const handleClose = ()=>{
	store.commit('setFootStatus', 0)
	uni.navigateTo({
		url: '/pages/family/binding?str=home'
	});
	popup.value.close()
}
// 暴露给父组件
defineExpose({
	popup
});
</script>
