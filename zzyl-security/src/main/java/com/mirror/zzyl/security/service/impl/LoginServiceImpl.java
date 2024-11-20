package com.mirror.zzyl.security.service.impl;

import com.alibaba.fastjson.JSONObject;

import com.mirror.zzyl.common.constant.UserCacheConstant;
import com.mirror.zzyl.common.utils.BeanConv;
import com.mirror.zzyl.common.utils.JwtUtil;
import com.mirror.zzyl.common.vo.ResourceVo;
import com.mirror.zzyl.common.vo.RoleVo;
import com.mirror.zzyl.common.vo.UserVo;
import com.mirror.zzyl.framework.properties.JwtTokenManagerProperties;
import com.mirror.zzyl.security.service.LoginService;
import com.mirror.zzyl.security.service.ResourceService;
import com.mirror.zzyl.security.service.RoleDeptService;
import com.mirror.zzyl.security.service.RoleService;
import com.mirror.zzyl.security.vo.UserAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 *  登录接口实现
 */
@Component
public class LoginServiceImpl implements LoginService {

    @Resource
    AuthenticationManager authenticationManager;

    @Resource
    RoleService roleService;

    @Resource
    ResourceService resourceService;

    @Resource
    private JwtTokenManagerProperties jwtTokenManagerProperties;

    @Resource
    RoleDeptService roleDeptService;

    @Resource
    private StringRedisTemplate redisTemplate;

    @Override
    public UserVo login(UserVo userVo) {
        //用户认证
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userVo.getUsername(), userVo.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authentication);

        //认证Authentication对象获得内置对象UserAuth
        UserAuth userAuth = (UserAuth) authenticate.getPrincipal();
        userAuth.setPassword("");
        UserVo userVoResult = BeanConv.toBean(userAuth, UserVo.class);

        //查询当前用户拥有的资源列表，方便授权过滤器进行校验
        List<ResourceVo> resourceVoList = resourceService.findResourceVoListByUserId(userVoResult.getId());
        Set<String> requestPaths = resourceVoList.stream()
                .filter(x -> "r".equals(x.getResourceType()))
                .map(ResourceVo::getRequestPath)
                .collect(Collectors.toSet());
        userVoResult.setResourceRequestPaths(requestPaths);

        //用户当前角色列表
        List<RoleVo> roleVoList = roleService.findRoleVoListByUserId(userVoResult.getId());
        Set<String> roleLabels = roleVoList
                .stream()
                .map(RoleVo::getLabel)
                .collect(Collectors.toSet());
        userVoResult.setRoleLabels(roleLabels);

        //userToken令牌颁布
        String userToken = UUID.randomUUID().toString();
        userVoResult.setUserToken(userToken);

        //构建载荷
        Map<String, Object> claims = new HashMap<>();
        String userVoJsonString = JSONObject.toJSONString(userVoResult);
        claims.put("currentUser", userVoJsonString);

        //jwtToken令牌颁布
        String jwtToken = JwtUtil.createJWT(jwtTokenManagerProperties.getBase64EncodedSecretKey(), jwtTokenManagerProperties.getTtl(), claims);

        //剔除缓存：用户关联userToken
        String userTokenKey = UserCacheConstant.USER_TOKEN + userVo.getUsername();
        long ttl = Long.valueOf(jwtTokenManagerProperties.getTtl()) / 1000;
        //key：username   value:uuid
        redisTemplate.opsForValue().set(userTokenKey, userToken, ttl, TimeUnit.SECONDS);

        //续期缓存：userToken关联jwtToken
        String jwtTokenKey = UserCacheConstant.JWT_TOKEN + userToken;
        //key：uuid   value:jwttoken
        redisTemplate.opsForValue().set(jwtTokenKey, jwtToken, ttl, TimeUnit.SECONDS);

        return userVoResult;
    }
}
