(function(){
    "use strict";

    var module = angular.module("app");

    module.directive("dragList", directive);


    directive.$inject =["$timeout"];

    function directive($timeout) {

        return {
            restrict: 'A',

            link: function(scope,element,attrs) {

                var self = this;

   /*             var listsContainerSelector = null;*/

                self.placeholderElement = document.createElement("div");
                self.placeholderElement.id = "placeholder";
                self.placeholderElement.setAttribute("drag","");



               var elements = element[0].parentElement.getElementsByClassName("project-status-list-item-name-left");


               for(var i=0;i<elements.length;i++) {

                       elements[i].addEventListener("mousedown",function () {
                           element.attr("draggable",true);

                   });
               }




                element[0].addEventListener("dragstart", function(event) {

                    if(event.target.className === element[0].className) {


                        self.activeElement = event.target;

                        /*  activeElementStyle = self.activeElement.getBoundingClientRect();*/
                        var activeElementStyle = window.getComputedStyle(self.activeElement);

                        self.placeholderElement.style.width = activeElementStyle.width;
                        self.placeholderElement.style.height = activeElementStyle.height;
                        self.placeholderElement.style.padding = activeElementStyle.padding;
                        self.placeholderElement.style.margin = activeElementStyle.margin;
                        self.placeholderElement.style.border = activeElementStyle.border;
                        self.placeholderElement.style.backgroundColor = "#EEEEEEEE";

                        self.activeElement.addEventListener("dragend", dragendHandler, false);


                        $timeout(function () {
                            event.target.parentElement.insertBefore(self.placeholderElement, event.target);
                            event.target.parentElement.removeChild(self.activeElement);
                        }, 0);
                    }
                });



                    var oldX=0;

                self.parentClassName = element[0].parentElement.className;


                element[0].addEventListener("dragover", dragoverHandler);

                function dragoverHandler (event) {

                    event.preventDefault();

                    var targetElement = event.target;


                    if (self.activeElement ) {

                        if (event.pageX > oldX) {
                            element[0].parentElement.insertBefore(self.placeholderElement, element[0].nextElementSibling);
                        } else if (event.pageX < oldX) {
                            element[0].parentElement.insertBefore(self.placeholderElement,element[0] );
                        }
                        oldX = event.pageX;
                    }
                }


                function dragendHandler(event) {

                    if(self.placeholderElement.parentElement) {
                        self.placeholderElement.parentElement.insertBefore(self.activeElement,self.placeholderElement);
                        self.placeholderElement.parentElement.removeChild(self.placeholderElement);
                        self.activeElement = null;

                        var elements2 = event.target.parentElement.getElementsByClassName("project-status-list");


                        for(var i=0;i<elements2.length;i++) {

                            elements2[i].setAttribute("draggable","false")

                        }

                    }
                }


            }
        }
    }


})();