package com.mirror.zzyl.common.exception;


import com.mirror.zzyl.common.base.IBasicEnum;
import lombok.Getter;
import lombok.Setter;

/**
 * 自定义异常
 * @author mirror
 */
public class ProjectException extends RuntimeException {

    //错误编码
    @Getter
    private int code;

    //提示信息
    private String message;

    //异常接口
    @Getter
    private IBasicEnum basicEnumIntface;

    public ProjectException() {

    }
    public ProjectException(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public ProjectException(IBasicEnum errorCode) {
        setBasicMsg(errorCode);
    }


    public ProjectException(IBasicEnum errorCode, String throwMsg) {
        super(throwMsg);
        setBasicMsg(errorCode);
    }

    public ProjectException(IBasicEnum errorCode, Throwable throwable) {
        super(throwable);
        setBasicMsg(errorCode);
    }


    private void setBasicMsg(IBasicEnum basicEnumIntface) {
        this.code = basicEnumIntface.getCode();
        this.message = basicEnumIntface.getMsg();
        this.basicEnumIntface = basicEnumIntface;
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return "ProjectException{" +
                "code='" + code + '\'' +
                ", message='" + message + '\'' +
                ", basicEnumIntface=" + basicEnumIntface +
                '}';
    }
}
