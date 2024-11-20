package com.mirror.zzyl.service.service;


import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.service.dto.ApplicationsDto;
import com.mirror.zzyl.service.vo.ApplicationsVo;

/**
* <p>
* applications Service 接口
* </p>
*
* @author itheima
*/
public interface ApplicationsService {

    /**
     * 分页查询我的申请
     * @param applicationsDto
     * @return
     */
    ResponseResult<ApplicationsVo> selectByPage(ApplicationsDto applicationsDto);

}