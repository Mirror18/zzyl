<!--家人选择弹层-->
<template>
	<view class="timeSelect">
		<uni-popup ref="popup" @change="change">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="uni-title">选择家人<view class="close" @click="handleClose"></view>
				</view>
				<picker-view v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange"
					indicator-class="indicatorClass" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in allElderData" :key="index" @click="onSubmit($event,item)">
							{{ item.elderVo.name }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		computed,
		nextTick
	} from 'vue';
	import {
		getData,
		tostTip
	} from '@/utils/index.js';
	// 获取父组件值、方法
	const props = defineProps({
		allElderData: {
			type: Array,
			default: () => ([])
		},
		// 表单基本信息
		formData: {
			type: Object,
			default: () => ({})
		},
		serviceVal:{
			type: String,
			default: ''
		}
	});
	// ------定义变量------
	const popup = ref(null); //ref定义
	const emit = defineEmits(['bindFamily']);
	const value = ref([0]);
	const visible = true;
	const indicatorStyle = `height: 50px`;
	const selectItem = ref({})
	watch(props, (newValue, oldValue) => {
		nextTick(() => {
			newValue.allElderData.forEach((ele, i) => {
				if (ele.elderId === newValue.formData.elderId) {
					value.value = [i]
				}
			})
		})

	})
	// ------定义方法------
	// 选择日期
	const bindChange = e => {
		// console.log(props.allElderData,1)
		// console.log(props.allElderData[e.detail.value[0]],2)
		selectItem.value = props.allElderData[e.detail.value[0]];
		console.log(selectItem.value)
	};
	// 确认日期
	const onSubmit = (e, val) => {
		// if(props.serviceVal!=='bill'){
		// 	if (props.serviceVal==='service'&&val.elderVo.status === 3) {
		// 	tostTip('退住中，不可选择');
		// 	return false
		// }
		// if (val.elderVo.status === 5) {
		// 	tostTip('已退住，不可选择');
		// 	return false
		// }
		// }
		
		if ((selectItem.value.id === undefined&&selectItem.value.elderVo&&selectItem.value.elderVo.elderId===-1)||selectItem.value.id === undefined) {
			selectItem.value = props.allElderData[0];
		}
		value.value = e.detail.value
		emit('bindFamily', selectItem.value);
		popup.value.close()
	};
	// 关闭 弹层
	const handleClose = () => {
		value.value = []
		popup.value.close()
	}
	// 暴露给父组件
	defineExpose({
		popup
	});
</script>