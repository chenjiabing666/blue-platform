(function(){
	// 'invitation strick'

	angular.module('app.invitation',[])
    .controller('InvitationCtrl', ['$scope','$http','$mdDialog','$location','$timeout',InvitationCtrl])
    .controller('InvitationDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',InvitationDetailCtrl])
    .controller('InvitationChangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',InvitationChangeCtrl])
    .controller('InvitationAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',InvitationAddCtrl])
    .controller('InvitationUserCtrl', ['$scope', '$http','$mdDialog','$location','$timeout',InvitationUserCtrl])
    .controller('AgentCtrl', ['$scope','$http','$mdDialog','$location','$timeout',AgentCtrl])
    .controller('AgentChangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',AgentChangeCtrl])

    function InvitationCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwInvitaterMobile = '';
        $scope.kwInvitationId = '';
        $scope.kwUserType = '';
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
        $scope.invitationLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "4") {
                $scope.isShow = 1;
            }
        }


        function getInvitationList(pageNum, pageSize){

            $http.post('http://localhost:8080/yoyo-server/' + 'invitationCode/getInvitationCodeList.do',{},{params:{
                inviterId:$scope.kwInvitationId,
                inviterMobile:$scope.kwInvitaterMobile,
                userType:2,
                pageNum:pageNum,
                pageSize:pageSize,
                interfaceType:1,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.invitationLists=data.result;
                    $scope.stores=data.result;
                    $scope.invitation=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
            obj.titleForKey = ["invitationId","invitationType","nickName","mobile","password",];
            obj.data = $scope.stores;
            exportCsv(obj);
        }

        function exportCsv(obj){
            //title ["","",""]
            var title = obj.title;
            //titleForKey ["","",""]
            var titleForKey = obj.titleForKey;
            var data = obj.data;
            var str = [];
            str.push(obj.title.join(",")+"\n");
            for(var i=0;i<data.length;i++){
                var temp = [];
                for(var j=0;j<titleForKey.length;j++){
                    temp.push(data[i][titleForKey[j]]);
                }

                str.push(temp.join(",")+"\n");
            }

            var uri = 'data:text/txt;charset=utf-8,' + encodeURIComponent(str.join(""));  
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "邀请人列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getInvitationList(page, $scope.numPerPage);
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
            // console.log($scope.stores);
            return $scope.onFilterChange();
        };


        init = function() {
            console.log($scope.numPerPage);

            $http.post('http://localhost:8080/yoyo-server/' + 'invitationCode/getInvitationCodeList.do',{},{params:{
                inviterId:$scope.kwInvitationId,
                inviterMobile:$scope.kwInvitaterMobile,
                userType:2,         
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    // console.log($scope.stores);
                    $scope.search();
                    // $scope.searchInvitation(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchInvitation(page,$scope.numPerPage);
                }
            });         
        };

        $scope.selected = {};

        $scope.isSelectedAll = false;

        $scope.isSelected = function (id) {
            console.log("isSelected==" + $scope.selected[id]);
            if($scope.selected[id] == true){
                return true;
            }else{
                return false;
            }         
        };

        var judgeSelectedAll = function () {
        var isSelectedAll = true;


      for (var i = 0; i < $scope.currentPageStores.length; i++) {


                      var invitation = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[invitation.invitationId];

                }

    return isSelectedAll;
          };

          var updateSelected = function (id) {

    console.log($scope.isSelected(id));

                if ($scope.isSelected(id)){


        $scope.selected[id] = false;


    }else{

        $scope.selected[id] = true;

    }

    $scope.isSelectedAll = judgeSelectedAll();

    

               
          };



          var updateSelectedByStatus = function (id, status) {

    console.log($scope.isSelected(id));


    $scope.selected[id] = status;



               
          };
         $scope.selectAll = function () {


    console.log("isSelectedAll1"  + $scope.isSelectedAll);


    if($scope.isSelectedAll){

        $scope.isSelectedAll = false;

    }else{

        $scope.isSelectedAll = true; 


    }

            
                for (var i = 0; i < $scope.currentPageStores.length; i++) {


                      var invitation = $scope.currentPageStores[i];



        updateSelectedByStatus(invitation.invitationCodeId, $scope.isSelectedAll);

                }



          };


          $scope.selectItem = function (id) {
    console.log("selectItem"  + id);


    updateSelected(id);

          };

            //批量删除
            $scope.deleteList = function(){


                          // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定批量删除')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定删除')
                            .cancel('取消删除');

                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteInvitationBatch.do";// 接收上传文件的后台地址
                    console.log($scope.selected);
                    var temp = "";

                    var form = new FormData();

                    for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        form.append("id", temp);
                        form.getTaskDetail
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            $scope.showAlert("删除成功");
                             for(var i in $scope.selected){
                                temp = i;
                                $(".delete-"+temp).css("display","none");
                                     $scope.total--;
                             }

                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.errorMessage);
                         $scope.showAlert("删除失败");
                    }


                    }
                    // init();
                    $scope.showAlert = function(txt) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                        )

                    }

            })

        }




       // 搜索

       $scope.searchInvitation = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.invitationId = $("#invitationId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationList.do',{},{params:{
            invitationId:$scope.kwInvitationId,
            nickName:$scope.kwNickName,
                    invitation:$scope.kwInvitation,
                    invitationId:$scope.kwInvitationId,
                    mobile:$scope.mobile,
                    pageNum:pageNum,
                    pageSize:pageSize
                }}).success(function (data){
                    if(data.errorCode == 0){
                        $scope.stores=data.result;
                        $scope.total = data.total;
                        $scope.currentPageStores = $scope.stores;
                        $scope.total.$apply;
                        $scope.currentPageStores.$apply;
                        console.log("total:" + data.total);
                    } 
                })
                $scope.showAlert = function(txt) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                        ) 
                    
                }    
            // console.log($scope.productType);
            console.log($scope.numPerPage);

        }

        
        
        // 删除邀请人
        $scope.deleteInvitation = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条邀请人员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"invitationCode/deleteInvitationCode.do?",{},{params:{
                        invitationCodeId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除邀请人成功");
                            getInvitationList(1,10);
                            $(".delete-"+id).css("display","none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }if($scope.total<$scope.numPerPage){
                            $scope.filteredStores.length=$scope.total;
                        }
                        
                    })
                }, function() {

                    $scope.showAlert("取消删除");
                });
                        };
                        $scope.showAlert = function(txt) {

                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title(txt)
                                .ok('确定')
                                ) 
                            
                        }    
                        $scope.showConfirm();
                    }

                    
        //设为精英
        $scope.setElite = function(id){
            $scope.showConfirm = function(){
                var confirm = $mdDialog.confirm()
                .title('是否确定设置该邀请人为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        invitationId:id,
                    }}).success(function(data){
                        if(data.errorCode == 0){
                            $scope.showAlert("设置成功");
                            $(".set-"+id).css("display","none");
                            $scope.total--;
                        }else{
                            $scope.showAlert(data.errorMessage);
                        }if($scope.total<$scope.numPerPage){
                            $scope.filteredStores.length=$scope.total;
                        }
                    })
                },function(){
                    $scope.showAlert("取消");
                });
            };
            $scope.showAlert = function(txt){
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    )
            }
            $scope.showConfirm();
            init();
        }       
        init();
        
        

    }



    // 查看详情
    function InvitationDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/invitation/invitation-list');
        }

        $scope.invitationId = $location.search().id;
        
        $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationById.do',{},{params:{
            invitationId:$scope.invitationId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.invitation = data.result;
            }
        });
    }


    // 修改
    function InvitationChangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.invitationId = $location.search().id;

        $scope.backClick = function(){
            $location.path("/invitation/invitation-list");
        }

        $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationById.do',{},{params:{
            invitationId:$scope.invitationId
        }}).success( function (data){
                if(data.errorCode == 0){
                    $scope.invitation = data.result;
                    console.log($scope.invitation);
                } else {
                    $scope.showAlert(data.errorMessage);
                    console.log($scope.invitation)
                }
            });


        $scope.changeinvitation = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改邀请人')
                .ok('确定修改')
                .cancel('取消修改');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/yoyo-server/"+"invitation/modifyInvitation.do?",{},{params:{
                        invitationId:$scope.invitation.invitationId,
                        invitation:$scope.invitation.invitation,
                        hallName:$scope.invitation.hallName,
                        origin:$scope.invitation.origin,
                        introduce:$scope.invitation.introduce
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改邀请人成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
                        }
                        
                    })
                }, function() {
                    $scope.showAlert("取消修改");
                });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')).then(function(){
                    $location.path('/invitation/invitation-list');
                })                       
            }


            $scope.showAlert1 = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                )         
            } 
            $scope.showConfirm();
        }
    }






    // 增加
    function InvitationAddCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.invitation = {};

        $scope.pageType = $location.search().pageType;
        console.log($scope.pageType);

        $scope.backClick = function(){
            if($location.search().pageType == 1){
                $location.path('/invitation/invitation-list');
            }else if($location.search().pageType == 2){
                $location.path('/invitation/agent-list');
            }
            
        }
        
        $scope.addinvitation = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加？')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/yoyo-server/"+"invitationCode/addInvitationUser.do?",{},{params:{
                        userId:$scope.invitation.userId,
                        userType:$scope.invitation.userType
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
                        }
                    })
                },  function() {
                        $scope.showAlert("取消添加");
                    });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                ).then(function(){

                    if($location.search().pageType == 1){
                        $location.path('/invitation/invitation-list');
                    }else if($location.search().pageType == 2){
                        $location.path('/invitation/agent-list');
                    }
                   
                })              
            }    

            $scope.showAlert1 = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                 )          
            }

            $scope.showConfirm();
        }

        $scope.showAlert = function(txt) {
            $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(false)
                .title(txt)
                .ok('确定')
            ) 
        }    
    }


