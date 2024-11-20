package com.mirror.zzyl.service.vo;


import com.mirror.zzyl.service.entity.Applications;
import lombok.Data;

/**
 * @author itheima
 */
@Data
public class ApplicationsVo extends Applications {

    /**
     * 单据流程状态
     */
    private Integer flowStatus;
}
