(function(){
    "use strict";

    var module = angular.module("app");

    module.component("projectsLogin", {
        templateUrl:"projects/projects-login/projects-login.component.html",
        controllerAs:"model",
        controller:controller
    });

    controller.$inject = ["ResourceService","authService","$rootRouter"];


    function controller(ResourceService,authService,$rootRouter) {
        var model=this;

        model.login = login;
        model.errorLogin=errorLogin;
        model.enterLogin=enterLogin;



        model.errorMessage = false;


        function enterLogin(event) {
            var x = event.keyCode || event.which;
            if (x === 13) {
                login();
            }
        }

        function login() {

            ResourceService.login(model.username,model.password).then(function (objectToken) {
                authService.saveToken(objectToken);

                ResourceService.getUser().then(function(userInfo) {
                    authService.saveUser(userInfo);
                    $rootRouter.navigate(["List"]);
                }).catch(function(error) {
                   console.log(error);
                });



            }).catch(function (error) {
                model.errorMessage = true;

            })

        }






        function errorLogin() {

            return {
                "error":model.errorMessage,
                "hidden":!model.errorMessage
            }
        }








    }






})();