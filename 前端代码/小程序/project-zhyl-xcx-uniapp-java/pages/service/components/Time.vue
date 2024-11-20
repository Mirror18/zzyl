<!--时间选择弹层-->
<template>
	<view class="timeSelect">
		<uni-popup ref="popup">
			<view class="uni-list-cell-db">
				<picker mode="date" :value="datas" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{date}}</view>
				</picker>
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
		tostTip,
		getDsec,
		getTateSec
	} from '@/utils/index.js';
	import {
		getTateTime
	} from '@/utils/index.js'
	// 获取父组件值、方法
	const props = defineProps({
		// 选择的时间
		nowDate: {
			type: String,
			default: ''
		},
		ispicView: {
			type: Boolean,
			default: false
		}
	});
	// ------定义变量------
	const popup = ref(null); //ref定义
	const emit = defineEmits();
	const date = new Date(); //当前日期
	const year = ref(date.getFullYear()); //获取当前年份
	const month = ref(date.getMonth() + 1); //获取当前月
	const day = ref(date.getDate()); //获取当前的日期
	const selectValue = ref([0, 1, 1]); //当前的默认选择年月日从数组的第一个索引开始
	const visible = ref(true);
	const indicatorStyle = `height: 50px`;
	const isTime = ref(false); //判断选择的日期是不是大于等于当前日期
const datas = currentDate
const startDate = computed(() => {
  return getDateBase('start');
})
const endDate = computed(() => {
  return getDateBase('end');
})
	// 临时
	const getDateBase = (type) => {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
	
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;
		day = day > 9 ? day : '0' + day;
		 return `${year}-${month}-${day}`;
	}
	const currentDate = getDateBase({
	            format: true
	        })
	watch(props, (newValue, oldValue) => {
		nextTick(() => {
			
			const date = new Date(getTateTime(newValue.nowDate));
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			months.value.forEach((ele, i) => {
				if (month === ele) {
					selectValue.value[1] = i;

				}
			});
			days.value.forEach((v, index) => {
				if (day === v) {
					selectValue.value[2] = index;
				}
			});
		});
	});
	const months = ref();
	const years = ref([]);
	const days = ref([]);
	onMounted(() => {
		// 获取默认年
		for (let i = year.value; i <= date.getFullYear() + 10; i++) {
			years.value.push(i);
		}

		getMon();
		getDate();
		
	});
	
	// 获取默认月份
	const getMon = () => {
		let m = [];
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		for (let i = 1; i <= 12; i++) {
			m.push(i);
		}
		months.value = m.splice(month); //删除当月前的月份
	};
	// 获取默认天数
	const getDate = () => {
		const num = mGetDate(year.value, month.value, 0);
		const date = new Date();
		const yearData = date.getFullYear();
		const day = date.getDate() - 1;
		const mon = date.getMonth() + 1;
		let d = [];
		for (let i = 1; i <= num; i++) {
			d.push(i);
		}
		days.value = d.splice(day); //删除当天前的天数
	};
	// 获取个月份的天数函数
	const mGetDate = (year, month) => {
		var m = new Date(year, month, 0);
		return m.getDate();
	};
	// ------定义方法------
	// 选择日期
	const bindChange = e => {
		
		// //选择的时间与当前日期对比，如果小于当前日期禁止选择
		const val = e.detail.value;
		// 获取选择的年月日
		const y = years.value[val[0]];
		const m = months.value[val[1]];
		const d = days.value[val[2]];
		
		// // 获取当前的年月日
		const date = new Date();
		const yearData = date.getFullYear();
		const dayData = date.getDate() - 1;
		const mon = date.getMonth() + 1;
		const num = mGetDate(y, m);
		// 赋值
		year.value = y;
		month.value = m;
		day.value = d;
		selectValue.value = val;

		// 当前的月份
		let monBasedata = [];
		for (let monIndex = 1; monIndex <= 12; monIndex++) {
			monBasedata.push(monIndex);
		}
		// 当前的天数
		let data = [];
		for (let dataIndex = 1; dataIndex <= num; dataIndex++) {
			data.push(dataIndex);
		}
		// 如果是当前的年逻辑
		if (y === yearData) {
			// 当前年的月份
			// 如果选择的月份大于当月判断逻辑
			if (m > mon) {
				days.value = data;
				// 给当前选择的天数赋值
				setTimeout(() => {
					selectValue.value[2] = d - 1;
					clearTimeout()
				}, 100);
				months.value = monBasedata.splice(mon - 1); //删除当天前的天数
				// 给当前选择的月赋值
				months.value.forEach((mV, MIn) => {
					if (mV === m) {
						selectValue.value[1] = MIn;
					}
				});
			} else {
				// 如果当前选择的月份和当前月相同逻辑
				months.value = monBasedata.splice(mon - 1);
				days.value = data.splice(dayData); //删除当天前的天数
				months.value.forEach((monsVal, monIn) => {
					if (monsVal === m) {
						selectValue.value[1] = monIn;
					}
				});
				month.value = months.value[selectValue.value[1]]
				days.value.forEach((daysVal, dayIn) => {
					if (daysVal === d) {
						selectValue.value[2] = dayIn;
					}

				});
				day.value = days.value[selectValue.value[2]]

			}
		}
		// 选择的年大于目前年
		if (y > yearData) {
			days.value = data;
			months.value = monBasedata;
			if (m > mon) {
				setTimeout(() => {
					selectValue.value[2] = d - 1;
					clearTimeout()
				}, 100);

				setTimeout(() => {
					selectValue.value[1] = m - 1;
					clearTimeout()
				}, 100);
			} else {
				days.value.forEach((daysOldVal, dayOldIn) => {
					if (daysOldVal === d) {
						setTimeout(() => {
							selectValue.value[2] = dayOldIn;
							clearTimeout()
						}, 100);
					}
				});
				months.value.forEach((monVal, monIn) => {
					if (monVal === m) {
						selectValue.value[1] = monIn;
					}
				});
			}
		}
	};
	// 确认日期
	const onSubmit = () => {
		let data = '';
		data = year.value + '.' + month.value + '.' + day.value;
		if (!isTime.value) {
			emit('bindPicker', data, {
				year: year.value,
				month: month.value,
				day: day.value
			});
			emit('clearTime')
			// 关闭弹层
			popup.value.close();
			clearTimeout()

		} else {
			tostTip('日期不可小于当前日期');
		}
	};
	// 关闭 弹层
	const handleClose = () => {
		const date = new Date(getTateTime(props.nowDate));
		const yearData = date.getFullYear();
		const dayData = date.getDate();
		const mon = date.getMonth() + 1;
		// 年处理
		years.value.forEach((yearVal, yearIn) => {
			if (yearVal === yearData) {
				selectValue.value[0] = yearIn;
			}
		})
		// 月处理
		months.value.forEach((monVal, monIn) => {
			if (monVal === mon) {
				selectValue.value[1] = monIn;
			}
		})
		// 天处理
		days.value.forEach((dayVal, dayIn) => {
			if (dayVal === dayData) {
				selectValue.value[2] = dayIn;
			}
		})
		// // 关闭弹层
		popup.value.close();
	};
	// 暴露给父组件
	defineExpose({
		popup,
		visible
	});
</script>