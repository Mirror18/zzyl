//时间不足两位在前面补0
export const addZero = (s) => {
	return s < 10 ? ('0' + s) : s;
}
// 获取处理当前日期，时分秒以00:00:00显示
export const getTate = (val, time) => {
	const timeVal = val.split(".")
	const date = new Date(time);
	const year = timeVal[0];
	const month = timeVal[1];
	const day = timeVal[2];
	let m = null
	if (time === undefined) {
		m = year + "-" + month + "-" + day + ":00";
	} else {
		m = year + "-" + month + "-" + day + " " + time + ":00";
	}
	return m
}
// 格式化当前时间yyyy.mm.dd
export const getNow = (val) => {
	let date = new Date(val);
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	return addZero(y) + "." + addZero(m) + "." + addZero(d);
}
// 格式化当前时间yyyy.mm
export const getNowMonth = (val) => {
	return val.replace('-', '.')
	// let date = new Date(val+'-1 00:00:00');
	// let y = date.getFullYear();
	// let m = date.getMonth() + 1;
	// let d = date.getDate();
	// return addZero(y) + "." + addZero(m);
}
// 获取时间段时分00:00
export const getTime = (val) => {
	let date = new Date(val);
	let h = date.getHours();
	let min = date.getMinutes();
	return addZero(h) + ":" + addZero(min);
}
// 获取yyyy.mm.dd 00:00:00
export const getAllTime = (val) => {
	let date = new Date(val);
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	let h = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();
	return addZero(y) + "." + addZero(m) + "." + addZero(d) + ' ' + addZero(h) + ":" + addZero(min) + ":" + addZero(
	sec);
}
//获取当前日期到10后的数据
export const getData = () => {
	const dates = {}
	const years = [];

	const months = [];

	const days = [];
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	let value = []
	for (let i = year; i <= date.getFullYear() + 10; i++) {
		years.push(i);
	}
	for (let i = 1; i <= 12; i++) {
		months.push(i);
	}
	for (let i = 1; i <= 31; i++) {
		days.push(i);
	}
	value = [9999, month - 1, day - 1]

	return dates = {
		value: value,
		years: years,
		months: months,
		days: days
	}
}
// 将时分秒转为时间戳
export const timeToSec = (time) => {
	if (time != null) {
		let s = '';
		let hour = time.split(':')[0];
		let min = time.split(':')[1];
		s = Number(hour) * 60 + Number(min);
		return s;
	}

}
// 获取年月日yyyy-mm-dd
export const getTateTime = (time) => {
	const t = time.replace(/\./g, '/');
	return t
}
// 获取年月日时间戳
export const getTateSec = (time) => {
	const times = getTateTime(time)
	const sec = (new Date(times)).getTime()
	return sec
}

export const getTSec = (time) => {
	const timeVal = time.split(".")
	const date = new Date(time);
	const year = timeVal[0];
	const month = timeVal[1];
	const day = timeVal[2];
	return year + '/' + month + '/' + day
}
// 获取年月日时间戳
export const getDsec = (time) => {
	const times = getTSec(time)
	const sec = (new Date(times)).getTime()
	return sec
}
//tost 弹层提示
export const tostTip = (val) => {
	uni.showToast({
		title: val,
		icon: "none",
		background: '#ffaa00',
		duration: 1500,
		position: "bottom"
	});
}
// 钱数自动补充两位小数
export function decimalsReplenish(value) {
	value = typeof value === 'string' ? Number(value) : value
	if (!value) return '0.00'

	value = value.toFixed(2)
	const intPart = Math.trunc(value) // 获取整数部分
	let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
	// 去除，分隔符
	if (intPartFormat.indexOf(',') !== -1) {
		intPartFormat = intPartFormat.split(',').join('')
	}
	let floatPart = '.00' // 预定义小数部分
	const value2Array = value.split('.')
	// =2表示数据有小数位
	if (value2Array.length === 2) {
		floatPart = value2Array[1].toString() // 拿到小数部分
		if (floatPart.length === 1) {
			return `${intPartFormat}.${floatPart}0`
		}
		return `${intPartFormat}.${floatPart}`
	}
	return intPartFormat + floatPart
}
export const call = (val) => {
	uni.makePhoneCall({
		phoneNumber: val,
		success(e) {
			// console(e)
		},
		fail(e) {
			// console(e)
		}
	})
}
// 禁止输入空格
export const warnBlank = (val) => {
	// 检查输入的内容是否包含空格
	// if (/s/.test()) {
		// 如果包含空格则将空格删除掉
		return val.replace(/\s/g, '');
	// }
}
// let times = null
// // 倒计时

// export function timeBack(val,id) {
// 	time(value,id)

// }
// function time(value,id){
// 	console.log(value)
// 		const end = Date.parse(value.replace(/-/g, "/"));
// 		const now = Date.parse(new Date());
// 		const m15 = 15 * 60 * 1000;
// 		const msec = m15 - (now - end);
// 		if (msec < 0) {
// 		  clearTimeout(times);
// 		} else {
// 		  let min = parseInt((msec / 1000 / 60) % 60);
// 		  let sec = parseInt((msec / 1000) % 60);
// 		  if (min < 10) {
// 		    min = "0" + min;
// 		  } else {
// 		    min = min;
// 		  }
// 		  if (sec < 10) {
// 		    sec = "0" + sec;
// 		  } else {
// 		    sec = sec;
// 		  }

// 		  if (min >= 0 && sec >= 0) {
// 		    if (min === 0 && sec === 0) {
// 					// 订单超时后进去订单详情取消状态
// 		      uni.navigateTo({
// 		      	url: '/subPages/order/details?id='+id
// 		      });
// 		      clearTimeout(times);
// 		      return;
// 		    }
// 		    times = setTimeout(function () {
// 		      time();
// 		    }, 1000);
// 		  }
// 			return min + ":" + sec;
// 		}
// 	}