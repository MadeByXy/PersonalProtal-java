package com.xyzz.personalprotal.models.mapper;

import com.xyzz.personalprotal.models.database.LayoutModel;
import com.xyzz.personalprotal.models.database.ShortCutModel;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ShortCutMapper {
    /***
     * 获取快捷方式列表
     * @param ip 本机IP
     * @param height 快捷方式所在行
     * @param width 快捷方式所在行列数数组
     * @return 快捷方式列表
     */
    List<ShortCutModel> getShortCutList(
            @Param("ip") String ip,
            @Param("height") int height,
            @Param("width") int[] width);

    /***
     * 获取页面布局
     * @param ip 本机IP
     * @return 首页页面布局信息
     */
    LayoutModel getLayout(String ip);

    /***
     * 设置快捷方式
     * @param model 快捷方式实体
     * @return 快捷方式id
     */
    int setShortCut(ShortCutModel model);

    /***
     * 设置首页布局
     * @param model 首页布局实体
     */
    void setLayout(LayoutModel model);
}
