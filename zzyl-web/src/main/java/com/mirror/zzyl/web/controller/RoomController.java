package com.mirror.zzyl.web.controller;

import com.mirror.zzyl.common.base.ResponseResult;
import com.mirror.zzyl.service.dto.RoomDto;
import com.mirror.zzyl.service.service.RoomService;
import com.mirror.zzyl.service.vo.RoomVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room")
@Api(tags = "房间管理")
public class RoomController extends BaseController {
    @Autowired
    private RoomService roomService;

    @PostMapping("/add")
    @ApiOperation("添加房间")
    public ResponseResult addRoom(@RequestBody RoomDto roomDto) {
        return toAjax(roomService.addRoom(roomDto));
    }

    @DeleteMapping("/delete/{id}")
    @ApiOperation("删除房间")
    public ResponseResult deleteRoom(@PathVariable Long id) {
        return toAjax(roomService.deleteRoom(id));
    }

    @PutMapping("/update")
    @ApiOperation("更新房间")
    public ResponseResult updateRoom(@RequestBody RoomDto roomDto) {
        return toAjax(roomService.updateRoom(roomDto));
    }

    @GetMapping("/get/{id}")
    @ApiOperation("获取房间")
    public ResponseResult<RoomVo> getRoom(@PathVariable Long id) {
        return ResponseResult.success(roomService.getRoom(id));
    }

    @GetMapping("/getAllVo")
    @ApiOperation("获取所有房间（所有楼层）")
    public ResponseResult<List<RoomVo>> getAllRoomVos() {
        return ResponseResult.success(roomService.getAllRoomVos());
    }

    @GetMapping("/getRoomsByFloorId/{floorId}")
    @ApiOperation("获取所有房间（入住配置）")
    public ResponseResult<List<RoomVo>> getRoomsByFloorId(@PathVariable Long floorId) {
        return ResponseResult.success(roomService.getRoomsByFloorId(floorId));
    }


    @GetMapping("/getRoomsCheckedByFloorId/{floorId}")
    @ApiOperation("获取所有房间（床位房型）")
    public ResponseResult<List<RoomVo>> getRoomsCheckedByFloorId(@PathVariable Long floorId) {
        return ResponseResult.success(roomService.getRoomsCheckedByFloorId(floorId));
    }


    @GetMapping("/getRoomsWithDeviceByFloorId/{floorId}")
    @ApiOperation("获取所有房间（智能床位）")
    public ResponseResult<List<RoomVo>> getRoomsWithDeviceByFloorId(@PathVariable Long floorId) {
        return ResponseResult.success(roomService.getRoomsWithDeviceByFloorId(floorId));
    }

    @GetMapping("/getRoomsWithNurByFloorId/{floorId}")
    @ApiOperation("获取所有房间（负责老人）")
    public ResponseResult<List<RoomVo>> getRoomsWithNurByFloorId(@PathVariable Long floorId) {
        return ResponseResult.success(roomService.getRoomsWithNurByFloorId(floorId));
    }
}
