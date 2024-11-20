<!--首页快速入口-->
<template>
  <view class="fastMenu">
  	<view class="item" @click="handleOrder(0)">
			<view class="menuIcon">
				<icon class="payment"></icon>
			</view>
			<view class="item">待支付</view>
  		
  	</view>
  	<view class="item" @click="handleOrder(1)">
  		<view class="menuIcon">
  			<icon class="serve"></icon>
  		</view>
  		<view class="item">待执行</view>
  	</view>
  	<view class="item" @click="handleOrder(2)">
  		<view class="menuIcon">
  			<icon class="execute"></icon>
  		</view>
  		<view class="item">已执行</view>
  	</view>
  	<view class="item" @click="handleOrder(3)">
  		<view class="menuIcon">
  			<icon class="accomplish"></icon>
  		</view>
  		<view class="item">已完成</view>
  	</view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 定义变量
const emit = defineEmits(['handleOrder'])
// ------定义方法------
const handleOrder = (val)=>{
	emit('handleOrder',val)
}
</script>
