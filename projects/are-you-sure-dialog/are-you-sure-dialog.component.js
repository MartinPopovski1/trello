(function (){
    "use strict";

    var module = angular.module("app");

    module.component("areYouSureDialog", {
        templateUrl: "projects/are-you-sure-dialog/are-you-sure-dialog.component.html",
        controllerAs: "vm",
        controller: controller,
        bindings: { }
    });

    controller.$inject = ["locals", "close"];

    function controller(locals, close) {
        var vm = this;

        this.$onInit = function () {
            vm.content = locals.content;
            vm.btnNoText = locals.btnNoText;
            vm.btnYesText = locals.btnYesText;
        };


        vm.yesHandler = yesHandler;
        vm.noHandler = noHandler;



        /// implementation /////////

        function yesHandler() {
            if(close) close(true);
        }

        function noHandler() {
            if(close) close(false);
        }





    }

})();