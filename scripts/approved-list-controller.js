/**
 * Created by wasib & gourav on 11/01/18.
 */
dataApprovalApp.directive('calendar', function () {
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
dataApprovalApp.controller('ApprovedListController', function ($rootScope,
    $scope,
    $timeout,
    MetadataService) {

    $scope.programStages = [];

    jQuery(document).ready(function () {
        hideLoad();
    })
    $timeout(function () {
        $scope.date = {};
        $scope.date.startDate = new Date();
        $scope.date.endDate = new Date();
    }, 0);

    //initially load tree
    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        $scope.selectedOrgUnitUid = selection.getSelected();
        loadPrograms();
    }, false);

    loadPrograms = function () {
        MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function (orgUnit) {
            $timeout(function () {
                $scope.selectedOrgUnit = orgUnit;
                $scope.allPrograms = orgUnit.programs;
                $scope.programs = [];
                $scope.programStages = [];
                for (var i = 0; i < orgUnit.programs.length; i++) {
                    if (orgUnit.programs[i].withoutRegistration == false) {
                        $scope.programs.push(orgUnit.programs[i]);
                    }
                }
            });
        });
    }
    $scope.getProgramStages = function (progId) {
        $scope.selectedProgramID = progId.id;
        var url1 = "../../programs/" + progId.id + ".json?fields=id,name,withoutRegistration,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[options[code,displayName]],sortOrder]]]&paging=false";
        $.get(url1, function (data1) {
            $timeout(function () {
                $scope.programStages = [];
                for (var j = 0; j < data1.programStages.length; j++) {
                    $scope.programStages.push(data1.programStages[j]);
                }
            });
        });
    }
    $scope.getSelectedProgramStage = function (selectedProgramStage) {
        if (selectedProgramStage != null) {
            $scope.selectedPSName = [];
            $scope.selectedPSName.push(selectedProgramStage);
            $scope.selectedPSID = $scope.selectedPSName[0].id;
        }
    }

    $scope.updateStartDate = function (startdate) {
        $scope.startdateSelected = startdate;
        //  alert("$scope.startdateSelected---"+$scope.startdateSelected);
    };

    $scope.updateEndDate = function (enddate) {
        $scope.enddateSelected = enddate;
        //  alert("$scope.enddateSelected---"+ $scope.enddateSelected);
    };

    $scope.fnExcelReport = function () {

        //   var blob = new Blob([document.getElementById('divId').innerHTML], {
        //        type: 'text/plain;charset=utf-8'
        //      });
        //        saveAs(blob, "Report.xls");
        $("#divId").tableExport({
            formats: ["xlsx", "xls"],
            filename: "Report"
        });
    };

    $scope.exportData = function (program) {
        //   exportData($scope.date.startDate,$scope.date.endDate,program,$scope.selectedOrgUnit);
        exportData($scope.startdateSelected, $scope.enddateSelected, program, $scope.selectedOrgUnit);

    }

    $scope.generateReport = function (program) {
        $timeout(function () {
            $scope.program = program;

            for (var i = 0; i < $scope.program.programTrackedEntityAttributes.length; i++) {
                var str = $scope.program.programTrackedEntityAttributes[i].displayName;
                var n = str.lastIndexOf('-');
                $scope.program.programTrackedEntityAttributes[i].displayName = str.substring(n + 1);

            }
            $scope.psDEs = [];
            $scope.Options = [];
            $scope.attribute = "Attributes";
            $scope.attributeValues = ['', '', ''];
            $scope.numberOfEvents = [];
            $scope.attribute1 = "Name of \"Fee for Service\" specialist";
            $scope.attribute2 = "Manav sampada ID(EHRMS id)";
            $scope.attribute3 = "Contact number";
            $scope.approved_reject = "Approved/Rejected";
            $scope.enrollment = "Enrollment date";
            var options = [];
            $scope.eventDataValues = [];
            $scope.valuesToDisplay = [];
            $scope.Events = [];
            $scope.selectedPS = $scope.selectedPSName;
            var index = 0;
            for (var i = 0; i < $scope.selectedPS.length; i++) {

                var psuid = $scope.selectedPS[i].id;
                $scope.psDEs.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                $scope.psDEs.push({ dataElement: { id: "eventDate", name: "eventDate", ps: psuid } });

                for (var j = 0; j < $scope.selectedPS[i].programStageDataElements.length; j++) {

                    $scope.selectedPS[i].programStageDataElements[j].dataElement.ps = psuid;
                    var de = $scope.selectedPS[i].programStageDataElements[j];
                    $scope.psDEs.push(de);

                    // if ($scope.selectedPS[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                    //     if ($scope.selectedPS[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                    //         for (var k = 0; k < $scope.selectedPS[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                    //             index = index + 1; // $scope.Options.push($scope.selectedPS[i].programStageDataElements[j]);
                    //             var code = $scope.selectedPS[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                    //             var name = $scope.selectedPS[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                    //             options.push({ code: code, name: name });
                    //             $scope.Options[$scope.selectedPS[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                    //         }
                    //     }
                    // }
                }
            }

            $.ajax({
                async: false,
                type: "GET",
                url: "../../events.json?ou=" + $scope.selectedOrgUnit.id + "&ouMode=DESCENDANTS&program=" + $scope.selectedProgramID + "&programStage=" + $scope.selectedPSID + "&startDate=" + $scope.startdateSelected + "&endDate=" + $scope.enddateSelected + "&skipPaging=true",
                success: function (response) {
                    $scope.existingEvents = [];
                    $scope.numberOfEvents.push(response.events.length);

                    for (var j = 0; j < response.events.length; j++) {
                        $scope.tei = response.events[j].trackedEntityInstance;
                        $scope.eventId = response.events[j].event;
                        $scope.eventDV = response.events[j].dataValues;
                        $scope.eventOrgUnit = response.events[j].orgUnitName;
                        for (var a = 0; a < $scope.eventDV.length; a++) {
                            if ($scope.eventDV[a].value == 'Approved' || $scope.eventDV[a].value == 'Auto-Approved') {

                                if ($scope.eventDV[a].value == 'Approved') {
                                    $scope.colorName = "rgb(106, 199, 106)";
                                }
                                else if ($scope.eventDV[a].value == 'Auto-Approved') {
                                    $scope.colorName = "#f1ee9f";
                                }
                                // else if ($scope.eventDV[a].value == 'Rejected') {
                                //     $scope.colorName = "rgba(210, 85, 85, 0.85)";
                                // }

                                if (response.events[j].eventDate) {
                                    $scope.event_Date1 = response.events[j].eventDate;
                                    $scope.event_Date = $scope.event_Date1.split("T")[0];
                                }

                                if ($scope.eventDV.length != 0) {
                                    for (var z = 2; z < $scope.psDEs.length; z++) {
                                        $scope.eventDataValues.push(eventLoop($scope.psDEs[z].dataElement.id));
                                    }
                                }
                                else {
                                    for (var z = 2; z < $scope.psDEs.length; z++) {
                                        $scope.eventDataValues.push("");
                                    }
                                }

                                function eventLoop(idHeader) {
                                    var event_Values = '';
                                    for (var y = 0; y < $scope.eventDV.length; y++) {
                                        if (idHeader == $scope.eventDV[y].dataElement) {
                                            event_Values = $scope.eventDV[y].value;
                                        }

                                    }
                                    return event_Values;
                                }

                                $.ajax({
                                    async: false,
                                    type: "GET",
                                    url: "../../trackedEntityInstances/" + $scope.tei + ".json?fields=trackedEntityInstance,orgUnit,created,attributes[attribute,displayName,value]&ou=" + $scope.selectedOrgUnit.id + "&ouMode=DESCENDANTSprogram=" + $scope.selectedProgramID + "&programStage=" + $scope.selectedPSID + "&startDate=" + $scope.startdateSelected + "&endDate=" + $scope.enddateSelected + "&skipPaging=true",
                                    success: function (response1) {
                                        $scope.enrollmentDate1 = response1.created;
                                        $scope.enrollmentDate = $scope.enrollmentDate1.split(" ")[0];
                                        for (var k = 0; k < response1.attributes.length; k++) {
                                            if (response1.attributes[k].displayName == 'Name of "Fee for Service" specialist') {
                                                $scope.attributeValues[0] = response1.attributes[k].value;
                                            }
                                            if (response1.attributes[k].displayName == 'Manav sampada ID(EHRMS id)') {
                                                $scope.attributeValues[1] = response1.attributes[k].value;
                                            }
                                            if (response1.attributes[k].displayName == 'Contact number') {
                                                $scope.attributeValues[2] = response1.attributes[k].value;
                                            }
                                        }
                                    }
                                })

                                var displayingValues = {
                                    currentProgram: $scope.program,
                                    enrollmentDate: $scope.enrollmentDate,
                                    attributeValues0: $scope.attributeValues[0],
                                    attributeValues1: $scope.attributeValues[1],
                                    attributeValues2: $scope.attributeValues[2],
                                    eventOrgUnitName: $scope.eventOrgUnit,
                                    eventDate: $scope.event_Date,
                                    allEventDataValues: $scope.eventDataValues,
                                    eventId: $scope.eventId,
                                    color: $scope.colorName
                                }
                                $scope.valuesToDisplay.push(displayingValues);
                                console.log($scope.valuesToDisplay);
                                $scope.enrollmentDate = '';
                                $scope.program = '';
                                $scope.attributeValues[0] = '';
                                $scope.attributeValues[1] = '';
                                $scope.attributeValues[2] = '';
                                $scope.eventOrgUnit = '';
                                $scope.event_Date = '';
                                $scope.eventDataValues = [];
                                $scope.eventId = '';
                                $scope.colorName = '';

                            }
                        }
                    }
                }
            })
        })
    }

    function showLoad() {// alert( "inside showload method 1" );
        setTimeout(function () {
        }, 1000);

        //     alert( "inside showload method 2" );
    }
    function hideLoad() {

    }

});