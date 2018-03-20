angular.module('app').controller('FrameController', function ($scope, factory) {
    $scope.Init = function () {
        if (factory.IsNull($scope.FrameLocal)) {
            //页面刷新后， 自动跳回主页
            location.href = '#home';
        }
    }
    /***
     * 修正框架高度为满屏
     */
    $scope.FixHeight = function () {
        return window.innerHeight - 72;
    }
})