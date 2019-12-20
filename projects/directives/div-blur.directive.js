(function(){
    "use strict";

    var module = angular.module("app");

    module.directive("onDivBlur", directive);

    directive.$inject = ["utils", "$document", "$rootScope", "$timeout"];

    function directive(utils, $document, $rootScope, $timeout) {
        return {
            restrict:'A',
            scope: {
                onDivBlur: "&?",
            },
            link: function(scope,element,attrs) {
                    $document.on('click', documentClicked);

                    scope.$on("$destroy", function () {
                        $document.off('click', documentClicked);
                    });


                    function documentClicked(event) {
                        var isInsideDiv = element.find(event.target).length > 0;
                        if(!isInsideDiv) {
                            if(scope.onDivBlur) {
                                scope.onDivBlur();
                            }


                            /*$timeout(function () {
                                scope.divBlur = false;
                            }, 0);*/

                            //$rootScope.$broadcast("div-blur::outside-div");
                        }
                    }





/*                function closeInput(event) {
                    var checkClassName = event.currentTarget.classList.forEach(function (item) {
                      return item===element[0]
                    });

                   if(checkClassName) {

                   }
                }*/
            }
        }

    }



})();