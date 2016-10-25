/**
 * Created by hisp on 2/12/15.
 */

var bidReportsAppServices = angular.module('bidReportsAppServices', [])
    .service('MetadataService',function(){
       return {
           getOrgUnit : function(id){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../organisationUnits/'+id+".json?fields=id,name,programs[id,name,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name],sortOrder]]]",
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           },
           getSQLView : function(sqlViewUID,param){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../sqlViews/'+sqlViewUID+"/data?"+param,
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           }
       }
    });
