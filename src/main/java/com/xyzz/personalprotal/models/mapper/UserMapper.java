package com.xyzz.personalprotal.models.mapper;

import com.xyzz.personalprotal.models.database.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    /*** 获取用户信息
     * @param userId: 用户ID
     */
    @Select("select * from user where userId = #{userId}")
    User GetUserById(@Param("userId") int userId);

    /*** 注册用户信息
     * @param userId: 用户ID
     * @param userName: 用户名
     * @return: 是否操作成功
     */
    @Insert("insert into user (userId, userName) values (#{userId}, #{userName})")
    boolean Register(@Param("userId") int userId, @Param("userName") String userName);
}
