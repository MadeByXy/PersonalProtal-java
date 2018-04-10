angular.module('app').controller('HomeController', function ($scope, factory) {
    $scope.Init = function () {
        $scope.GetWeather();
        $scope.GetShortCut();
    }

    /***
     * 获取天气信息
     */
    $scope.GetWeather = function () {
        factory.Query('https://free-api.heweather.com/v5/weather',
            {key: 'b8572b0c0502416996c8bbe7613233e9', city: factory.City},
            function (data) {
                data = data.HeWeather5[0];
                $scope.WeatherInfo = {
                    //当前所在城市
                    city: factory.City,
                    //当前时间
                    time: '{0} {1}'.format(Enum.Week[new Date().getDay()], new Date().format('M月dd日')),
                    //实时气温
                    currentTemp: data.now.tmp,
                    //当前风力
                    wind: '{0} {1}{2}'.format(data.now.wind.dir, data.now.wind.sc, (/[0-9]/g.test(data.now.wind.sc) ? '级' : '')),
                    //当前天气
                    weather: data.now.cond.txt,
                    //当前天气(图标)
                    weatherIcon: '/style/images/weather/{0}.png'.format(data.now.cond.code),
                    //本日温度
                    temperature: '{0}~{1}℃'.format(data.daily_forecast[0].tmp.min, data.daily_forecast[0].tmp.max)
                }
            })
    }

    /***
     * 获取快捷方式信息
     */
    $scope.GetShortCut = function () {
        factory.Query('/ShortCut/Get', {}, function (data) {
            $scope.LayoutList = [];

            $scope.ShortCutData = data.array;
        })
    }

    $scope.GetShortCutData = function (width, height) {
        var data = ($scope.ShortCutData || []).first(item => item.width == width && item.height == height) || {
            width: width,
            height: height
        };
    }

    /***
     * 新增/修改快捷方式
     * @param data 菜单数据
     */
    $scope.OpenEdit = function (data) {
        factory.OpenDialog('/views/home-page/shortcut-setting.html', '快捷方式设置', [
            {
                text: '保存', action: function (data) {
                    factory.Query('/ShortCut/Set', data, function () {
                        factory.Hint('设置成功');

                        //刷新列表
                        $scope.GetShortCut();
                    })
                    return true;
                }, dataCheck: [
                    {key: 'name', name: '网站名称', allowTypes: [Enum.AllowType.NonEmpty]},
                    {key: 'url', name: '网站地址', allowTypes: [Enum.AllowType.NonEmpty]}]
            }, {text: '关闭'}
        ], 500, factory.Clone(data));
    }

    /***
     * 删除快捷方式
     * @param data 菜单数据
     */
    $scope.Delete = function (data) {
        factory.Query('/ShortCut/Set', {
            id: data.id,
            name: '',
            url: '',
            width: data.width,
            height: data.height
        }, function () {
            factory.Hint('刪除成功');

            //刷新列表
            $scope.GetShortCut();
        })
    }

    $scope.Open = function (data) {
        window.open(data.url, '_blank');
    }

    $scope.Move = function (data) {
        console.log(data);
    }

    $scope.Range = function (num) {
        return new Array(num);
    }

    $scope.GetNumber = function (text) {
        return (text || '').split('').sum(item => item.charCodeAt());
    }

    $scope.IsNull = factory.IsNull;
    $scope.ColorLibrary = Enum.ColorLibrary;

    /***
     * 感谢名单列表
     * @type {*[]}
     */
    $scope.ThanksList = [
        {"Name": "Bootstrap", "Url": "https://github.com/twbs/bootstrap"},
        {"Name": "AngularJS", "Url": "https://github.com/angular/angular.js"},
        {
            "Name": "Developer",
            "Url": "http://themes.3rdwavemedia.com/website-templates/free-responsive-website-template-for-developers"
        },
        {"Name": "js-beautify", "Url": "https://github.com/beautify-web/js-beautify"},
        {"Name": "CodeMirror", "Url": "https://github.com/codemirror/codemirror"},
        {"Name": "particles.js", "Url": "https://github.com/VincentGarreau/particles.js"},
        {"Name": "bootstrap-contextmenu", "Url": "https://github.com/sydcanem/bootstrap-contextmenu"}
    ];
})