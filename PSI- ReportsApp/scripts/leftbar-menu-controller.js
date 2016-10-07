//Controller for column show/hide
psiReportsApp.controller('LeftBarMenuController',
        function($scope,
                $location) {
    $scope.showTodaySchedule = function(){
        $location.path('/schedule-today').search();
    }; 
    

});