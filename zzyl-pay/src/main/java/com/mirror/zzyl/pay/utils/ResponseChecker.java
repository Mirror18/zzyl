package com.mirror.zzyl.pay.utils;


import com.mirror.zzyl.pay.client.response.BasicResponse;

/**
 * @author mirror
 * @ClassName ResponseChecker.java
 *  微信结果检查
 */
public class ResponseChecker {

    public static boolean success(BasicResponse response) {
        String code = response.getCode();
        return code.equals("200");
    }

}
