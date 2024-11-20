package com.mirror.zzyl.service.service;


import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.service.dto.RefundVoucherDto;

public interface RetreatBillService {

    /**
     * 上传退款凭证
     * @param refundVoucherDto
     * @return
     */
    ResponseResult uploadRefundVoucher(RefundVoucherDto refundVoucherDto);

    /**
     * 查询退住账单数据
     * @param retreatId
     * @return
     */
    ResponseResult getRetreatBill(Long retreatId);
}
