(function(){
    "use strict";

    angular.module("app").service("testService", function () {

        console.log("Service instant...");

        this.a = 0;
    });

})();