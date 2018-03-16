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
dataApprovalApp.controller('AuditReportController', function ($rootScope,
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
                    if (orgUnit.programs[i].name == "Gynaecologist - PBR monitoring" || orgUnit.programs[i].name == "Anaesthetist - PBR monitoring" || orgUnit.programs[i].name == "Paediatric - PBR monitoring") {
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
            $("#tableid").empty();
            $scope.program = program;

            /*for (var i = 0; i < $scope.program.programTrackedEntityAttributes.length; i++) {
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
        })*/

        var newdata = [];
        var devent =[];
        var teiValues = [];
        var currentStatus = [];
       /* $.ajax({
            async : false,
            type: "GET",
            url: "../../trackedEntityInstances.json?ou="+$scope.selectedOrgUnit.id+"&program="+$scope.selectedProgramID+"&programStage=" + $scope.selectedPSID +"&startDate=" + $scope.startdateSelected + "&endDate=" + $scope.enddateSelected +"&skipPaging=true",
            success: function(data){		
                for(var i=0;i<data.trackedEntityInstances.length;i++)
                {
                    var ttt=data.trackedEntityInstances[i].trackedEntityInstance;
                    $.ajax({
                        async : false,
                        type: "GET",
                        url: "../../events.json?orgUnit="+$scope.selectedOrgUnit.id+"&program="+$scope.selectedProgramID+"&trackedEntityInstance="+ttt+"&programStage=" + $scope.selectedPSID+"&startDate=" + $scope.startdateSelected + "&endDate=" + $scope.enddateSelected +"&skipPaging=true",
                        success: function(data1){		
                            for(var j=0;j<data1.events.length;j++) {
                                devent.push(data1.events[j].event);  
                            }
                    }
                   });               
                }
                $.ajax({
                    async : false,
                    type: "GET",
                    url: "../../audits/trackedEntityDataValue.json?de=OZUfNtngt0T&de=CCNnr8s3rgE&skipPaging=true",
                    success: function(data2){		
                        for (var k = 0; k < data2.trackedEntityDataValueAudits.length; k++) {
                            var newevnt = data2.trackedEntityDataValueAudits[k].programStageInstance.id;
                            if (devent.indexOf(newevnt) >-1) {
                                newdata.push(data2.trackedEntityDataValueAudits[k]);
                            }
                        }
                }
               });          
        }
    });*/

    $.ajax({
        async : false,
        type: "GET",
        url: "../../audits/trackedEntityDataValue.json?de=OZUfNtngt0T&de=CCNnr8s3rgE&skipPaging=true",
        success: function(data2){
            getOrgUnit($scope.selectedOrgUnit.id);		
            for (var k = 0; k < data2.trackedEntityDataValueAudits.length; k++) {
                var newevnt = data2.trackedEntityDataValueAudits[k].programStageInstance.id;
               $.ajax({
                        async : false,
                        type: "GET",
                        url: "../../events/"+ newevnt +".json?skipPaging=true",
                        success: function(data1){
                              var evorgunit = data1.orgUnit;
                              var prgrm = data1.program;
                              var prgrmstge = data1.programStage;
                              var eventDate1 = data1.lastUpdated;
                              var eventDate2 = eventDate1.split("T");
                              var eventDate = eventDate2[0];
                              if(orgunit.indexOf(evorgunit) >-1 && prgrm == $scope.selectedProgramID && prgrmstge == $scope.selectedPSID &&
                                 eventDate >= $scope.startdateSelected && eventDate <= $scope.enddateSelected) 
                                 {
                                    for(var j=0;j<data1.dataValues.length;j++) {
                                        if(data1.dataValues[j].dataElement == 'OZUfNtngt0T')
                                        {
                                            currentStatus.push(data1.dataValues[j].value);
                                        }
                                    }
                                var tei = data1.trackedEntityInstance;
                                newdata.push(data2.trackedEntityDataValueAudits[k]);
                                $.ajax({
                                    async : false,
                                    type: "GET",
                                    url: "../../trackedEntityInstances/"+ tei +".json?&skipPaging=true",
                                    success: function(data){		
                                       // for(var i=0;i<data.trackedEntityInstances.length;i++) {
                                            for(var z=0;z<data.attributes.length;z++){
                                            if(data.attributes[z].displayName == 'Name of \"Fee for Service\" specialist')
                                              {
                                               name = data.attributes[z].value;
                                              }
                                            else if(data.attributes[z].displayName == 'Manav sampada ID(EHRMS id)')
                                              {
                                                id = data.attributes[z].value;
                                              }                                      
                                            }
                                            teiValues.push({Name : name,Id : id });
                                       // }
                                    }
                                });
                            }
                         //   }
                    }
                   }); 
            }
            console.log(teiValues);
    }
   });
    
 

            if(newdata.length==0)
            {
                var row2 = $(
                    "<tr style='text-align: left;' ><td colspan='1' style='font-size: 20px;background-color: white; height:100px ;color: black;font-weight: bold '>No Data Found</td></tr>");
                $("#tableid").append(row2);
    
            }
            else {
                //console.log(newdata.length);
                var rowm = $(
                  //  "<thead>//<tr style='border:1px solid black'><td COLSPAN='2' style='background-color: #8fadc1;height:30px  ;color: #1B4F72;text-align: left; '><font style='font-size: 15px'>Event Date:</font> " +event1.dataset.eventDate.substring(0,10)  // "</td>" +
                   // "<td COLSPAN='1' style='background-color: #8fadc1;height:30px ;color: #1B4F72;text-align: left; '><font style='font-size: 15px'>Data Set :</font>" + prog.dataset.name + "</td>" +
                  //  "<td COLSPAN='1' style='background-color: #8fadc1;height:30px ;color: #1B4F72;text-align: left; '><font style='font-size: 15px'>Track Entity Name :</font>" +entity.dataset.value  + "</td>" +
                   // "<td COLSPAN='1' style='background-color: #8fadc1;height:30px  ;color: #1B4F72;text-align: left; '><font style='font-size: 15px'>Org Unit :</font> " + orgUnit.name + "</td></tr>" +
                 //   "<tr><td COLSPAN='5' style='border:1px solid black;background-color: #1B4F72;height:30px  ;color: white;text-align: center;font-weight: bold ' >Data Set Audit Report" + "</td></tr>" +
                    "<tr><th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold;position: relative;' >Name of Fee for Service specialist" + "&nbsp;&nbsp;&nbsp;<span style='color: #1B4F72;margin-top: -15px;text-align: right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold;position: relative;' >Manav sampada ID" + "&nbsp;&nbsp;&nbsp;<span style='color: #1B4F72;margin-top: -15px;text-align: right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold;position: relative;' >Updated" + "&nbsp;&nbsp;&nbsp;<span style='color: #1B4F72;margin-top: -15px;text-align: right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold ' >Modified By" + "&nbsp;&nbsp;&nbsp;<span  style='color: #1B4F72;margin-top: -15px;text-align:right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold ' >Audit Type" + "&nbsp;&nbsp;&nbsp;<span style='color:  #1B4F72;margin-top: -15px;text-align:right ;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold ' >Value" + "&nbsp;&nbsp;&nbsp;<span style='color:  #1B4F72;margin-top: -15px;text-align:right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold ' >Data Element" + "&nbsp;&nbsp;&nbsp;<span style='color:  #1B4F72;margin-top: -15px;text-align:right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "<th colspan='1' style='border:1px solid black;background-color: #aeb0b0;height:30px   ;color: white;text-align: center;font-weight: bold ' >Current Status" + "&nbsp;&nbsp;&nbsp;<span style='color:  #1B4F72;margin-top: -15px;text-align:right;text-decoration: none;font-weight: normal;'></span></th>" +
                    "</tr>"
                );
                $("#tableid").append(rowm);
    
                var rown = $(
                    "<tbody>");
                $("#tableid").append(rown);
    
    
                for (var j = 0; j < newdata.length; j++) {
                  //  for(var y = 0;y<teiValues.length; y++){
                    var elemntname = newdata[j].dataElement.id;
                    var Delemnt = getDataElement(elemntname);
    
                    var rowf = $(
                        "<tr><td  style='border:1px solid black;'> " + teiValues[j].Name +
                        "</td><td  style='border:1px solid black;'> " + teiValues[j].Id +//
                        "</td><td  style='border:1px solid black;'> " + newdata[j].created +//
                        "</td><td  style='border:1px solid black;'> " + newdata[j].modifiedBy +//
                        "</td><td  style='border:1px solid black;'>" + newdata[j].auditType +//////
                        "</td><td  style='border:1px solid black;'>" + newdata[j].value +
                        "</td><td  style='border:1px solid black;'>" + Delemnt +
                        "</td><td  style='border:1px solid black;'>" + currentStatus[j] +
                        "</td></tr>");
                    $("#tableid").append(rowf);
              //  }
            }
            }
            var rown1 = $(
                "</tbody>");
            $("#tableid").append(rown1);
            /*$(document).ready(function()
                {
                    $(".tablesorter").tablesorter();
                }
            );*/
        })      
        $scope.show = true;
    };

    getDataElement=function (value) {
        var matched = [];
        $.ajax({
            async : false,
            type: "GET",
            url: "../../dataElements/"+ value +".json?fields=name,id&paging=false",
            success: function(data){	
            var daelemt=data.name;
            matched.push(daelemt);	
            }   
          });
        return matched;
    }

    var orgunit= [];
    getOrgUnit = function (ou){
        $.ajax({
            async : false,
            type: "GET",
            url: "../../organisationUnits/"+ ou + ".json?includeDescendants=true&fields=id,name&paging=false",
            success: function(data4){
                for(var q=0;q< data4.organisationUnits.length;q++){
                    orgunit.push(data4.organisationUnits[q].id);
                }	
            }
        });
        return orgunit
    }
    
     $scope.exportExcel = function() {
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('tableid');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');
        a.href = data_type + ', ' + table_html;
        a.download = 'Audit Report.xls';
        a.click();
    }

    function showLoad() {// alert( "inside showload method 1" );
        setTimeout(function () {
        }, 1000);

        //     alert( "inside showload method 2" );
    }
    function hideLoad() {

    }

});