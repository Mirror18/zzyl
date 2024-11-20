package com.mirror.zzyl.pay.client.response;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author mirror
 * @ClassName AppPreCreateResponse.java
 */
@Data
@NoArgsConstructor
public class AppPreCreateResponse {

    //请求返回编码
    private String code;

    @JSONField(name="prepay_id")
    private String prepayId;
}
