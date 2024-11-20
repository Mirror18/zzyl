<template>
	<view class="container phoneCon">
	    <uni-popup ref="popup" @change="change" class="popupBox">
	      <view class="popup-content">
	        <view class="phone">
						<view>很高兴得到您的认可，咨询更多详细<br/>内容，请拨打电话</view>
						<view>000-000-0000</view>
					</view>
					<view class="phoneFoot">
						
						<view @click="closePopup" class="closePopup">取消</view>
						<view @click="call">呼叫</view>
					</view>
	        
	      </view>
	    </uni-popup>
	  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { tostTip } from "@/utils/index.js";
// 获取父组件值、方法
const props = defineProps({
  phoneData: {
    type: String,
    default: "",
  },
})
const popup= ref(null)
const closePopup = ()=>{
	popup.value.close()
}
// 
const call =() =>{
	tostTip('该功能对接第三方，暂未实现');
}
defineExpose({
	popup
});
</script>
