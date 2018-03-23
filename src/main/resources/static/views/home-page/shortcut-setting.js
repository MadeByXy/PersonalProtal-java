angular.module('app').controller('ShortCutSettingController', function ($scope) {
    $scope.$on('Init', function (event, data) {
        $scope.Data = data || {name: '', url: ''};
    })

    $scope.$on('ReadyFinish', function () {
        $scope.$emit('Finish', $scope.Data);
    })
})