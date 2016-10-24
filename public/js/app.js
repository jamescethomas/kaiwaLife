'use strict';

/* App Module */
var kaiwaLife = angular.module('kaiwaLife', [
    'ngRoute',
    'ngCookies',
    // 'ngAnimate',
    'ngResource',
    'kaiwaControllers',

    'ui.bootstrap',
    'pascalprecht.translate',
    'underscore'
]);

var kaiwaControllers = angular.module('kaiwaControllers', []);
