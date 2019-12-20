(function(){
        "use strict";


        var module=angular.module("app",[
            "ngComponentRouter",
            "luegg.directives",
            "angularComponentModalService"
        ]);

        module.config(config);
        module.run(run);

        module.value("$routerRootComponent","projectsApp");


        config.$inject = []; // provider, const
        function config() {

        }

        run.$inject = ["$rootScope", "$location"];
        function run($rootScope, $location) {
/*            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                    $location.path('/login');
                }
            });*/
        }



})();