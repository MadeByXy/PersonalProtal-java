package com.xyzz.personalprotal.common;

public class DataHelper {
    /***
     * 返回范围区间的数字数组
     * @param num 结束坐标
     * @return
     */
    public static int[] ToArray(int num) {
        return ToArray(0, num);
    }

    /***
     * 返回范围区间的数字数组
     * @param beginNum 开始坐标
     * @param endNum 结束坐标
     * @return
     */
    public static int[] ToArray(int beginNum, int endNum) {
        int[] array = new int[endNum - beginNum];
        for (int i = 0; i < array.length; i++) {
            array[i] = i + beginNum;
        }
        return array;
    }
}
