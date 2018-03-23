package com.xyzz.personalprotal.controllers;

import com.xyzz.personalprotal.common.DataBase;
import com.xyzz.personalprotal.common.IpUtil;
import com.xyzz.personalprotal.models.common.ApiResult;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.hamcrest.core.IsNull;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

@RestController
@RequestMapping("/ShortCut")
public class ShortCutController {

    /***
     * 获取首页快捷方式信息
     * @param request
     * @return
     * @throws SQLException
     */
    @RequestMapping("/Get")
    public ApiResult Get(HttpServletRequest request) throws SQLException {
        String ip = IpUtil.GetIpAddr(request);
        ResultSet layout = DataBase.ExecuteSql(
                "select ip, width, height from LayoutList where ip = ? union select '', 5, 2",
                new ArrayList<Object>() {{
                    add(ip);
                }});
        JSONArray result = new JSONArray();
        for (int height = 0; height < layout.getInt("height"); height++) {
            JSONArray objects = new JSONArray();
            for (int width = 0; width < layout.getInt("width"); width++) {
                final int tempW = width, tempH = height;
                JSONObject object = new JSONObject();
                ResultSet resultSet = DataBase.ExecuteSql(
                        "select id, name, url, width, height, (case when (name is null or name == '') and (url is null or url == '') then 0 else 1 end) show from ShortCut where ip = ? and width = ? and height = ?",
                        new ArrayList<Object>() {{
                            add(ip);
                            add(tempW);
                            add(tempH);
                        }});
                if (resultSet.next()) {
                    object.appendField("id", resultSet.getInt("ID"));
                    object.appendField("name", resultSet.getString("NAME"));
                    object.appendField("url", resultSet.getString("URL"));
                    object.appendField("width", resultSet.getInt("WIDTH"));
                    object.appendField("height", resultSet.getInt("HEIGHT"));
                    object.appendField("show", resultSet.getBoolean("SHOW"));
                } else {
                    object.appendField("width", tempW);
                    object.appendField("height", tempH);
                    object.appendField("show", false);
                }
                objects.appendElement(object);
            }
            result.appendElement(objects);
        }

        return ApiResult.ToSuccess("", result);
    }

    /***
     * 调整首页大小
     * @param request
     * @param width 横排数量
     * @param height 竖排数量
     * @return
     * @throws SQLException
     */
    @RequestMapping("/FixSize")
    public ApiResult FixSize(HttpServletRequest request,
                             @RequestParam int width,
                             @RequestParam int height) throws SQLException {
        boolean result = DataBase.ExecuteSql_Boolean(
                "replace into LayoutList (ip, width, height) values (?, ?, ?)",
                new ArrayList<Object>() {{
                    add(IpUtil.GetIpAddr(request));
                    add(width);
                    add(height);
                }});

        return new ApiResult() {{
            setSuccess(result);
            setMessage(result ? "执行成功" : "执行失败");
        }};
    }

    /***
     * 设置快捷方式
     * @param request
     * @param id 快捷方式ID， 该值为空表示新建
     * @param name 快捷方式名称
     * @param url 快捷方式地址
     * @param width 快捷方式横坐标
     * @param height 快捷方式纵坐标
     * @return
     * @throws SQLException
     */
    @RequestMapping("/Set")
    public ApiResult Set(HttpServletRequest request,
                         Integer id,
                         @RequestParam String name,
                         @RequestParam String url,
                         @RequestParam int width,
                         @RequestParam int height) throws SQLException {
        boolean result = DataBase.ExecuteSql_Boolean(
                "replace into ShortCut (id, ip, name, url, width, height) values (?, ?, ?, ?, ?, ?)",
                new ArrayList<Object>() {{
                    add(id);
                    add(IpUtil.GetIpAddr(request));
                    add(name);
                    add(url);
                    add(width);
                    add(height);
                }});

        return new ApiResult() {{
            setSuccess(result);
            setMessage(result ? "执行成功" : "执行失败");
        }};
    }
}
