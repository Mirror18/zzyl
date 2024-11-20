<!--取消次数达到上线提示-->
<template>
	<uni-popup ref="popup" class="uniPopupBox">
		<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
			<view class="popupCon">
				<view class="popIcon">
					<icon></icon>
				</view>
				<view class="tip">很抱歉，取消次数已达上线</view>
				<view class="text">
					<text>该账号今日取消预约次数已达上线，</text>
					<text>今日不可再次预约哦~</text>
				</view>
			</view>
			<view class="popupFoot" @click="handleClose">确定</view>
		</view>
	</uni-popup>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// ------定义变量------
const popup = ref(null);//定义弹层ref
// ------定义方法------
// 关闭弹层
const handleClose = ()=>{
	popup.value.close()
}
// 暴露给父组件
defineExpose({
	popup
});
</script>
