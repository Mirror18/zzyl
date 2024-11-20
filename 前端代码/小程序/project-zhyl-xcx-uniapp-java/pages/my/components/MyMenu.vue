<!--首页快速入口-->
<template>
  <view class="myMenu">
  	<view class="item">
  		<view @click="handleApp">我的预约</view><icon class="selectIcon"></icon>
  	</view>
  	<view class="item">
  		<view @click="handleContract">我的合同</view><icon class="selectIcon"></icon>
  	</view>
  	<view class="item">
  		<view @click="handleBill">我的账单</view><icon class="selectIcon"></icon>
  	</view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 定义变量
const emit = defineEmits(['handleApp','handleContract','handleBill'])
// ------定义方法------
// 我的预约
const handleApp = ()=>{
	emit('handleApp')
}
// 我的合同
const handleContract = ()=>{
	emit('handleContract')
}
// 我的账单
const handleBill = ()=>{
	emit('handleBill')
}
</script>
