import {
	request
} from '../../utils/request.js';
// 所有分页列表
export const getContractList = (params) =>
	request({
		url: '/contract/list',
		method: 'get',
		params,
	});