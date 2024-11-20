<!--预约表单-->
<template>
	<view class="formBox">
		<view class="item">
			<view class="label">
				家人姓名
			</view>
			<view class="tip">必填</view>
			<input class="formInput" type="text" placeholder-class="placeholderClass" maxlength="10" v-model="formData.name" placeholder="请输入"/>
		</view>
		<view class="item">
			<view class="label">
				身份证号
			</view>
			<view class="tip">必填</view>
			<input class="formInput" placeholder-class="placeholderClass" type='number'  v-model="formData.idCard" placeholder="请输入"/>
		</view>
		<view class="item">
			<view class="label">
				您称呼他/她
			</view>
			<view class="tip">必填</view>
			<input class="formInput" type="text" placeholder-class="placeholderClass" maxlength="10" v-model="formData.remark" placeholder="请输入"/>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from "vuex";
// 获取父组件值、方法
const props = defineProps({
	// 房型信息
	formData: {
		type: Object,
		default: () => ({})
	}
});
// ------定义变量------
const store = useStore(); //存储获取数据
const users = store.state.user; //获取存储数据
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
// // 触发手机号
// const handlePhone= (val)=>{
// 	emit('getSearchList')
// }
// 暴露给父组件
defineExpose({

})
</script>
