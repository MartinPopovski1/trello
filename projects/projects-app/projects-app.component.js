(function() {
    "use strict";

    var module = angular.module("app");

    module.component("projectsApp", {
        templateUrl: "projects/projects-app/projects-app.component.html",
        $routeConfig: [
            { path: "/preview/:id", component: "projectPreview", name: "Preview" },
            { path: "/list", component: "projectsList", name: "List" },
            { path: "/login", component: "projectsLogin", name: "Login" },
            { path: "/**", redirectTo:["List"] },

        ],

    });




})();