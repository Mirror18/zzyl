package com.mirror.zzyl.pay.client.response;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author mirror
 * &#064;ClassName  AmountResponse.java
 *  金额信息
 */
@Data
@NoArgsConstructor
public class AmountResponse {

    //订单总金额【分】
    private Integer total;

    //退款总金额【分】
    private Integer refund;
}
