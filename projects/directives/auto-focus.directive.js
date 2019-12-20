
(function(){
    "use strict";


    var module = angular.module("app");

    module.directive("autoFocus", function() {
     return {
         restrict:'A',

         link: function(scope,element,attrs) {
             element.focus();


         }
     }
    })


})();