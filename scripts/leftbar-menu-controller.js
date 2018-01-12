/**
 * Created by wasib & gourav on 31/12/17.
 */

dataApprovalApp.controller('LeftBarMenuController',
        function ($scope,
                $location) {
                $scope.applicationsForApproval = function () {
                        $location.path('/applications-for-approval').search();
                },
                $scope.approvedList = function () {
                        $location.path('/approved-list').search();
                },
                $scope.rejectedList = function () {
                        $location.path('/rejected-list').search();
                };
        });