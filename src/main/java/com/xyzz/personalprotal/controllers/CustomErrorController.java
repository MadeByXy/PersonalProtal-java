package com.xyzz.personalprotal.controllers;


//@RestController
//public class CustomErrorController implements ErrorController {
//    public String getErrorPath() {
//        return "/error";
//    }
//
//    /*** 通用异常捕获接口
//     */
//    @RequestMapping(value = "/error")
//    public Object error(ResponseFacade response, HttpServletRequest request) throws IllegalAccessException, NoSuchFieldException {
//        Field field = response.getClass().getDeclaredField("response");
//        field.setAccessible(true);
//        Object data = field.get(response);
//        field = data.getClass().getDeclaredField("coyoteResponse");
//        field.setAccessible(true);
//        return ApiResult.ToFail(((Response) field.get(data)).getMessage(), response.getStatus());
//    }
//}
