'use strict';

fifoApp.controller('StatusCtrl', function($scope, $rootScope, $cookies, wiggle) {

    $scope.msgTrClass = function(type) {
        return type == 'critical' ? 'error': type;
    }

    $scope.show = function() {

        wiggle.cloud.get(function res (data) {
            $scope.metrics = data.metrics
            $scope.versions = data.versions
            $scope.total_memory = data.metrics['provisioned-memory'] + data.metrics['free-memory']
            $scope.messages = Config.evaluate_cloud(data.metrics).concat(data.warnings)
            $scope.adjustMessage = Config.adjustMessage

            $scope.cloud_ok = $scope.messages.filter(function(i) {
                /*Msg from the server has no ok attr, so set it. */
                i.ok = !!i.ok;
                return !i.ok;
            }).length < 1

            $scope.cloud_status = $scope.cloud_ok ? 'images/healthy-cluster.png' : 'images/unhealthy-cluster.png'
            $scope.cloud_resume = $scope.cloud_ok ? 'Your cloud is fine!'        : 'Your cloud needs some attention!'
        })

    }

    $cookies["X-Snarl-Token"] && $scope.show()

    /* Update data on memory change */
    $scope.$on('memorychange', $scope.show)

});
