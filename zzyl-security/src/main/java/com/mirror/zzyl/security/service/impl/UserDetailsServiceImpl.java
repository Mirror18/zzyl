package com.mirror.zzyl.security.service.impl;


import com.mirror.zzyl.common.vo.UserVo;
import com.mirror.zzyl.security.service.UserService;
import com.mirror.zzyl.security.vo.UserAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 *  用户明细信息服务
 */
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //这里我们默认使用账号密码登录,对于多种登录方式如何处理-->字符串分割
        UserVo userVo = userService.findUserVoForLogin(username);
        return new UserAuth(userVo);
    }
}
