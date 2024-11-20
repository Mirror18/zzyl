package com.mirror.zzyl.security.service.impl;


import com.mirror.zzyl.security.mapper.RoleResourceMapper;
import com.mirror.zzyl.security.service.RoleResourceService;
import com.mirror.zzyl.security.entity.RoleResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 角色资源关联表服务实现类
 */
@Service
public class RoleResourceServiceImpl implements RoleResourceService {

    @Autowired
    RoleResourceMapper roleResourceMapper;

    @Override
    public Boolean deleteRoleResourceByRoleId(Long roleId) {
        int flag = roleResourceMapper.deleteRoleResourceByRoleId(roleId);
        if (flag>0){
            return true;
        }
        return false;
    }

    @Override
    public Boolean deleteRoleResourceInRoleId(List<Long> roleIds) {
        int flag = roleResourceMapper.deleteRoleResourceInRoleId(roleIds);
        if (flag>0){
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public int batchInsert(List<RoleResource> roleResourceList) {
        return roleResourceMapper.batchInsert(roleResourceList);
    }
}
