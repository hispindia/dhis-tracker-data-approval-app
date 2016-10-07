/**
 * Created by hisp on 2/12/15.
 */

var psiReportsAppServices = angular.module('psiReportsAppServices', [])
    .service('MetadataService',function($http){
       return {
           getOrgUnit : function(id){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../organisationUnits/'+id+".json",
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           },
		         getdataSets : function(id){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../dataSets/'+id+".json",
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           }
		   ,

            getprograms : function(){
                var def = $.Deferred();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    url: '../../programs.json',
                    success: function (data) {
                        def.resolve(data);
                    }
                });
                return def;

            },
           getsqlview :  function(){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../sqlViews/DxH7T8l7PdY/data.xls',
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;

           },

           getsection : function(id1){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../sections/'+id1+".json",
                   success: function (data) {
                       def.resolve(data);
                   },timeout: 2000000
               }).fail(function (xhr, status) {
                   if (status == "timeout") {
                       def.reject(status)
                   }
               });
               return def;
           }

           ,



        getdatavalueset : function(id1,id2,id3){
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: '../../dataValueSets.json?dataSet='+id1+"&period="+id2+"&orgUnit="+id3,
                success: function (data) {
                    def.resolve(data);
                },timeout: 2000000
            }).fail(function (xhr, status) {
                if (status == "timeout") {
                    def.reject(status)
                }
            });
            return def;
        }

           ,


           putdatavaluesetfor: function(id0,id1,id2,id3,id4,id5) {
               var def = $.Deferred();

          /*     var dataObj = {
                   dataSet: id1,
                   period: id3,
                   orgUnit: id0,

                   dataValues: [
                       {"dataElement": id2, "value": id4}

                   ]
               };
               var res = $http.post('../../dataValueSets.json?', dataObj);
               res.success(function (data, status, headers, config) {
                   $scope.message = data;
               });
               res.error(function (data, status, headers, config) {
                   alert("failure message: " + JSON.stringify({data: data}));
               });
*/
               var dataObj = {

             dataSet: id1,
                   period: id3,
                   orgUnit: id0,
                   "attributeOptionCombo": id5,
                   dataValues: [
                       { "dataElement": id2, "value": id4}
                   ]
               };

                $.ajax({
                type: "POST",
                dataType: "json",
                async: true,
                    data    : JSON.stringify(dataObj),
                contentType: "application/json",
                url: '../../dataValueSets.json?',

               success: function (data) {
                   def.resolve(data);



             /*     if(data.importCount.ignored==1) {
                      tempalert("enter correct data", 500);
                      function tempalert(msg, duration) {
                          var el = document.createElement("div");
                          el.setAttribute("style", "position:absolute;top:40%;left:60%;background-color:red;");
                          el.innerHTML = msg;
                          setTimeout(function () {
                              el.parentNode.removeChild(el);
                          }, duration);
                          document.body.appendChild(el);
                      }
                  }*/

                /*    else if(data.importCount.updated==1){
                      tempalert("saved", 500);
                      function tempalert(msg, duration) {
                          var el = document.createElement("div");
                          el.setAttribute("style", "position:absolute;top:40%;left:60%;background-color:green;");
                          el.innerHTML = msg;
                          setTimeout(function () {
                              el.parentNode.removeChild(el);
                          }, duration);
                          document.body.appendChild(el);
                      }
                  }*/

                },
                error: function (data) {
                    def.resolve(data);
               alert("PLEASE  ENTER VALUE IN CORRECT FORMAT");

                }
                });
               return def;

                },



           getcategorycombooption : function(id1){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../dataSets/' + id1 + '.json?fields=periodType,categoryCombo[id,name,categoryOptionCombos[id,name]]',
                   success: function (data) {
                       def.resolve(data);
                   },timeout: 2000000
               }).fail(function (xhr, status) {
                   if (status == "timeout") {
                       def.reject(status)
                   }
               });
               return def;
           }

           ,

       }



    });
	

  