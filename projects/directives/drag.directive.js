(function(){
    "use strict";

    var module = angular.module("app");

    module.directive("drag", directive);


    directive.$inject =["$timeout"];

    function directive($timeout) {

        return {
            restrict: 'A',

            link: function(scope,element,attrs) {

                var self = this;

                self.placeholderElement = document.createElement("div");
                self.placeholderElement.id = "placeholder";
                self.placeholderElement.setAttribute("drag","");
                self.placeholderElement.setAttribute("draggable","true");


                element[0].setAttribute("draggable","true");

/*

                document.addEventListener("click",function(event) {
                    console.log(event.target)
                });
*/

                self.parentClassName = element[0].parentElement.className;


                document.body.addEventListener("dragover", function (event) {

                    event.preventDefault();

                    if (self.activeElement) {
                        if (event.target.className === self.parentClassName) {
                            if (event.target.children.length === 0) {
                                event.target.appendChild(self.placeholderElement);
                            }
                        }
                    }
                });




                element[0].addEventListener("dragstart", function(event) {

                    event.stopPropagation();
                    self.activeElement = event.target;
                    /*  activeElementStyle = self.activeElement.getBoundingClientRect();*/
                    var activeElementStyle =window.getComputedStyle(self.activeElement);

                    self.placeholderElement.style.width  = activeElementStyle.width;
                    self.placeholderElement.style.height = activeElementStyle.height;
                    self.placeholderElement.style.padding = activeElementStyle.padding;
                    self.placeholderElement.style.margin =  activeElementStyle.margin;
                    self.placeholderElement.style.border =  activeElementStyle.border;
                    self.placeholderElement.style.backgroundColor =  "#EEEEEEEE";


                    self.activeElement.addEventListener("dragend", dragendHandler,false);




                    $timeout(function () {
                        event.target.parentElement.insertBefore(self.placeholderElement,event.target);
                        event.target.parentElement.removeChild(self.activeElement);
                        }, 0);
                });

                    var oldY=0;
                    var oldX=0;

                element[0].addEventListener("dragover", dragoverHandler);

                function dragoverHandler (event) {

                    event.preventDefault();

                    var targetElement = event.target;


                    if (self.activeElement) {

                        if (targetElement.draggable) {
                            if (event.pageY > oldY) {
                                targetElement.parentElement.insertBefore(self.placeholderElement, targetElement.nextElementSibling);
                            } else if (event.pageY < oldY) {
                                targetElement.parentElement.insertBefore(self.placeholderElement, targetElement);
                            }
                            oldY = event.pageY;
                        }
                    }

                }



                function dragendHandler(event) {

                    if(self.placeholderElement.parentElement) {
                        self.placeholderElement.parentElement.insertBefore(self.activeElement,self.placeholderElement);
                        self.placeholderElement.parentElement.removeChild(self.placeholderElement);
                        self.activeElement = null;

                    }
                }



            }
        }
    }


})();