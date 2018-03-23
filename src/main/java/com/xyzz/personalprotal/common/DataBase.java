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

    private static Connection Conn;

    private DataBase() {
        try {
            Class.forName("org.sqlite.JDBC");
            Conn = DriverManager.getConnection("jdbc:sqlite::resource:static/database.db");
        } catch (ClassNotFoundException e) {
            //记录日志
            System.out.print(e.getMessage());
        } catch (SQLException e) {
            //记录日志
            System.out.print(e.getMessage());
        }
    }

    /*** 执行Sql语句， 获取结果集的第一项数据
     * @param sql: 要执行的Sql语句
     */
    public static String ExecuteSql_String(String sql) throws SQLException {
        return DataBase.ExecuteSql_String(sql, new ArrayList<>());
    }

    /*** 执行Sql语句， 获取结果集的第一项数据
     * @param sql: 要执行的Sql语句
     * @param parameters: Sql的参数化数据集
     */
    public static String ExecuteSql_String(String sql, ArrayList<Object> parameters) throws SQLException {
        return DataBase.ExecuteSql_Pri(sql, parameters).executeQuery().getString(1);
    }

    /*** 执行Sql语句， 获取是否执行成功
     * @param sql: 要执行的Sql语句
     */
    public static boolean ExecuteSql_Boolean(String sql) throws SQLException {
        return DataBase.ExecuteSql_Boolean(sql, new ArrayList<>());
    }

    /*** 执行Sql语句， 获取是否执行成功
     * @param sql: 要执行的Sql语句
     * @param parameters: Sql的参数化数据集
     */
    public static boolean ExecuteSql_Boolean(String sql, ArrayList<Object> parameters) throws SQLException {
        return DataBase.ExecuteSql_Pri(sql, parameters).executeUpdate() > 0;
    }

    /*** 执行Sql语句， 获取返回结果
     * @param sql: 要执行的Sql语句
     */
    public static ResultSet ExecuteSql(String sql) throws SQLException {
        return DataBase.ExecuteSql(sql, new ArrayList<>());
    }

    /*** 执行Sql语句， 获取返回结果
     * @param sql: 要执行的Sql语句
     * @param parameters: Sql的参数化数据集
     */
    public static ResultSet ExecuteSql(String sql, ArrayList<Object> parameters) throws SQLException {
        return DataBase.ExecuteSql_Pri(sql, parameters).executeQuery();
    }

    /*** 执行Sql语句， 获取返回结果
     * @param sql: 要执行的Sql语句
     * @param parameters: Sql的参数化数据集
     */
    private static PreparedStatement ExecuteSql_Pri(String sql, ArrayList<Object> parameters) throws SQLException {
        if (parameters == null) {
            parameters = new ArrayList<>();
        }

        PreparedStatement preparedStatement = Conn.prepareStatement(sql);

        for (int i = 0; i < parameters.size(); i++) {
            Object object = parameters.get(i);

            preparedStatement.setObject(i + 1, object);
        }
        return preparedStatement;
    }
}