angular.module('app').controller('FrameController', function ($scope, factory) {
    $scope.Init = function () {
        if (factory.IsNull($scope.FrameLocal)) {
            //页面刷新后， 自动跳回主页
            location.href = '#home';
        }
    }
})