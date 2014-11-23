/**
 * Created by Alexander on 11/22/2014.
 */

/**
 * Created by Alexander S. on 11/8/2014.
 */

'use strict';

require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        angular: '../bower_components/angular/angular',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        toastr: '../bower_components/toastr/toastr',
        moment: '../bower_components/moment/moment',
        'sa.table': '../src/sa.table'
    },
    shim: {
        'jquery': {exports: '$'},
        'angular': {exports: 'angular'},
        'bootstrap': {deps: ['jquery']},
        'toastr': {deps: ['jquery']},
        'sa.table': {deps: ['angular', 'moment']}
    },
    priority: [
        'angular'
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'angular',
    'app'
], function (angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    angular.element().ready(function () {
        angular.resumeBootstrap([app['name']]);
    });
});