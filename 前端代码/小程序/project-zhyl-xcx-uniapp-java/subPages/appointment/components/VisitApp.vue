<!--预约表单-->
<template>
	<view class="formBox">
		<view class="item">
			<view class="label">
				预约人姓名
			</view>
			<view class="tip">必填</view>
			<input class="formInput" type="text" placeholder-class="placeholderClass" v-model="formData.name" placeholder="请输入" @blur="handleBlur"/>
		</view>
		<view class="item">
			<view class="label">
				预约人手机号
			</view>
			<view class="tip">必填</view>
			<input class="formInput" placeholder-class="placeholderClass" type='number'  v-model="formData.mobile" placeholder="请输入"/>
		</view>
		<!-- 参观预约：直接填写老人姓名 -->
		<view class="item" v-if="appType===0">
			<view class="label">
				家人姓名
			</view>
			<view class="tip">必填</view>
			<input class="formInput" type="text" placeholder-class="placeholderClass" v-model="formData.visitor" placeholder="请输入"  @blur="handleVisiBlur"/>
		</view>
		<!-- end -->
		<!-- 探访预约：需要选择老人姓名 -->
		<view class="item" v-else>
			<view class="label">
				家人姓名
			</view>
			<view class="tip">必填</view>
			<view class="rightText dateSelect" @click="handleFamily('bottom')">{{formData.visitor}}<icon class="selectIcon"></icon></view>
		</view>
		<!-- end -->
		<view class="item">
			<view class="label">
				预约日期
			</view>
			<view class="tip">必填</view>
			<view class="rightText dateSelect" @click="handleTime('bottom')">{{nowDate}}<icon class="selectIcon"></icon></view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from "vuex";
import { warnBlank } from '@/utils/index.js'
// 获取父组件值、方法
const props = defineProps({
	// 房型信息
	formData: {
		type: Object,
		default: () => ({})
	},
	// 选择的时间
	nowDate:{
		type: String,
		default: ''
	}
});
// ------定义变量------
const store = useStore(); //存储获取数据
const users = store.state.user; //获取存储数据
const appType = users.appointmentType //获取参观类型：参观预约0、探访预约1
// ------定义方法------
const emit = defineEmits(['handleTime','handleFamily'])
// 显示日期选择 弹层
const handleTime =(val)=>{
	emit('handleTime',val)
}
// 显示选择家人弹层
const handleFamily = (val)=>{
	emit('handleFamily',val)
}
// 触发姓名
 	const handleBlur = (e) => {
		let text = warnBlank(e.detail.value)
		props.formData.name = text.substring(0, 10)
	}
// 触发家人
const handleVisiBlur = (e) => {
		let text = warnBlank(e.detail.value)
		props.formData.visitor = text.substring(0, 10)
	}
// // 触发手机号
// const handlePhone= (val)=>{
// 	emit('getSearchList')
// }
// 暴露给父组件
defineExpose({

})
</script>
