(function () {
    "use strict";

    var module = angular.module("app");
    module.component("projectPreview", {
        templateUrl: "projects/project-preview/project-preview.component.html",
        controllerAs: "model",
        controller: controller,
        bindings: {
            "$router": "<"
        }
    });


    controller.$inject = ["StoreService", "utils", '$scope', "$timeout", "areYouSureDialogService", "ResourceService","authService"];

    function controller(store, utils, $scope,$timeout, areYouSureDialogService, ResourceService,authService) {
        var model = this;

        this.$onInit = function () {
            model.newBoardName = "";
            model.inputBoardClicked = false;
            model.flyout = true;
            model.isListInputOpen = false;
            model.isBoardActive=false;
        };

        this.$routerOnActivate = function (next) {
            model.id = next.params.id;
            ResourceService.getProject(model.id).then(function(response) {
                model.project = response;
                model.boards=model.project.boards;
                model.projectName = model.project.name;

                if(model.project.boards.length>0) {
                    model.board = model.project.boards[model.project.boards.length-1];
                    model.board.isBoardActive=true;
                }
            });




        };

        this.$onChanges = function () {

        };

        this.$onDestroy = function () {

        };


        model.manageFlyout = manageFlyout;
        model.openBoard=openBoard;
        model.addBoard = addBoard;
        model.removeBoard = removeBoard;
        model.updateProject = updateProject;
        model.goTo = goTo;
        model.openEditBoard=openEditBoard;
        model.enterBoard = enterBoard;
        model.updateBoard = updateBoard;
        model.enterUpdateProject = enterUpdateProject;
        model.enterUpdateBoard = enterUpdateBoard;
        model.closeEditBoard = closeEditBoard;
        model.addList = addList;
        model.enterAddList = enterAddList;
        model.closeList=closeList;
        model.activeBoard=activeBoard;
        model.openLastBoard=openLastBoard;
        model.boardExist=boardExist;
        model.updateList=updateList;
        model.removeList=removeList;
        model.addTicket=addTicket;
        model.logout = logout;


/*        $scope.$watch("model.isListInputOpen", function (value) {
            console.log("TOP VALUE: " + value);
        });*/

/*        $scope.$on("div-blur::outside-div", closeList);*/



        
        /// implementation /////////


        function manageFlyout() {
            model.flyout = !model.flyout;
        }


        function updateProject() {

/*            if (model.project.name) {
                store.updateProject(model.project.id, model.project);
                model.projectName = model.project.name;
            }
            model.project.name = model.projectName;*/
        }

        function enterUpdateProject(event) {
            var x = event.keyCode || event.which;
            if (x === 13) {
                updateProject();
            }
        }


        function addBoard(name) {

            if (model.newBoardName !== "") {
                ResourceService.postBoard(model.id,name).then( function (response) {
                        model.project.boards.push(response);
                        model.newBoardName = "";
                        openLastBoard();
                }).catch(function(error) {
                    console.log(error);
                });

            }
        }

        function enterBoard($event, name, idOfProject) {
            if ($event.keyCode === 13) {
                if (model.newBoardName !== "") {
                    addBoard(name, idOfProject);
                    model.board=model.project.boards[model.project.boards.length-1];
                }
            }
        }

        function removeBoard(id) {

            var options = {
                content: "Are you sure you want to remove this board?",
                btnNoText: "Cancel",
                btnYesText: "Remove",
                callback: callback
            };

            areYouSureDialogService.open(options);


            function callback(positiveFeedback) {
                if(positiveFeedback) {
                    ResourceService.removeBoard(model.id,id).then(function () {
                        utils.linq.removeFirst(model.project.boards, function (board) {
                            return board.id === id;
                        });
                        openLastBoard();

                    })
                }
            }


        }


        function openEditBoard(board,$event) {
/*            model.boards=store.getAllBoards(model.project.id);
            board.isEditMode=!board.isEditMode;
            $event.stopPropagation();*/
        }

        function closeEditBoard(board) {
            $timeout(function() {
                board.isEditMode = false;
                model.newBoardName = "";
                },0
            )


        }


        function updateBoard(board) {

/*            if (board.name !== "") {
                store.updateBoard(model.project.id, board);
            } else {
                var storedBoard = store.getBoard(model.project.id, board.id);
                board.name = storedBoard.name;
            }
            board.isEditMode = false;*/
        }

        function enterUpdateBoard(event) {
            var x = event.keyCode || event.which;
            if (x === 13) {
                updateBoard();
            }
        }


        function openBoard(id) {
            var foundBoard = utils.linq.first(model.project.boards,function(b) { return b.id===id });
            model.board=foundBoard;
            model.project.boards.forEach(function(b) { b.isBoardActive = false; });
            model.board.isBoardActive=true;
        }

        function openLastBoard() {

            model.board=model.project.boards[model.project.boards.length-1];
            if(model.board) {
                model.project.boards.forEach(function(b) { b.isBoardActive = false; });
                model.board.isBoardActive=true;
            }

        }

        function goTo() {
            model.$router.navigate(["List"]);
        }


        function addList() {
            if(model.newListName) {
                ResourceService.postList(model.id,model.board.id, model.newListName).then(function (response) {
                    model.board.lists.push(response);
                    model.scrollRight=true;
                    model.newListName = "";
                }).catch (function(error) {
                    console.log(error);
                });



            }
            else {
             model.isAddListClicked = true;
            }
        }

        function enterAddList(event) {
                var x = event.keyCode || event.which;
                if (x === 13) {
                    addList();
                }
        }

        function removeList(id) {
            var options = {
                content: "Are you sure you want to remove this status list?",
                btnNoText: "Cancel",
                btnYesText: "Remove",
                callback: callback
            };

            areYouSureDialogService.open(options);


            function callback(positiveFeedback) {
                if(positiveFeedback) {

                    ResourceService.removeList(model.id,model.board.id,id).then(function(){
                        utils.linq.removeFirst(model.board.lists,function(l) { return l.id === id }  )
                    }).catch(function (error) {
                        console.log(error);
                    })
                }
            }

        }

        function closeList() {
            $timeout(function () {
                model.isListInputOpen = false;
                model.newListName = "";
            }, 0);

        }


        function activeBoard(board) {

            return{
                "project-preview-active-board": board.isBoardActive
            }
        }

        function boardExist() {
            if(model.board) {
                return true;
            }
        }

        function updateList(list) {

/*            if(list.name) {
                store.updateList(model.project.id,model.board.id,list);
            }
            else {
                var storedList = store.getList(model.project.id,model.board.id,list.id);
                list.name=storedList.name;
            }*/
        }



        function addTicket(idOfList,ticketName) {
            ResourceService.postTickets(model.project.id,model.board.id,idOfList,ticketName).then(function(response) {
                var foundList = utils.linq.first(model.board.lists,function(l) { return l.id===idOfList });
                foundList.tickets.push(response);
            }).catch(function(error) {
                console.log(error);
            })

        }


        function logout() {

            authService.deleteUser();
            model.$router.navigate(["Login"]);

        }
        
        
        
        
        /// helpers /////////



        



    }


})();