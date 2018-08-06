(function() {
    // 'use strict';
    angular.module('app.banner')
    .controller('BannerCtrl', ['$scope', '$filter', '$http', '$mdDialog', BannerCtrl])
    .controller('BannerDetailCtrl', ['$scope', '$http', '$location', '$mdDialog', BannerDetailCtrl])
    .controller('AddBannerCtrl', ['$scope', '$http', '$mdDialog', AddBannerCtrl]) //,'$upload'
    // .controller('ImageCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ImageCtrl])
    // .controller('AddImageCtrl', ['$scope', '$http', '$mdDialog', AddImageCtrl]) //,'$upload'
    .controller('ChangeBannerCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeBannerCtrl])
    function BannerCtrl($scope, $filter, $http, $mdDialog) {
        var idTmr;

        function getExplorer() {
            var explorer = window.navigator.userAgent;
            //ie 
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
            //firefox 
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
            //Chrome
            else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            }
            //Opera
            else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            }
            //Safari
            else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        }
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
        $scope.hstep = "理财一对一"
        $scope.options = ["理财一对一", "活动预览", "理财小常识"]
        $scope.activated1 = "是";
        $scope.activated2 = "否";



       // bannerName,bannerLocation,bannerType,activated,startDate,endDate
       $scope.bannerName;
       $scope.bannerLocation;
       $scope.bannerType;
       $scope.activated;
       $scope.startDate;
       $scope.endDate;


        $scope.getTable = function() {
            method1("newTable");
        }
        $scope.getallTable = function() {
            method1("allnewTable");
        }
        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "47") {
                $scope.isShow = 1;
            }
        }


        //获取广告列表
        function getBannerList(pageNum, pageSize) {
            // console.log($scope.bannerType=="");
            // console.log($scope.bannerType+"---"+$scope.bannerLocation+"----"+$scope.activated);
            console.log($scope.endDate+"---"+$scope.startDate);
            if ($scope.bannerName=="") {
                $scope.bannerName=undefined;
            }

            if ($scope.bannerLocation=="") {
                $scope.bannerLocation=undefined;
            }

            if ($scope.bannerType=="") {
                $scope.bannerType=undefined;
            }

            if ($scope.activated=="") {
                $scope.activated=undefined;
            }

            if ($scope.startDate=="") {
                $scope.startDate=undefined;
            }


            if ($scope.endDate=="") {
                $scope.endDate=undefined;
            }

            $http.post('http://localhost:8080/lifecrystal-server/' + 'banner/getBannerList.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    bannerName:$scope.bannerName,
                    bannerLocation:$scope.bannerLocation,
                    bannerType:$scope.bannerType,
                    activated:$scope.activated,
                    startDate:$scope.startDate,
                    endDate:$scope.endDate
                }
            }).success(function(data) {
                if (data.successCode == 0) {
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                }else{
                    $scope.stores = null;
                }
            });
        } 

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            //console.log('$scope.numPerPage=='+$scope.numPerPage);
            getBannerList(page, $scope.numPerPage);
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
            $scope.endDate=$("#endDate").val();
            $scope.startDate=$("#startDate").val();
            $scope.filteredStores = $scope.stores;
            ////console.log($scope.stores);
            return $scope.onFilterChange();
        };


        //置顶
        $scope.topBanner = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该广告确定置顶?')
                    
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/lifecrystal-server/' + 'banner/topBanner.do',
                        data: $.param({
                            bannerId: id
                            // activated: 2
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        // console.log(data.errorCode)
                        if (data.successCode==100200) {
                            $scope.showAlert("置顶成功");
                            init();
                            
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
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




        // 上线
        $scope.makeEffect = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该广告是否上线')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/lifecrystal-server/' + 'banner/upBanner.do',
                        data: $.param({
                            bannerId: id
                            // activated: 2
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        // console.log(data.errorCode)
                        if (data.successCode==100200) {
                            $scope.showAlert("上线成功");
                            for(var i=0;i<$scope.stores.length;i++){
                                if ($scope.stores[i].bannerId==id) {
                                    $scope.stores[i].activated=1;
                                    return;
                                }
                            };
                            
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
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
        
        // 下线
        $scope.makeUnEffect = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该广告是否下线')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/lifecrystal-server/' + 'banner/downBanner.do',
                        data: $.param({
                            bannerId: id
                            // activated: 1
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        if (data.successCode=100200) {
                            $scope.showAlert("下线成功");
                            for(var i=0;i<$scope.stores.length;i++){
                                if ($scope.stores[i].bannerId==id) {
                                    $scope.stores[i].activated=2;
                                    return;
                                }
                            };
                            // init();
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    })
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };
            
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
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
        init = function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'banner/getBannerList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage
                }
            }).success(function(data) {
                if (data.successCode == 0) {
                    console.log(data.result);
                    console.log("type:"+$scope.bannerType);
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                };
            });
        };


        // 删除公告
        $scope.deleteBanner = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除该广告')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/lifecrystal-server/' + 'banner/deleteBanner.do',
                        data: $.param({
                            bannerId: id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        if (data.successCode == 0) {
                            $scope.showAlert("删除广告成功");
                            // getBannerList($scope.currentPage, $scope.numPerPage);
                            $(".delete-"+id).remove();
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    })
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消删除图片");
                });
            };


            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
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
        // 搜索公告
        // $scope.searchBanner = function(){
        //     $scope.bannerName = $(".bannerName").val();
        //     $scope.bannerType = $(".bannerType option:selected").text();
        //     // //console.log($scope.bannerName);
        //     // //console.log($scope.bannerType);
        //     switch($scope.bannerType){
        //         case '主页banner': $scope.bannerType = 1;break;
        //         case '成功案例banner'  : $scope.bannerType = 2;break;
        //         case '活动介绍banner': $scope.bannerType = 3;break;
        //         case '员工风采banner': $scope.bannerType = 4;break;
        //         case '培训和发展banner'  : $scope.bannerType = 5;break;
        //         case '企业社会责任banner': $scope.bannerType = 6;break;
        //         case '行业殊荣banner': $scope.bannerType = 7;break;
        //     }
        //     //console.log($scope.bannerType);
        //     $http.post('http://139.196.7.76:8080/chinatravel-server/' + 'Banner/',{},{params:{
        //     }}).success(function (data){
        //     })
        // }
        function initall(pageNum, pageSize) {
            $http({
                method: 'POST',
                url: 'http://localhost:8080/lifecrystal-server/' + 'banner/getBannerList.do',
                data: $.param({
                    pageNum: 1,
                    pageSize: 200
                }), //序列化参数
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.allstores = data.result;
                };
            });
        }
        initall();
        init();
    }

    function BannerDetailCtrl($scope, $http, $location, $mdDialog) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)
        $scope.backClick = function() {
            $location.path('/Banner/banner-list');
        }
        $scope.cancelClick = function() {
            $(".banner-detail input").attr('disabled', true);
            $(".bannerType").css("display", "block");
            $(".bannerTypeSelect").css("display", "none");
            $(".changeConfirm").css("display", "none");
            $(".cancelClick").css("display", "none");
            switch ($scope.banner.type) {
                case '主页banner':
                    $scope.bannerType = 1;
                    break;
                case '成功案例banner':
                    $scope.bannerType = 2;
                    break;
                case '活动介绍banner':
                    $scope.bannerType = 3;
                    break;
                case '员工风采banner':
                    $scope.bannerType = 4;
                    break;
                case '培训和发展banner':
                    $scope.bannerType = 5;
                    break;
                case '企业社会责任banner':
                    $scope.bannerType = 6;
                    break;
                case '行业殊荣banner':
                    $scope.bannerType = 7;
                    break;
            }
        }
        $scope.bannerId = $location.search().id;
        //console.log($location.search().id);
        //console.log($scope.bannerId);
        $http.post('https://www.citsgbt.com/chinatravel-php/app/index.php?r=Banner/GetBannerById', {}, {
            params: {
                bannerId: $scope.bannerId
            }
        }).success(function(data) {
            if (data.errorCode == 0) {
                $scope.banner = data.result;
                switch ($scope.banner.type) {
                    case 1:
                        $scope.banner.type = "首页banner图";
                        break;
                }
            }
        })
        // 修改
        $scope.changeClick = function() {
            //console.log("修改")
            $(".banner-detail input").attr('disabled', false);
            $(".bannerId").attr('disabled', true);
            $(".bannerType").css("display", "none");
            $(".cancelClick").css("display", "inline");
            $(".bannerTypeSelect").css("display", "block");
            $(".changeConfirm").css("display", "block");
        }
        // 确认修改
        $scope.changeConfirm = function() {
            switch ($scope.banner.type) {
                case '主页banner':
                    $scope.bannerType = 1;
                    break;
                case '成功案例banner':
                    $scope.bannerType = 2;
                    break;
                case '活动介绍banner':
                    $scope.bannerType = 3;
                    break;
                case '员工风采banner':
                    $scope.bannerType = 4;
                    break;
                case '培训和发展banner':
                    $scope.bannerType = 5;
                    break;
                case '企业社会责任banner':
                    $scope.bannerType = 6;
                    break;
                case '行业殊荣banner':
                    $scope.bannerType = 7;
                    break;
            }
            //console.log('id='+$scope.banner.bannerId);
            //console.log('type='+$scope.banner.type);
            //console.log($scope.banner.imageUrl);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改图片信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    //console.log('id='+$scope.banner.bannerId);
                    //console.log('type='+$scope.banner.type);
                    //console.log($scope.banner.imageUrl);
                    // $http.post("http://139.196.7.76:8080/chinatravel-server/"+"Banner/modifyBanner",{},{params:{
                    //     bannerId:$scope.banner.bannerId,
                    //     type:$scope.banner.type,
                    //     imageUrl:$scope.banner.imageUrl
                    // }}).success(function (data){
                    //     if(data.errorCode == 0){
                    //         $scope.showAlert("修改图片信息成功");
                    //     } else {
                    //         $scope.showAlert1(data.errorMessage);
                    //     }
                    // })
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: "http://139.196.7.76:8080/chinatravel-server/" + "Banner/ModifyBanner",
                        data: {
                            bannerId: $scope.banner.bannerId,
                            type: $scope.banner.type,
                            imageUrl: $scope.banner.imageUrl
                        },
                        success: function(data) {
                            if (data) {
                                $scope.showAlert("修改图片信息成功");
                            } else {
                                $scope.showAlert1(data.errorMessage);
                            }
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert1("取消修改图片信息");
                });
            };
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                ).then(function() {
                    $(".banner-detail input").attr('disabled', true);
                    $(".bannerType").css("display", "block");
                    $(".bannerTypeSelect").css("display", "none");
                    $(".changeConfirm").css("display", "none");
                    $(".cancelClick").css("display", "none");
                    switch ($scope.banner.type) {
                        case '主页banner':
                            $scope.bannerType = 1;
                            break;
                        case '成功案例banner':
                            $scope.bannerType = 2;
                            break;
                        case '活动介绍banner':
                            $scope.bannerType = 3;
                            break;
                        case '员工风采banner':
                            $scope.bannerType = 4;
                            break;
                        case '培训和发展banner':
                            $scope.bannerType = 5;
                            break;
                        case '企业社会责任banner':
                            $scope.bannerType = 6;
                            break;
                        case '行业殊荣banner':
                            $scope.bannerType = 7;
                            break;
                    }
                })
            }
            $scope.showAlert1 = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                ).then(function() {
                    switch ($scope.banner.type) {
                        case '主页banner':
                            $scope.bannerType = 1;
                            break;
                        case '成功案例banner':
                            $scope.bannerType = 2;
                            break;
                        case '活动介绍banner':
                            $scope.bannerType = 3;
                            break;
                        case '员工风采banner':
                            $scope.bannerType = 4;
                            break;
                        case '培训和发展banner':
                            $scope.bannerType = 5;
                            break;
                        case '企业社会责任banner':
                            $scope.bannerType = 6;
                            break;
                        case '行业殊荣banner':
                            $scope.bannerType = 7;
                            break;
                    }
                })
            }
            $scope.showConfirm();
        }
    }

    function AddBannerCtrl($scope, $http, $mdDialog, $location) {
        $scope.isAddBanner = 0;
        var AuthoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < AuthoritySet.length; i++) {
            if (AuthoritySet[i] == "addBanner") {
                $scope.isAddBanner = 1;
            }
        }
        $scope.banner = {
            'jumpUrl': ''
        };
        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }
        $scope.doUploadVideo = function(element) {
            $scope.videoFileObj = element.files[0];
        }
        $scope.addBanner = function() {
            //console.log($scope.banner.file);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否上传广告')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    var addBannerUrl = "http://localhost:8080/lifecrystal-server/" + "banner/addBanner.do"; // 接收上传文件的后台地址
                    $scope.banner.startDate=$("#startDate").val();
                    $scope.banner.endDate=$("#endDate").val();
                    if ($scope.banner.bannerName==undefined||$scope.banner.bannerName=="") {
                        $scope.showAlert("广告名称不能为空!");
                        return;
                    }

                    if ($scope.banner.bannerType==undefined||$scope.banner.bannerType=="") {
                        $scope.showAlert("广告类型不能为空!");
                        return;
                    }

                    if ($scope.banner.bannerLocation==undefined||$scope.banner.bannerLocation=="") {
                        $scope.showAlert("广告位置不能为空!");
                        return;
                    }

                    if ($scope.banner.activated==undefined||$scope.banner.activated=="") {
                        $scope.showAlert("上线/下线不能为空!");
                        return;
                    }

                    if ($scope.banner.bannerType==1&&($scope.imageFileObj==undefined||$scope.imageFileObj=="")) {
                        $scope.showAlert("图片文件不能为空!");
                        return;
                    }

                    if ($scope.banner.bannerType==2&&($scope.videoFileObj==undefined||$scope.videoFileObj=="")) {
                        $scope.showAlert("视频文件不能为空!");
                        return;
                    }

                    // if($scope.banner.bannerType==2&&($scope.banner.LinkUrl!="")){
                    //     $scope.showAlert("视频类型的文件不可以添加链接!");
                    //     return;
                    // }


                    if ($scope.banner.bannerType==undefined) {
                        $scope.banner.bannerType="";
                    }

                    if ($scope.banner.bannerName==undefined) {
                        $scope.banner.bannerName="";
                    }

                    if ($scope.banner.bannerLocation==undefined) {
                        $scope.banner.bannerLocation="";
                    }

                    if ($scope.banner.startDate==undefined) {
                        $scope.banner.startDate="";
                    }

                    if ($scope.banner.endDate==undefined) {
                        $scope.banner.endDate="";
                    }

                    if ($scope.banner.activated==undefined) {
                        $scope.banner.activated="";
                    }

                    if ($scope.banner.bannerType==undefined) {
                        $scope.banner.bannerType="";
                    }

                    if ($scope.banner.LinkUrl==undefined) {
                        $scope.banner.LinkUrl="";
                    }

                    // $scope.banner.bannerType=null;

                    var form = new FormData();
                    form.append("bannerType", $scope.banner.bannerType); // 可以增加表单数据 bannerName
                    form.append("bannerName", $scope.banner.bannerName);
                    form.append("bannerLocation", $scope.banner.bannerLocation);  
                    form.append("startDate", $scope.banner.startDate);
                    form.append("endDate", $scope.banner.endDate);
                    form.append("activated", $scope.banner.activated);   
                    form.append("bannerType", $scope.banner.bannerType);   

                    
                    if ($scope.banner.bannerType==2) {
                        // console.log("videoFileObj");
                        form.append("file", $scope.videoFileObj);
                    }else{
                        // console.log("imageFileObj");
                        form.append("file", $scope.imageFileObj);
                    }
                    
                    
                    form.append("linkUrl", $scope.banner.LinkUrl);
                    // console.log(form)

                    // form.append("sortIndex",$scope.banner.sortIndex);
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addBannerUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        console.log("cccc---"+xhr.readyState);
                        console.log(xhr.status);
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.successCode);
                                if(date.successCode==100200){
                                    $scope.showAlert("广告上传成功");
                                    // // console.log("广告上传成功");
                                    // alert("广告上传成功");
                                }else{
                                    $scope.showAlert(date.errorMessage);
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
                            }
                        }
                    }
                }, function() {
                    $scope.showAlert("取消上传");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    // $location.path('/Banner/banner-list');
                });
            }
            $scope.showConfirm();
        }
    }

    function AddImageCtrl($scope, $http, $mdDialog, $location) {
        $scope.isAddImage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            console.log(authoritySet[i]);
            if (authoritySet[i] == "addImage") {
                $scope.isAddImage = 1;
            }
        }
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files;
            // console.log("$scope.fileObj");
            var files = $scope.fileObj;
            var files = Array.prototype.slice.call(files);
            // console.log(this);
            if (files.length > 6) {
                alert("最多同时只可上传6张图片");
                return;
            }
            files.forEach(function(file, i) {
                if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                var reader = new FileReader();
                var li = document.createElement("li");
                console.log(li);
                var a = document.createElement('a');
                $('.img-list').append($(li));
                $('.img-list li').append($(a));
                reader.onload = function() {
                    var result = this.result;
                    var img = new Image();
                    img.src = result;
                    console.log(result)
                    $(li).css('background-image', "url(" + result + ")");
                    $(a).text('X').css({
                        display: 'none'
                    });
                    $('.img-list li').hover(function() {
                        $(this).find('a').css({
                            display: 'block'
                        });
                    }, function() {
                        $(this).find('a').css({
                            display: 'none'
                        });
                    });
                    $('.img-list li a').click(function(event) {
                        var i = $(this).parent('li').index();
                        console.log(i);
                        var filearray = $scope.fileObj;
                        console.log(typeof(filearray));
                        $(filearray).splice(i, 1);
                        $(this).parent('li').remove();
                        console.log($scope.fileObj);
                    });
                };
                reader.readAsDataURL(file);
            })
        }
        $scope.addImage = function() {
            //console.log($scope.banner.file);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否上传图片')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // $http.post("http://139.196.7.76:8080/chinatravel-server/"+"Banner/addBanner",{})
                    var addImageUrl = "http://localhost:8080/lifecrystal-server/" + "image/addImage.do"; // 接收上传文件的后台地址
                    // FormData 对象
                    var form = new FormData();
                    //console.log($scope.banner.type);
                    form.append("file", $scope.fileObj);

                    var xhr = new XMLHttpRequest();
                    //console.log('111111111111');
                    var response;
                    xhr.open("post", addImageUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("上传图片成功");
                            }
                        }
                    }
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消上传");
                });
            };
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
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
    }

    function ImageCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.login = function() {
            if (sessionStorage.awardId == undefined) {
                $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)
        var init;
        $scope.stores = [];
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
        $scope.isListImage = 0;
        $scope.isAddImage = 0;
        $scope.isEditImage = 0;
        $scope.isDeleteImage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "listImage") {
                $scope.isListImage = 1;
            } else if (authoritySet[i] == "addImage") {
                $scope.isAddImage = 1;
            } else if (authoritySet[i] == "editImage") {
                $scope.isEditImage = 1;
            } else if (authoritySet[i] == "deleteImage") {
                $scope.isDeleteImage = 1;
            }
        }

        function getAwardList(pageNum, pageSize) {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'image/getImageList.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
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
            getAwardList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/lifecrystal-server/' + 'image/getImageList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage,
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    $scope.currentPageStores = $scope.stores;
                };
            });
        };
        // 删除管理员
        $scope.deleteImage = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除该条图片信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/lifecrystal-server/" + "image/deleteImage.do?", {}, {
                        params: {
                            imageId: id
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("删除图片成功");
                            $(".delete-" + id).css("display", "none");
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
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        //修改密码
        $scope.awardId = $location.search().id;
        $scope.awardName = $location.search().name;
        $scope.changeAward = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改密码')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/lifecrystal-server/" + "award/modifyAward.do?", {}, {
                        params: {
                            awardId: $scope.awardId,
                            awardName: $scope.awardName,
                            awardContent: $scope.awardContent
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("奖品修改成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消修改");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/award/award-list')
                })
            }
            $scope.showAlert1 = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        $scope.backClick = function() {
            $location.path("/image/image-list");
        }
        init();
    }

function ChangeBannerCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.bannerId = $location.search().id;
    $http.post("http://localhost:8080/lifecrystal-server/"+"banner/getBannerById.do?",{},{params:{
        bannerId:$scope.bannerId
    }}).success(function (data){
        if(data.successCode == 0){
            $scope.banner = data.result;
            console.log($scope.banner);
            console.log("  " + $scope.banner);
        } else {
            $scope.showAlert1(data.errorMessage)
        }                        
    })


        $scope.banner = {
            'jumpUrl': ''
        };
        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }
        $scope.doUploadVideo = function(element) {
            $scope.videoFileObj = element.files[0];
        }

    $scope.changeBanner = function(){
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改Banner信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeBannerUrl ="http://localhost:8080/lifecrystal-server/" + "banner/modifyBanner.do?";  
                    if ($scope.banner.bannerName==undefined||$scope.banner.bannerName=="") {
                        $scope.showAlert("广告名称不能为空!");
                        return;
                    }

                    if ($scope.banner.bannerType==undefined||$scope.banner.bannerType=="") {
                        $scope.showAlert("广告类型不能为空!");
                        return;
                    }

                    if ($scope.banner.bannerLocation==undefined||$scope.banner.bannerLocation=="") {
                        $scope.showAlert("广告位置不能为空!");
                        return;
                    }

                    if ($scope.banner.activated==undefined||$scope.banner.activated=="") {
                        $scope.showAlert("上线/下线不能为空!");
                        return;
                    }

                    // if ($scope.banner.bannerType==1&&($scope.imageFileObj==undefined||$scope.imageFileObj=="")) {
                    //     $scope.showAlert("图片文件不能为空!");
                    //     return;
                    // }

                    // if ($scope.banner.bannerType==2&&($scope.videoFileObj==undefined||$scope.videoFileObj=="")) {
                    //     $scope.showAlert("视频文件不能为空!");
                    //     return;
                    // }

                    if($scope.banner.bannerType==2&&($scope.banner.linkUrl!="")){
                        $scope.showAlert("视频类型的文件不可以添加广告链接!");
                        return;
                    }


                    if ($scope.banner.bannerType==undefined) {
                        $scope.banner.bannerType="";
                    }

                    if ($scope.banner.bannerName==undefined) {
                        $scope.banner.bannerName="";
                    }

                    if ($scope.banner.bannerLocation==undefined) {
                        $scope.banner.bannerLocation="";
                    }

                    if ($scope.banner.startDate==undefined) {
                        $scope.banner.startDate="";
                    }

                    if ($scope.banner.endDate==undefined) {
                        $scope.banner.endDate="";
                    }

                    if ($scope.banner.activated==undefined) {
                        $scope.banner.activated="";
                    }

                    if ($scope.banner.bannerType==undefined) {
                        $scope.banner.bannerType="";
                    }

                    if ($scope.banner.linkUrl==undefined) {
                        $scope.banner.linkUrl="";
                    }

                    // $scope.banner.bannerType=null;

                    var form = new FormData();
                    form.append("bannerType", $scope.banner.bannerType); // 可以增加表单数据 bannerName
                    form.append("bannerName", $scope.banner.bannerName);
                    form.append("bannerLocation", $scope.banner.bannerLocation);  
                    form.append("startDate", $scope.banner.startDate);
                    form.append("endDate", $scope.banner.endDate);
                    form.append("activated", $scope.banner.activated);   
                    form.append("bannerType", $scope.banner.bannerType); 
                    form.append("bannerId", $scope.banner.bannerId);     

                    
                    if ($scope.banner.bannerType==2) {
                        form.append("file", $scope.videoFileObj);
                    }else{
                        form.append("file", $scope.imageFileObj);
                    }
                    
                    
                    form.append("linkUrl", $scope.banner.linkUrl);


                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeBannerUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成

                            console.log(xhr.responseText);
                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           if (xhr.responseText.successCode=100200) {
                                $scope.showAlert("修改Banner信息成功");       
                           }else{
                             $scope.showAlert(xhr.responseText.errorMessage);
                           }
                           
                                          

                       }
                   }

               }

           }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消上传");
                });
                        };
                        $scope.showAlert = function(txt) {
                 // dialog
                 $mdDialog.show(
                    $mdDialog.alert()

                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    ).then(function() {
                       // $location.path('/banner/banner-list');
                   }) 
                }    
                $scope.showConfirm();
            }
            $scope.backClick = function(){
                $location.path("/banner/banner-list");
            }

        }



})();