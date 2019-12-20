(function (){
    "use strict";

    var module = angular.module("app");

    module.service("ticketFormService", ticketFormService);

    ticketFormService.$inject = ["ComponentModalService"];

    function ticketFormService(ComponentModalService) {

        this.open = open;
        this.close = close;

        var modalInstance = null;


        /// implementation /////////

        function open(options) {
            var _options = {
                title: options.title,
                listName: options.listName,
                description: options.description,
                callback: options.callback
            };

            var modalOptions = {
                component: 'ticketForm',
                locals: _options
            };

            ComponentModalService.showModal(modalOptions).then(function (modal) {
                modalInstance = modal;
                modal.close.then(function(positiveFeedback) {
                    if(_options.callback) _options.callback(positiveFeedback);
                });
            }).catch(function (reason) {

            })
        }


        function close() {
            if(modalInstance) modalInstance.dismiss();
        }


    }

})();