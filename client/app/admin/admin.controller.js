(function(){
	'use strict';


	angular.module('app.admin',[])
  .controller('AdminCtrl',['$scope','$http','$mdDialog','$location','$timeout',AdminCtrl])
  .controller('AddAdminCtrl',['$scope','$http','$mdDialog','$location','$timeout',AddAdminCtrl])
  .controller('ChangeAdminCtrl',['$scope','$http','$mdDialog','$location','$timeout',ChangeAdminCtrl])


    //修改密码的控制器
   function ChangeAdminCtrl($scope,$http,$mdDialog,$location,$timeout) {

        $scope.oldPassword;   //原密码
        $scope.newPassword;  //新密码
        $scope.confirmPassword;

        $scope.backClick = function(){
            $location.path("/admin/admin-list");
            }

        //修改密码
        $scope.modifyPassword=function(){
            // console.log($scope.oldPassword+"----"+$scope.newPassword+"---"+$scope.confirmPassword);
            if ($scope.newPassword=="") {
                $scope.newPassword=undefined;
            }

            if ($scope.oldPassword=="") {
                $scope.oldPassword=undefined;
            }

            if ($scope.newPassword==""||$scope.newPassword==null) {
                alert("新密码不能为空");
                return;
            }

            if ($scope.newPassword.length<6||$scope.length>20) {
                alert("密码必须是6-20位之间");
                return;
            }

            if ($scope.confirmPassword!=$scope.newPassword) {
                alert("新密码和确认密码不一致");
                return;
            }

            $http.post('http://localhost:8080/lifecrystal-server/' + 'admin/modifyPassword.do',{},{params:{
                oldPassword:$scope.oldPassword,   
                newPassword:$scope.newPassword,      
                adminId:sessionStorage.adminId  
            }}).success(function (data) {
               if (data.successCode == 100200) {
                    alert(data.successMessage);
            }else{
                // $scope.currentPageStores=null;    //变成null，及时更新到页面中
                alert(data.errorMessage);
            }
        });

        }   

   }

  //管理员列表的控制器
  function AdminCtrl($scope,$http,$mdDialog,$location,$timeout) {

    //验证是否登录
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('/page/signin')
        }
    }

        //$timeout($scope.login(),10)
        var init;
        $scope.flag=0;   //设置一个标记

        $scope.stores = [];
        $scope.kwAdminName     //姓名
        // $scope.kwRoleId = '0';
        $scope.status='0';        //状态  
        $scope.account;
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
        $scope.adminLists = [];
        $scope.allAdminLists = [];
        $scope.authAdmin={};

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "1") {
                $scope.isShow = 1;
            }
        }

        //获取管理员列表
        function getAdminList(pageNum, pageSize){
            if($scope.account==""){
                $scope.account=undefined;
            }
            if($scope.kwAdminName==""){
                $scope.kwAdminName=undefined;
            }
            if($scope.status==""){
                $scope.status=undefined;
            }
             console.log('$scope.adminName=='+$scope.adminName  + ", " + $scope.account+"---"+$scope.status);
             $http.post('http://localhost:8080/lifecrystal-server/' + 'admin/getAdminList.do',{},{params:{
                adminName:$scope.kwAdminName,   //用户名
                status:$scope.status,   //状态
                account:$scope.account,   //账号
                pageNum:pageNum,    //当前页数
                pageSize:pageSize    //每页显示的大小
            }}).success(function (data) {
               if (data.successCode == 100200) {
                $scope.adminLists=data.result;
                $scope.stores=data.result;
                $scope.currentPageStores = data.result;
                
                console.log($scope.currentPageStores);

                $scope.filteredStores = data.result;
                $scope.currentPageStores.$apply;
                $scope.total = data.total;
                console.log($scope.stores);
            }else{
                $scope.currentPageStores=null;    //变成null，及时更新到页面中
            }
        });
        }



        $scope.export = function(){

            //查询所有管理员记录
            $http.post('http://localhost:8080/bookmall-server/' + 'admin/getAdminList.do',{},{params:{
                adminName:$scope.kwAdminName,
                roleId:$scope.kwRoleId,
                pageNum:1,
                pageSize:$scope.total
                
            }}).success(function (data) {

                if (data.errorCode == 0) {
                    $scope.allAdminLists=data.result;
                    $scope.stores=data.result;
            //$scope.currentPageStores = data.result;
            
            //注释部分防止页面变化
            //$scope.filteredStores = data.result;
            //$scope.currentPageStores.$apply;
            //$scope.total = data.total;
            console.log($scope.stores);


            //数据导入表格（PS：放在export外面会先执行）
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["管理员ID","管理员名称","管理员密码","角色名称","描述","创建时间"];
            obj.titleForKey = ["adminId","adminName","password","roleName","description","createdDate"];
            obj.data = $scope.allAdminLists;

            for(var i in $scope.allAdminLists){
                $scope.allAdminLists[i].createdDate = formatDate(new Date($scope.allAdminLists[i].createdDate));
            }
            exportCsv(obj);


        };
    });

        }


        function   formatDate(now)   {     
          var   year=now.getFullYear();     
          var   month=now.getMonth()+1;     
          var   date=now.getDate();     
          var   hour=now.getHours();     
          var   minute=now.getMinutes();     
          var   second=now.getSeconds();     
          return   year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;     
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
            var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str.join(""));  
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "管理员列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }



        function select(page) {
            getAdminList(page, $scope.numPerPage);

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
            // $scope.filteredStores = $scope.stores;
            //console.log($scope.stores);
            // return $scope.onFilterChange();
             // console.log('$scope.adminName=='+$scope.adminName  + ", " + $scope.account+"---"+$scope.status);

            getAdminList(1, $scope.numPerPage);

        };


        init = function() {
            // console.log($scope.numPerPage);

            // getRoleList(1, 100);

            // console.log(:$scope.kwAdminName+"----"+$scope.account+);
            $http.post('http://localhost:8080/lifecrystal-server/' + 'admin/getAdminList.do',{},{params:{
                // adminName:$scope.kwAdminName,
                // account:$scope.account,
                // status:$scope.status,
                pageNum:1,
                pageSize:$scope.numPerPage
            }}).success(function (data) {
                if (data.successCode == 100200) {
                    $scope.stores=data.result;
                    $scope.total = data.total;

                    // console.log($scope.stores);
                    $scope.search();

                    $scope.currentPageStores = $scope.stores;

                };
            });


            /*$http.post('http://localhost:8080/bookmall-server/' + 'admin/getAdminById.do',{},{params:{
                adminId:sessionStorage.adminId
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.authAdmin=data.result;
                    console.log($scope.authAdmin.roleId);
                };
            });*/






        };

        //弹出对话框
        $scope.showAlert = function(txt) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(false)
                                    .title(txt)
                                    .ok('确定')
                                    ) 

                            }


        //重置密码
        $scope.resetPassWord=function(id){
            $http.post("http://localhost:8080/lifecrystal-server/"+"admin/resetPassword.do?",{},{params:{
                            adminId:id
                        }}).success(function (data){
                            if(data.successCode == 100200){
                                $scope.showAlert("密码重置成功");
                           } else {
                              $scope.showAlert(data.errorMessage);
                          }

                    })
        }



            // 启用管理员
            $scope.startAdmin = function(id){
                $scope.showConfirm = function() {
                    // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定启用该条管理员')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
                        // console.log('确定')
                        $http.post("http://localhost:8080/lifecrystal-server/"+"admin/startAdmin.do?",{},{params:{
                            adminId:id
                        }}).success(function (data){
                            if(data.successCode == 100200){
                                $scope.showAlert("启用管理员成功");
                                for(var i=0;i<$scope.stores.length;i++){
                                    if ($scope.stores[i].adminId==id) {
                                        $scope.stores[i].deleted=1;  //设置已经注销
                                        // $scope.stores[i].
                                    }
                                }
                           } else {
                              $scope.showAlert(data.errorMessage);
                          }

                      })
                    }, function() {

                        $scope.showAlert("取消启用");
                    });
                            };


                            


                            $scope.showConfirm();
                        }






            // 注销管理员
            $scope.deleteAdmin = function(id){
                $scope.showConfirm = function() {
                    // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定注销该条管理员')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
                        // console.log('确定')
                        $http.post("http://localhost:8080/lifecrystal-server/"+"admin/logout.do?",{},{params:{
                            adminId:id
                        }}).success(function (data){
                        	if(data.successCode == 100200){
                        		$scope.showAlert("注销管理员成功");
                                for(var i=0;i<$scope.stores.length;i++){
                                    if ($scope.stores[i].adminId==id) {
                                        $scope.stores[i].deleted=2;  //设置已经注销
                                        // $scope.stores[i].
                                    }
                                }
                                // $location.path("/admin/admin-list");
                                // $("#status-"+id).text("已注销");
                                // $scope.flag=2;
                                // $("#operation-"+id).text("启用");
                               // $scope.total--;
                           } else {
                              $scope.showAlert(data.errorMessage);
                          }

                      })
                    }, function() {
                        $scope.showAlert("取消注销");
                    });
                            };


                            


                            $scope.showConfirm();
                        }

        //修改密码
        $scope.adminId = $location.search().id;
        $scope.adminName = $location.search().name;
        $scope.roleName = $location.search().roleName;
        // 获取权限列表
        // $http.post('http://localhost:8080/bookmall-server/' + 'admin/getAuthorityList2.do',{},{params:{
        // }}).success(function (data) {
        //     if (data.errorCode == 0) {
        //         $scope.authorityList=data.result;
        //         console.log($scope.authorityList);
        //         //  获取用户权限val
        //         $http.post("http://localhost:8080/bookmall-server/"+"admin/getAdminAuthorityList.do?",{},{params:{
        //             adminId:$scope.adminId
        //         }}).success(function (data){
        //             if(data.errorCode == 0){
        //                 $scope.authorityValList = data.result;
        //                 console.log($scope.authorityValList);
        //                 var authorityValList = data.result;
        //                 $(authorityValList).each(function (i,dom){
        //                     console.log(dom)
        //                     $("input:checkbox[value='"+dom+"']").prop("checked",true);
        //                 // $(":checkbox[id='"+dom+"']").prop("checked",true);
        //             });
        //             } else {
        //             // $scope.showAlert(data.errorMessage);
        //         }

        //     })
        //     };
        // });
        
        function queryCheckedValue() {

            var authoritys = "";
            $("input:checkbox[name='authoritys']:checked").each(function(i) {
                var val = $(this).val();
                authoritys = authoritys + val + ",";
            });
            return authoritys;
        }
        $scope.changePsd = function(){
            var authoritys = queryCheckedValue();
            console.log(authoritys);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改参数')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {

                                $http.post("http://localhost:8080/bookmall-server/"+"admin/modifyAdmin.do?",{},{params:{
                                    adminId:$scope.adminId,
                                    roleId:$scope.kwRoleIds,
                                    password:$scope.Psw,
                                    authoritys:authoritys
                                }}).success(function (data){
                                    if(data.errorCode == 0){
                                        $scope.showAlert("修改成功");
                                    } else {
                                        $scope.showAlert(data.errorMessage);
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
                                    $location.path('/admin/admin-list')
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
                            $location.path("/admin/admin-list");
                        }

                        init();
                    }





                    //添加管理员的控制器
                    function AddAdminCtrl($scope,$http,$mdDialog,$location,$timeout){
                        $scope.isAddAdmin = 0;
                        $scope.isShow = 0;
                        $scope.selectAuthories;

                        $scope.backClick = function(){
                            $location.path("/admin/admin-list");
                        }

                        $scope.login = function(){
                            if(sessionStorage.adminId == undefined){
                                $location.path('')
                            }
                        }

                        var authoritySet = sessionStorage.authoritySet.split(',');
                        for (var i = 0; i < authoritySet.length; i++) {
                            if (authoritySet[i] == "1") {
                                $scope.isShow = 1;
                            }
                        }
        //$timeout($scope.login(),10)
        $scope.admin = {adminName:'', password:'', account:'',description:''};

        // $http.post('http://localhost:8080/bookmall-server/' + 'admin/getAdminById.do',{},{params:{
        //     adminId:sessionStorage.adminId
        // }}).success(function (data) {
        //     if (data.errorCode == 0) {
        //         $scope.authAdmin=data.result;
        //         console.log($scope.authAdmin.roleId);
        //     };
        // });

        // 获取权限列表
        $http.post('http://localhost:8080/lifecrystal-server/' + 'authority/getAuthorityList.do',{},{params:{
            pageSize:100,
            pageNum:1
        }}).success(function (data) {
            if (data.successCode == 100200) {
                $scope.authorityList=data.result;
                console.log($scope.authorityList);

            };
        });

        // function getRoleList(pageNum, pageSize){

        //      $http.post('http://localhost:8080/bookmall-server/' + 'role/getRoleList.do',{},{params:{
        //         pageNum:pageNum,
        //         pageSize:pageSize
        //     }}).success(function (data) {
        //         if (data.errorCode == 0) {
        //             $scope.roleList=data.result;
        //             console.log($scope.stores);
        //         };
        //     });
        // }


    // getRoleList(1, 100);

    //获取点击的权限列表
    function queryCheckedValue() {

        var authoritys = "";
        $("input:checkbox[name='authoritys']:checked").each(function(i) {
            var val = $(this).val();
            authoritys = authoritys + val + ",";
        });
        return authoritys;
    }

    //添加管理员
    $scope.addAdmin = function(){
        var authoritys = queryCheckedValue();
        console.log("authoritys="+authoritys);
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加新的管理员')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')



                    $http.post("http://localhost:8080/lifecrystal-server/"+"admin/addAdmin.do?",{},{params:{
                        adminName:$scope.admin.adminName,
                        password:$scope.admin.password,
                        account:$scope.admin.account,
                        description:$scope.admin.description,
                        authoritys: authoritys
                    }}).success(function (data){
                        if(data.successCode == 100200){
                            $scope.showAlert("添加管理员成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
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
                                    // $location.path('/admin/admin-list');
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
