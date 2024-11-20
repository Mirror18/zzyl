package com.mirror.zzyl.pay.client;


import com.mirror.zzyl.pay.client.operators.Common;
import com.mirror.zzyl.pay.client.operators.Wap;
import lombok.Data;
import lombok.extern.log4j.Log4j2;

/**
 * &#064;ClassName  Factory.java
 *  封装对于微信支付工程类
 * @author mirror
 */
@Data
@Log4j2
public class Factory {

    Config config;

    public void setOptions(Config config) {
        this.config = config;
    }

    //基础服务
    public Common common(){
        return new Common(config);
    }



    //手机网页支付
    public Wap Wap(){
        return new Wap(config);
    }


}
