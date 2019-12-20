(function () {
    "use strict";

    var module = angular.module("angularComponentModalService", []);

    module.service("ComponentModalService", ComponentModalService);

    ComponentModalService.$inject = [
        "$animate",
        "$document",
        "$compile",
        "$controller",
        "$injector",
        "$http",
        "$rootScope",
        "$q",
        "$templateRequest",
        "$timeout"
    ];

    function ComponentModalService(
        $animate,
        $document,
        $compile,
        $controller,
        $injector,
        $http,
        $rootScope,
        $q,
        $templateRequest,
        $timeout
    ) {


        /// interface /////////

        var self = this;

        self.openModals = [];

        self.getTemplate = getTemplate;
        self.appendChild = appendChild;
        self.closeModals = closeModals;
        self.showModal = showModal;




        //  Returns a promise which gets the template, either
        //  from the template parameter or via a request to the
        //  template url parameter.
        function getTemplate(template, templateUrl) {
            var deferred = $q.defer();
            if (template) {
                deferred.resolve(template);
            } else if (templateUrl) {
                $templateRequest(templateUrl, true)
                    .then(function(template) {
                        deferred.resolve(template);
                    }, function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.reject("No template or templateUrl has been specified.");
            }
            return deferred.promise;
        }

        //  Adds an element to the DOM as the last child of its container
        //  like append, but uses $animate to handle animations. Returns a
        //  promise that is resolved once all animation is complete.
        function appendChild(parent, child) {
            var children = parent.children();
            if (children.length > 0) {
                return $animate.enter(child, parent, children[children.length - 1]);
            }
            return $animate.enter(child, parent);
        }

        //  Close all modals, providing the given result to the close promise.
        function closeModals(result, delay) {
            while (self.openModals.length) {
                self.openModals[0].close(result, delay);
                self.openModals.splice(0, 1);
            }
        }

        function showModal(options) {

            if(options.component) return showModalComponent(options);

            //  Get the body of the document, we'll add the modal to this.
            var body = angular.element($document[0].body);

            //  Create a deferred we'll resolve when the modal is ready.
            var deferred = $q.defer();

            //  Validate the input parameters.
            var controllerName = options.controller;
            if (!controllerName) {
                deferred.reject("No controller has been specified.");
                return deferred.promise;
            }

            //  Get the actual html of the template.
            getTemplate(options.template, options.templateUrl)
                .then(function(template) {

                    //  The main modal object we will build.
                    var modal = {};

                    //  Create a new scope for the modal.
                    var modalScope = (options.scope || $rootScope).$new(),
                        rootScopeOnClose = null,
                        locationChangeSuccess = options.locationChangeSuccess;

                    //  Allow locationChangeSuccess event registration to be configurable.
                    //  True (default) = event registered immediately
                    //  # (greater than 0) = event registered with delay
                    //  False = disabled
                    if (locationChangeSuccess === false){
                        rootScopeOnClose = angular.noop;
                    }
                    else if (angular.isNumber(locationChangeSuccess) && locationChangeSuccess >= 0) {
                        $timeout(function() {
                            rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);
                        }, locationChangeSuccess);
                    }
                    else {
                        rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);
                    }




                    //  Create the inputs object to the controller - this will include
                    //  the scope, as well as all inputs provided.
                    //  We will also create a deferred that is resolved with a provided
                    //  close function. The controller can then call 'close(result)'.
                    //  The controller can also provide a delay for closing - this is
                    //  helpful if there are closing animations which must finish first.
                    var closeDeferred = $q.defer();
                    var closedDeferred = $q.defer();
                    var inputs = {
                        $scope: modalScope,
                        close: function(result, delay) {
                            //  If we have a pre-close function, call it.
                            if (typeof options.preClose === 'function') options.preClose(modal, result, delay);

                            if (delay === undefined || delay === null) delay = 0;
                            $timeout(function() {

                                cleanUpClose(result);

                            }, delay);
                        }
                    };

                    //  If we have provided any inputs, pass them to the controller.
                    if (options.locals) angular.extend(inputs, options.locals);

                    //  Compile then link the template element, building the actual element.
                    //  Set the $element on the inputs so that it can be injected if required.
                    var linkFn = $compile(template);
                    var modalElement = linkFn(modalScope);
                    inputs.$element = modalElement;

                    //  Create the controller, explicitly specifying the scope to use.
                    var controllerObjBefore = modalScope[options.controllerAs];
                    var modalController = $controller(options.controller, inputs, false, options.controllerAs);

                    if (options.controllerAs && controllerObjBefore) {
                        angular.extend(modalController, controllerObjBefore);
                    }

                    //  Then, append the modal to the dom.
                    if (options.appendElement) {
                        // append to custom append element
                        appendChild(options.appendElement, modalElement);
                    } else {
                        // append to body when no custom append element is specified
                        appendChild(body, modalElement);
                    }

                    // Finally, append any custom classes to the body
                    if(options.bodyClass) {
                        body[0].classList.add(options.bodyClass);
                    }

                    //  Populate the modal object...
                    modal.controller = modalController;
                    modal.scope = modalScope;
                    modal.element = modalElement;
                    modal.close = closeDeferred.promise;
                    modal.closed = closedDeferred.promise;

                    //  ...which is passed to the caller via the promise.
                    deferred.resolve(modal);

                    // Clear previous input focus to avoid open multiple modals on enter
                    document.activeElement.blur();

                    //  We can track this modal in our open modals.
                    self.openModals.push({ modal: modal, close: inputs.close });

                    function cleanUpClose(result) {

                        //  Resolve the 'close' promise.
                        closeDeferred.resolve(result);

                        //  Remove the custom class from the body
                        if(options.bodyClass) {
                            body[0].classList.remove(options.bodyClass);
                        }

                        //  Let angular remove the element and wait for animations to finish.
                        $animate.leave(modalElement)
                            .then(function () {
                                //  Resolve the 'closed' promise.
                                closedDeferred.resolve(result);

                                //  We can now clean up the scope
                                modalScope.$destroy();

                                //  Remove the modal from the set of open modals.
                                for (var i=0; i<self.openModals.length; i++) {
                                    if (self.openModals[i].modal === modal) {
                                        self.openModals.splice(i, 1);
                                        break;
                                    }
                                }

                                //  Unless we null out all of these objects we seem to suffer
                                //  from memory leaks, if anyone can explain why then I'd
                                //  be very interested to know.
                                inputs.close = null;
                                deferred = null;
                                closeDeferred = null;
                                modal = null;
                                inputs = null;
                                modalElement = null;
                                modalScope = null;
                            });

                        // remove event watcher
                        rootScopeOnClose && rootScopeOnClose();
                    }

                })
                .then(null, function(error) { // 'catch' doesn't work in IE8.
                    deferred.reject(error);
                });

            return deferred.promise;
        }


        function showModalComponent(options) {
            //  Get the body of the document, we'll add the modal to this.
            var body = angular.element($document[0].body);

            //  Create a deferred we'll resolve when the modal is ready.
            var deferred = $q.defer();


            //  Validate if component exists.
            var directives = $injector.get(options.component + 'Directive');
            if (directives.length !== 1) {
                deferred.reject("The specified component does not exists.");
                return deferred.promise;
            }

            var componentDefinition = directives[0];


            //  Get the actual html of the template.
            getTemplate(componentDefinition.template, componentDefinition.templateUrl)
                .then(function(template) {

                    //  The main modal object we will build.
                    var modal = {};

                    //  Create a new scope for the modal.
                    var modalScope = (options.scope || $rootScope).$new(),
                        rootScopeOnClose = null,
                        locationChangeSuccess = options.locationChangeSuccess;

                    //  Allow locationChangeSuccess event registration to be configurable.
                    //  True (default) = event registered immediately
                    //  # (greater than 0) = event registered with delay
                    //  False = disabled
                    if (locationChangeSuccess === false){
                        rootScopeOnClose = angular.noop;
                    }
                    else if (angular.isNumber(locationChangeSuccess) && locationChangeSuccess >= 0) {
                        $timeout(function() {
                            rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);
                        }, locationChangeSuccess);
                    }
                    else {
                        rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);
                    }



                    function closeModal(result, delay) {
                        //  If we have a pre-close function, call it.
                        if (typeof options.preClose === 'function') options.preClose(modal, result, delay);

                        if (delay === undefined || delay === null) delay = 0;
                        $timeout(function() {

                            cleanUpClose(result);

                        }, delay);
                    }


                    //  Create the inputs object to the controller - this will include
                    //  the scope, as well as all inputs provided.
                    //  We will also create a deferred that is resolved with a provided
                    //  close function. The controller can then call 'close(result)'.
                    //  The controller can also provide a delay for closing - this is
                    //  helpful if there are closing animations which must finish first.
                    var closeDeferred = $q.defer();
                    var closedDeferred = $q.defer();
                    var inputs = {
                        $scope: modalScope,
                        close: closeModal,
                        locals: {}
                    };

                    //  If we have provided any inputs, pass them to the controller.
                    if (options.locals) angular.extend(inputs.locals, options.locals);

                    //  Compile then link the template element, building the actual element.
                    //  Set the $element on the inputs so that it can be injected if required.
                    var linkFn = $compile(template);
                    var modalElement = linkFn(modalScope);
                    inputs.$element = modalElement;

                    //  Create the controller, explicitly specifying the scope to use.
                    var bindings = {};
                    var controllerObjBefore = modalScope[componentDefinition.controllerAs];
                    var modalController = $controller(componentDefinition.controller, inputs, bindings, componentDefinition.controllerAs);

                    if (componentDefinition.controllerAs && controllerObjBefore) {
                        angular.extend(modalController, controllerObjBefore);
                    }

                    if(modalController && modalController.$onInit && typeof modalController.$onInit === "function") modalController.$onInit();

                    //  Then, append the modal to the dom.
                    if (options.appendElement) {
                        // append to custom append element
                        appendChild(options.appendElement, modalElement);
                    } else {
                        // append to body when no custom append element is specified
                        appendChild(body, modalElement);
                    }

                    // Finally, append any custom classes to the body
                    if(options.bodyClass) {
                        body[0].classList.add(options.bodyClass);
                    }

                    //  Populate the modal object...
                    modal.controller = modalController;
                    modal.scope = modalScope;
                    modal.element = modalElement;
                    modal.close = closeDeferred.promise;
                    modal.closed = closedDeferred.promise;
                    modal.dismiss = closeModal;



                    //  ...which is passed to the caller via the promise.
                    deferred.resolve(modal);

                    // Clear previous input focus to avoid open multiple modals on enter
                    document.activeElement.blur();

                    //  We can track this modal in our open modals.
                    self.openModals.push({ modal: modal, close: inputs.close });

                    function cleanUpClose(result) {

                        //  Resolve the 'close' promise.
                        closeDeferred.resolve(result);

                        //  Remove the custom class from the body
                        if(options.bodyClass) {
                            body[0].classList.remove(options.bodyClass);
                        }

                        //  Let angular remove the element and wait for animations to finish.
                        $animate.leave(modalElement)
                            .then(function () {
                                //  Resolve the 'closed' promise.
                                closedDeferred.resolve(result);

                                //  We can now clean up the scope
                                if(modalController && modalController.$onDestroy && typeof modalController.$onDestroy === "function") modalController.$onDestroy();
                                else modalScope.$destroy();



                                //  Remove the modal from the set of open modals.
                                for (var i=0; i<self.openModals.length; i++) {
                                    if (self.openModals[i].modal === modal) {
                                        self.openModals.splice(i, 1);
                                        break;
                                    }
                                }

                                //  Unless we null out all of these objects we seem to suffer
                                //  from memory leaks, if anyone can explain why then I'd
                                //  be very interested to know.
                                inputs.close = null;
                                deferred = null;
                                closeDeferred = null;
                                modal = null;
                                inputs = null;
                                modalElement = null;
                                modalScope = null;
                            });

                        // remove event watcher
                        rootScopeOnClose && rootScopeOnClose();
                    }

                })
                .then(null, function(error) { // 'catch' doesn't work in IE8.
                    deferred.reject(error);
                });



            return deferred.promise;
        }






    }

})();