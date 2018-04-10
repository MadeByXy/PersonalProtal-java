angular.module('app').controller('LayoutSettingController', function ($scope, factory) {
    $scope.$on('Init', function (event, data) {
        factory.Query('/ShortCut/GetLayout', {}, function (data) {
            $scope.Data = data.object;
        })
    })

    $scope.$on('ReadyFinish', function () {
        factory.Query('/ShortCut/SetLayout', $scope.Data, function () {
            $scope.$emit('Finish');
        })
    })
})