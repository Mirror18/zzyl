package com.mirror.zzyl.security.controller;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;

import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.common.vo.UserVo;
import com.mirror.zzyl.security.service.LoginService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *  登录接口
 */
@RestController
@Api(tags = "用户登录")
@RequestMapping("security")
public class LoginController {

    @Autowired
    LoginService loginService;

    @PostMapping("login")
    @ApiOperation(value = "用户登录",notes = "用户登录")
    @ApiImplicitParam(name = "userVo",value = "登录对象",required = true,dataType = "UserVo")
    @ApiOperationSupport(includeParameters ={"userVo.username","userVo.password"} )
    public ResponseResult<UserVo> login(@RequestBody UserVo userVo){
        return ResponseResult.success(loginService.login(userVo));
    }
}
