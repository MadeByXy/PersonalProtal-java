angular.module('app').controller('IndexController', function ($scope, factory) {
    /***
     * 搜索引擎列表
     * @type {{select: number, data: *[]}}
     */
    $scope.SearchEngineList = {
        select: 0,
        data: [{
            "name": "百度搜索",
            "value": "https://www.baidu.com/s?wd="
        }, {
            "name": "必应搜索",
            "value": "http://cn.bing.com/search?q="
        }, {
            "name": "百度地图",
            "value": "http://map.baidu.com/?newmap=1&s=s%26wd%3D"
        }, {
            "name": "高德地图",
            "value": "http://ditu.amap.com/search?query="
        }]
    };

    /***
     * 菜单列表
     * @type {*[]}
     */
    $scope.Navigation = [{
        "LinkName": "个人资料",
        "LinkUrl": "/Views/Resume.html",
        "Navigation": []
    }, {
        "LinkName": "算法验证",
        "LinkUrl": "#",
        "Navigation": [{
            "LinkName": "A*算法",
            "LinkUrl": "/Views/Algorithm/AStar.html",
            "Navigation": []
        }, {
            "LinkName": "多叉树模拟",
            "LinkUrl": "/Views/Algorithm/Tree.html",
            "Navigation": []
        }, {
            "LinkName": "AutoUI",
            "LinkUrl": "/Views/Algorithm/AutoUI.html",
            "Navigation": []
        }]
    }, {
        "LinkName": "个人工具箱",
        "LinkUrl": "#",
        "Navigation": [{
            "LinkName": "Json验证及格式化",
            "LinkUrl": "/Views/ToolsBox/Json.html",
            "Navigation": []
        }, {
            "LinkName": "在线翻译",
            "LinkUrl": "/Views/ToolsBox/Translator.html",
            "Navigation": []
        }, {
            "LinkName": "数据加密解密",
            "LinkUrl": "/Views/ToolsBox/Encryption.html",
            "Navigation": []
        }, {
            "LinkName": "正则表达式测试",
            "LinkUrl": "/Views/ToolsBox/Regexp.html",
            "Navigation": []
        }, {
            "LinkName": "HTML/CSS美化",
            "LinkUrl": "/Views/ToolsBox/CodeBeautify.html",
            "Navigation": []
        }, {
            "LinkName": "在线Api调试",
            "LinkUrl": "/Views/ToolsBox/ApiTest.html",
            "Navigation": []
        }]
    }];

    /***
     * 智能提示列表
     * @type {Array}
     */
    $scope.SuggestionItems = [];

    /***
     * 开启搜索模式
     */
    $scope.Search = function (event) {
        switch (event.keyCode) {
            case 38: //向上
                if ($scope.SuggestionItems && $scope.SuggestionItems.length != 0) {
                    $scope.SuggestionIndex--;
                    if ($scope.SuggestionIndex < 0) {
                        $scope.SuggestionIndex = $scope.SuggestionItems.length - 1;
                    }
                    $scope.searchText = $scope.SuggestionItems[$scope.SuggestionIndex];
                }
                return;
            case 40: //向下
                if ($scope.SuggestionItems && $scope.SuggestionItems.length != 0) {
                    $scope.SuggestionIndex++;
                    if ($scope.SuggestionIndex >= $scope.SuggestionItems.length) {
                        $scope.SuggestionIndex = 0;
                    }
                    $scope.searchText = $scope.SuggestionItems[$scope.SuggestionIndex];
                }
                return;
            case 13: //Enter
            case undefined:  //鼠标点击事件
                $scope.SuggestionItems = [];
                $scope.FrameLocal = $scope.SearchEngineList.data[$scope.SearchEngineList.select].value + encodeURIComponent($scope.searchText);
                localStorage.setItem("searchText", encodeURIComponent($scope.searchText));
                localStorage.setItem("engine", $scope.SearchEngineList.data[$scope.SearchEngineList.select].value);
                //location.href = '#frame';
                //location.href = '?text=' + encodeURIComponent($scope.searchText) + '&engine=' + $scope.SearchEngineList.data[$scope.SearchEngineList.select].value + '#frame';
                $scope.$broadcast('ChangeFrame');
                location.href = '#frame';
                return;
            default:
                return;
        }
    }

    /***
     * 获取智能提示列表
     */
    $scope.GetSuggestion = function () {
        factory.Query('/Index/DelegateQuery', {
                url: 'http://suggestion.baidu.com/su',
                parameters: [
                    {key: 'cb', value: 'transfer'},
                    {key: 'wd', value: encodeURIComponent($scope.searchText || '')}
                ].select(item => item.key + '=' + item.value).join('&'),
                charset: 'GBK'
            },
            function (data) {
                eval(data.object);
            }
        )
    }

    /***
     * 接收智能提示的回调
     */
    function transfer(data) {
        $scope.SuggestionIndex = 0;
        $scope.SuggestionItems = data.s;
    }

    $scope.IsNull = factory.IsNull;
})