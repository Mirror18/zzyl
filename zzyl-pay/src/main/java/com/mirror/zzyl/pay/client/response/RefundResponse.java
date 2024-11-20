package com.mirror.zzyl.pay.client.response;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * &#064;ClassName  RefundResponse.java
 *  退款返回
 * @author mirror
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class RefundResponse extends BasicResponse {

    //商户退款单号
    @JSONField(name = "out_refund_no")
    private String outRefundNo;

    //商户订单号
    @JSONField(name = "out_trade_no")
    private String outTradeNo;

    //退款状态
    //SUCCESS：退款成功
    //CLOSED：退款关闭
    //PROCESSING：退款处理中
    //ABNORMAL：退款异常
    private String status;

    //金额信息
    private AmountResponse amount;
}
