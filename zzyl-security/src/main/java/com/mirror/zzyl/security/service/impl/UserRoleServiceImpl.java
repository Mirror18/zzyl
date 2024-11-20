package com.mirror.zzyl.security.service.impl;


import com.mirror.zzyl.security.entity.UserRole;
import com.mirror.zzyl.security.mapper.UserRoleMapper;
import com.mirror.zzyl.security.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户角色关联表服务实现类
 */
@Service
public class UserRoleServiceImpl implements UserRoleService {

    @Autowired
    UserRoleMapper userRoleMapper;

    @Override
    public boolean deleteUserRoleByUserId(Long userId) {
        int flag = userRoleMapper.deleteUserRoleByUserId(userId);
        if (flag>0){
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteUserRoleInUserId(List<Long> userIds) {
        int flag = userRoleMapper.deleteUserRoleInUserId(userIds);
        if (flag>0){
            return true;
        }
        return false;
    }

    @Override
    public int batchInsert(List<UserRole> userRoles) {
        return userRoleMapper.batchInsert(userRoles);
    }
}
