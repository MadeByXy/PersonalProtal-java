Enum = {
    //类型检测枚举
    AllowType: {
        //非空类型
        NonEmpty: 0,
        //布尔类型
        Boolean: 1,
        //正整数类型
        PositiveInteger: 2,
        //整数类型
        Integer: 3,
        //数字类型
        Digital: 4,
        //邮箱类型
        Email: 5,
        //手机号码类型
        Mobile: 6
    },
    //缓存过期时间(毫秒)
    CacheExpirationTime: 600000,
    //忽略请求时长(毫秒)
    //ps: 该值指示范围时间内的重复请求会被合并成一次请求
    CacheIgnoredTime: 100,
    //周次枚举
    Week: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    //通知公告
    Notice: {
        //重要等级
        Level: ['未定义', '一般', '重要', '紧急']
    },
    //邮件
    Message: {
        //重要等级
        Level: ['未定义', '普通', '紧急']
    },
    //首页相关
    Home: {
        //详情跳转页
        DetailList: {
            通知公告: {
                detailUrl: '/views/notice/noticeDetail.html',
                ChangeData: function (id) {
                    return {noticeId: id}
                }
            }, 收文: {
                detailUrl: '/views/document/documentDetail.html',
                ChangeData: function (id) {
                    return {id: id, type: 'detail', audit: true}
                }
            }, 发文: {
                detailUrl: '/views/document/dispatchDetail.html',
                ChangeData: function (id) {
                    return {id: id, type: 'detail', audit: true}
                }
            }, 短消息: {
                detailUrl: '/views/shortMsg/messageDetail.html',
                ChangeData: function (id) {
                    return {emailId: id}
                }
            }, 学校投稿: {
                detailUrl: 'news/newsDetail.html',
                ChangeData: function (id) {
                    return id
                }
            },
        }
    }
}