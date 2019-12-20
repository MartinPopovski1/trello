(function(){
    "use strict";

    var module = angular.module("app");

    module.service("ResourceService", service);

    service.$inject = [
        "$http",
        "$q",
        "utils"
    ];

    function service (
        $http,
        $q,
        utils
    ) {

        this.getProject = getProject;
        this.getAllProjects = getAllProjects;
        this.postProject = postProject;
        this.removeProject = removeProject;





        var baseUrl = "http://localhost:8080/api/projects";


        function getProject(id) {
            var deferred = $q.defer();

            var url = baseUrl + "/" + id;

            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }, function(error) {

                deferred.reject(error);
            });
            return deferred.promise;
        }


        function getAllProjects() {

            var deferred = $q.defer();

            var url = baseUrl;

            $http.get(url).then(function(response) {
                deferred.resolve(response.data);
            }, function(error) {

                deferred.reject(error);
            });

            return deferred.promise;
        }

        function postProject(name) {
            var deferred = $q.defer();

            var url = baseUrl;

            $http.post(url, { name: name}).then(function (response) {
                deferred.resolve(response.data)
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function removeProject(id) {
            var deferred = $q.defer();

            var url= baseUrl + "/" + id;


            $http.delete(url,{id:id} ).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error)
            });
            return deferred.promise;

        }




        /// Boards


        this.postBoard=postBoard;
        this.removeBoard=removeBoard;



        function postBoard(id,name) {
            var deferred = $q.defer();

            var url = baseUrl + "/" + id + "/" + "boards";

            $http.post(url, { name: name}).then(function (response) {
                deferred.resolve(response.data)
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function removeBoard(projectId, boardId) {
            var deferred = $q.defer();

            var url= baseUrl + "/" + projectId + "/boards/" + boardId;

            $http.delete(url,{id:boardId} ).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error)
            });
            return deferred.promise;

        }


        //// List

        this.postList=postList;
        this.removeList = removeList;




        function postList(projectId,boardId,name) {
            var deferred = $q.defer();

            var url = baseUrl + "/" + projectId + "/" + "boards" + "/" + boardId + "/" + "ticketLists";

            $http.post(url, { name: name}).then(function (response) {
                deferred.resolve(response.data)
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function removeList(projectId, boardId, id) {
            var deferred = $q.defer();

            var url= baseUrl + "/" + projectId + "/" + "boards" + "/" + boardId + "/" + "ticketLists" + "/" + id;

            $http.delete(url,{id:id} ).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error)
            });
            return deferred.promise;

        }



        //// Tickets

        this.postTickets=postTickets;
        this.removeTickets = removeTickets;





        function postTickets(projectId,boardId,listId,name) {
            var deferred = $q.defer();

            var url = baseUrl + "/" + projectId + "/" + "boards" + "/" + boardId + "/" + "ticketLists" + "/" + listId + "/"  + "tickets";

            $http.post(url, { name: name}).then(function (response) {
                deferred.resolve(response.data)
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }



        function removeTickets(projectId, boardId, id) {
            var deferred = $q.defer();

            var url= baseUrl + "/" + projectId + "/boards/"  + boardId + "/ticketLists/" + listId  + "/tickets/" + id;

            $http.delete(url,{id:id} ).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error)
            });
            return deferred.promise;

        }



        //// Login

        this.login = login;
        this.getUser = getUser;


        function login(username,password) {
            var deferred = $q.defer();

            var url = "http://localhost:8080/api/login";

            $http.post(url,{username:username, password: password}).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error)
            });
            return deferred.promise;

        }

        function getUser() {
            var deferred = $q.defer();

            var url = "http://localhost:8080/api/user";

            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error)
            });
            return deferred.promise;
        }






    }
})();