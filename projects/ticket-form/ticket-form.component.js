(function (){
    "use strict";

    var module = angular.module("app");

    module.component("ticketForm", {
        templateUrl: "projects/ticket-form/ticket-form.component.html",
        controllerAs: "vm",
        controller: controller,
        bindings: { }
    });

    controller.$inject = ["locals", "close"];

    function controller(locals, close) {
        var vm = this;

        this.$onInit = function () {
            vm.title = locals.title;
            vm.listName = locals.listName;
            vm.description = locals.description;
            vm.callback = locals.callback;

        };


        vm.closeHandler = closeHandler;



        /// implementation /////////

        function closeHandler() {
            if(close) close();
        }






    }

})();






