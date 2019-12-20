
(function(){
    "use strict";

    var module = angular.module("app");


    module.component("projectItem", {
        templateUrl: "projects/project-item/project-item.component.html",
        controllerAs:"model",
        controller:controller,
        bindings: {
            project:"<",
            onRemove:"&?"

        },
    });

        controller.$inject = ["$rootRouter"];

    function controller($rootRouter) {

        var model=this;

        model.goTo = goTo;
        model.removeProject = removeProject;


        function goTo(id) {
            $rootRouter.navigate(["Preview",{id:id}])
        }

        function removeProject(id) {

            if(model["onRemove"]) model["onRemove"]({id:id});
        }


    }


})();