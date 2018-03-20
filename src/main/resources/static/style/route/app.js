//路由配置
app.config(function ($stateProvider, $urlRouterProvider) {
    //路由配置表
    var loadMap = [
        {url: '/home', templateUrl: '/views/home-page/home.html'},  //首页
        {url: '/frame', templateUrl: '/views/home-page/frame.html'},  //嵌入框架
    ]

    $.each(loadMap, function (index, item) {
        $stateProvider.state(item.url, {
            url: item.url,
            templateUrl: item.templateUrl,
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: item.files || [
                                item.templateUrl.replace('.html', '.js')
                            ],
                            serie: true
                        }
                    ]);
                }
            }
        })
    })

    //默认页面
    $urlRouterProvider.otherwise("/home");
});

//跨域白名单配置
app.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://www.baidu.com/**',
        'http://cn.bing.com/**',
        'http://map.baidu.com/**',
        'http://ditu.amap.com/**']);
});
