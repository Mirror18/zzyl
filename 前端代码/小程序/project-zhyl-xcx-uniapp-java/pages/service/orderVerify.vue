 <!--确认订单-->
 <template>
 	<view class="pageCon appBox verifyBox">
 		<!-- 标题 -->
 		<NavBar title="确认订单" :isShowBack="true" :handleToLink="handleToLink"></NavBar>
 		<!-- end -->
 		<view class="main" :style="{'paddingTop':capsuleBottom +'px'}" v-if="netStatus">
 			<view class="box boxRadius">
 				<view class="detailCon">
 					<view class="con">
 						<view class="imgL">
 							<image :src="baseData.image"></image>
 						</view>
 						<view class="rText">
 							<view class="tit">{{baseData.name}}</view>
 							<view class="info">
 								<text class="font-col fs-13">￥</text><text
 									class="font-col font-size">{{decimalsReplenish(baseData.price)}}</text><text>/{{baseData.unit}}</text>
 							</view>
 						</view>
 					</view>
 					<view class="conItem">
 						<view class="item"><label>服务家人</label><text>{{formData.name}}</text></view>
 						<view class="item"><label>期望服务时间</label><text>{{dateTime}}</text></view>
 						<view class="item last">
 							<view><text>小计</text> <text><text class="font-col fs-18">￥</text><text
 										class="font-col fs-25">{{decimalsReplenish(baseData.price)}}</text></text></view>
 						</view>
 					</view>
 				</view>
 			</view>
 			<view class="box mt-20 boxRadius">
 				<view class="formBox">
 					<view class="tit">备注</view>
 					<view class="txt"><textarea class="textarea" v-model="remark" placeholder="请输入备注信息~"
 					@blur="handleBlur"></textarea><text class="num">{{ remark ? remark.length : 0 }}/50</text></view>
 				</view>

 			</view>
 			<view class="footBtn">
 				<view @click="handleSub" class="bt">提交订单</view>
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
 		onShow
 	} from "@dcloudio/uni-app";
 	import {
 		useStore
 	} from 'vuex';
 	import {
 		tostTip,
 		getNow,
 		getTime,
 		decimalsReplenish,
		warnBlank
 	} from '@/utils/index.js';
 	// 接口
 	import {
 		goodsDetail,
 		goodsPay
 	} from '@/pages/api/service.js';
 	// ------定义变量------
 	const store = useStore(); //存储获取数据
 	const users = store.state.user; //获取存储数据
 	const baseData = ref([]); //基本数据
 	const formData = ref({}); //表单数据
 	const remark = ref(null) //备注
 	const netStatus = ref(true) //判断有无网
 	const isClick = ref(false); //防止多次提交按钮
 	const dateTime = ref(null) //期望服务时间
 	let capsuleBottom = ref()
 	// ------定义方法------
 	//胶囊底部距离头部的距离
 	onLoad((option) => {
 		uni.getSystemInfo({
 			success: (res) => {
 				capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 10
 			}
 		})
 		formData.value = JSON.parse(decodeURIComponent(option.item));
 		dateTime.value = getNow(formData.value.estimatedArrivalTime) + ' ' + getTime(formData.value
 			.estimatedArrivalTime)
 	})
 	// ------定义方法------
 	onShow((e) => {
 		getData();
 	});
 	// 获取详情
 	const getData = async type => {
 		await goodsDetail(formData.value.projectId)
 			.then(res => {
 				if (res.code == 200) {
 					const {
 						data
 					} = res;
 					baseData.value = data
 					netStatus.value = true
 				}
 			})
 			.catch(err => {
 				uni.showToast({
 					title: err.msg,
 					duration: 1000,
 					icon: 'none'
 				});
 				netStatus.value = false
 			});
 	};
 	// 立即购买
 	const handleSub = async () => {
 		if (!isClick.value) {
 			isClick.value = true;
 			let params = {
 				...formData.value,
 				remark: remark.value
 			};
 			await goodsPay(params).then(res => {
 				if (res.code === 200) {
 					isClick.value = false
 					tostTip('下单成功');
 					// store.commit('user/setOrderType', true);
 					store.commit('user/setBackLike', 'goods');
 					uni.redirectTo({
 						url: '/subPages/pay/index?item=' + encodeURIComponent(JSON.stringify(res.data))
 					});
 				} else {
 					tostTip(res.msg);
 				}
 			});
 		}
 	}
 	// 断网刷新
 	const handleToRefresh = () => {
 		getData()
 	}
	// 触发备注
	 	const handleBlur = (e) => {
			let text = warnBlank(e.detail.value)
			remark.value = text.substring(0, 50)
		}
 	// 列表页返回列表
 	const handleToLink = () => {
 		uni.navigateTo({
 			url: '/pages/service/details?item=' + encodeURIComponent(JSON.stringify(formData.value))
 		});
 	}
 </script>
 <style src="./index.scss" lang="scss" scoped></style>