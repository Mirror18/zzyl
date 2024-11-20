package com.mirror.zzyl.pay.client.response;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * &#064;ClassName  PreCreateResponse.java
 * @author mirror
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class PreCreateResponse extends BasicResponse{

    //二维码请求地址
    @JSONField(name="code_url")
    private String codeUrl;

}
