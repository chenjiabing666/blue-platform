(function(){
	'use strict';


	angular.module('app.role',[])
		.controller('RoleCtrl',['$scope','$http','$mdDialog','$location','$timeout',RoleCtrl])
		.controller('AddRoleCtrl',['$scope','$http','$mdDialog','$location','$timeout',AddRoleCtrl])
        .controller('ChangeRoleCtrl',['$scope','$http','$mdDialog','$location','$timeout',ChangeRoleCtrl])

	function RoleCtrl($scope,$http,$mdDialog,$location,$timeout) {

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwAdminName = '';
        $scope.kwRoleId = '0';
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

        $scope.isListRole = 0;
        $scope.isAddRole = 0;
        $scope.isEditRole = 0;
        $scope.isDeleteRole = 0;

        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            console.log(authoritySet[i]);
            if (authoritySet[i] == "listRole") {
                $scope.isListRole = 1;
            } else if (authoritySet[i] == "addRole") {
                $scope.isAddRole = 1;
            } else if (authoritySet[i] == "editRole") {
                $scope.isEditRole = 1;
            } else if (authoritySet[i] == "deleteRole") {
                $scope.isDeleteRole = 1;
            }
        }



    function getRoleList(pageNum, pageSize){

       $http.post('http://localhost:8080/fenxiao-server/' + 'role/getRoleList.do',{},{params:{
       		pageNum:pageNum,
       		pageSize:pageSize,
            roleName:$scope.kwRoleName
       		}}).success(function (data) {
       		if (data.errorCode == 0) {
         	$scope.stores=data.result;
         	$scope.currentPageStores = data.result;
         	$scope.filteredStores = data.result;
         	$scope.currentPageStores.$apply;
         	$scope.total = data.total;
         	console.log($scope.stores);
       		};
    	});
	}
  

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;

            console.log('$scope.kwRoleName=='+$scope.kwRoleName);


                getRoleList(page, $scope.numPerPage);
            

           
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




   


      $http.post('http://localhost:8080/fenxiao-server/' + 'role/getRoleList.do',{},{params:{
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

        // 删除角色
        $scope.deleteRole = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定删除该条角色信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/fenxiao-server/"+"role/delRole.do?",{},{params:{
                        roleId:id
                    }}).success(function (data){
                    	if(data.errorCode == 0){
                    		$scope.showAlert("删除角色成功");
                        	$(".delete-"+id).css("display","none");
                        	$scope.total--;
                    	} else {
                    		$scope.showAlert(data.errorMessage);
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

        //修改密码
        $scope.roleId = $location.search().id;
        $scope.roleName = $location.search().name;


        $scope.authoritySet = [];
        $scope.selectModuleModify = function(authorityId, checkStatus){
        if(checkStatus){

          $scope.authoritySet.push(authorityId);
        
        }else{

        removeByValue($scope.authoritySet, authorityId);

        }

        console.log("authoritySet is " + $scope.authoritySet + ", checkStatus is" + checkStatus);


        }
        console.log($scope.description);

        $scope.modifyRole = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定修改角色')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                   

                    $http.post("http://localhost:8080/fenxiao-server/"+"role/modifyRole.do?",{},{params:{
                        roleId:$scope.roleId,
                        roleName:$scope.roleName,
                        authorityList:$scope.authoritySet,
                        description:$scope.role.description
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("角色修改成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
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
                        .ok('确定')
                ).then(function(){
                    $location.path('/role/role-list')
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

        $scope.backClick = function(){
            $location.path("/role/role-list");
        }

        init();
    }


    function AddRoleCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.isAddRole = 0;
        var authoritySetAdd = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySetAdd.length; i++) {
            if (authoritySetAdd[i] == "addRole") {
                $scope.isAddRole = 1;
            }
        }

        $scope.backClick = function(){
            $location.path("/role/role-list");
        }

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

       $scope.role = {roleName:'', description:''};

        

      function getAuthorityList(){

       $http.post('http://localhost:8080/fenxiao-server/' + 'authority/getAuthorityList.do',{},{params:{
            }}).success(function (data) {
            if (data.errorCode == 0) {
            $scope.authorityList=data.result;
           
            console.log($scope.stores);
            };
        });
    }


  getAuthorityList();

  $scope.authoritySet = [];

  function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}



   $scope.selectModule = function(authorityId, checkStatus){

    if(checkStatus){

      $scope.authoritySet.push(authorityId);
    }else{

    removeByValue($scope.authoritySet, authorityId);

    }


console.log("authoritySet is " + $scope.authoritySet + ", checkStatus is" + checkStatus);


   }

      $scope.addRole = function(){


            
            $scope.showConfirm = function() {
                            // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定添加新的角色')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')



                    $http.post("http://localhost:8080/fenxiao-server/"+"role/addRole.do?",{},{params:{
                        roleName:$scope.role.roleName,
                        authorityList:$scope.authoritySet,
                        description:$scope.role.description
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("添加角色成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
                        }
                        
                    })
                }, function() {
                    // console.log('取消')
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
                    $location.path('/role/role-list');
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



      function ChangeRoleCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.roleId = $location.search().id;
        $scope.roleName = $location.search().name;

        $http.post('http://localhost:8080/fenxiao-server/' + 'role/getRoleByRoleId.do',{},{params:{
            roleId:$scope.roleId
            }}).success(function (data) {
            if (data.errorCode == 0) {
            $scope.role=data.result;
           
            console.log($scope.stores);
            };
        });

        console.log(" $scope.roleId  ===" + $scope.roleId );

        $scope.role = {roleName:'', description:''};



      function getAuthorityList(){

       $http.post('http://localhost:8080/fenxiao-server/' + 'authority/getAuthorityList.do',{},{params:{
            }}).success(function (data) {
            if (data.errorCode == 0) {
            $scope.authorityList=data.result;
           
            console.log($scope.stores);
            };
        });
    }


  getAuthorityList();

  $scope.authoritySet = [];

  function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}



   $scope.selectModuleUpdate = function(authorityId, checkStatus){

    if(checkStatus){

      $scope.authoritySet.push(authorityId);
    }else{

    removeByValue($scope.authoritySet, authorityId);

    }


console.log("authoritySet is " + $scope.authoritySet + ", checkStatus is" + checkStatus);


   }


        $scope.modifyRole = function(){
            
            $scope.showConfirm = function() {
                            // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定修改角色')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')

                    console.log("$scope.role.roleId ===" + $scope.role.roleId);

                    $http.post("http://localhost:8080/fenxiao-server/"+"role/modifyRole.do?",{},{params:{
                        roleId:$scope.roleId,
                        roleName:$scope.roleName,
                        authorityList:$scope.authoritySet,
                        description:$scope.role.description
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改角色成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
                        }
                        
                    })
                }, function() {
                    // console.log('取消')
                    $scope.showAlert("取消修改");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                ).then(function(){
                    $location.path('/role/role-list');
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