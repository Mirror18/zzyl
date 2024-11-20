<!--取消-->
<template>
	<uni-popup ref="popup" class="uniPopupBox pdfPopup">
		<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
			<view class="popupCon">
				<view class="popIcon">
					<icon class="pdfIcon"></icon>
				</view>
				<view class="tit">{{pdfData.name}}</view>
				<view class="tip">
					请复制链接粘贴到手机默认浏览器下载
				</view>
				<!-- <uni-link :href="pdfData.pdfUrl" :text="pdfData.pdfUrl">复制链接</uni-link> -->
				<button class="bt" @click="handleCopy">复制链接</button>
			</view>
			<view @click="handleClose" class="close"></view>
		</view>
	</uni-popup>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 获取父组件值、方法
const props = defineProps({
	// 选择的时间
	pdfData: {
		type: Object,
		default: ()=>({})
	}
});
// ------定义变量------
const popup = ref(null);//定义弹层ref
const emit = defineEmits(['handleSub'])
// ------定义方法------
// 关闭弹层
const handleClose = ()=>{
	popup.value.close()
}
// 确认解绑
const handleSub=()=>{
	emit('handleSub')
}
const handleCopy = ()=>{
	uni.setClipboardData({
	 data: props.pdfData.pdfUrl,
	 success: () => {
	  handleClose()
	 }
	})
}
// 暴露给父组件
defineExpose({
	popup
});
</script>
