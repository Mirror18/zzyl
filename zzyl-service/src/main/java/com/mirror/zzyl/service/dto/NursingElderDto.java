package com.mirror.zzyl.service.dto;


import com.mirror.zzyl.common.base.BaseDto;
import lombok.Data;

import java.util.List;

@Data
public class NursingElderDto extends BaseDto {
    private Long id;

    private List<Long> nursingIds;

    private Long elderId;
}