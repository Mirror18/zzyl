<!--时间选择弹层-->
<template>
	<view class="timeSelect">
		<uni-popup ref="popup">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="uni-title">
					<view class="close" @click.stop="handleClose"></view>
				</view>
				<picker-view v-if="visible" :indicator-style="indicatorStyle" :immediate-change="true" :value="selectValue"
					@change="bindChange" indicator-class="indicatorClass" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in hours" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in minutes" :key="index">{{ item }}</view>
					</picker-view-column>
				</picker-view>
				<view class="pickerBtn"><button class="bt" @click="onSubmit">完成</button></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeUpdate,
		watch,
		computed,
		nextTick
	} from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";
	import {
		getData,
		tostTip,
		getDsec,
		getTateSec,
		addZero,
		getNow,
		getTime,
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
	const hour = ref(date.getHours()); //获取当前时
	const mins = ref(date.getMinutes()); //获取当前分

	const selectValue = ref([0, 0, 0, 0, 0]); //当前的默认选择年月日从数组的第一个索引开始
	const visible = ref(true);
	const indicatorStyle = `height: 50px`;
	const isTime = ref(false); //判断选择的日期是不是大于等于当前日期
	const propDate = ref(null)
	const isBind = ref(false)
	watch(props, (newValue, oldValue) => {
		nextTick(() => {
			if (newValue.ispicView) {
				if (newValue.nowDate) {

					propDate.value = newValue.nowDate
					const date = new Date(getTateTime(newValue.nowDate));
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					const hour = date.getHours(); //获取当前时
					let mins = date.getMinutes(); //获取当前分
					const newDate = new Date()
					const yearD = newDate.getFullYear();
					const monthD = newDate.getMonth() + 1;
					const dayD = newDate.getDate();
					const hourD = newDate.getHours(); //获取当前时
					const minsD = newDate.getMinutes(); //获取当前分
					const num = mGetDate(yearD, monthD, 0);
					let d = [];
					for (let i = 1; i <= num; i++) {
						d.push(i);
					}
					let m = [];
					for (let i = 0; i <= 59; i++) {
						i = addZero(i)
						m.push(i);
					}
					let h = [];
					for (let i = 0; i <= 23; i++) {
						i = addZero(i)
						h.push(i);
					}
					if (month === monthD) {
						days.value = d.splice(dayD - 1)

						if (day === dayD) {
							if (hour === hourD) {
								hours.value = h.splice(hour)
								
								if (mins - minsD < 30) {
									console.log(mins,minsD,111)
									//当前的事件往后推30分钟
									minutes.value = m.splice((minsD + 30) % 60); //删除过去的时间/分
									//总分钟减去当前分钟数减去30分钟
									if ((60 - mins - 30) < 1) {
										hours.value.splice(0, 1)
									}
								} else {
									console.log(mins,minsD,222)
									minutes.value = m.splice(minsD + 30)
								}
								
							} else {
								console.log(hour,hourD,333)
								console.log(mins,minsD,333)
								// hours.value = h.splice(hourD+1)
								// if(hour-hourD===1&&mins-minsD<0){
								// 	minutes.value = m.splice(mins); //删除过去的时间/分
								// }else{
								// 	minutes.value = m
								// }
								
							}
						}
					} else {
						days.value = d
						hours.value = h
						minutes.value = m
					}



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
					// 时
					hours.value.forEach((h, index) => {
						if (hour === h) {
							selectValue.value[3] = index;
						}
					});
					// 分
					console.log(mins, minsD, minutes.value, 145)
					minutes.value.forEach((n, index) => {
						if (mins === n) {
							selectValue.value[4] = index;
						}
					});
				} else {
					selectValue.value = [0, 0, 0, 0, 0]
				}
			}

		});
	});
	const months = ref();
	const years = ref([]);
	const days = ref([]);
	const hours = ref([]);
	const minutes = ref([]);
	onMounted(() => {
		// 获取默认年
		for (let i = year.value; i <= date.getFullYear(); i++) {
			years.value.push(i);
		}
		// 获取默认时
		for (let i = 0; i <= 23; i++) {
			i = addZero(i)
			hours.value.push(i);
		}
		// 获取默认分
		for (let i = 0; i <= 59; i++) {
			i = addZero(i)
			minutes.value.push(i);
		}
		getMon(date);
		getDate(date);
		getHour(date);
		getMins(date);
	});
	// 获取默认月份
	const getMon = (val) => {
		let m = [];
		const date = val;
		const year = date.getFullYear();
		const month = date.getMonth();
		for (let i = 1; i <= month + 3; i++) {
			m.push(i);
		}
		months.value = m.splice(month); //删除当月前的月份
	};
	// 获取默认天数
	const getDate = (val) => {
		const num = mGetDate(year.value, month.value, 0);
		const date = val;
		const yearData = date.getFullYear();
		const day = date.getDate() - 1;
		const mon = date.getMonth() + 1;
		let d = [];
		for (let i = 1; i <= num; i++) {
			d.push(i);
		}
		days.value = d.splice(day); //删除当天前的天数
	};
	// 获取默认的时
	const getHour = (val) => {
		const date = val;
		const hour = date.getHours()
		let h = [];
		for (let i = 0; i <= 23; i++) {
			i = addZero(i)
			h.push(i);
		}
		hours.value = h.splice(hour); //删除过去的时间/时
	};
	// 获取默认的秒
	const getMins = (val) => {
		const date = val;
		const hour = date.getHours()
		const min = date.getMinutes()
		let m = [];
		for (let i = 0; i <= 59; i++) {
			i = addZero(i)
			m.push(i);
		}

		//当前的事件往后推30分钟
		minutes.value = m.splice(min - 30); //删除过去的时间/分
		//总分钟减去当前分钟数减去30分钟
		if ((60 - min - 30) < 1) {
			hours.value.splice(0, 1)
		}
		// 如果当前时间是23：59显示第二天的00：00
		if (min === 59 && hour === 23) {
			days.value.splice(0, 1)
		}
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
		let d = days.value[val[2]];
		let h = hours.value[val[3]];
		const min = minutes.value[val[4]];

		// // 获取当前的年月日
		const date = new Date();
		const yearData = date.getFullYear();
		const dayData = date.getDate() - 1;
		const mon = date.getMonth() + 1;
		const num = mGetDate(y, m);
		let hou = date.getHours(); //获取当前时
		const minsin = date.getMinutes(); //获取当前分
		// 赋值
		year.value = y;
		month.value = m;
		day.value = d;
		hour.value = h;
		mins.value = min
		selectValue.value = val;

		// 当前的月份
		let monBasedata = [];
		for (let monIndex = 1; monIndex <= mon + 2; monIndex++) {
			monBasedata.push(monIndex);
		}
		// 当前的天数
		let data = [];
		for (let dataIndex = 1; dataIndex <= num; dataIndex++) {
			data.push(dataIndex);
		}
		// 当前的时
		let hourBasedata = [];
		for (let hourIndex = 0; hourIndex <= 23; hourIndex++) {
			hourIndex = addZero(hourIndex)
			hourBasedata.push(hourIndex);
		}
		// 当前的分
		let minBasedata = [];
		for (let minIndex = 0; minIndex <= 59; minIndex++) {
			minIndex = addZero(minIndex)
			minBasedata.push(minIndex);
		}
		// 如果是当前的年逻辑
		if (y === yearData) {
			// 当前年的月份
			// 如果选择的月份大于当月判断逻辑
			if (m > mon) {
				days.value = data; //获取所有天数
				hours.value = hourBasedata; //获取所有小时
				minutes.value = minBasedata //获取所有分钟
				// 给当前选择的天数赋值
				setTimeout(() => {
					selectValue.value[2] = d - 1;
					clearTimeout()
				}, 100);
				months.value = monBasedata.splice(mon - 1); //删除当天前的天数
				// 给当前选择的月赋值
				months.value.forEach((mV, MIn) => {
					if (mV === min) {
						selectValue.value[1] = MIn;
					}
				});
				// 当前选择的小时赋值
				hours.value.forEach((ho, hi) => {
					if (ho === h) {
						setTimeout(() => {
							selectValue.value[3] = hi;
						}, 100);
					}

				});
				// 当前选择的分赋值
				minutes.value.forEach((m, i) => {
					if (m === min) {
						setTimeout(() => {
							selectValue.value[4] = i;
						}, 100);
					}

				});

			} else {
				// 如果当前选择的月份和当前月相同逻辑
				months.value = monBasedata.splice(mon - 1); //删除当前月之前的月份
				days.value = data.splice(dayData); //删除当天前的天数
				// 当前选中的月份
				months.value.forEach((monsVal, monIn) => {
					if (monsVal === m) {
						selectValue.value[1] = monIn;
					}
				});
				// 获取当前月份
				month.value = months.value[selectValue.value[1]]
				// 当前选中的天
				days.value.forEach((daysVal, dayIn) => {
					if (daysVal === d) {
						selectValue.value[2] = dayIn;
					}

				});
				// 获取当前的天
				day.value = days.value[selectValue.value[2]]
				// 当前选择的天是否大于当天，
				if (d > dayData + 1) {
					// 如果大于执行一下逻辑
					hours.value = hourBasedata; //获取所有小时（00-23）
					minutes.value = minBasedata //获取所有分钟（01-59）
					// 当前选中的小时
					hours.value.forEach((ho, hi) => {
						if (ho === h) {
							setTimeout(() => {
								selectValue.value[3] = hi;
							}, 100);
						}

					});
					// 当前选中的分钟
					minutes.value.forEach((m, i) => {
						if (m === min) {
							setTimeout(() => {
								selectValue.value[4] = i;
							}, 100);
						}

					});
				} else {
					// 如果选择的天时当天，执行以下逻辑

					// 当前选择的天赋值
					days.value.forEach((d, di) => {
						if (dayData + 1 === d) {
							selectValue.value[2] = di;
							day.value = d
						} else {
							selectValue.value[2] = 0
						}
					})
					// 如果时间滑到了当前时间，60分减去当前时间的分加30，如果得到的值小于0，小时+1
					if (60 - (minsin + 30) < 0) {
						hou = hou + 1
					}
					hours.value = hourBasedata.splice(hou); //删除当前时间的时
					// 分，处理首位时0的值
					if (typeof h === 'string') {
						if (h.indexOf(0) === 0) {
							h = Number(h.substring(1))

						}
					}

					hours.value.forEach((h, i) => {
						if (h === hour.value) {
							setTimeout(() => {
								selectValue.value[3] = i;
							}, 100);
						} else {
							selectValue.value[3] = 0;
						}

					});
					const hourDatas = hours.value[0]
					if (h > hourDatas) {
						minutes.value = minBasedata


						// mins.value = minutes.value[selectValue.value[4]]
						// selectValue.value[4] = 20;
						// // 如果当前时间是23：59显示第二天的00：00
						// if (h === 23 && min === 59) {
						// 	days.value.splice(0, 1)
						// }

					} else {
						// //当前的事件往后推30分钟
						// minBasedata.splice(0,min)
						minutes.value = minBasedata.splice(minsin - 30); //删除前的分

						// //总分钟减去当前分钟数减去30分钟
						// if ((60 - minsin - 30) < 1) {
						// 	hours.value.splice(0, 1)
						// }
					}
					minutes.value.forEach((m, i) => {
						if (m === min) {
							setTimeout(() => {
								selectValue.value[4] = i;
							}, 100);
						} else {
							selectValue.value[4] = 0;
						}

					});
				}
			}

		}
	};
	// 确认日期
	const onSubmit = () => {
		let data = '';

		hour.value = hours.value[selectValue.value[3]];
		mins.value = minutes.value[selectValue.value[4]];
		data = year.value + '.' + month.value + '.' + day.value + ' ' + hour.value + ':' + mins.value
		if (!isTime.value) {
			emit('bindPicker', data, {
				year: year.value,
				month: month.value,
				day: day.value,
				hour: hour.value,
				mins: +mins.value
			});
			emit('clearTime')
			// 关闭弹层
			popup.value.close();
			clearTimeout()
			console.log(data, 458)

		} else {
			tostTip('日期不可小于当前日期');
		}
		emit('closePicView')
	};
	// 关闭 弹层
	const handleClose = () => {
		if (props.nowDate) {
			const data = year.value + '.' + month.value + '.' + day.value + ' ' + hour.value + ':' + mins.value
			let date = new Date(getTateTime(props.nowDate));
			const yearData = date.getFullYear();
			const dayData = date.getDate();
			const mon = date.getMonth() + 1;
			const hou = date.getHours(); //获取当前时
			const minsin = date.getMinutes(); //获取当前分
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
			// 时处理
			hours.value.forEach((houVal, houIn) => {
				if (houVal === hou) {
					selectValue.value[3] = houIn;
				}
			})
			// 分处理
			minutes.value.forEach((minVal, minIn) => {
				if (minVal === minsin) {
					selectValue.value[4] = minIn;
				}
			})
			// selectValue.value = [0,0,0,0,0]
			// // 关闭弹层

		}
		popup.value.close();
		emit('closePicView')
	};
	// 暴露给父组件
	defineExpose({
		popup,
		visible,
		getMon,
		getDate,
		getHour,
		getMins,
	});
</script>