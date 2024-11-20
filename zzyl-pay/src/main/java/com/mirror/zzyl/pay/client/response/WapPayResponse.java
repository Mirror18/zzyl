package com.mirror.zzyl.pay.client.response;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * &#064;ClassName  PagePayResponse.java
 * @author mirror
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class WapPayResponse extends BasicResponse {

    @JSONField(name="prepay_id")
    private String prepayId;

}
