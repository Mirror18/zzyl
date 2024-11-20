package com.mirror.zzyl.service.service;

import com.aliyun.iot20180120.models.DeleteDeviceRequest;
import com.aliyun.iot20180120.models.QueryDeviceDetailRequest;
import com.aliyun.iot20180120.models.QueryDeviceRequest;
import com.mirror.zzyl.common.base.PageResponse;
import com.mirror.zzyl.service.dto.DeviceDto;
import com.mirror.zzyl.service.vo.DeviceVo;


public interface DeviceService {


    /**
     * 注册设备
     * @param deviceDto
     * @throws Exception
     */
    public void registerDevice(DeviceDto deviceDto) throws Exception ;

    /**
     * 更新设备
     * @param deviceDto
     * @throws Exception
     */
    public void updateDevice(DeviceDto deviceDto) throws Exception ;

    /**
     * 查询设备
     * @param request
     * @return
     * @throws Exception
     */
    public PageResponse<DeviceVo> queryDevice(QueryDeviceRequest request) throws Exception ;

    /**
     * 删除设备
     * @param request
     * @throws Exception
     */
    public void deleteDevice(DeleteDeviceRequest request) throws Exception ;

    /**
     * 查询设备详情
     * @param request
     * @return
     * @throws Exception
     */
    public DeviceVo queryDeviceDetail(QueryDeviceDetailRequest request) throws Exception;
}