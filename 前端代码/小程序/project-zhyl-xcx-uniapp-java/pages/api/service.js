import {
	request
} from '../../utils/request.js';
// 获取分页列表
export const getServiceList = (params) =>
	request({
		url: '/orders/project/page',
		method: 'get',
		params,
	});
// 商品详情
export const goodsDetail = (id) =>
	request({
		url: `/orders/project/${id}`,
		method: 'get'
	});
// 下单，购买商品
export const goodsPay = (params) =>
	request({
		url: `/orders`,
		method: 'post',
		params
	})
// 购买商品校验老人
export const goodsViseiOrder = (params) =>
	request({
		url: `/orders/check`,
		method: 'post',
		params
	})