package com.xyzz.personalprotal.controllers;

import com.xyzz.personalprotal.common.DataBase;
import com.xyzz.personalprotal.common.DataHelper;
import com.xyzz.personalprotal.common.IpUtil;
import com.xyzz.personalprotal.models.common.ApiResult;
import com.xyzz.personalprotal.models.database.LayoutModel;
import com.xyzz.personalprotal.models.database.ShortCutModel;
import com.xyzz.personalprotal.models.mapper.ShortCutMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/ShortCut")
public class ShortCutController {
    /***
     * 获取首页快捷方式信息
     * @param request
     * @return
     */
    @RequestMapping("/Get")
    public ApiResult Get(HttpServletRequest request) {
        return ApiResult.ToSuccess("", (ArrayList<List<ShortCutModel>>) DataBase.invoke(ShortCutMapper.class, mapper -> {
            String ip = IpUtil.GetIpAddr(request);
            ArrayList<List<ShortCutModel>> data = new ArrayList<>();
            LayoutModel layoutModel = mapper.getLayout(ip);
            for (int height = 0; height < layoutModel.getHeight(); height++) {
                data.add(mapper.getShortCutList(ip, height, DataHelper.ToArray(layoutModel.getWidth())));
            }
            return data;
        }));
    }

    /***
     * 调整首页大小
     * @param request
     * @param model 首页布局实体
     * @return
     */
    @RequestMapping("/FixSize")
    public ApiResult FixSize(HttpServletRequest request, LayoutModel model) {
        model.setIp(IpUtil.GetIpAddr(request));
        DataBase.commit(ShortCutMapper.class, mapper -> {
            mapper.setLayout(model);
        });
        return ApiResult.ToSuccess("执行成功");
    }

    /***
     * 设置快捷方式
     * @param request
     * @param model 快捷方式实体
     * @return
     */
    @RequestMapping("/Set")
    public ApiResult Set(HttpServletRequest request, ShortCutModel model) {
        model.setIp(IpUtil.GetIpAddr(request));
        return ApiResult.ToSuccess("执行成功", (int) DataBase.commit(ShortCutMapper.class, mapper -> {
            return mapper.setShortCut(model);
        }));
    }
}
