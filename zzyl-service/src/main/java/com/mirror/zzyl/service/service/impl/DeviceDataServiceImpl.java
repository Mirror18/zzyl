package com.mirror.zzyl.service.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.alibaba.fastjson.JSON;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.mirror.zzyl.common.base.PageResponse;
import com.mirror.zzyl.service.dto.DeviceDataDto;
import com.mirror.zzyl.service.entity.DeviceData;
import com.mirror.zzyl.security.entity.User;
import com.mirror.zzyl.service.mapper.DeviceDataMapper;
import com.mirror.zzyl.service.service.DeviceDataService;
import com.mirror.zzyl.common.utils.UserThreadLocal;
import com.mirror.zzyl.service.vo.DeviceDataVo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;

@Service
public class DeviceDataServiceImpl implements DeviceDataService {

    @Resource
    private DeviceDataMapper deviceDataMapper;

    @Override
    public void createDeviceData(DeviceDataDto deviceDataDto) {
        deviceDataMapper.insert(BeanUtil.toBean(deviceDataDto, DeviceData.class));
    }

    @Override
    public DeviceDataVo readDeviceData(Long id) {
        return BeanUtil.toBean(deviceDataMapper.selectByPrimaryKey(id), com.mirror.zzyl.service.vo.DeviceDataVo.class);
    }

    @Override
    public void updateDeviceData(Long id, DeviceDataDto deviceDataDto) {
        DeviceData deviceData = BeanUtil.toBean(deviceDataDto, DeviceData.class);
        //从当前线程中获取用户数据
        String subject = UserThreadLocal.getSubject();
        User user = JSON.parseObject(subject, User.class);
        deviceData.setProcessor(user.getRealName());
        deviceData.setStatus("3");
        deviceData.setId(id);
        deviceDataMapper.updateByPrimaryKeySelective(deviceData);
    }

    @Override
    public void deleteDeviceData(Long id) {
        deviceDataMapper.deleteByPrimaryKey(id);
    }

    @Override
    public PageResponse<DeviceDataVo> getDeviceDataPage(Integer pageNum, Integer pageSize, Integer status, String deviceName, String accessLocation, Integer locationType, String functionId, LocalDateTime startTime, LocalDateTime endTime) {
        PageHelper.startPage(pageNum, pageSize);
        Page<DeviceDataVo> page = deviceDataMapper.page(status, deviceName, accessLocation, locationType, functionId, startTime, endTime);
        return PageResponse.of(page, DeviceDataVo.class);
    }

    @Override
    public PageResponse<DeviceDataVo> getDeviceWeekDataPage(Integer pageNum, Integer pageSize, Integer status, String deviceName, String accessLocation, Integer locationType, String functionId, LocalDateTime startTime, LocalDateTime endTime) {
        PageHelper.startPage(pageNum, pageSize);
        Page<DeviceDataVo> page = deviceDataMapper.pageWeek(status, deviceName, accessLocation, locationType, functionId, startTime, endTime);
        return PageResponse.of(page, DeviceDataVo.class);
    }
}
