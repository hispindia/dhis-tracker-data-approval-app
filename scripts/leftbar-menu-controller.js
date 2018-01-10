/**
 * Created by wasib & gourav on 31/12/17.
 */

dataApprovalApp.controller('LeftBarMenuController',
        function ($scope,
                $location) {
                $scope.showTodaySchedule = function () {
                        $location.path('/schedule-today').search();
                };
        });