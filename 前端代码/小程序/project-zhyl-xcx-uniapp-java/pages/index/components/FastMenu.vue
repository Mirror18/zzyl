<!--首页快速入口-->
<template>
  <view class="fastMenu">
    <view class="item" @click="handleIntro">
			<view class="menuIcon">
      <icon class="introduce"></icon>
			</view>
      <view>养老院介绍</view>
    </view>
    <view class="item" @click="handleBinding">
			<view class="menuIcon">
      <icon class="binding"></icon>
			</view>
      <view>绑定家人</view>
    </view>
    <view class="item" @click="handleOrder">
			<view class="menuIcon">
      <icon class="serve"></icon>
			</view>
      <view>我的订单</view>
    </view>
    <view class="item" @click="handleBill">
			<view class="menuIcon">
      <icon class="bill"></icon>
			</view>
      <view>我的账单 </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
// ------定义变量------
const emit= defineEmits(['isToken'])
const store = useStore(); //vuex获取、储存数据
// 进入绑定家人页面
const handleBinding = () => {
	
	emit('isToken','/pages/family/binding?str=home')
	}
	//进入订单页面
const handleOrder =()=>{
	store.commit('setRouter','pages/index/index')
	// store.commit('user/setOrderType', false);
	store.commit('user/setOrderStatus', ''); //重置订单选中状态
	store.commit('setFootStatus', 0) //底部选择为首页
	store.commit('user/setBackLike', 'home'); //设置是从首页进入到的订单页面
	uni.navigateTo({
		url: uni.getStorageSync('token') ? '/subPages/order/index': '/pages/login/index'
	});
}
// 进入账单
const handleBill  =()=>{
	store.commit('setRouter','pages/index/index')
	store.commit('setFootStatus', 0) //底部选择为首页
	store.commit('user/setBackLike', 'home'); //设置是从首页进入到的订单页面
	uni.navigateTo({
		url: uni.getStorageSync('token') ? '/subPages/bill/index': '/pages/login/index'
	});
}
// 养老院介绍
const handleIntro = ()=>{
	store.commit('setRouter','pages/index/index')
	store.commit('setFootStatus', 0) //底部选择为首页
	store.commit('user/setBackLike', 'home'); //设置是从首页进入到的订单页面
	uni.navigateTo({
		url: '/subPages/introduce/index'
	});
}
</script>
