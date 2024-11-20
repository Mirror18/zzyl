package com.mirror.zzyl.security.service;


import com.mirror.zzyl.common.vo.UserVo;

/**
 *  登录接口
 */
public interface LoginService {

    /***
     *  用户退出
     * @param userVo 登录信息
     * @return
     */
    UserVo login(UserVo userVo);
}
