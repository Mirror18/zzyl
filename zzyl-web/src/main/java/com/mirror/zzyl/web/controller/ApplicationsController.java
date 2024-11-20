package com.mirror.zzyl.web.controller;



import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.common.utils.UserThreadLocal;
import com.mirror.zzyl.service.dto.ApplicationsDto;
import com.mirror.zzyl.service.service.ApplicationsService;
import com.mirror.zzyl.service.vo.ApplicationsVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
* <p>
* applications 控制器实现
* </p>
*
* @author itheima
*/
@RestController
@RequestMapping("/applications")
@Api(tags = "我的申请")
public class ApplicationsController {

    @Autowired
    private ApplicationsService applicationsService;

    @PostMapping("/selectByPage")
    @ApiOperation(value = "查询我的申请")
    public ResponseResult<ApplicationsVo> selectByPage(@RequestBody ApplicationsDto applicationsDto){

        Long mgtUserId = UserThreadLocal.getMgtUserId();
        applicationsDto.setApplicatId(mgtUserId);
        return applicationsService.selectByPage(applicationsDto);
    }

}
