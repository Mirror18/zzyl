package com.mirror.zzyl.service.entity;


import com.mirror.zzyl.common.base.BaseEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class Floor extends BaseEntity {

    /**
     * 楼层名称
     */
    @ApiModelProperty(value = "楼层名称")
    private String name;

    /**
     * 楼层编号
     */
    @ApiModelProperty(value = "楼层编号")
    private Integer code;
}

