package com.mirror.zzyl.service.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.service.dto.RefundVoucherDto;
import com.mirror.zzyl.service.entity.Retreat;
import com.mirror.zzyl.service.entity.RetreatBill;
import com.mirror.zzyl.common.exception.BaseException;
import com.mirror.zzyl.service.mapper.RetreatBillMapper;
import com.mirror.zzyl.service.mapper.RetreatMapper;
import com.mirror.zzyl.service.service.RetreatBillService;
import com.mirror.zzyl.common.utils.UserThreadLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RetreatBillServiceImpl implements RetreatBillService {

    @Autowired
    private RetreatBillMapper retreatBillMapper;

    @Autowired
    private RetreatMapper retreatMapper;

    /**
     * 上传退款凭证
     * @param refundVoucherDto
     * @return
     */
    @Override
    public ResponseResult uploadRefundVoucher(RefundVoucherDto refundVoucherDto) {

        Retreat retreat = retreatMapper.getRetreatByCode(refundVoucherDto.getRetreatCode());
        if(retreat == null){
            throw new BaseException("退住单不存在");
        }

        RetreatBill retreatBill = new RetreatBill();
        retreatBill.setRetreatId(retreat.getId());
        BeanUtil.copyProperties(refundVoucherDto,retreatBill);
        retreatBill.setElderId(retreat.getElderId());
        retreatBill.setCreateTime(LocalDateTime.now());
        retreatBill.setCreateBy(UserThreadLocal.getUserId());

        retreatBillMapper.update(retreatBill);

        return ResponseResult.success();
    }

    /**
     * 查询退住账单数据
     * @param retreatId
     * @return
     */
    @Override
    public ResponseResult getRetreatBill(Long retreatId) {
        RetreatBill retreatBill = retreatBillMapper.selectByRetreatId(retreatId);
        return ResponseResult.success(retreatBill);
    }
}
