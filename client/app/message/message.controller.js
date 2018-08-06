(function () {
    'use strict';

    angular.module('app.message')
        .controller('MessageCtrl', ['$scope', '$filter', '$http','$mdDialog','$location','$timeout', MessageCtrl])
        .controller('MessageDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',MessageDetailCtrl])
        .controller('AddMessageCtrl',['$scope','$http','$mdDialog','$location','$timeout','$filter',AddMessageCtrl])
        .filter('parseMessageType',function(){
            return function(input){
                if(input == 1){
                    return '系统消息';
                }
                if(input == 2){
                    return '点赞消息';
                }
                if(input == 3){
                    return '评论消息';
                }
            }
        })




    function MessageCtrl($scope, $filter, $http,$mdDialog,$location,$timeout) {

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.searchKeywords = '';
        $scope.filteredStores = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.search = search;
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.currentPage = [];
        $scope.isListMessage = 0;
        $scope.isAddMessage = 0;
        $scope.isEditMessage = 0;
        $scope.isDeleteMessage = 0;

    function getMessageList(pageNum, pageSize){

       $http.post('http://localhost:8080/yoyo-server/' + 'message/getMessageList.do',{},{params:{
        messageType:$scope.kwMessageType,
        pageNum:pageNum,
        pageSize:pageSize
       }}).success(function (data) {
       if (data.errorCode == 0) {
         $scope.stores=data.result;
         $scope.currentPageStores = data.result;
         $scope.filteredStores = data.result;
         $scope.currentPageStores.$apply;
         $scope.total = data.total;
         console.log($scope.stores);
       }else{
        $scope.currentPageStores = null;
       }
    });

}

       

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;

            console.log('$scope.numPerPage=='+$scope.numPerPage);

            if($scope.isSearch){
                $scope.searchMessage(page,$scope.numPerPage);
            } else {
                getMessageList(page, $scope.numPerPage);
            } 
        };

        function onFilterChange() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        function onNumPerPageChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };


        function search() {
            $scope.filteredStores = $scope.stores;
            //console.log($scope.stores);
            return $scope.onFilterChange();
        };

        init = function() {
            console.log($scope.numPerPage);


      $http.post('http://localhost:8080/yoyo-server/' + 'message/getMessageList.do',{},{params:{
       pageNum:1,
       pageSize:$scope.numPerPage,
    }}).success(function (data) {
       if (data.errorCode == 0) {
         $scope.stores=data.result;
         $scope.total = data.total;
         console.log($scope.stores);

         $scope.search();
         $scope.currentPageStores = $scope.stores;

       };
    });
            
        };

        // 删除新闻
        $scope.deleteMessage = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定删除该条新闻')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"message/delMessage.do?",{},{params:{
                        messageId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除新闻成功");
                            $(".delete-"+id).css("display","none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                        
                    })
                }, function() {
                    // console.log('取消')
                    $scope.showAlert("取消删除新闻");
                });
            };
            $scope.showAlert = function(txt) {
                 // dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        // .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title(txt)
                        // .content('You can specify some description text in here.')
                        // .ariaLabel('Alert Dialog Demo')
                        .ok('确定')
                        // .targetEvent()
                ) 
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }    
            $scope.showConfirm();
        }

        // 搜索新闻

        $scope.searchMessage = function(num,size){
            $scope.isSearch = true;
            $scope.messageName = $(".messageName").val();
            $scope.messageType = $(".messageType option:selected").text();
            // console.log($scope.messageName);
            // console.log($scope.messageType);
            switch($scope.messageType){
                case '信珑动态': $scope.messageType = 0;break;
                case '业界新闻': $scope.messageType = 1;break;
            }
            console.log($scope.messageType);
            $http.post('http://localhost:8080/yoyo-server/' + 'message/selectMessageList.do',{},{params:{
                title:$scope.messageName,
                type:$scope.messageType,
                pageNum:num,
                pageSize:size
            }}).success(function (data){
                if(data.errorCode == 0){
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.currentPageStores = $scope.stores;
                    $scope.total.$apply;
                    $scope.currentPageStores.$apply;
                    console.log("total:" + data.total);
                } else {
                    $scope.showAlert(data.errorMessage)
                }
            })
        }
        $scope.showAlert = function(txt) {
             // dialog
            $mdDialog.show(
                $mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false)
                    .title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
            ) 
            // ).then(function(){
            //     // $('.userForm').reset();
            // })
        }    

        init();
    }

    function MessageDetailCtrl($scope,$http,$location,$mdDialog,$timeout){


        $scope.backClick = function(){
            $location.path('/message/message-list');
        }
        $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $(".message-detail input").attr('disabled',true);
            $(".messageType").css("display","block");
            $(".messageRecommand").css("display","block");
            $(".messageTypeSelect").css("display","none");
            $(".message-content-edit").css("display","none");
            $(".message-content").css("display","block");
            $(".changeConfirm").css("display","none");
            switch($scope.message.type){
                case 1:$scope.message.type = "业界新闻";break;
                case 0:$scope.message.type = "信珑动态";break;
            }
            switch($scope.message.isRecommand){
                case true:$scope.message.isRecommand = '是';break;
                case false:$scope.message.isRecommand = '否';break;
            }
        }

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(),10)

        
        $scope.messageId = $location.search().id;
        console.log($location.search().id);
        console.log($scope.messageId);

        $http.post('http://localhost:8080/yoyo-server/' + 'message/getMessageById.do',{},{params:{
            messageId:$scope.messageId
        }}).success(function(data){
            if (data.errorCode == 0) {
                $scope.message = data.result;
                switch($scope.message.type){
                    case 1:$scope.message.type = "业界新闻";break;
                    case 0:$scope.message.type = "信珑动态";break;
                }
                switch($scope.message.isRecommand){
                    case true:$scope.message.isRecommand = '是';break;
                    case false:$scope.message.isRecommand = '否';break;
                }
            } 
        })

        // 修改

        $scope.changeClick = function(){
            console.log("修改")
            $(".cancelClick").css("display","inline");
            $(".message-detail input").attr('disabled',false);
            $(".messageId").attr('disabled',true);
            $(".messageType").css("display","none");
            $(".messageRecommand").css("display","none");
            $(".messageTypeSelect").css("display","block");
            $(".message-content-edit").css("display","block");
            $(".message-content").css("display","none");
            $(".changeConfirm").css("display","block");
            $scope.messageContent = $scope.message.content;
        }

        // 确认修改
        $scope.changeConfirm = function(){
            // console.log($scope.messageId);
            $scope.messageType = $(".messageTypeSelect .md-checked span").text();
            $scope.messageTitle = $(".messageTitle").val();
            $scope.messageText = $(".message-content-edit-html").val();

            // console.log($scope.messageType);
            // console.log($scope.messageTitle);
            // console.log($scope.messageContent);
            // console.log("$scope.message.type"+$scope.message.type);
            if($scope.messageType == ""){
                $scope.messageType = $scope.message.type;
            }
            switch($scope.message.type){
                case "业界新闻":$scope.message.type = 1;break;
                case "信珑动态":$scope.message.type = 0;break;
            }
            switch($scope.message.isRecommand){
                    case '是':$scope.message.isRecommand = true;break;
                    case '否':$scope.message.isRecommand = false;break;
                }

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定修改新闻信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    // $http.post("http://localhost:8080/yoyo-server/"+"message/modifyMessage.do",{},{params:{
                    //     messageId:$scope.messageId,
                    //     type:$scope.message.type,
                    //     title:$scope.messageTitle,
                    //     content:$scope.messageText,
                    //     isRecommand:$scope.message.isRecommand
                    // }}).success(function (data){
                    //     if(data.errorCode == 0){
                    //         $scope.showAlert("修改新闻信息成功");
                    //         $scope.message.content = $scope.messageText;
                    //     } else {
                    //         $scope.showAlert(data.errorMessage);
                    //     }
                        
                    // })
                    // 
                    // 
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: "http://localhost:8080/yoyo-server/"+"message/modifyMessage.do",
                        data: {
                            messageId:$scope.messageId,
                            type:$scope.message.type,
                            title:$scope.messageTitle,
                            content:$scope.messageText,
                            messageDate:$scope.message.messageDate,
                            isRecommand:$scope.message.isRecommand
                        },
                        success: function(data){
                            if(data.errorCode == 0){
                                $scope.showAlert("修改新闻信息成功");
                            }else{
                                $scope.showAlert(data.errorMessage);
                            }
                            
                        }
                    });
                }, function() {
                    // console.log('取消')
                    $scope.showAlert("取消修改新闻信息");
                });
            };

            $scope.showAlert = function(txt) {
                 // dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        // .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title(txt)
                        // .content('You can specify some description text in here.')
                        // .ariaLabel('Alert Dialog Demo')
                        .ok('确定')
                        // .targetEvent()

                ).then(function(){
                    $(".message-detail input").attr('disabled',true);
                    $(".messageType").css("display","block");
                    $(".messageRecommand").css("display","block");
                    $(".messageTypeSelect").css("display","none");
                    $(".message-content-edit").css("display","none");
                    $(".message-content").css("display","block");
                    $(".changeConfirm").css("display","none");
                     $(".cancelClick").css("display","none");
                    switch($scope.message.type){
                        case 1:$scope.message.type = "业界新闻";break;
                        case 0:$scope.message.type = "信珑动态";break;
                    }
                    switch($scope.message.isRecommand){
                        case true:$scope.message.isRecommand = '是';break;
                        case false:$scope.message.isRecommand = '否';break;
                    }
                    
                })
            }    
            $scope.showConfirm();
        }

    }


    function AddMessageCtrl($scope,$http,$mdDialog,$location,$timeout,$filter){
        $scope.isAddMessage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "addMessage") {
                $scope.isAddMessage = 1;
            } 
        }

        $scope.backClick = function(){
            $location.path('/message/message-list');
        }

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(),10)
        
            $scope.um = UM.getEditor('myEditor');
    $scope.um.addListener('blur',function(){
        $('#focush2').html('编辑器失去焦点了')
    });
    $scope.um.addListener('focus',function(){
        $('#focush2').html('')
    });


     $scope.$on('$destroy', function() {
        $scope.um.destroy();
    });


        //默认选中1
        $scope.message = {fromUserId:'1'};
        $scope.addMessage = function(){
            var textarea = '';
            textarea = angular.element(document.querySelector('.box')).html();
            $scope.fromUserId = $scope.message.fromUserId;
            $scope.content = textarea;
            // $scope.messageDate = $filter('date')($scope.message.messageDate,'yyyy/MM/dd');
            // alert($scope.message.content);
            // $scope.messageTitle = $(".messageTitle").val();
            //$scope.messageText = $(".message-content-edit-html").val();
            //$scope.messageDate = $filter('date')($scope.message.messageDate,'yyyy/MM/dd');
            // console.log("$scope.message.type"+$scope.message.type);
            // console.log("$scope.message.isRecommand"+$scope.message.isRecommand);
            // console.log("$scope.message.messageDate"+$scope.message.messageDate);
            // console.log($scope.messageText);
            $scope.showConfirm = function() {
                            // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定添加新的消息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    // $http.post("http://localhost:8080/yoyo-server/"+"message/addMessage.do",{},{params:{
                    //     type:$scope.message.type,
                    //     title:$scope.messageTitle,
                    //     content:$scope.messageText,
                    //     isRecommand:$scope.message.isRecommand
                    // }}).success(function (data){
                    //     if(data.errorCode == 0){
                    //         $scope.showAlert("添加新闻成功");
                    //     } else {
                    //         $scope.showAlert1(data.errorMessage)
                    //     }
                        
                    // })
                    // 
                    // 
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: "http://localhost:8080/yoyo-server/"+"message/addMessage.do",
                        data: {
                            //获取发送者Id
                            fromUserId:$scope.fromUserId,
                            type:1,
                            toUserId:0,
                            content:$scope.content 
                            // title:$scope.messageTitle,
                            //content:$scope.messageText,
                            // messageDate:$scope.messageDate,
                            //isRecommand:$scope.message.isRecommand
                        },
                        success: function(data){
                            if(data.errorCode == 0){
                                $scope.showAlert("添加消息成功");
                            }else{
                                $scope.showAlert1(data.errorMessage);
                            }
                            
                        }
                    });
                }, function() {
                    // console.log('取消')
                    $scope.showAlert1("取消添加消息");
                });
            };
            $scope.showAlert = function(txt) {
                 // dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        // .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title(txt)
                        // .content('You can specify some description text in here.')
                        // .ariaLabel('Alert Dialog Demo')
                        .ok('确定')
                        // .targetEvent()
                ).then(function(){
                    $scope.reset = function(){
                      $(".messageTitle").val("");
                      $scope.messageContent = '';
                      $scope.message.type = '';
                      $scope.message.messageDate = '';
                    }
                    $scope.reset();
                }) 
                
            }    
            $scope.showAlert1 = function(txt) {
                 // dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        // .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title(txt)
                        // .content('You can specify some description text in here.')
                        // .ariaLabel('Alert Dialog Demo')
                        .ok('确定')
                        // .targetEvent()
                )
            }    
            $scope.showConfirm();
        }




    }
   
})(); 