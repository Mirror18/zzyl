package com.mirror.zzyl.framework.config;

import com.mirror.zzyl.framework.intercept.AutoFillInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *  webMvc 高级配置
 * @author mirror
 */
@Configuration
public class MybatisConfig {
    /**
     * 自动填充拦截器
     */
    @Bean
    public AutoFillInterceptor autoFillInterceptor(){
        return new AutoFillInterceptor();
    }

}
