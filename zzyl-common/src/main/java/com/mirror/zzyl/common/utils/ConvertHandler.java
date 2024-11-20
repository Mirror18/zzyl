package com.mirror.zzyl.common.utils;


/**
 * 特殊类型转换器
 * @author mirror
 */
public interface ConvertHandler<O, T> {
    /**
     * 特殊对象类型转换
     *
     * @param originObject 源对象
     * @param targetObject 目标对象
     */
    void map(O originObject, T targetObject);
}
