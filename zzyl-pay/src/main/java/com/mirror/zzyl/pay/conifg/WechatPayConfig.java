package com.mirror.zzyl.pay.conifg;


import com.mirror.zzyl.pay.client.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;

/**
 * @author mirror
 * @ClassName WeChatPayConfig.java
 *  微信配置类
 */
@Configuration
@EnableConfigurationProperties(WechatPayProperties.class)
public class WechatPayConfig {

    @Resource
    WechatPayProperties wechatPayProperties;

    /***
     *  获得配置
     * @return
     */
    public Config config(){
        return Config.builder()
            .appid(wechatPayProperties.getAppid())
            .domain(wechatPayProperties.getDomain())
            .mchId(wechatPayProperties.getMchId())
            .mchSerialNo(wechatPayProperties.getMchSerialNo())
            .apiV3Key(wechatPayProperties.getApiV3Key())
            .privateKey(wechatPayProperties.getPrivateKey())
            .notifyUrl(wechatPayProperties.getNotifyUrl())
            .build();
    }
}
