package com.mirror.zzyl.service.mapper;


import com.mirror.zzyl.service.entity.Floor;
import com.mirror.zzyl.service.vo.FloorVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FloorMapper {

    int insert(Floor floor);

    int deleteById(Long id);

    int updateById(Floor floor);

    Floor selectById(Long id);

    List<FloorVo> selectAll();

    List<FloorVo> selectAllRoomAndBed();

    List<FloorVo> selectAllByNur();
    List<FloorVo> selectAllByDevice();
}
