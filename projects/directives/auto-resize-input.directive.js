
(function(){
    "use strict";


    var module = angular.module("app");

    module.directive("autoResizeInput", function() {
     return {
         restrict:'A',
         scope: {
             ngModel: '<'
         },
         link: function(scope,element,attrs) {

        var unchangedSize;

/*                 EVENTS

             scope.$on("makeMeDraggable", function (event, data) {
                 console.log("event received 123");
                 if(data.menuItemId === attrs.menuItem.id) {
                     console.log("event received");
                 }
             });


             element.on("mousedown", function() {
                 $rootScope.$broadcast("makeMeDraggable",data);
             })*/



             element.on('load', function() {
            element[0].size = (scope.ngModel.length);
        });


           element.on('mousedown',function() {
                    if(scope.ngModel.length){
                        element[0].size = (scope.ngModel.length);
                        unchangedSize = element[0].size;
                    }

           });


             element.on("keydown", function() {
                 if(scope.ngModel.length) {
                     var x = event.which || event.keyCode;
                     if(x>47 && x<91) {
                         element[0].size = (scope.ngModel.length+1);
                     }
                 }

             });


             element.on("keyup", function() {
                 if(!scope.ngModel) {
                     element[0].size=unchangedSize;
                 }
                 else {

                     var x = event.which || event.keyCode;

                     if (x===8 || x===46){
                         element[0].size = (scope.ngModel.length);
                     }
                     else if(x===13) {
                         element[0].blur();
                     }

                     else  {
                         if(x>47 && x<91) {
                             element[0].size = (scope.ngModel.length);
                         }
                     }

                 }



             });

         }
     }
    })


})();