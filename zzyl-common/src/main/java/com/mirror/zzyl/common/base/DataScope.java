package com.mirror.zzyl.common.base;

import java.lang.annotation.*;

/**
 * 数据权限过滤注解
 * @author mirror
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataScope {
    String deptAlias()  default  "";
    String userAlias()  default  "";
}
