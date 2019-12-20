(function(){
    "use strict";

    var module = angular.module("app");

    module.directive("uiDropdown", function() {
        return {
            restrict:'A',

            link: function(scope,element,attrs) {

                element.dropdown();


            }
        }
    })

})();