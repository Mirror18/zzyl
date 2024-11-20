package com.mirror.zzyl.common.utils;



import com.mirror.zzyl.common.base.IBasicEnum;
import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.common.enums.BasicEnum;

import java.util.Date;

/**
 * 构造AjaxResult工具
 * @author mirror
 */
public class AjaxResultBuild {

    public static <T> ResponseResult<T> build(IBasicEnum basicEnumIntface, T t){

         //构建对象
        return ResponseResult.<T>builder()
            .code(basicEnumIntface.getCode())
            .msg(basicEnumIntface.getMsg())
            .operationTime(new Date())
            .data(t)
            .build();
    }

    /**
     * 公共成功响应方法
     * @param t
     * @param <T>
     * @return
     */
    public static <T> ResponseResult<T> successBuild(T t){
        return AjaxResultBuild.build(BasicEnum.SUCCEED,t);
    }

    /**
     * 公共失败响应方法
     * @param t
     * @param <T>
     * @return
     */
    public static <T> ResponseResult<T> failedBuild(T t){
        return AjaxResultBuild.build(BasicEnum.SYSYTEM_FAIL,t);
    }

}
