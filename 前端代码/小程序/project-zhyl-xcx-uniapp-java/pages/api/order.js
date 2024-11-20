import {
	request
} from '../../utils/request.js';

// 订单列表
export const getOrderList = (params) =>
	request({
		url: '/orders/order/page',
		method: 'get',
		params,
	});
// 订单详情
export const getOrderDetail = (id) =>
	request({
		url: `/orders/${id}`,
		method: 'get'
	});
// 取消
export const cancelOrder = (params) =>
	request({
		url: `/orders/${params.orderId}/cancel?reason=`+params.reason,
		method: 'post'
	})
// 删除订单
export const orderDelete = (id) =>
	request({
		url: `/orders/${id}`,
		method: 'delete'
	})
// 退款
export const orderRefund = (params) =>
	request({
		url: `/orders/refund`,
		method: 'post',
		params
	})
