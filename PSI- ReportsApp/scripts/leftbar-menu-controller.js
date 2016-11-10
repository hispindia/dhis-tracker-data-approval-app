//Controller for column show/hide
trackerReportsApp.controller('LeftBarMenuController',
        function($scope,
                $location) {
    $scope.showTodaySchedule = function(){
        $location.path('/schedule-today').search();
    }; 
    

});