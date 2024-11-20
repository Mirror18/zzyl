package com.mirror.zzyl.service.job;

import com.mirror.zzyl.service.mapper.DeviceDataMapper;
import com.xxl.job.core.handler.annotation.XxlJob;

import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author itheima
 */
@Component
@Log
public class DeviceDataClearJob {

    @Autowired
    private DeviceDataMapper deviceDataMapper;


    @XxlJob("clearDeviceDataJob")
    public void clearDeviceDataJob(){
        log.info("设备上报数据,定时清理开始....");
        deviceDataMapper.clearDeviceDataJob();
        log.info("设备上报数据,定时清理结束....");
    }
}
