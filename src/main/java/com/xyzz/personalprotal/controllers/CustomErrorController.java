//package com.xyzz.personalprotal.controllers;
//
//
//import com.xyzz.personalprotal.models.common.ApiResult;
//import org.apache.catalina.connector.ResponseFacade;
//import org.apache.coyote.Response;
//import org.springframework.boot.web.servlet.error.ErrorController;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.servlet.http.HttpServletRequest;
//import java.lang.reflect.Field;
//
//@RestController
//public class CustomErrorController implements ErrorController {
//    public String getErrorPath() {
//        return "/error";
//    }
//
//    /*** 通用异常捕获接口
//     */
//    @RequestMapping(value = "/error")
//    @ResponseBody
//    public Object error(ResponseFacade response, HttpServletRequest request, Exception e) throws IllegalAccessException, NoSuchFieldException {
//
//        Field field = response.getClass().getDeclaredField("response");
//        field.setAccessible(true);
//        Object data = field.get(response);
//        field = data.getClass().getDeclaredField("coyoteResponse");
//        field.setAccessible(true);
//        return ApiResult.ToFail(((Response) field.get(data)).getMessage(), response.getStatus());
//    }
//}
