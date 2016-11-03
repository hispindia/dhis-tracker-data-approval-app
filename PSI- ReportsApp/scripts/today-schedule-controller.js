/**
 * Created by hisp on 2/12/15.
 */
bidReportsApp.directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});
bidReportsApp
    .controller('TodayScheduleController', function( $rootScope,
                                            $scope,
                                            $timeout,
                                            MetadataService){

       // const SQLVIEW_TEI_PS = "nBCleImsp8E";
       // const SQLVIEW_TEI_ATTR = "NJKQr9q6kOO";

        const SQLVIEW_TEI_PS =  "abCbclBlomN";
        const SQLVIEW_TEI_ATTR = "GeoFWM61aQw";

       $timeout(function(){
            $scope.date = {};
            $scope.date.startDate = new Date();
            $scope.date.endDate = new Date();
        },0);

        //initially load tree
        selection.load();

        // Listen for OU changes
        selection.setListenerFunction(function(){
            $scope.selectedOrgUnitUid = selection.getSelected();
            loadPrograms();
        },false);

        loadPrograms = function(){
            MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function(orgUnit){
                $timeout(function(){
                    $scope.selectedOrgUnit = orgUnit;
                });
            });
        }

        $scope.updateStartDate = function(startdate){
            $scope.startdateSelected = startdate;
            //  alert("$scope.startdateSelected---"+$scope.startdateSelected);
        };

        $scope.updateEndDate = function(enddate){
            $scope.enddateSelected = enddate;
            //  alert("$scope.enddateSelected---"+ $scope.enddateSelected);
        };

        $scope.fnExcelReport = function(){

            var blob = new Blob([document.getElementById('divId').innerHTML], {
                type: 'text/plain;charset=utf-8'
            });
            saveAs(blob, "Report.xls");

        };

       $scope.generateReport = function(program){

               $scope.program = program;
               $scope.psDEs = [];
               for (var i=0;i<$scope.program.programStages.length;i++){

                   $scope.psDEs.push({dataElement : {id : "orgUnit",name : "orgUnit"}});
                   $scope.psDEs.push({dataElement : {id : "eventDate",name : "eventDate"}});

                   for (var j=0;j<$scope.program.programStages[i].programStageDataElements.length;j++){
                       $scope.psDEs.push($scope.program.programStages[i].programStageDataElements[j]);
                   }
               }

         //  var param = "var=program:"+program.id + "&var=orgunit:"+$scope.selectedOrgUnit.id+"&var=startdate:"+moment($scope.date.startDate).format("YYYY-MM-DD")+"&var=enddate:"+moment($scope.date.endDate).format("YYYY-MM-DD");
           var param = "var=program:"+program.id + "&var=orgunit:"+$scope.selectedOrgUnit.id+"&var=startdate:"+$scope.startdateSelected+"&var=enddate:"+$scope.enddateSelected;

           MetadataService.getSQLView(SQLVIEW_TEI_PS,param).then(function(stageData){
               $scope.stageData = stageData;

               MetadataService.getSQLView(SQLVIEW_TEI_ATTR,param).then(function(attrData){
                   $scope.attrData = attrData;

                   arrangeData($scope.stageData,$scope.attrData);
               })
            })
       }

        function arrangeData(stageData,attrData){

            var report = [{
                    teiuid : ""
                }]

            var teiWiseAttrMap = [];
            $scope.attrMap = [];
            $scope.teiList = [];
            $scope.eventList = [];
            $scope.maxEventPerTei = [];

            var teiPsMap = [];
            var teiPsEventMap = [];
            var teiPsEventDeMap = [];
            var teiEventMap = [];


            // For attribute
            const index_tei = 0;
            const index_attruid = 2;
            const index_attrvalue = 3;
           // const index_attrname = 4;
            const index_ouname = 4;

            // For Data values
            const index_deuid = 5;
            const index_devalue = 7;
            const index_ps = 1;
            const index_ev = 3;
            const index_evDate = 4;
            const index_ou = 8;


            for (var i=0;i<attrData.height;i++){
                var teiuid = attrData.rows[i][index_tei];
                var attruid = attrData.rows[i][index_attruid];
                var attrvalue = attrData.rows[i][index_attrvalue];
                var ouname = attrData.rows[0][index_ouname];

                if (teiWiseAttrMap[teiuid] == undefined){
                    teiWiseAttrMap[teiuid] = [];
                }
                teiWiseAttrMap[teiuid].push(attrData.rows[i]);
               // $scope.attrMap[teiuid+"-"+attruid] = ouname;
                $scope.attrMap[teiuid+"-"+attruid] = attrvalue;

            }

           // $scope.attrMap[teiuid+"-"+attruid] = ouname;

            for (key in teiWiseAttrMap){
                $scope.teiList.push({teiuid : key});
                $scope.attrMap =$scope.attrMap;
            }

            $timeout(function(){
                $scope.teiList = $scope.teiList;
            })
            $scope.teis = prepareListFromMap(teiWiseAttrMap);

            for (var i=0;i<stageData.height;i++){
                var teiuid = stageData.rows[i][index_tei];
                var psuid = stageData.rows[i][index_ps];
                var evuid = stageData.rows[i][index_ev];
                var evDate = stageData.rows[i][index_evDate];
                var deuid = stageData.rows[i][index_deuid];
                var devalue = stageData.rows[i][index_devalue];
                var ou = stageData.rows[i][index_ou];

                if (!teiPsMap[teiuid + "-" + psuid]){
                    teiPsMap[teiuid + "-" + psuid] = 0;
                }

                if (!teiPsEventMap[teiuid + "-" + psuid + "-" + evuid]){
                    teiPsEventMap[teiuid + "-" + psuid + "-" + evuid] = [];
                }

                if (!teiEventMap[teiuid]){
                    teiEventMap[teiuid] = [];
                }
                var event = {
                                evuid : evuid,
                                evDate : evDate,
                                deuid : deuid,
                                devalue : devalue,
                                ou : ou
                }

                teiEventMap[teiuid].push(event);
                teiPsMap[teiuid + "-" + psuid] = teiPsMap[teiuid + "-" + psuid]+1;
                teiPsEventMap[teiuid + "-" + psuid + "-" + evuid].push(event);
                teiPsEventDeMap[teiuid + "-" + evuid + "-" + deuid] = devalue;
            }

            for (key in teiPsMap){

                var keys = key.split("-");
                var teiuid = keys[0];
                var psuid = keys[1];

                if (!$scope.maxEventPerTei[teiuid]){
                    $scope.maxEventPerTei[teiuid] = 0
                }

                if ($scope.maxEventPerTei[teiuid] < teiPsMap[key]){
                    $scope.maxEventPerTei[teiuid] = teiPsMap[key];
                }
            }

            for (var i=0;i<$scope.teiList.length;i++){

               var teiuid = $scope.teiList[i].teiuid;
               var events = teiEventMap[teiuid];
                $scope.eventList[teiuid] = [];

                if(!events){ $scope.eventList.push({}); continue}
               for (var j=0;j<events.length;j++){
                   var dataValues = [];
                   var eventuid = events[j].evuid;
                   var org =events[j].ou;
                   var eventDate = events[j].evDate;
                   eventDate = eventDate.substring(0, 10)


                   for (var k=0;k<$scope.psDEs.length;k++){

                       var deuid = $scope.psDEs[k].dataElement.id;
                       var value = teiPsEventDeMap[teiuid + "-" +eventuid + "-" + deuid];
                            if (!value) value="";
                            if (deuid == "orgUnit"){
                                value = org;debugger
                            }else if (deuid == "eventDate"){
                                value = eventDate;debugger
                            }
                      dataValues.push(value);
                   }
                   //dataValues.push(org);

                   $scope.eventList[teiuid].push(dataValues);
               }
            }
            debugger





        }
    });