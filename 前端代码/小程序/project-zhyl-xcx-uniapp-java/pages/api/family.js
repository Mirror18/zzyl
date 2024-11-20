import {
  request
} from '../../utils/request.js';
// 所有分页列表
export const getElderList = (params) =>
  request({
    url: '/memberElder/list-by-page',
    method: 'get',
    params,
  });
// 所有列表
export const getAllElderList = (params) =>
  request({
    url: '/memberElder/my',
    method: 'get',
    params,
  });
// 绑定家人
export const elderBinging = (params) =>
  request({
    url: `/memberElder/add`,
    method: 'post',
    params
  })
//查询指定设备的状态
export const deviceDetail = (params) =>
  request({
    url: `/user/QueryDevicePropertyStatus`,
    method: 'post',
    params
  })
// 解除绑定
export const elderdeleteById = (id) =>
  request({
    url: `/memberElder/deleteById?id=` + id,
    method: 'delete'
  })
// 取消预约
export const cancelCount = () =>
  request({
    url: `/reservation/cancelled-count`,
    method: 'get'
  })
//获取老人物模型信息数据
export const elderBloodPresh = (params) =>
  request({
    url: `/user/get-page`,
    method: 'get',
    params
  })
//获取老人物模型周信息数据的每天的平均值
export const elderBloodPreshPing = (params) =>
  request({
    url: `/user/get-week-page`,
    method: 'get',
    params
  })