package com.mirror.zzyl.security.service.impl;


import com.mirror.zzyl.security.entity.RoleDept;
import com.mirror.zzyl.security.mapper.RoleDeptMapper;
import com.mirror.zzyl.security.service.RoleDeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 角色和部门关系业务层
 */
@Service
public class RoleDeptServiceImpl implements RoleDeptService {

    @Autowired
    RoleDeptMapper roleDeptMapper;

    @Override
    public int batchInsert(List<RoleDept> roleDeptList) {
        return roleDeptMapper.batchInsert(roleDeptList);
    }

    @Override
    public Boolean deleteRoleDeptByRoleId(Long roleId) {
        int flag = roleDeptMapper.deleteRoleDeptByRoleId(roleId);
        if (flag>0){
            return true;
        }
        return false;
    }

    @Override
    public Boolean deleteRoleDeptInRoleId(List<Long> roleIds) {
        int flag = roleDeptMapper.deleteRoleDeptInRoleId(roleIds);
        if (flag>0){
            return true;
        }
        return false;
    }

}
