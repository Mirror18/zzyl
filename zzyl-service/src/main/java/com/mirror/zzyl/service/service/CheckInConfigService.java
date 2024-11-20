package com.mirror.zzyl.service.service;


import com.mirror.zzyl.service.dto.CheckInConfigDto;
import com.mirror.zzyl.service.entity.CheckInConfig;

/**
* <p>
* check_in_config Service 接口
* </p>
*
* @author itheima
*/
public interface CheckInConfigService {

    /**
     * 根据老人id查询入住配置
     * @param elderId
     * @return
     */
    CheckInConfig findCurrentConfigByElderId(Long elderId);

    /**
     * 入住选择配置
     *
     * @param checkInConfigDto 入住选择配置
     * @return 受影响的行数
     */
    int checkIn(CheckInConfigDto checkInConfigDto);
}