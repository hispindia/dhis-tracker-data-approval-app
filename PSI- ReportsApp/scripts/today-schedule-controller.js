/**
 * Created by Priyanka on 4/10/16.
 */

psiReportsApp.directive('calendar', function () {
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

psiReportsApp.controller('TodayScheduleController', function( $rootScope,
                                            $scope,$window,
                                            $timeout, $http,
                                            MetadataService){
    $scope.basicUrl = "../api/sqlViews/";
    $scope.programSelected ="";
    $scope.startdateSelected ="";
    $scope.enddateSelected ="";
        //initially load tree
        selection.load();


        // Listen for OU changes
        selection.setListenerFunction(function(){
            $scope.selectedOrgUnitUid = selection.getSelected();
            $scope.orgunit1=$scope.selectedOrgUnitUid[0];
			$scope.selecteddatasetperiod=[];
            $scope.period=[];
            $scope.selecteddatasetperiodwithcount=[];
            $scope.selecteddataelementnamewithid={};
            $scope.optionset;
            $scope.datavaluefromapi=[];

            $scope.selecteddataelementnameid=[];
            $scope.selecteddataelementnameid2014=[];
            $scope.promises1=[];
            $scope.parama=[];
            $scope.sectiondataelementslist;

            var d = new Date();
            var n = d.getFullYear()-1;
            $scope.currentyear = (n).toString() ;
            $scope.k=0;
            $scope.datasetid;

            $scope.datasection;
            $scope.dataelementslist;


            loadPrograms();
            allPSIPrograms();
        },false);
        loadPrograms = function(){
            MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function(orgUnit){
                $timeout(function(){
                    $scope.selectedOrgUnit = orgUnit;
                });
            })
		};
        $scope.get=function(datasection) {
            $scope.sectionaldataelementslist;
            $scope.datasection=datasection;
            MetadataService.getsection($scope.datasection.id).then(function (dataelement) {
                $timeout(function(){
                    $scope.sectionaldataelementslist   = dataelement;

                    $scope.generateForm($scope.datasetid,$scope.selectedperiod, $scope.selectedSource);
                  //  $scope.dataelementslist = dataelement.clone();
                    //var arr2 = arr1.clone()
                });

            });

        };

		$scope.dummy=function(datasetid) {
            $scope.datasetid=datasetid.id;
            $scope.selecteddatasetperiod.length=0;
            for( var i =0; i<5;i++){
                $scope.selecteddatasetperiod.push(($scope.currentyear-i).toString());
            }

                $scope.sections($scope.currentyear);

        };
		$scope.getReport = function() {
         /*  MetadataService.getsqlview().then(function(){
                $timeout(function(){
                 //   $scope.programList = pro.programs;

                });

            })*/

       //     var modal = document.getElementById('modal');
        //    modal.style.display = "block";
            $window.open('../../sqlViews/DxH7T8l7PdY/data.xls', '_blank');
		};


        $scope.updateProgram = function(selectedProgram) {
            $scope.programSelected = selectedProgram.id;

            //alert("selected program--"+$scope.programSelected);
        };

    $scope.updateStartDate = function(startdate){
        $scope.startdateSelected = startdate;
      //  alert("$scope.startdateSelected---"+$scope.startdateSelected);
    };

    $scope.updateEndDate = function(enddate){
        $scope.enddateSelected = enddate;
      //  alert("$scope.enddateSelected---"+ $scope.enddateSelected);
    };

        $scope.generateForm = function(selectedDataset,selectedPeriod,selectedSource) {
            $scope.selectdataelementall=[];
            $scope.selectdatavaluetall=[];
            $scope.selecteddataelement1=[];
            $scope.selectedperiod=selectedPeriod;
            $scope.selectedSource=  selectedSource
            $scope.count =0;
            var promiseQueue = [];
            while($scope.count<5) {
                promiseQueue.push($scope.generateForm1(selectedDataset, (selectedPeriod - $scope.count).toString(),selectedSource));
                $scope.count=$scope.count+1;
            }

            $.when.apply($, promiseQueue) // happens now
                .then(function () {
                    $scope.selecteddatasetperiod[j];
                  /*  for(var m=0;m<$scope.selecteddatasetperiod.length;m++) {
                        $scope.selecteddatasetperiod[m];
                        $scope.selecteddatasetperiodwithcount['year']=$scope.selecteddatasetperiod[m];
                        $scope.selecteddatasetperiodwithcount['count']=m;
                    }*/

                        for(var count=4;count>=0;count--) {
                            for(var m=0;m<5;m++) {
                                var index=$scope.selecteddatasetperiod.indexOf($scope.selectdataelementall[m][0].period);
                                if(count==index){
                                    $scope.selectdatavaluetall.push($scope.selectdataelementall[m]);
                                }
                            }
                        }
                    for(var i=0;i< $scope.selecteddataelementnameid.length;++i) {
                        $scope.selecteddataelement=[];
                        for(var j=0;j<5;j++){
                            var index=4-$scope.selecteddatasetperiod.indexOf($scope.selectdatavaluetall[j][i].period);
                            $scope.selecteddataelement.splice(index, 0, $scope.selectdatavaluetall[j][i]);
                        }

                        $scope.selecteddataelement1.push($scope.selecteddataelement);
                        $scope.count=0;
                    }
                    $scope.$apply();
                }, function (e) {
                    console.log("promise queue error : "+e);
            });
        }

        $scope.generateForm1=function(selectedDataset,selectedPeriod,selectedSource) {
            var def = $.Deferred();
            if($scope.sectionaldataelementslist!=undefined){
                $scope.dataelementslist   = Object.assign({}, $scope.sectionaldataelementslist);
            }

                MetadataService.getdatavalueset($scope.datasetid, selectedPeriod, $scope.selectedOrgUnitUid).then(function (orgUnit) {
                    $scope.selecteddataelementnameid = [];
                    $scope.selecteddataelementnameid2014.length = 0;
                    for (var j = 0, lent = $scope.dataelementslist.dataElements.length; j < lent; j++) {
                        $scope.selecteddataelementnamewithid = {};
                        if (orgUnit.dataValues != undefined) {
                            for (var i = 0, len = orgUnit.dataValues.length; i < len; i++) {
                                if ((orgUnit.dataValues[i].dataElement === $scope.dataelementslist.dataElements[j].id) && ((orgUnit.dataValues[i].attributeOptionCombo == selectedSource.id))) {
                                    $scope.selecteddataelementnamewithid['name'] = $scope.dataelementslist.dataElements[j].name;
                                    $scope.selecteddataelementnamewithid['id'] = $scope.dataelementslist.dataElements[j].id;
                                    $scope.selecteddataelementnamewithid['value'] = orgUnit.dataValues[i].value;
                                    $scope.selecteddataelementnamewithid['period'] = orgUnit.dataValues[i].period;
                                    $scope.selecteddataelementnamewithid['TD'] = $scope.dataelementslist.dataElements[j].id+orgUnit.dataValues[i].period;
                                    break;
                                }
                                else if (i == len - 1) {
                                    $scope.selecteddataelementnamewithid['name'] = $scope.dataelementslist.dataElements[j].name;
                                    $scope.selecteddataelementnamewithid['id'] = $scope.dataelementslist.dataElements[j].id;
                                    $scope.selecteddataelementnamewithid['value'] = "";
                                    $scope.selecteddataelementnamewithid['period'] = orgUnit.dataValues[i].period;
                                    $scope.selecteddataelementnamewithid['TD'] = $scope.dataelementslist.dataElements[j].id+orgUnit.dataValues[i].period;
                                }

                            }

                        }
                        else {
                            $scope.selecteddataelementnamewithid['name'] = $scope.dataelementslist.dataElements[j].name;
                            $scope.selecteddataelementnamewithid['id'] = $scope.dataelementslist.dataElements[j].id;
                            $scope.selecteddataelementnamewithid['value'] = "";
                            $scope.selecteddataelementnamewithid['period'] = orgUnit.period;
                            $scope.selecteddataelementnamewithid['TD'] = $scope.dataelementslist.dataElements[j].id+orgUnit.period;
                        }
                        $scope.selecteddataelementnameid.push($scope.selecteddataelementnamewithid);
                    }
                    $scope.selectdataelementall.push($scope.selecteddataelementnameid);

                    def.resolve();
                });
            return def.promise();
        }

		$scope.sections=function(selectedPeriod)
		{$scope.sectionoption;
            $scope.selecteddatasetperiod.length=0;
            for( var i =0; i<5;i++){
                $scope.selecteddatasetperiod.push((selectedPeriod-i).toString());}

			    MetadataService.getdataSets($scope.datasetid).then(function(dataelements){
                    $timeout(function(){
                        $scope.sectionoption=dataelements;
                        $scope.dataelementslist = dataelements;

                    });
                    MetadataService.getcategorycombooption($scope.datasetid).then(function(source){
                        $timeout(function(){
                            $scope.optionset = source.categoryCombo;
                        });
                    })
            })
		}
     allPSIPrograms=function()
        {
            MetadataService.getprograms().then(function(pro){
                $timeout(function(){
                    $scope.programList = pro.programs;

                });

            })
        };


            $scope.change1=function(example,dataElements,dataElementsname,year,selectedSource,TDid) {
                MetadataService.putdatavaluesetfor($scope.orgunit1, $scope.datasetid, dataElements, year, example, selectedSource.id).then(function(source){
                    mainContent = document.getElementById(TDid);
                    if(source.importCount.ignored==1) {
                    mainContent.style.backgroundColor = 'rgb(255, 254, 140)';
                        mainContent.value=$scope.oldvalue;

                    }
                    if(source.importCount.updated==1) {
                        mainContent.style.backgroundColor = 'rgb(255, 138, 138)';}
                    if(source.importCount.imported==1) {

                    mainContent.style.backgroundColor = 'rgb(185, 255, 185)';}
                });
            }

        $scope.setoldvalue=function(oldvalue)
        {
            $scope.oldvalue=oldvalue;
        }
         // MetadataService.putdatavaluesetfor($scope.orgunit1,$scope.datasetid,dataElements,year,example,selectedSource.id);




    });
