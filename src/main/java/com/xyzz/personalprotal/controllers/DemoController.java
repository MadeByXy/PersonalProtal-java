package com.xyzz.personalprotal.controllers;

import com.xyzz.personalprotal.common.DataBase;
import com.xyzz.personalprotal.models.ApiResult;
import com.xyzz.personalprotal.models.mapper.UserMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sun.java2d.pipe.AAShapePipe;

import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
@RequestMapping("Demo")
public class DemoController {

    private UserMapper UserMapper;

    @RequestMapping("Demo")
    public ApiResult Demo() {
        return ApiResult.ToSuccess("Hello World");
    }

    /*** 参数测试
     * @param test1
     * @param test2
     * @return
     */
    @RequestMapping("ParamsTest")
    public ApiResult ParamsTest(@RequestParam String test1, @RequestParam int test2) {
        return ApiResult.ToSuccess("测试成功");
    }

    @RequestMapping("Register")
    public ApiResult Register() throws SQLException {
        ResultSet resultSet = DataBase.ExecuteSql("select * from blockList");
        return ApiResult.ToSuccess("注册成功");
    }
}
