 <!--支付订单-->
 <template>
 	<view class="pageCon appBox verifyBox">
 		<!-- 标题 -->
 		<NavBar title="支付订单" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
 		<!-- end -->
 		<view class="main" :style="{'paddingTop':capsuleBottom +'px'}" v-if="netStatus">
 			<view class="orderPay">
 				<view class="money">￥<text>{{decimalsReplenish(formData.amount)}}</text></view>
 				<view class="time">
 					<view>支付剩余时间<text>{{ rocallTime }}</text></view>
 				</view>
 			</view>
 			<view class="box boxRadius">
 				<view class="example-body">
 					<radio-group class="uni-list" @change="styleChange">
 						<view class="uni-list-item">
 							<view class="uni-list-item__container" v-for="(item, index) in payMethodList" :key="item">
 								<view class="uni-list-item__content">
 									<icon class="wechatIcon"></icon><text class="uni-list-item__content-title">{{
				                      item
				                    }}</text>
 								</view>
 								<view class="uni-list-item__extra">
 									<radio :value="item" color="#FE6A3D" :checked="index == activeRadio" class="radioIcon" />
 								</view>
 							</view>
 						</view>
 					</radio-group>
 				</view>
 			</view>
 			<view class="footBtn">
 				<view @click="handleSub" class="bt">确认支付</view>
 			</view>
 		</view>

 		<!-- 断网显示的页面 -->
 		<net-fail v-else :handleToRefresh="handleToRefresh"></net-fail>
 		<!-- end -->

 	</view>
 </template>

 <script setup>
 	import {
 		ref,
 		reactive,
 		onMounted
 	} from 'vue';
 	import {
 		onLoad,
 		onShow,
 		onHide,
 		onUnload
 	} from "@dcloudio/uni-app";
 	import {
 		useStore
 	} from 'vuex';
 	import {
 		tostTip,
 		getNow,
 		getTime,
 		decimalsReplenish,
 	} from '@/utils/index.js';
 	// 基本数据
 	import {
 		payMethodList
 	} from '@/utils/commonData.js'
 	// 接口
 	import {
 		goodsPay
 	} from '@/pages/api/service.js';
 	// ------定义变量------
 	const store = useStore(); //存储获取数据
 	const users = store.state.user; //获取存储数据
 	const baseData = ref([]); //基本数据
 	const formData = ref({}); //表单数据
 	const rocallTime = ref('') //倒计时
 	const times = ref(null)
 	const netStatus = ref(true) //判断有无网
 	const activeRadio = ref(0)
 	const isClick = ref(false); //防止多次提交按钮
 	let capsuleBottom = ref()
 	const navBack = ref(null) //是否从详情页过来的
 	const isback = ref(false) //是否触发了左上角返回按钮
 	const typeVal = ref(users.backLink)
 	// ------定义方法------
 	//胶囊底部距离头部的距离
 	onLoad((option) => {
 		uni.getSystemInfo({
 			success: (res) => {
 				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 10
 			}
 		})
 		formData.value = JSON.parse(decodeURIComponent(option.item));
 	})

 	onUnload(() => {
 		// 这块跳转比较特殊，有两个入口进入此页面，一个是购买商品后进入，另外一个是从订单列表页进入
 		// 如果触发了左上角的返回按钮， 不执行此跳转
		// if(!isback.value){
		// 	// if (users.isOrderType) {
		// 		// if ((typeVal.value === 'list') || (typeVal.value === 'goods')) {
		// 			uni.navigateTo({
		// 				url: '/subPages/order/details?id=' + formData.value.id
		// 			})
		// 		// }
		// 	// }else{
		// 	// 	if(typeVal.value === 'list'){
		// 	// 		uni.navigateTo({
		// 	// 			url: '/subPages/order/details?id=' + formData.value.id
		// 	// 		})
		// 	// 	}
		// 	// }
		// 	// store.commit('user/setBackLike', 'detail');
		// }
 		
store.commit('user/setOrderStatus', '');
 	})
 	// ------定义方法------
 	onShow((e) => {
 		runTimeBack()
 	});
 	// 支付
 	const handleSub = async () => {
		
		
 		if (!isClick.value) {
 			isClick.value = true;
			isback.value = true
 			const params = JSON.parse(formData.value.tradingVo.placeOrderJson)
 			uni.requestPayment({
 				timeStamp: String(params.timeStamp),
 				nonceStr: params.nonceStr,
 				package: params.package,
 				paySign: params.paySign,
 				signType: "RSA",
 				success: function(res) {
 					uni.reLaunch({
 						url: '/subPages/success/index?item=' + encodeURIComponent(JSON.stringify(formData.value))
 					});
 				},
 				complete: function(val) {
 					if (val.errMsg === 'requestPayment:fail cancel') {
 						isClick.value = false
 					}
 				}
 			})
 		}
 	}
 	// 订单倒计时
 	const runTimeBack = () => {
 		const end = Date.parse(formData.value.createTime.replace(/-/g, "/"));
 		const now = Date.parse(new Date());
 		const m15 = 15 * 60 * 1000;
 		const msec = m15 - (now - end);
 		if (msec < 0) {
 			clearTimeout(times.value);
 		} else {
 			let min = parseInt((msec / 1000 / 60) % 60);
 			let sec = parseInt((msec / 1000) % 60);
 			if (min < 10) {
 				min = "0" + min;
 			} else {
 				min = min;
 			}
 			if (sec < 10) {
 				sec = "0" + sec;
 			} else {
 				sec = sec;
 			}
 			rocallTime.value = min + ":" + sec;
 			if (min >= 0 && sec >= 0) {
 				if (min === 0 && sec === 0) {
 					// 订单超时后进去订单详情取消状态
 					uni.navigateTo({
 						url: '/subPages/order/details?id=' + formData.value.id
 					});
 					clearTimeout(times.value);
 					return;
 				}
 				times.value = setTimeout(function() {
 					runTimeBack();
 				}, 1000);
 			}
 		}
 	}
 	// 断网刷新
 	const handleToRefresh = () => {
 		getData()
 	}
 	// 列表页返回列表
 	const handleToLink = () => {
 		// uni.navigateBack({
 		// 	delta: 1
 		// });
 		isback.value = true //是否触发了左上角返回按钮
		store.commit('user/setBackLike', 'back');
 		uni.reLaunch({
 			url: '/subPages/order/details?id=' + formData.value.id
 		})
 	}
 </script>
<style src="./../../pages/service/index.scss" lang="scss" scoped></style>