(function (){
    "use strict";

    var module = angular.module("app");

    module.service("areYouSureDialogService", areYouSureDialogService);

    areYouSureDialogService.$inject = ["ComponentModalService"];

    function areYouSureDialogService(ComponentModalService) {

        this.open = open;
        this.close = close;

        var modalInstance = null;


        /// implementation /////////

        function open(options) {
            var _options = {
                title: options.title,
                content: options.content,
                btnYesText: options.btnYesText,
                btnNoText: options.btnNoText,
                callback: options.callback
            };

            var modalOptions = {
                component: 'areYouSureDialog',
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