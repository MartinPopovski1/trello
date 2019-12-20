(function () {
 "use strict";

     var module = angular.module("app");
     module.service("StoreService", service);

     service.$inject = ["utils"];

     function service(utils) {

         var self = this;
         var projects = [];




         this.createProject = createProject;
         this.updateProject= updateProject;
         this.removeProject = removeProject;
         this.getProject = getProject;
         this.getAllProjects = getAllProjects;


         /// Project /////////

         function createProject(name) {
             var project = {
                 name:name,
                 id: uuid(),
                 boards: []
             };
             projects.push(project);
             localStorage.setItem("projects",JSON.stringify(projects));
             return project;
         }


         function updateProject(id, project) {

           var foundProject = utils.linq.first(projects,function(p) { return  p.id===id; });

             foundProject.name=project.name;
             localStorage.setItem("projects",JSON.stringify(projects));
         }


         function removeProject(id) {

/*             utils.linq.removeFirst(projects, function (p) {
                 return p.id === id;
             });*/

             utils.linq.removeFirst(projects, p => p.id === id );
             localStorage.setItem("projects",JSON.stringify(projects));
             return true;

         }

         function getProject(id) {
             projects = JSON.parse(localStorage.getItem("projects"));
             return angular.copy(utils.linq.first(projects,function(p) {
                 return p.id===id;
             }));
         }

         function getAllProjects() {
             projects = JSON.parse(localStorage.getItem("projects"));

             if(!projects) {
              projects=[];
             }
             return angular.copy(projects);
         }



         /// Boards in projects /////////




         this.createBoard = createBoard;
         this.updateBoard= updateBoard;
         this.removeBoard = removeBoard;
         this.getBoard = getBoard;
         this.getAllBoards = getAllBoards;





         function createBoard(name,idOfProject) {
             var board = {
                 name:name,
                 lists:[],
                 id: uuid()
             };
             var foundProject = utils.linq.first(projects, function (p) {
                 return p.id === idOfProject;
             });
             if(foundProject) {
                 foundProject.boards.push(board);
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return angular.copy(board);
             }
         }

         function updateBoard(idOfProject,board) {

             var foundProject = utils.linq.first(projects,function(p) { return  p.id===idOfProject; });
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===board.id });
             if(foundBoard) {
                 foundBoard.name=board.name;
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return true;
             }

         }


         function removeBoard(idOfProject,id) {
             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects, function (p) {
                 return p.id === idOfProject;
             });
             if(foundProject) {
                 utils.linq.removeFirst(foundProject.boards, function (board) {
                     return board.id === id;
                 });
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return true;
             }
         }


         function getBoard(idOfProject,idOfBoard) {
             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects,function(p) { return  p.id===idOfProject; });
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard });

             return angular.copy(foundBoard);
         }




         function getAllBoards(idOfProject) {
             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects,function(p) { return  p.id===idOfProject; });

             if(!foundProject.boards) {
                 foundProject.boards=[];
             }
             return angular.copy(foundProject.boards);
         }






         /// Boards in projects /////////




         this.createList = createList;
         this.updateList= updateList;
         this.removeList = removeList;
         this.getList = getList;
         this.getAllLists = getAllLists;




         function createList(idOfProject,idOfBoard,name) {

             var newList = {
                 name:name,
                 id:uuid(),
                 tickets:[]
             };
             var foundProject = utils.linq.first(projects,function(p) { return p.id===idOfProject;});
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard; });
             if(foundBoard) {
                 foundBoard.lists.push(newList);
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return angular.copy(newList);
             }
         }

         function updateList(idOfProject,idOfBoard,list) {
             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects,function(p) { return  p.id===idOfProject; });
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard });
             var foundList = utils.linq.first(foundBoard.lists,function(l) { return l.id === list.id });
             if(foundList) {
                 foundList.name=list.name;
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return true;
             }
         }


         function removeList(idOfProject,idOfBoard,idOfList) {

             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects, function (p) { return p.id === idOfProject; });
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard });
             if(foundBoard) {
                 utils.linq.removeFirst(foundBoard.lists, function (list) {
                     return list.id === idOfList;
                 });
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return true;
             }
         }

         function getList(idOfProject,idOfBoard,idOfList) {
             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects,function(p) { return  p.id===idOfProject; });
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard });
             var foundList = utils.linq.first(foundBoard.lists, function(l) { return l.id===idOfList });
             return angular.copy(foundList);
         }



         function getAllLists(idOfProject,idOfBoard) {
             projects = JSON.parse(localStorage.getItem("projects"));
             var foundProject = utils.linq.first(projects,function(p) { return  p.id===idOfProject; });
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard });

             if(!foundBoard.lists) {
                 foundBoard.lists=[];
             }
             return angular.copy(foundBoard.lists);
         }


         this.createTicket = createTicket;
         this.updateList= updateList;
         this.removeList = removeList;
         this.getList = getList;
         this.getAllLists = getAllLists;


         function createTicket(idOfProject,idOfBoard,idOfList,name) {

             var newTicket = {
                 name:name,
                 id:uuid()
             };
             var foundProject = utils.linq.first(projects,function(p) { return p.id===idOfProject;});
             var foundBoard = utils.linq.first(foundProject.boards,function(b) { return b.id===idOfBoard; });
             var foundList = utils.linq.first(foundBoard.lists, function(l) { return l.id===idOfList });

             if(foundList) {
                 foundList.tickets.push(newTicket);
                 localStorage.setItem("projects",JSON.stringify(projects));
                 return angular.copy(newTicket);
             }
         }





         /// helpers /////////

         function findIndexById(id) {
             for(let i=0; i<projects.length; i++) {
                 if(projects[i].id===id) {
                     return i;
                 }
             }
         }

         function uuid() {
             function s4() {
                 return Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);
             }

             return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
         }


     }





    module.factory("storeFactory", factory);

    factory.$inject = [];

    function factory() {

        var service = {
            projects: [],
            create: create,
            update: update,
        };

        return service;

        function create() {

        }

        function update() {

        }
    }



  /*  module.value("NumberOfDays", "AAAAAa");
    module.value("AdminUser", {
        name: "Martin",
    });

    module.constant("PI", 3.1415);



    module.controller("SSSS", controller);
    controller.$inject = ["NumberOfDays", "PI"];
    function controller(NumberOfDays, PI) {
        var a = NumberOfDays;
    }*/

})();


