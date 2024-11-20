import {
	request
} from '../../utils/request.js';

// 订单列表
export const getBillList = (params) =>
	request({
		url: '/bill/page/',
		method: 'get',
		params,
	});
// 订单详情
export const getBillDetail = (id) =>
	request({
		url: `/bill/${id}`,
		method: 'get'
	});
// 支付
export const billPay = (params) =>
	request({
		url: `/bill`,
		method: 'put',
		params
	});
