(function(){
    "use strict";

    var module = angular.module("app");

    module.component("projectsList", {
        templateUrl:"projects/projects-list/projects-list.component.html",
        controllerAs:"model",
        controller:controller
    });

    controller.$inject = ["StoreService","utils","$timeout","areYouSureDialogService", "$http","ResourceService"];

    function controller(store,utils,$timeout, areYouSureDialogService, $http, ResourceService) {
        var model = this;

        model.addProject = addProject;
        model.removeProject=removeProject;
        model.emptyStringError = emptyStringError;



        model.errorInput=false;
        model.projects = [];

        ResourceService.getAllProjects().then(function(response) {
            model.projects = response;
        }).catch(function(error) {
            console.log(error)
        });

        function addProject() {
            if(model.projectName)
            {
                ResourceService.postProject(model.projectName).then(function (response) {
                    model.projects.push(response);
                } , function (error) {
                    console.log(error)
                });
                model.projectName="";
                model.errorInput=false;
            }
            else model.errorInput=true;
        }


        function removeProject(id) {

            var options = {
                content: "Are you sure you want to remove this project?",
                btnNoText: "Cancel",
                btnYesText: "Yes",
                callback: callback


            };

            function callback(positiveFeedback) {
                if(positiveFeedback) {
                    ResourceService.removeProject(id).then( function() {
                        $timeout(function () {
                            utils.linq.removeFirst(model.projects, function (p) {
                                return p.id === id
                            });
                        }, 0)
                    }, function (error) {
                        console.log(error)
                    });

                }
            }

            areYouSureDialogService.open(options);
        }






        function emptyStringError() {

            return{
                "error": model.errorInput
            }
        }




/*

        model.xml = function () {

            let xhr = new XMLHttpRequest();

// 2. Configure it: GET-request for the URL /article/.../load
            xhr.open('GET', 'https://www.google.com/search?q=xmlhttprequest+example&oq=xmlH&aqs=chrome.2.69i57j0l5.2831j0j7&sourceid=chrome&ie=UTF-8');



// 4. This will be called after the response is received
            xhr.onload = function() {
               model.showXML = true;
            };

            xhr.onerror = function() {
                model.showXML = true;
            };

// 3. Send the request over the network
            xhr.send();
        };


        model.ang = function () {
            $http({
                method: 'GET',
                url: 'https://www.google.com/search?q=xmlhttprequest+example&oq=xmlH&aqs=chrome.2.69i57j0l5.2831j0j7&sourceid=chrome&ie=UTF-8'
            }).then(function successCallback(response) {
                model.showANG = true;
            }, function errorCallback(response) {
                model.showANG = true;
            });
        };

*/

    }



})();
