(function(){
    "use strict";


    angular.module("app").component("test1",{
        template:"<div>{{model.serviceA}}</div><button ng-click='model.increment()'>Inc Ser</button><button ng-click='model.refresh()'>Refresh Ser</button><hr><div>{{model.factoryA}}</div><button ng-click='model.incrementFactory()'>Inc F</button><button ng-click='model.refreshFactory()'>Refresh F</button>",
        controllerAs: "model",
        controller: controller
    });

    controller.$inject = ["testFactory", "testService"];

    function controller(f, s) {
        var model = this;

        this.increment = increment;
        this.incrementFactory = incrementFactory;
        this.refresh = refresh;
        this.refreshFactory = refreshFactory;

        model.serviceA = s.a;
        model.factoryA = f.a;


        function increment() {
            s.a++;
        }

        function incrementFactory() {
            f.a++;
        }


        function refresh() {
            model.serviceA = s.a;
        }

        function refreshFactory() {
            model.factoryA = f.a;
        }

    }

})();