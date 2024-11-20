import { request } from '../../utils/request.js';

// 热门房型
export const getHotHoust = (params) =>
  request({
    url: '/roomTypes',
    method: 'get',
    params,
  });
