(function(){
    "use strict";

    angular.module("app").factory("testFactory", function () {

        console.log("Factory instant..."); 

        return {
           a : 0
       }
    });

})();