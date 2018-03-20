package com.xyzz.personalprotal.models.common;

import java.util.ArrayList;

/*** 接口通用返回格式
 * @see T:单元素返回的类型
 * @see V:多元素返回的类型
 * */
public class ApiResult<T, V> {
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    private boolean success = true;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message = "";

    public T getObject() {
        return object;
    }

    public void setObject(T object) {
        this.object = object;
    }

    private T object;

    public ArrayList<V> getArray() {
        return array;
    }

    public void setArray(ArrayList<V> array) {
        this.array = array;
    }

    private ArrayList<V> array = new ArrayList<V>();

    /*** 返回成功的请求结果
     * @param message: 返回描述
     */
    public static <T, V> ApiResult ToSuccess(String message) {
        return ApiResult.ToSuccess(message, "", new ArrayList<String>());
    }

    /*** 返回成功的请求结果
     * @param message: 返回描述
     * @param object: 单元素返回的值
     */
    public static <T, V> ApiResult ToSuccess(String message, T object) {
        return ApiResult.ToSuccess(message, object, new ArrayList<String>());
    }

    /*** 返回成功的请求结果
     * @param message: 返回描述
     * @param array: 多元素返回的值
     */
    public static <T, V> ApiResult ToSuccess(String message, ArrayList<V> array) {
        return ApiResult.ToSuccess(message, "", array);
    }

    /*** 返回成功的请求结果
     * @param object: 单元素返回的值
     * @param array: 多元素返回的值
     */
    public static <T, V> ApiResult ToSuccess(T object, ArrayList<V> array) {
        return ApiResult.ToSuccess("", object, array);
    }

    /*** 返回成功的请求结果
     * @param message: 返回描述
     * @param object: 单元素返回的值
     * @param array: 多元素返回的值
     */
    public static <T, V> ApiResult ToSuccess(String message, T object, ArrayList<V> array) {
        ApiResult<T, V> result = new ApiResult<T, V>();
        result.success = true;
        result.message = message;
        result.object = object;
        result.array = array;
        return result;
    }

    /*** 返回失败的请求结果
     * @param message: 失败原因
     */
    public static ApiResult ToFail(String message) {
        return ApiResult.ToFail(message, "");
    }

    /*** 返回失败的请求结果
     * @param message: 失败原因
     * @param object: 单元素返回的值
     */
    public static <T, V> ApiResult ToFail(String message, T object) {
        ApiResult<T, V> result = new ApiResult<T, V>();
        result.success = false;
        result.message = message;
        result.object = object;
        return result;
    }
}
