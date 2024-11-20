package com.mirror.zzyl.common.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 *  数据权限对象
 * @author mirror
 */
@Data
@NoArgsConstructor
public class DataSecurity implements Serializable {

    @ApiModelProperty(value = "仅本人数据权限")
    private Boolean yourselfData;

    @ApiModelProperty(value = "数据权限对应部门编号集合")
    private List<String> deptNos;

    @Builder
    public DataSecurity(Boolean yourselfData, List<String> deptNos) {
        this.yourselfData = yourselfData;
        this.deptNos = deptNos;
    }
}
