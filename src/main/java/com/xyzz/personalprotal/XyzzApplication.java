package com.xyzz.personalprotal;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.xyzz.personalprotal.models.mapper")
public class XyzzApplication {

	public static void main(String[] args) {
		SpringApplication.run(XyzzApplication.class, args);
	}
}
