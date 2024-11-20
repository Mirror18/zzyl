"use strict";
const utils_request = require("../../utils/request.js");
const getElderList = (params) => utils_request.request({
  url: "/memberElder/list-by-page",
  method: "get",
  params
});
const getAllElderList = (params) => utils_request.request({
  url: "/memberElder/my",
  method: "get",
  params
});
const elderBinging = (params) => utils_request.request({
  url: `/memberElder/add`,
  method: "post",
  params
});
const deviceDetail = (params) => utils_request.request({
  url: `/user/QueryDevicePropertyStatus`,
  method: "post",
  params
});
const elderdeleteById = (id) => utils_request.request({
  url: `/memberElder/deleteById?id=` + id,
  method: "delete"
});
const elderBloodPresh = (params) => utils_request.request({
  url: `/user/get-page`,
  method: "get",
  params
});
const elderBloodPreshPing = (params) => utils_request.request({
  url: `/user/get-week-page`,
  method: "get",
  params
});
exports.deviceDetail = deviceDetail;
exports.elderBinging = elderBinging;
exports.elderBloodPresh = elderBloodPresh;
exports.elderBloodPreshPing = elderBloodPreshPing;
exports.elderdeleteById = elderdeleteById;
exports.getAllElderList = getAllElderList;
exports.getElderList = getElderList;
