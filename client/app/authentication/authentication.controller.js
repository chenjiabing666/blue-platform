(function(){
    // 'video strick'

    angular.module('app.authentication')
        .controller('AuthenticationCtrl',['$scope','$filter','$http','$mdDialog','$location','$timeout','$state','$window',AuthenticationCtrl])
        .controller('AuthenticationDetailCtrl',['$scope','$http','$location','$mdDialog','$timeout','$stateParams',AuthenticationDetailCtrl])

        .filter('parseIsReview',function(){
            return function(input){
                if(input == 1){
                    return '待审核';
                }
                if(input == 2){
                    return '已通过';
                }
                if(input == 3){
                    return '被拒绝';
                }
            }
    })


    //身份审核
    function AuthenticationCtrl($scope,$filter,$http,$mdDialog,$location,$timeout,$state,$window){
        
        $scope.level=''

        //判断是否登录状态
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(),10)

        //定义初始化参数
        var init;

        //定义其他参数
        $scope.stores = [];
        $scope.kwNickName = '';
        $scope.kwUserId = '';
        $scope.kwMobile = '';
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
        $scope.userLists = [];
        $scope.kwExamine = '1';

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "12") {
                $scope.isShow = 1;
            }
        }
        
        //选择每页数据展示条数函数
        function select(page) {
             getAuthenticationList(page, $scope.numPerPage);
            
            
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
            return $scope.onFilterChange();
        };



        //全选操作
     
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

                var authentication = $scope.currentPageStores[i];

                isSelectedAll &= $scope.selected[authentication.authenticationId];

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

                var authentication = $scope.currentPageStores[i];

                updateSelectedByStatus(authentication.authenticationId, $scope.isSelectedAll);

            }

        };

        $scope.selectItem = function (id) {
            console.log("selectItem=="  + id);

            updateSelected(id);
        };


        //获得审核列表
        function getAuthenticationList(pageNum, pageSize){     

               $http.post('http://localhost:8080/yoyo-server/' + 'authentication/getAuthenticationList.do',{},{params:{
                    mobile:$scope.kwMobile,
                    // reviewType:2,
                    // interfaceType:2,
                    pageNum:pageNum,
                    pageSize:pageSize,
                    status:$scope.kwExamine,
                
               }}).success(function (data) {
               if (data.errorCode == 0) {
                     $scope.userLists=data.result;
                     $scope.stores=data.result;
                     $scope.user=data.result;
                     $scope.currentPageStores = data.result;
                     $scope.filteredStores = data.result;
                     $scope.currentPageStores.$apply;
                     $scope.total = data.total;
                     // $scope.searchUser(pageNum, $scope.numPerPage);
                    }else {
                       $scope.currentPageStores = null; 
                       
                    }
                });
        };


        //初始化函数
        init = function() {

            $http.post('http://localhost:8080/yoyo-server/' + 'authentication/getAuthenticationList.do',{},{params:{
                // reviewType:2,
                // interfaceType:2,
                pageNum:1,
                pageSize:$scope.numPerPage,
                status:$scope.kwExamine,
            }}).success(function (data) {
               if (data.errorCode == 0) {
                 $scope.stores=data.result;
                 $scope.total = data.total;
                 console.log($scope.stores);

                 $scope.search();
                 // $scope.searchUser(1,$scope.numPerPage);
                 $scope.currentPageStores = $scope.stores;
                 // $scope.searchUser(page,$scope.numPerPage);
               }
            });

            $http.post('http://localhost:8080/yoyo-server/' + 'admin/getAdminById.do',{},{params:{
                adminId:sessionStorage.adminId
                 }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.authAdmin=data.result;
                };
            });
                    
        };

        //审核
        $scope.review = function(id,status){
            $scope.showConfirm = function() {
                //弹窗
                var confirm;

                if(status == 2){
                    confirm = $mdDialog.confirm()
                        .title('是否通过')
                        .ok('确定')
                        .cancel('取消');
                }else if(status == 3){
                     confirm = $mdDialog.confirm()
                        .title('是否拒绝')
                        .ok('确定')
                        .cancel('取消');
                }

                $mdDialog.show(confirm).then(function() {

                    $http({
                       method:'post',
                       url:'http://localhost:8080/yoyo-server/' + 'authentication/modifyAuthentication.do',
                       data: $.param({
                            authenticationId:id,
                            status:status,
                            
                       }),
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (data){
                        if(data){
                           $scope.showAlert("应用成功");
                           $http.post('http://localhost:8080/yoyo-server/' + 'authentication/getAuthenticationList.do',{},{params:{
                                pageNum:1,
                                pageSize:$scope.numPerPage,
                                status:$scope.kwExamine,
                            }}).success(function (data) {
                               if (data.errorCode == 0) {
                                    $scope.stores=data.result;
                                    $scope.total = data.total;
                                    console.log($scope.stores);
                                    $scope.search();
                                    $scope.currentPageStores = $scope.stores;
                                    alert($scope.total);
                                    if($scope.total == 0){
                                        $window.location.reload();
                                    }
                                }else{
                                    $window.location.reload();
                                }
                            });
                        } else {
                            $scope.showAlert(errorMessage);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                ) 
            };

            $scope.showConfirm();
        };


        //批量审核  
        $scope.reviewAll = function(status){
            //弹窗
            var confirm;

            if(status == 2){
                confirm = $mdDialog.confirm()
                    .title('是否批量通过')
                    .ok('确定')
                    .cancel('取消');
            }else if(status == 3){
                confirm = $mdDialog.confirm()
                    .title('是否批量拒绝')
                    .ok('确定')
                    .cancel('取消');
            }

            $mdDialog.show(confirm).then(function() {
                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"authentication/modifyAllAuthentication.do";// 接收上传文件的后台地址
                var temp = ""; 
                var form = new FormData();
                for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性 
                     temp = i; 
                     console.log(temp);
                     form.append("status", status);
                     form.append("authenticationId", temp);
                     form.getTaskDetail
                }
                      
                var xhr = new XMLHttpRequest();
                var response;
                xhr.open("post", modifyTopicUrl, true);
                xhr.send(form);
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200){
                       
                        console.log($scope.selected);
                        for(var i in $scope.selected){
                            temp = i;
                            $(".delete-"+temp).css("display","none");
                                 $scope.total--;
                        }
                       
                        $scope.showAlert("批量操作成功");
                        init();
                        
                    } else if(xhr.readyState == 4 && xhr.status != 200){
                         $scope.showAlert(xhr.errorMessage);
                    }
                    
                }
               
            })
                
            $scope.showAlert = function(txt) {
                
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                ) 
        
            };

        };
        
        //调用初始化函数
        init();
   
    };
       

    //查看详情
    function AuthenticationDetailCtrl($scope,$http,$location,$mdDialog,$timeout,$stateParams){
        
        $timeout($scope.login(),10)


        $scope.backClick = function(){

            $location.path('/authentication/authentication-list');
            
        }
        /*  $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $("#myDeal").attr("disabled",true);
            $("#myManager").attr("disabled",true);
            $(".changeConfirm").css("display","none");
            $("#myManager").css("display","block");
            $(".authentication-manager").css("display",'none');
          
        }*/

        $http.post('http://localhost:8080/yoyo-server/' + 'admin/getAdminById.do',{},{params:{
            adminId:sessionStorage.adminId
             }}).success(function (data) {
            if (data.errorCode == 0) {
                $scope.authAdmin=data.result;
            };
        });
             
        $scope.authenticationId = $location.search().id;
        
        $http.post('http://localhost:8080/yoyo-server/' + 'authentication/getAuthenticationById.do',{},{params:{
            authenticationId:$scope.authenticationId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.authentication = data.result;
                if($scope.authentication.status == 1){
                    $scope.authentication.status = "待审核";
                }else if($scope.authentication.status == 2){
                    $scope.authentication.status = "已通过";
                }else if($scope.authentication.status == 3){
                    $scope.authentication.status = "已被拒";
                }

            } else {
                $scope.showAlert(data.errorMessage);
            }
        });

    };






})();