(function(){
    "use strict";

    var module = angular.module("app");


    module.service("authService", service);

    service.$inject = [];


    function service() {

        this.saveUser = saveUser;
        this.saveToken=saveToken;
        this.isAuthUser = isAuthUser;
        this.deleteUser = deleteUser;


        function isAuthUser() {
            var accessToken = JSON.parse(localStorage.getItem("access-token")) || {};
            return accessToken;
        }

        function saveToken(tokenObject) {

            this.accessToken = tokenObject.token;
            localStorage.setItem("access-token",JSON.stringify(this.accessToken));

        }


        function saveUser(userInfo) {

                var user = {
                    id: userInfo.id,
                    username:userInfo.username,
                    password:userInfo.password,
                    name:userInfo.name,
                };
                localStorage.setItem("user",JSON.stringify(user));

        }

        function deleteUser() {
            localStorage.clear();
        }





    }




})();