package com.xyzz.personalprotal.common;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.Reader;
import java.util.function.Consumer;
import java.util.function.Function;

public class DataBase {
    private static SqlSessionFactory sessionFactory;

    static {
        try {
            //使用MyBatis提供的Resources类加载mybatis的配置文件
            Reader reader = Resources.getResourceAsReader("static/mybatis-config.xml");
            //构建sqlSession的工厂
            sessionFactory = new SqlSessionFactoryBuilder().build(reader);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /***
     * 执行指定的数据库操作
     * @param tClass mapper类型
     * @param mapper 操作的lambda方法
     * @param <T> mapper类型
     */
    public static <T> void invoke(Class<T> tClass, Consumer<T> mapper) {
        invoke(tClass, mapper, false);
    }

    /***
     * 提交指定的数据库操作
     * @param tClass mapper类型
     * @param mapper 操作的lambda方法
     * @param <T> mapper类型
     */
    public static <T> void commit(Class<T> tClass, Consumer<T> mapper) {
        invoke(tClass, mapper, true);
    }

    /***
     * 执行指定的数据库操作
     * @param tClass mapper类型
     * @param mapper 操作的lambda方法
     * @param <T> mapper类型
     * @param <R> 返回值类型
     * @return lambda返回值
     */
    public static <T, R> R invoke(Class<T> tClass, Function<T, R> mapper) {
        return invoke(tClass, mapper, false);
    }

    /***
     * 提交指定的数据库操作
     * @param tClass mapper类型
     * @param mapper 操作的lambda方法
     * @param <T> mapper类型
     * @param <R> 返回值类型
     * @return lambda返回值
     */
    public static <T, R> R commit(Class<T> tClass, Function<T, R> mapper) {
        return invoke(tClass, mapper, true);
    }

    /***
     * 执行指定的数据库操作
     * @param tClass mapper类型
     * @param mapper 操作的lambda方法
     * @param commit 是否需要提交数据
     * @param <T> mapper类型
     */
    private static <T> void invoke(Class<T> tClass, Consumer<T> mapper, boolean commit) {
        SqlSession session = sessionFactory.openSession();
        mapper.accept(session.getMapper(tClass));
        if (commit) {
            session.commit();
        }
        session.close();
    }

    /***
     * 执行指定的数据库操作
     * @param tClass mapper类型
     * @param mapper 操作的lambda方法
     * @param commit 是否需要提交数据
     * @param <T> mapper类型
     * @param <R> 返回值类型
     * @return lambda返回值
     */
    private static <T, R> R invoke(Class<T> tClass, Function<T, R> mapper, boolean commit) {
        SqlSession session = sessionFactory.openSession();
        R result = mapper.apply(session.getMapper(tClass));
        if (commit) {
            session.commit();
        }
        session.close();
        return result;
    }
}