(function () {
    'use strict';
    angular.module('app.recommend', [])
        .controller('RecommendCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', RecommendCtrl])
        .controller('AddRecommendCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', AddRecommendCtrl])
        .controller('ChangeRecommendCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ChangeRecommendCtrl])


    //修改密码的控制器
    function ChangeRecommendCtrl($scope, $http, $mdDialog, $location, $timeout) {

        

        //绑定表单数据
        $scope.recommend={"title":"","sort":""};

        //如果返回列表
        $scope.backClick = function () {
            $location.path("/recommend/recommend-list");
        }

        $scope.showAlert = function (txt) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
            )

        }


        $scope.recommendId = $location.search().id;   //获取管理员Id
        
        
        //表单回显
        $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/getDetailInfo.do',{},{params:{
            typeId:$scope.recommendId   //管理员Id
        }}).success( function (data){   
            if(data.code == 0){
                $scope.recommend = data.result;     
                $scope.apps=data.result.apps       
            } else {
                $scope.showAlert(data.message);
            }
        });


        $scope.modify=function(){
             //表单回显
        $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/modifyRecommendType.do',{},{params:{
            typeId:$scope.recommendId,
            title:$scope.recommend.title,
            sort:$scope.recommend.sort

        }}).success( function (data){   
            if(data.code == 0){
                $scope.showAlert("修改成功");
            } else {
                $scope.showAlert(data.message);
            }
        });

        }

        //修改密码
        $scope.top = function (id) {
            
            $http.post('http://localhost:8080/applicationMarket-server/' + 'app/top.do', {}, {
                params: {
                    appId:id
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("置顶成功");
                    //重新加载
                    //表单回显
        $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/getDetailInfo.do',{},{params:{
            typeId:$scope.recommendId   //管理员Id
        }}).success( function (data){   
            if(data.code == 0){
                $scope.recommend = data.result;     
                $scope.apps=data.result.apps       
            } else {
                $scope.showAlert(data.message);
            }
        });
                } else {
                    $scope.showAlert(data.message);
                }
            });

        }


        //移除应用
        $scope.remove = function (id) {
            
            $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/removeApp.do', {}, {
                params: {
                    appId:id,
                    recommendTypeId:$scope.recommendId
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("移除成功");
                    $(".delete-"+id).remove();
                } else {
                    $scope.showAlert(data.message);
                }
            });

        }






    }

    //管理员列表的控制器
    function RecommendCtrl($scope, $http, $mdDialog, $location, $timeout) {

        //验证是否登录
        $scope.login = function () {
            if (sessionStorage.recommendId == undefined) {
                $location.path('/page/signin')
            }
        }

        //$timeout($scope.login(),10)
        var init;
        $scope.flag = 0;   //设置一个标记

        $scope.stores = [];
        $scope.kwRecommendName     //姓名
        // $scope.kwRoleId = '0';
        $scope.status = '0';        //状态
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
        $scope.recommendLists = [];
        $scope.allRecommendLists = [];
        $scope.authRecommend = {};

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "43") {
                $scope.isShow = 1;
            }
        }

        //获取管理员列表
        function getRecommendList(pageNum, pageSize) {
            if ($scope.title==undefined) {
                $scope.title=""
            }
            $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/getRecommendTypeList.do', {}, {
                params: {
                    title:$scope.title,
                    pageNum: pageNum,    //当前页数
                    pageSize: pageSize    //每页显示的大小
                }
            }).success(function (data) {

                if (data.code == 0) {
                    $scope.recommendLists = data.result;
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;

                    // console.log($scope.currentPageStores);

                    $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    // console.log($scope.stores);
                } else {
                    $scope.currentPageStores = null;    //变成null，及时更新到页面中
                }
            });
        }


        $scope.export = function () {

            //查询所有管理员记录
            $http.post('http://localhost:8080/bookmall-server/' + 'recommend/getRecommendList.do', {}, {
                params: {
                    recommendName: $scope.kwRecommendName,
                    roleId: $scope.kwRoleId,
                    pageNum: 1,
                    pageSize: $scope.total

                }
            }).success(function (data) {

                if (data.errorCode == 0) {
                    $scope.allRecommendLists = data.result;
                    $scope.stores = data.result;
                    //$scope.currentPageStores = data.result;

                    //注释部分防止页面变化
                    // $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
                    // $scope.total = data.total;
                    // console.log($scope.stores);


                    //数据导入表格（PS：放在export外面会先执行）
                    var obj = {title: "", titleForKey: "", data: ""};
                    obj.title = ["管理员ID", "管理员名称", "管理员密码", "角色名称", "描述", "创建时间"];
                    obj.titleForKey = ["recommendId", "recommendName", "password", "roleName", "description", "createdDate"];
                    obj.data = $scope.allRecommendLists;

                    for (var i in $scope.allRecommendLists) {
                        $scope.allRecommendLists[i].createdDate = formatDate(new Date($scope.allRecommendLists[i].createdDate));
                    }
                    exportCsv(obj);


                }
                ;
            });

        }


        function formatDate(now) {
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }


        function exportCsv(obj) {
            //title ["","",""]
            var title = obj.title;
            //titleForKey ["","",""]
            var titleForKey = obj.titleForKey;
            var data = obj.data;
            var str = [];
            str.push(obj.title.join(",") + "\n");
            for (var i = 0; i < data.length; i++) {
                var temp = [];
                for (var j = 0; j < titleForKey.length; j++) {
                    temp.push(data[i][titleForKey[j]]);
                }
                str.push(temp.join(",") + "\n");
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
            console.log("page:" + page + "---numPerPage:" + $scope.numPerPage);
            getRecommendList(page, $scope.numPerPage);


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
            console.log("dagqina " + $scope.numPerPage);
            getRecommendList(1, $scope.numPerPage);
        };

        // function select(page) {
        //     console.log("page:"+page+"--numPerPage:"+$scope.numPerPage);
        //     getRecommendList(page, $scope.numPerPage);

        // };

        // function onFilterChange() {
        //     $scope.select(1);
        //     $scope.currentPage = 1;
        //     return $scope.row = '';
        // };

        // function onNumPerPageChange() {
        //     $scope.select(1);

        //     return $scope.currentPage = 1;
        // };


        // function search() {
        //     // $scope.filteredStores = $scope.stores;
        //     //console.log($scope.stores);
        //     // return $scope.onFilterChange();
        //      // console.log('$scope.recommendName=='+$scope.recommendName  + ", " + $scope.account+"---"+$scope.status);

        //     getRecommendList(1, $scope.numPerPage);

        // };


        init = function () {
            // console.log($scope.numPerPage);

            // getRoleList(1, 100);

            // console.log(:$scope.kwRecommendName+"----"+$scope.account+);
            $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/getRecommendTypeList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage
                }
            }).success(function (data) {
                console.log(data)
                if (data.code == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;

                    console.log($scope.stores);
                    $scope.search();

                    $scope.currentPageStores = $scope.stores;

                }
                ;
            });


            /*$http.post('http://localhost:8080/bookmall-server/' + 'recommend/getRecommendById.do',{},{params:{
                recommendId:sessionStorage.recommendId
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.authRecommend=data.result;
                    console.log($scope.authRecommend.roleId);
                };
            });*/


        };

        //弹出对话框
        $scope.showAlert = function (txt) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
            )

        }


        // //重置密码
        // $scope.deleteRecommend = function (id) {
        //     $http.post("http://localhost:8080/applicationMarket-server/" + "recommend/deleteRecommend.do", {}, {
        //         params: {
        //             recommendId: id
        //         }
        //     }).success(function (data) {
        //         if (data.code == 0) {
        //             $scope.showAlert("删除成功");
        //         } else {
        //             $scope.showAlert(data.message);
        //         }

        //     })
        // }


        

        // 删除分类
        $scope.deleteRecommend = function (id) {
            $scope.showConfirm = function () {
                // 确定
                var confirm = $mdDialog.confirm()
                    .title('是否确定删除该分类')
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirm).then(function () {
                    // console.log('确定')
                    $http.post("http://localhost:8080/applicationMarket-server/" + "recommendType/deleteRecommendType.do?", {}, {
                        params: {
                            recommendTypeId: id
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            $scope.showAlert("删除成功");
                            $(".delete-"+id).empty();   //删除这一行数据
                        } else {
                            $scope.showAlert(data.message);
                        }

                    })
                }, function () {
                    $scope.showAlert("取消删除");
                });
            };


            $scope.showConfirm();
        }

        //修改密码
        $scope.recommendId = $location.search().id;
        $scope.recommendName = $location.search().name;
        $scope.roleName = $location.search().roleName;
        // 获取权限列表
        // $http.post('http://localhost:8080/bookmall-server/' + 'recommend/getAuthorityList2.do',{},{params:{
        // }}).success(function (data) {
        //     if (data.errorCode == 0) {
        //         $scope.authorityList=data.result;
        //         console.log($scope.authorityList);
        //         //  获取用户权限val
        //         $http.post("http://localhost:8080/bookmall-server/"+"recommend/getRecommendAuthorityList.do?",{},{params:{
        //             recommendId:$scope.recommendId
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
        //             // $scope.showAlert(data.message);
        //         }

        //     })
        //     };
        // });

        function queryCheckedValue() {

            var authoritys = "";
            $("input:checkbox[name='authoritys']:checked").each(function (i) {
                var val = $(this).val();
                authoritys = authoritys + val + ",";
            });
            return authoritys;
        }

        $scope.changePsd = function () {
            var authoritys = queryCheckedValue();
            console.log(authoritys);
            $scope.showConfirm = function () {
                // 确定
                var confirm = $mdDialog.confirm()
                    .title('是否确定修改参数')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirm).then(function () {

                    $http.post("http://localhost:8080/bookmall-server/" + "recommend/modifyRecommend.do?", {}, {
                        params: {
                            recommendId: $scope.recommendId,
                            roleId: $scope.kwRoleIds,
                            password: $scope.Psw,
                            authoritys: authoritys
                        }
                    }).success(function (data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("修改成功");
                        } else {
                            $scope.showAlert(data.message);
                        }

                    })
                }, function () {

                    $scope.showAlert("取消修改");
                });
            };
            $scope.showAlert = function (txt) {

                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                ).then(function () {
                    $location.path('/recommend/recommend-list')
                })

            }
            $scope.showAlert1 = function (txt) {

                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                )

            }
            $scope.showConfirm();
        }

        $scope.backClick = function () {
            $location.path("/recommend/recommend-list");
        }

        init();
    }


    //添加管理员的控制器
    function AddRecommendCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.isAddRecommend = 0;
        $scope.isShow = 0;
        $scope.selectAuthories;

        $scope.backClick = function () {
            $location.path("/recommend/recommend-list");
        }

        $scope.login = function () {
            if (sessionStorage.recommendId == undefined) {
                $location.path('')
            }
        }

        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "44") {
                $scope.isShow = 1;
            }
        }
        //$timeout($scope.login(),10)
        $scope.recommend = {title: '', sort1: ''};

        


        // getRoleList(1, 100);

        //获取点击的权限列表
        function queryCheckedValue() {

            var authoritys = "";
            $("input:checkbox[name='authoritys']:checked").each(function (i) {
                var val = $(this).val();
                authoritys = authoritys + val + ",";
            });
            return authoritys;
        }

        //添加管理员
        $scope.addRecommend = function () {
            // var authoritys = queryCheckedValue();
            // console.log("authoritys=" + authoritys);
            $scope.showConfirm = function () {
                // 确定
                var confirm = $mdDialog.confirm()
                    .title('是否确定添加新的分类')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定添加')
                    .cancel('取消添加');
                $mdDialog.show(confirm).then(function () {
                    // console.log('确定')


                    $http.post("http://localhost:8080/applicationMarket-server/" + "recommendType/addRecommendType.do?", {}, {
                        params: {
                            title:$scope.recommend.title,
                            sort:$scope.recommend.sort1
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert(data.message);
                        }

                    })
                }, function () {
                    // console.log('取消')
                    $scope.showAlert("取消添加");
                });
            };
            $scope.showAlert = function (txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                ).then(function () {
                    // $location.path('/recommend/recommend-list');
                })

            }
            $scope.showAlert1 = function (txt) {
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
