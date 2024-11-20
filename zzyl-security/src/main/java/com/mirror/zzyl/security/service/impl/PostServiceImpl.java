package com.mirror.zzyl.security.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

import com.mirror.zzyl.common.base.PageResponse;
import com.mirror.zzyl.common.constant.SuperConstant;
import com.mirror.zzyl.common.exception.BaseException;
import com.mirror.zzyl.common.utils.BeanConv;
import com.mirror.zzyl.common.utils.EmptyUtil;
import com.mirror.zzyl.common.utils.NoProcessing;
import com.mirror.zzyl.common.vo.DeptVo;
import com.mirror.zzyl.common.vo.PostVo;
import com.mirror.zzyl.security.dto.DeptDto;
import com.mirror.zzyl.security.dto.PostDto;
import com.mirror.zzyl.security.entity.Dept;
import com.mirror.zzyl.security.entity.Post;
import com.mirror.zzyl.security.mapper.DeptMapper;
import com.mirror.zzyl.security.mapper.PostMapper;
import com.mirror.zzyl.security.service.DeptService;
import com.mirror.zzyl.security.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 岗位表服务实现类
 */
@Service
public class PostServiceImpl implements PostService {

    @Resource
    PostMapper postMapper;

    @Resource
    DeptService deptService;

    @Resource
    DeptMapper deptMapper;

    /**
     *  多条件查询岗位表分页列表
     * @param postDto 查询条件
     * @param pageNum 页码
     * @param pageSize 每页条数
     * @return Page<PostVo>
     */
    @Override
    public PageResponse<PostVo> findPostPage(PostDto postDto, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        if (EmptyUtil.isNullOrEmpty(postDto.getDeptNo())){
            throw new BaseException("部门不能为空");
        }
        Page<List<Post>> page = postMapper.selectPage(postDto);
        PageResponse<PostVo> pageResponse = PageResponse.of(page, PostVo.class);
        if (!EmptyUtil.isNullOrEmpty(pageResponse.getRecords())){
            //对应部门
            List<String> deptNos = pageResponse.getRecords().stream().map(PostVo::getDeptNo).collect(Collectors.toList());
            List<DeptVo> deptVoList = deptService.findDeptInDeptNos(deptNos);
            pageResponse.getRecords().forEach(n->{
                n.setCreateDay(LocalDateTimeUtil.format(n.getCreateTime(), "yyyy-MM-dd"));
                //装配部门
                deptVoList.forEach(d->{
                    if (n.getDeptNo().equals(d.getDeptNo())){
                        n.setDeptVo(BeanConv.toBean(d,DeptVo.class));
                    }
                });
            });
        }
        return pageResponse;
    }

    /**
     *  创建岗位表
     * @param postDto 对象信息
     * @return PostDto
     */
    @Override
    public PostVo createPost(PostDto postDto) {
        //转换PostVo为Post
        Post post = BeanUtil.toBean(postDto, Post.class);
        String postNo = createPostNo(post.getDeptNo());
        post.setPostNo(postNo);
        int flag = postMapper.insert(post);
        if (flag==0){
            throw new RuntimeException("保存职位信息出错");
        }
        PostVo postVoResult = BeanConv.toBean(post, PostVo.class);
        //装配部门
        DeptDto deptDto = DeptDto.builder()
                .dataState(SuperConstant.DATA_STATE_0)
                .parentDeptNo(postDto.getDeptNo()).build();
        List<Dept> deptList = deptMapper.selectList(deptDto);
        if (!EmptyUtil.isNullOrEmpty(deptList)){
            postVoResult.setDeptVo(BeanConv.toBean(deptList.get(0),DeptVo.class));
        }
        return postVoResult;
    }

    /**
     *  修改岗位表
     * @param postDto 对象信息
     * @return Boolean
     */
    @Override
    public Boolean updatePost(PostDto postDto) {
        //转换PostVo为Post
        Post post = BeanUtil.toBean(postDto, Post.class);
        if (post.getDataState().equals("1")) {
            String[] s = {""};
            s[0] = post.getPostNo();
            Integer total = checkPostHasUser(s);
            if(total>0){
                throw new RuntimeException("岗位已分配,不能禁用");
            }
        }
        int flag = postMapper.updateByPrimaryKey(post);
        if (flag==0){
            throw new RuntimeException("修改职位信息出错");
        }
        return true;
    }

    @Override
    public List<PostVo> findPostList(PostDto postDto) {

        postDto.setDataState("0");
        List<Post> postList = postMapper.selectList(postDto);
        List<PostVo> postVoList = BeanConv.toBeanList(postList, PostVo.class);
        if (!EmptyUtil.isNullOrEmpty(postVoList)){
            //对应部门
            List<String> deptNos = postVoList.stream().map(PostVo::getDeptNo).collect(Collectors.toList());
            List<DeptVo> deptVoList = deptService.findDeptInDeptNos(deptNos);
            postVoList.forEach(n->{
                //装配部门
                deptVoList.forEach(d->{
                    if (n.getDeptNo().equals(d.getDeptNo())){
                        n.setDeptVo(BeanConv.toBean(d,DeptVo.class));
                    }
                });

            });
        }
        return postVoList;
    }

    @Override
    public List<PostVo> findPostVoListByUserId(Long userId) {

        return postMapper.findPostVoListByUserId(userId);
    }

    /**
     * 创建编号
     * @param deptNo
     * @return
     */
    private String createPostNo(String deptNo) {
        PostDto postDto = PostDto.builder().deptNo(deptNo).build();
        List<Post> postList = postMapper.selectList(postDto);
        //无下属节点则创建下属节点
        if (EmptyUtil.isNullOrEmpty(postList)){
            return NoProcessing.createNo(deptNo,false);
            //有下属节点则累加下属节点
        }else {
            Long postNo = postList.stream()
                .map(post -> { return Long.valueOf(post.getPostNo());})
                .max(Comparator.comparing(i -> i)).get();
            return NoProcessing.createNo(String.valueOf(postNo),true);
        }
    }

    @Override
    public int deletePostByIds(String[] postIds) {
        //验证当前岗位是否被用户关联
        Integer total = checkPostHasUser(postIds);
        if(total>0){
            throw new RuntimeException("岗位已分配,不能删除");
        }
        return postMapper.deletePostByIds(postIds);
    }

    /**
     * 校验岗位是否分配用户
     * @param postIds
     * @return
     */
    public Integer checkPostHasUser(String[] postIds) {
        return postMapper.checkPostHasUser(postIds);
    }
}