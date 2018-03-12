package com.xyzz.personalprotal.common;

import java.sql.*;
import java.util.ArrayList;

/*** 数据库操作类
 */
public class DataBase {
    //类实例
    private static DataBase Instance = new DataBase();

    public static DataBase getInstance() {
        return Instance;
    }

    private DataBase() {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            //记录日志
            System.out.print(e.getMessage());
        }
    }

    /*** 执行Sql语句， 获取结果集的第一项数据
     * @param sql: 要执行的Sql语句
     */
    public static String ExecuteSql_String(String sql) throws SQLException {
        return DataBase.ExecuteSql_String(sql, new ArrayList<Object>());
    }

    /*** 执行Sql语句， 获取结果集的第一项数据
     * @param sql: 要执行的Sql语句
     * @param parameters: Sql的参数化数据集
     */
    public static String ExecuteSql_String(String sql, ArrayList<Object> parameters) throws SQLException {
        return DataBase.ExecuteSql(sql, new ArrayList<Object>()).getString(1);
    }

    /*** 执行Sql语句， 获取返回结果
     * @param sql: 要执行的Sql语句
     */
    public static ResultSet ExecuteSql(String sql) throws SQLException {
        return DataBase.ExecuteSql(sql, new ArrayList<Object>());
    }

    /*** 执行Sql语句， 获取返回结果
     * @param sql: 要执行的Sql语句
     * @param parameters: Sql的参数化数据集
     */
    public static ResultSet ExecuteSql(String sql, ArrayList<Object> parameters) throws SQLException {
        if (parameters == null) {
            parameters = new ArrayList<Object>();
        }

        Connection conn = DriverManager.getConnection("jdbc:sqlite::resource:static/database.db");
        PreparedStatement preparedStatement = conn.prepareStatement(sql);

        for (int i = 0; i < parameters.size(); i++) {
            Object object = parameters.get(i);

            if (object instanceof Integer) {
                preparedStatement.setInt(i, (Integer) object);
            } else {
                preparedStatement.setString(i, object.toString());
            }
        }
        return preparedStatement.executeQuery();
    }
}