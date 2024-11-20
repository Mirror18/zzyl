package com.mirror.zzyl.service.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.mirror.zzyl.common.base.PageResponse;
import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.service.dto.ApplicationsDto;
import com.mirror.zzyl.service.dto.PendingTasksDto;
import com.mirror.zzyl.service.entity.PendingTasks;
import com.mirror.zzyl.service.service.ApplicationsService;
import com.mirror.zzyl.service.vo.ApplicationsVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author itheima
 */
@Service
public class ApplicationsServiceImpl implements ApplicationsService {

    @Autowired
    private ActFlowCommServiceImpl actFlowCommService;

    /**
     * 分页查询我的申请
     * @param applicationsDto
     * @return
     */
    @Override
    public ResponseResult<ApplicationsVo> selectByPage(ApplicationsDto applicationsDto) {
        PendingTasksDto pendingTasksDto = BeanUtil.toBean(applicationsDto, PendingTasksDto.class);
        PageResponse<PendingTasks> pendingTasksPageResponse = actFlowCommService.myTaskInfoList(pendingTasksDto);
        return ResponseResult.success(pendingTasksPageResponse);
    }

}
