package com.xyzz.personalprotal.controllers;

import com.xyzz.personalprotal.models.ApiResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("Demo")
public class DemoController {

    @RequestMapping("Demo")
    public ApiResult Demo() {
        return ApiResult.ToSuccess("Hello World");
    }
}
