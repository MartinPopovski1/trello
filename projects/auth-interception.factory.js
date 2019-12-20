(function (){
    "use strict";

    // the appModule is needed to set authInterceptor as a config function
    // look at the last line of this file -> appModule.config(authInterceptorConfig);
    var module = angular.module("app");

    authInterceptorConfig.$inject = ["$httpProvider", "$provide"];

    function authInterceptorConfig($httpProvider, $provide) {

        $provide.factory("authInterceptor", authInterceptor);

        authInterceptor.$inject = ["$log", "$q","authService","$rootRouter"];

        function authInterceptor($log, $q,authService,$rootRouter) {
            return {
                "request": function (config) {
                    config.headers = config.headers || {};
                    var token = authService.isAuthUser();
                    if (token) {
                        config.headers.Authorization = "Bearer " + token;
                    }

                    return config;
                },
                "requestError": function (rejection) {

                    // handle the case where the request fails
                    //$log.error("API request failed: ", rejection);

                    return $q.reject(rejection);
                },
                "response": function (response) {
                    if (response.status === 401) {
                        // handle the case where the user is not authenticated
                        //$log.error("The user is not authenticated:", response);
                        // authService.logOut();
                        //$rootRouter.navigate(["Login"]);
                    }

                    return response || $q.when(response);
                },
                "responseError": function (rejection) {

                    if (rejection.status === 401) {
                        // handle the case where the user is not authenticated
                        //$log.error("Request failed - The user is not authenticated:", rejection);
                        // authService.logOut();
                        $rootRouter.navigate(["Login"])


                    }
                    if (rejection.status === 403) {
                        // handle the case where the user is not authorized
                        //$log.error("Request failed - The user is not authorized:", rejection);
                        // authService.logOut();
                    }
                    if (rejection.status === 419 || rejection.status === 440) {
                        // handle the case where there is a session timeout
                        //$log.error("Request failed - Session timeout:", rejection);
                    }

                    return $q.reject(rejection);
                }
            };
        }

        $httpProvider.interceptors.push("authInterceptor");
    }




    module.config(authInterceptorConfig);


})();
