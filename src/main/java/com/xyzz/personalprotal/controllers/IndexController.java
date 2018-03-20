package com.xyzz.personalprotal.controllers;

import com.xyzz.personalprotal.common.Http;
import com.xyzz.personalprotal.models.common.ApiResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "Index")
public class IndexController {

    /***
     * 委托请求以解决js的跨域问题
     * @param url 请求的http地址
     * @param parameters 请求的参数, 默认为空
     * @param charset 请求的编码, 默认为UTF-8
     * @param queryType 请求类型, 默认为GET请求
     * @return 请求结果
     */
    @RequestMapping(value = "DelegateQuery")
    public ApiResult DelegateQuery(
            @RequestParam String url,
            @RequestParam(defaultValue = "") String parameters,
            @RequestParam(defaultValue = "UTF-8") String charset,
            @RequestParam(defaultValue = "GET") String queryType) {
        try {
            return ApiResult.ToSuccess("", Http.Query(url, parameters, charset, queryType));
        } catch (Exception e) {
            return ApiResult.ToFail(e.getMessage());
        }
    }
}
