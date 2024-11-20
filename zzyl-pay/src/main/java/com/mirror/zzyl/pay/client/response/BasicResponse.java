package com.mirror.zzyl.pay.client.response;

import lombok.Data;

/**
 * @author mirror
 * &#064;ClassName  BasicResponse.java
 *  返回基础对象
 */
@Data
public class BasicResponse {

    //网关请求返回编码
    public String code;

    //网关请求返回信息
    public String message;

    //业务请求返回编码
    public String subCode;

    //业务请求返回信息
    public String subMessage;
}
