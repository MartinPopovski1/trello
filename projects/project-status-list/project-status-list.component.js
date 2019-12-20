(function(){
    "use strict";


    var module=angular.module("app");
    module.component("projectStatusList", {
        templateUrl:"projects/project-status-list/project-status-list.component.html",
        controllerAs:"vm",
        controller:controller,
        bindings:{
            list:"<",
            onUpdateList:"&?",
            onRemoveList:"&?",
            onAddTicket:"&?"
        }
    });



    controller.$inject = ["$scope","ticketFormService", "$rootScope"];

    function controller($scope,ticketForm, $rootScope) {
        var vm = this;


        $scope.$on("list-toggle-new-ticket-open", function (event, data) {
            if(vm.list.id !== data) vm.list.isAddTicketOpen = false;
        });


        vm.updateList=updateList;
        vm.removeList=removeList;
        vm.closeAddTicket=closeAddTicket;
        vm.addTicket=addTicket;
        vm.enterTicket=enterTicket;
        vm.openTicketForm=openTicketForm;
        vm.toggleNewTicket=toggleNewTicket;


        function updateList() {
            if(vm.onUpdateList) {
                 vm.onUpdateList({list:vm.list})
            }
        }

        function removeList(id) {
            if(vm.onRemoveList) {
                vm.onRemoveList({id:id})
            }
        }

        function closeAddTicket() {
            vm.list.isAddTicketOpen=false;
            vm.ticketName="";
            $scope.$apply();
        }

        function addTicket() {
            if(vm.onAddTicket && vm.ticketName) {
                vm.onAddTicket({idOfList:vm.list.id,ticketName:vm.ticketName});
                vm.ticketName="";
            }
        }

        function enterTicket($event) {
            var x=$event.keyCode || $event.which;
            if(x===13) {
                $event.preventDefault();
                vm.addTicket();
            }
        }

        function openTicketForm (ticket) {

            var options = {
                title: ticket.name,
                listName: vm.list.name,
                description: "",
                callback: callback
            };


            ticketForm.open(options);


            function callback() {


            }

        }



        function toggleNewTicket($event) {
            $event.stopPropagation();
            vm.list.isAddTicketOpen = !vm.list.isAddTicketOpen;
            if(vm.list.isAddTicketOpen) $rootScope.$broadcast("list-toggle-new-ticket-open", vm.list.id);


        }






    }



})();