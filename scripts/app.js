/**
 * Created by wasib & gourav on 31/12/17.
 */

var dataApprovalApp = angular.module('dataApprovalApp',['ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'd2HeaderBar',
    'd2Directives',
    'd2Filters',
    'd2Services',
    'pascalprecht.translate',
    'trackerReportsAppServices'
])

.config(function($routeProvider,$translateProvider){
        $routeProvider.when('/', {
            templateUrl:'views/home.html',
            controller: 'homeController'
        }).when('/applications-for-approval', {
            templateUrl:'views/applications-for-approval.html',
            controller: 'ApplicationsForApprovalController'

        }).when('/approved-list', {
            templateUrl:'views/approved-list.html',
            controller: 'ApprovedListController'

        }).when('/audit-report', {
            templateUrl:'views/audit-report.html',
            controller: 'AuditReportController'

        }).when('/rejected-list', {
            templateUrl:'views/rejected-list.html',
            controller: 'RejectedListController'

        }).otherwise({
            redirectTo : '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');

        initSQLView();

});

function initSQLView() {

    SQLViewsName2IdMap = [];
    getAllSQLViews().then(function(sqlViews){
        var requiredViews = [];
        requiredViews[SQLQUERY_TEI_ATTR_NAME] = false;
        requiredViews[SQLQUERY_EVENT_NAME] = false;
        requiredViews[SQLQUERY_TEI_DATA_VALUE_NAME] = false;

        for (var i=0;i<sqlViews.length;i++){
            SQLViewsName2IdMap[sqlViews[i].name] = sqlViews[i].id;

            if (sqlViews[i].name == SQLQUERY_TEI_ATTR_NAME){
                delete requiredViews[SQLQUERY_TEI_ATTR_NAME];
            }
            else if (sqlViews[i].name == SQLQUERY_TEI_DATA_VALUE_NAME){
               delete requiredViews[SQLQUERY_TEI_DATA_VALUE_NAME];
            }
            else if (sqlViews[i].name == SQLQUERY_EVENT_NAME){
                delete requiredViews[SQLQUERY_EVENT_NAME];
            }
        }

        createRequiredViews(requiredViews);
    })
}

function createRequiredViews(reqViews){

    for (var key in reqViews){

        var sqlViewTemplate =
        {
            "name": SQLView_Init_Map[key].name,
            "sqlQuery": SQLView_Init_Map[key].query,
            "displayName": SQLView_Init_Map[key].name,
            "description": SQLView_Init_Map[key].desc,
            "type": SQLView_Init_Map[key].type
        }

        createSQLView(Object.assign({},sqlViewTemplate)).then(function(response){
            SQLViewsName2IdMap[response.name] = response.response.lastImported;
            console.log("SQL View created.");debugger

        })
    }



}