//======================================
    // 邀请列表

    function InvitationUserCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }


        $timeout($scope.login(),10)
        

        $scope.backClick = function(){
            if($location.search().pageType == 1){
                $location.path('/invitation/invitation-list');
            }else if($location.search().pageType == 2){
                $location.path('/invitation/agent-list');
            }
            
        }

        var init;

        $scope.stores = [];
        $scope.kwMobile = '';
        $scope.kwUserId = '';
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
        $scope.invitationLists = [];

        $scope.fromUserId = $location.search().id;
        $scope.isAgent = $location.search().isAgent;
        function getInvitationList(pageNum, pageSize){
            $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationUserList.do',{},{params:{
                inviterId:$scope.kwInvitationId,
                userId:$scope.kwUserId,
                mobile:$scope.kwMobile,
                fromUserId:$scope.fromUserId,
                isAgent:$scope.isAgent,
                pageNum:pageNum,
                pageSize:pageSize,
                interfaceType:1,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.invitationLists=data.result;
                    $scope.stores=data.result;
                    $scope.invitation=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
            obj.titleForKey = ["invitationId","invitationType","nickName","mobile","password",];
            obj.data = $scope.stores;
            exportCsv(obj);
        }

        function exportCsv(obj){
            //title ["","",""]
            var title = obj.title;
            //titleForKey ["","",""]
            var titleForKey = obj.titleForKey;
            var data = obj.data;
            var str = [];
            str.push(obj.title.join(",")+"\n");
            for(var i=0;i<data.length;i++){
                var temp = [];
                for(var j=0;j<titleForKey.length;j++){
                    temp.push(data[i][titleForKey[j]]);
                }

                str.push(temp.join(",")+"\n");
            }

            var uri = 'data:text/txt;charset=utf-8,' + encodeURIComponent(str.join(""));  
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "邀请人列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getInvitationList(page, $scope.numPerPage);
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
            console.log($scope.stores);
            return $scope.onFilterChange();
        };


        init = function() {
            console.log($location);

            $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationUserList.do',{},{params:{
                inviterId:$scope.kwInvitationId,
                userId:$scope.kwUserId,
                fromUserId:$scope.fromUserId,
                isAgent:$scope.isAgent,        
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchInvitation(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchInvitation(page,$scope.numPerPage);
                }
            });         
        };

        $scope.selected = {};

        $scope.isSelectedAll = false;

        $scope.isSelected = function (id) {
            console.log("isSelected==" + $scope.selected[id]);
            if($scope.selected[id] == true){
                return true;
            }else{
                return false;
            }         
        };

        var judgeSelectedAll = function () {
        var isSelectedAll = true;


      for (var i = 0; i < $scope.currentPageStores.length; i++) {


                      var invitation = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[invitation.invitationId];

                }

    return isSelectedAll;
          };

          var updateSelected = function (id) {

    console.log($scope.isSelected(id));

                if ($scope.isSelected(id)){


        $scope.selected[id] = false;


    }else{

        $scope.selected[id] = true;

    }

    $scope.isSelectedAll = judgeSelectedAll();

    

               
          };



          var updateSelectedByStatus = function (id, status) {

    console.log($scope.isSelected(id));


    $scope.selected[id] = status;



               
          };
         $scope.selectAll = function () {


    console.log("isSelectedAll1"  + $scope.isSelectedAll);


    if($scope.isSelectedAll){

        $scope.isSelectedAll = false;

    }else{

        $scope.isSelectedAll = true; 


    }

            
                for (var i = 0; i < $scope.currentPageStores.length; i++) {


                      var invitation = $scope.currentPageStores[i];



            updateSelectedByStatus(invitation.invitationId, $scope.isSelectedAll);

                    }



              };


                  $scope.selectItem = function (id) {
            console.log("selectItem"  + id);


            updateSelected(id);

            };

            //批量删除
            $scope.deleteList = function(){


                          // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定批量删除')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定删除')
                            .cancel('取消删除');

                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteInvitationBatch.do";// 接收上传文件的后台地址
                    console.log($scope.selected);
                    var temp = "";

                    var form = new FormData();

                    for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        form.append("id", temp);
                        form.getTaskDetail
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            $scope.showAlert("删除成功");
                             for(var i in $scope.selected){
                                temp = i;
                                $(".delete-"+temp).css("display","none");
                                     $scope.total--;
                             }

                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.errorMessage);
                         $scope.showAlert("删除失败");
                    }


                    }
                    // init();
                    $scope.showAlert = function(txt) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                        )

                    }

            })

        }




       // 搜索

       $scope.searchInvitation = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.invitationId = $("#invitationId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationList.do',{},{params:{
            invitationId:$scope.kwInvitationId,
            nickName:$scope.kwNickName,
                    invitation:$scope.kwInvitation,
                    invitationId:$scope.kwInvitationId,
                    mobile:$scope.mobile,
                    pageNum:pageNum,
                    pageSize:pageSize
                }}).success(function (data){
                    if(data.errorCode == 0){
                        $scope.stores=data.result;
                        $scope.total = data.total;
                        $scope.currentPageStores = $scope.stores;
                        $scope.total.$apply;
                        $scope.currentPageStores.$apply;
                        console.log("total:" + data.total);
                    } 
                })
                $scope.showAlert = function(txt) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                        ) 
                    
                }    
            // console.log($scope.productType);
            console.log($scope.numPerPage);

        }

        
        
        // 删除邀请人
        $scope.deleteInvitation = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条邀请人员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"invitation/deleteInvitation.do?",{},{params:{
                        invitationId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除邀请人成功");
                            getInvitationList(1,10);
                            $(".delete-"+id).css("display","none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }if($scope.total<$scope.numPerPage){
                            $scope.filteredStores.length=$scope.total;
                        }
                        
                    })
                }, function() {

                    $scope.showAlert("取消删除");
                });
                        };
                        $scope.showAlert = function(txt) {

                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title(txt)
                                .ok('确定')
                                ) 
                            
                        }    
                        $scope.showConfirm();
                    }

                    
        //设为精英
        $scope.setElite = function(id){
            $scope.showConfirm = function(){
                var confirm = $mdDialog.confirm()
                .title('是否确定设置该邀请人为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        invitationId:id,
                    }}).success(function(data){
                        if(data.errorCode == 0){
                            $scope.showAlert("设置成功");
                            $(".set-"+id).css("display","none");
                            $scope.total--;
                        }else{
                            $scope.showAlert(data.errorMessage);
                        }if($scope.total<$scope.numPerPage){
                            $scope.filteredStores.length=$scope.total;
                        }
                    })
                },function(){
                    $scope.showAlert("取消");
                });
            };
            $scope.showAlert = function(txt){
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    )
            }
            $scope.showConfirm();
            init();
        }       
        init();
        
        

    }



    function AgentCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwInvitaterMobile = '';
        $scope.kwInvitationId = '';
        $scope.kwUserType = '';
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
        $scope.invitationLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "5") {
                $scope.isShow = 1;
            }
        }
        function getInvitationList(pageNum, pageSize){

            $http.post('http://localhost:8080/yoyo-server/' + 'invitationCode/getInvitationCodeList.do',{},{params:{
                inviterId:$scope.kwInvitationId,
                inviterMobile:$scope.kwInvitaterMobile,
                userType:1,
                pageNum:pageNum,
                pageSize:pageSize,
                interfaceType:1,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.invitationLists=data.result;
                    $scope.stores=data.result;
                    $scope.invitation=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
            obj.titleForKey = ["invitationId","invitationType","nickName","mobile","password",];
            obj.data = $scope.stores;
            exportCsv(obj);
        }

        function exportCsv(obj){
            //title ["","",""]
            var title = obj.title;
            //titleForKey ["","",""]
            var titleForKey = obj.titleForKey;
            var data = obj.data;
            var str = [];
            str.push(obj.title.join(",")+"\n");
            for(var i=0;i<data.length;i++){
                var temp = [];
                for(var j=0;j<titleForKey.length;j++){
                    temp.push(data[i][titleForKey[j]]);
                }

                str.push(temp.join(",")+"\n");
            }

            var uri = 'data:text/txt;charset=utf-8,' + encodeURIComponent(str.join(""));  
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "邀请人列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getInvitationList(page, $scope.numPerPage);
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
            // console.log($scope.stores);
            return $scope.onFilterChange();
        };


        init = function() {
            console.log($scope.numPerPage);

            $http.post('http://localhost:8080/yoyo-server/' + 'invitationCode/getInvitationCodeList.do',{},{params:{
                inviterId:$scope.kwInvitationId,
                inviterMobile:$scope.kwInvitaterMobile,
                userType:1,         
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    // console.log($scope.stores);
                    $scope.search();
                    // $scope.searchInvitation(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchInvitation(page,$scope.numPerPage);
                }
            });         
        };

        $scope.selected = {};

        $scope.isSelectedAll = false;

        $scope.isSelected = function (id) {
            console.log("isSelected==" + $scope.selected[id]);
            if($scope.selected[id] == true){
                return true;
            }else{
                return false;
            }         
        };

        var judgeSelectedAll = function () {
        var isSelectedAll = true;


      for (var i = 0; i < $scope.currentPageStores.length; i++) {


                      var invitation = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[invitation.invitationCodeId];

                }

    return isSelectedAll;
          };

          var updateSelected = function (id) {

    console.log($scope.isSelected(id));

                if ($scope.isSelected(id)){


        $scope.selected[id] = false;


    }else{

        $scope.selected[id] = true;

    }

    $scope.isSelectedAll = judgeSelectedAll();

    

               
          };



          var updateSelectedByStatus = function (id, status) {

    console.log($scope.isSelected(id));


    $scope.selected[id] = status;



               
          };
         $scope.selectAll = function () {


    console.log("isSelectedAll1"  + $scope.isSelectedAll);


    if($scope.isSelectedAll){

        $scope.isSelectedAll = false;

    }else{

        $scope.isSelectedAll = true; 


    }

            
                for (var i = 0; i < $scope.currentPageStores.length; i++) {


                      var invitation = $scope.currentPageStores[i];



        updateSelectedByStatus(invitation.invitationCodeId, $scope.isSelectedAll);

                }



          };


          $scope.selectItem = function (id) {
    console.log("selectItem"  + id);


    updateSelected(id);

          };

            //批量删除
            $scope.deleteList = function(){


                          // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定批量删除')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定删除')
                            .cancel('取消删除');

                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteInvitationBatch.do";// 接收上传文件的后台地址
                    console.log($scope.selected);
                    var temp = "";

                    var form = new FormData();

                    for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        form.append("id", temp);
                        form.getTaskDetail
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            $scope.showAlert("删除成功");
                             for(var i in $scope.selected){
                                temp = i;
                                $(".delete-"+temp).css("display","none");
                                     $scope.total--;
                             }

                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.errorMessage);
                         $scope.showAlert("删除失败");
                    }


                    }
                    // init();
                    $scope.showAlert = function(txt) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                        )

                    }

            })

        }



       // 搜索

       $scope.searchInvitation = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.invitationId = $("#invitationId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationList.do',{},{params:{
            invitationId:$scope.kwInvitationId,
            nickName:$scope.kwNickName,
                    invitation:$scope.kwInvitation,
                    invitationId:$scope.kwInvitationId,
                    mobile:$scope.mobile,
                    pageNum:pageNum,
                    pageSize:pageSize
                }}).success(function (data){
                    if(data.errorCode == 0){
                        $scope.stores=data.result;
                        $scope.total = data.total;
                        $scope.currentPageStores = $scope.stores;
                        $scope.total.$apply;
                        $scope.currentPageStores.$apply;
                        console.log("total:" + data.total);
                    } 
                })
                $scope.showAlert = function(txt) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                        ) 
                    
                }    
            // console.log($scope.productType);
            console.log($scope.numPerPage);

        }

        
        
        // 删除邀请人
        $scope.deleteInvitation = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"invitationCode/deleteInvitationCode.do?",{},{params:{
                        invitationCodeId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除成功");
                            getInvitationList(1,10);
                            $(".delete-"+id).css("display","none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }if($scope.total<$scope.numPerPage){
                            $scope.filteredStores.length=$scope.total;
                        }
                        
                    })
                }, function() {

                    $scope.showAlert("取消删除");
                });
                        };
                        $scope.showAlert = function(txt) {

                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title(txt)
                                .ok('确定')
                                ) 
                            
                        }    
                        $scope.showConfirm();
                    }

                    
        //设为精英
        $scope.setElite = function(id){
            $scope.showConfirm = function(){
                var confirm = $mdDialog.confirm()
                .title('是否确定设置该邀请人为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        invitationId:id,
                    }}).success(function(data){
                        if(data.errorCode == 0){
                            $scope.showAlert("设置成功");
                            $(".set-"+id).css("display","none");
                            $scope.total--;
                        }else{
                            $scope.showAlert(data.errorMessage);
                        }if($scope.total<$scope.numPerPage){
                            $scope.filteredStores.length=$scope.total;
                        }
                    })
                },function(){
                    $scope.showAlert("取消");
                });
            };
            $scope.showAlert = function(txt){
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    )
            }
            $scope.showConfirm();
            init();
        }       
        init();
        
        

    }




    //编辑经纪人
    function AgentChangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.invitationId = $location.search().id;

        $scope.backClick = function(){
            $location.path("/invitation/agent-list");
        }

        $http.post('http://localhost:8080/yoyo-server/' + 'invitation/getInvitationById.do',{},{params:{
            invitationId:$scope.invitationId
        }}).success( function (data){
                if(data.errorCode == 0){
                    $scope.invitation = data.result;
                    console.log($scope.invitation);
                } else {
                    $scope.showAlert(data.errorMessage);
                    console.log($scope.invitation)
                }
            });


        $scope.changeinvitation = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改邀请人')
                .ok('确定修改')
                .cancel('取消修改');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/yoyo-server/"+"invitation/modifyInvitation.do?",{},{params:{
                        invitationId:$scope.invitation.invitationId,
                        invitation:$scope.invitation.invitation,
                        hallName:$scope.invitation.hallName,
                        origin:$scope.invitation.origin,
                        introduce:$scope.invitation.introduce
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改邀请人成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
                        }
                        
                    })
                }, function() {
                    $scope.showAlert("取消修改");
                });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')).then(function(){
                    $location.path('/invitation/invitation-list');
                })                       
            }


            $scope.showAlert1 = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                )         
            } 
            $scope.showConfirm();
        }
    }


})();