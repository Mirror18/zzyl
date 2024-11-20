<!--取消-->
<template>
	<uni-popup ref="popup" class="uniPopupBox">
		<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
			<view class="popupCon">
				<view class="popIcon">
					<icon></icon>
				</view>
				<view class="tip">{{errorTipText.title}}</view>
				<view class="text">
					<text>{{errorTipText.text}}</text>
				</view>
			</view>
			<view class="popupFoot">
				<text @click="handleClose">再想想</text>
				<text @click="subCancel">继续</text>
			</view>
		</view>
	</uni-popup>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 获取父组件值、方法
const props = defineProps({
	// 选择的时间
	errorTipText: {
		type: Object,
		default: ()=>({})
	}
});
// ------定义变量------
const popup = ref(null);//定义弹层ref
const emit = defineEmits(['subCancel'])
// ------定义方法------
// 关闭弹层
const handleClose = ()=>{
	popup.value.close()
}
// 确认取消
const subCancel=()=>{
	emit('subCancel')
	handleClose()
}
// 暴露给父组件
defineExpose({
	popup
});
</script>
