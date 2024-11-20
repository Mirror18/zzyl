import {
	request
} from '../../utils/request.js';
// 添加预约
export const addReservation = (params) =>
	request({
		url: `/reservation`,
		method: 'post',
		params
	})
// 所有列表
export const getAllList = (params) =>
	request({
		url: '/reservation/countByTime',
		method: 'get',
		params,
	});
// 预约列表
export const getList = (params) =>
	request({
		url: '/reservation/page',
		method: 'get',
		params,
	});

// 取消预约
export const cancelReservation = (id) =>
	request({
		url: `/reservation/${id}/cancel`,
		method: 'put'
	})
// 取消预约
export const cancelCount = () =>
	request({
		url: `/reservation/cancelled-count`,
		method: 'get'
	})

