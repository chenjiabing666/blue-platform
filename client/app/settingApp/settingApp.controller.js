(function() {
    // 'setting strick'
    angular.module('app.settingApp')
    .controller('SettingAppDetailCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', SettingAppDetailCtrl])
    .controller('OrderPriceCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', OrderPriceCtrl])
    .controller('ChangeOrderPriceCtrl', ['$scope', '$http', '$location', '$mdDialog', '$timeout', ChangeOrderPriceCtrl])
    .controller('AddOrderPriceCtrl', ['$scope', '$http', '$location', '$mdDialog', '$timeout', AddOrderPriceCtrl])
    .controller('DocumentsCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', DocumentsCtrl])
    .controller('AddDocumentsCtrl', ['$scope', '$http', '$location', '$mdDialog', '$timeout', AddDocumentsCtrl])
    .controller('ChangeDocumentsCtrl', ['$scope', '$http', '$location', '$mdDialog', '$timeout', ChangeDocumentsCtrl])
    .filter("paseType", function() {
        return function(input) {
            if (input == 1) {
                return '等级规则';
            } else if (input == 2) {
                return 'vip介绍';
            } else if (input == 3) {
                return '充值规则';
            } else if (input == 4) {
                return '邀请好友规则';
            } else if (input == 5) {
                return '奖励规则';
            } else if (input == 6) {
                return '消息提醒规则';
            } else if (input == 7) {
                return '关于我们';
            } else if (input == 8) {
                return '用户协议';
            } else if (input == 9) {
                return '其他';
            }
        }
    })

    function SettingAppDetailCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(), 10)
        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "19") {
                $scope.isShow = 1;
            }
        }
        var init;
        $scope.stores = [];
        $scope.setting = {};
        $scope.doUploadPhoto1 = function(element) {
            $scope.fileObj1 = element.files[0];
        }
        $scope.doUploadPhoto2 = function(element) {
            $scope.fileObj2 = element.files[0];
        }
        $scope.doUploadPhoto3 = function(element) {
            $scope.fileObj3 = element.files[0];
        }
        $scope.doUploadVideo = function(element) {
            $scope.video = element.files[0];
        }
        $scope.changeSettingApp = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定更新设置').ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addSettingUrl = "http://localhost:8080/yoyo-server/" + "setting/updateSetting.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("file1", $scope.fileObj1);
                    form.append("file2", $scope.fileObj2);
                    form.append("file3", $scope.fileObj3);
                    form.append("video", $scope.video);
                    form.append("settingId", $scope.settingAppList.settingId);
                    form.append("commonVipFee", $scope.settingAppList.commonVipFee);
                    form.append("cvipSendTasktimes", $scope.settingAppList.cvipSendTasktimes);
                    form.append("cvipRobtaskNumber", $scope.settingAppList.cvipRobtaskNumber);
                    form.append("cvipFocusNumber", $scope.settingAppList.cvipFocusNumber);
                    form.append("svipSendTasktimes", $scope.settingAppList.svipSendTasktimes);
                    form.append("superVipFee", $scope.settingAppList.superVipFee);
                    form.append("vipProbation", $scope.settingAppList.vipProbation);
                    form.append("svipRobtaskNumber", $scope.settingAppList.svipRobtaskNumber);
                    form.append("svipFocusNumber", $scope.settingAppList.svipFocusNumber);
                    form.append("platformOnlineProportion", $scope.settingAppList.platformOnlineProportion);
                    form.append("platformLineoffProportion", $scope.settingAppList.platformLineoffProportion);
                    form.append("platformGiftProportion", $scope.settingAppList.platformGiftProportion);
                    form.append("fromUserAgentProportion", $scope.settingAppList.fromUserAgentProportion);
                    form.append("fromUserInviterProportion", $scope.settingAppList.fromUserInviterProportion);
                    form.append("toUserAgentProportion", $scope.settingAppList.toUserAgentProportion);
                    form.append("toUserInviterProportion", $scope.settingAppList.toUserInviterProportion);
                    form.append("toUserProportion", $scope.settingAppList.toUserProportion);
                    form.append("toUserGiftProportion", $scope.settingAppList.toUserGiftProportion);
                    form.append("toUserOnlineProportion", $scope.settingAppList.toUserOnlineProportion);
                    
                    

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addSettingUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成                             
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("更新设置成功");
                            }
                        }
                    }
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/settingApp/settingApp-detail');
                })
            }
            $scope.showConfirm();
        }
        init = function() {
            console.log($scope.numPerPage);
            $http.post('http://localhost:8080/yoyo-server/' + 'setting/getSettingById.do', {}, {
                params: {
                    settingId: 1
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.settingAppList = data.result;
                    $scope.stores = data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.currentPageStores = $scope.stores;
                };
            });
        };
        init();
    }
    //获取订单价格列表
    function OrderPriceCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(), 10)
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
        $scope.OrderPriceList = [];
        $scope.allOrderPriceList = [];

        function getOrderPriceList(pageNum, pageSize) {
            $http.post('http://localhost:8080/yoyo-server/' + 'orderPrice/getList.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.OrderPriceList = data.result;
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    console.log($scope.stores);
                };
            });
        }
        //初始化方法
        init = function() {
            console.log($scope.numPerPage);
            $http.post('http://localhost:8080/yoyo-server/' + 'orderPrice/getList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    $scope.currentPageStores = $scope.stores;
                }
            });
        };

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            console.log('$scope.numPerPage==' + $scope.numPerPage);
            if ($scope.isSearch) {
                $scope.searchOrderPrice(page, $scope.numPerPage);
            } else {
                getOrderPriceList(page, $scope.numPerPage);
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
            console.log($scope.stores);
            return $scope.onFilterChange();
        };
        $scope.selected = {}; //所有选中的元素
        $scope.isSelectedAll = false; //是否全被选中
        //获取标签选中状态
        $scope.isSelected = function(id) {
            if ($scope.selected[id] === true) {
                return true;
            } else {
                return false;
            }            
        };
        //返回 是否全选
        var judgeSelectedAll = function() {
            var isSelectedAll = true;  
            for (var i = 0; i < $scope.currentPageStores.length; i++) {    
                var admin = $scope.currentPageStores[i];
                isSelectedAll = $scope.selected[admin.adminId];  
            }
            return isSelectedAll;
        };
        //反转标签选中状态
          
        var updateSelected = function(id) {
            // if ($scope.isSelected(id)){
            //     $scope.selected[id] = false;
            // }else{
            //     $scope.selected[id] = true;
            // }
            // $scope.isSelectedAll = judgeSelectedAll();     
                };
        //赋值
        var updateSelectedByStatus = function(id, status) {
            $scope.selected[id] = status;       
        };
        $scope.selectAll = function() {
            //点击全选按钮反转元素状态
            if ($scope.isSelectedAll) {
                $scope.isSelectedAll = false;
            } else {
                $scope.isSelectedAll = true;
            }   //将
            for (var i = 0; i < $scope.currentPageStores.length; i++) {
                var admin = $scope.currentPageStores[i];
                updateSelectedByStatus(admin.adminId, $scope.isSelectedAll);
            } 
        };
        $scope.selectItem = function(id) {
            // updateSelected(id);
            if ($scope.isSelected(id)) {
                $scope.selected[id] = false;
            } else {
                $scope.selected[id] = true;
            }
            //全选判断
            $scope.isSelectedAll = judgeSelectedAll(); 
        };
        var truth; //是否有元素选中
        $scope.deleteList = function() {
            var temp = '';
            truth = false;
            var form = new FormData();
            //遍历
            for (var i in $scope.selected) { //用javascript的for/in循环遍历对象的属性
                temp = i;
                if ($scope.selected[i] === true) {
                    form.append("adminId", temp);
                    truth = true;
                }
            }
            if (truth === false) {
                alert('请先选择文档！');
            } else {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除文档')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定删除').cancel('取消删除');
                $mdDialog.show(confirm).then(function() {
                    var modifyTopicUrl = 'http://localhost:8080/yoyo-server/OrderPrice/deleteOrderPrice.do'; // 接收上传文件的后台地址
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            $scope.showAlert("批量删除成功");
                            for (var i in $scope.selected) {
                                temp = i;
                                $(".delete-" + temp).css("display", "none");
                                $scope.total--;
                            }
                        } else if (xhr.readyState == 4 && xhr.status != 200) {
                            // $scope.showAlert(xhr.errorMessage);
                            $scope.showAlert("删除失败");
                        }
                    }
                    // init();
                    $scope.showAlert = function(txt) {
                        $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
                    }
                })
            }
        }
        // 删除
        $scope.delete = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除？')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/yoyo-server/" + "orderPrice/delOrderPrice.do?", {}, {
                        params: {
                            orderPriceId: id
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("删除成功");
                            $(".delete-" + id).css("display", "none");
                            $scope.total--;
                            init();
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        //弹出框方法
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
        }
        init();
    }
    //编辑
    function ChangeOrderPriceCtrl($scope, $http, $location, $mdDialog, $timeout) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('')
            }
        }
        $scope.orderPriceId = $location.search().id;
        $http.post("http://localhost:8080/yoyo-server/" + "orderPrice/getOrderPriceById.do?", {}, {
            params: {
                orderPriceId: $scope.orderPriceId
            }
        }).success(function(data) {
            if (data.errorCode == 0) {
                $scope.orderPrice = data.result;
                console.log($scope.Document);
                console.log("  " + $scope.Document);
            } else {
                $scope.showAlert1(data.errorMessage)
            }
        })
        $scope.Document = {};
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files[0];
        }
        $scope.modify = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改?')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeDocumentUrl = "http://localhost:8080/yoyo-server/" + "orderPrice/updateOrderPrice.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("orderPriceId", $scope.orderPrice.orderPriceId);
                    form.append("price", $scope.orderPrice.price);
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeDocumentUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("修改成功");
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
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/settingApp/order-price-list');
                })
            }
            $scope.showConfirm();
        }
        $scope.backClick = function() {
            $location.path("/settingApp/order-price-list");
        }
    }
    //增加
    function AddOrderPriceCtrl($scope, $http, $location, $mdDialog, $timeout) {
        $scope.backClick = function() {
            $location.path("/settingApp/order-price-list");
        }
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('')
            }
        }
        $scope.Document = {};
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files[0];
        }
        $scope.doUploadMultPhoto = function(element) {
            $scope.carouselFileObj = element.files;
            //console.log("$scope.fileObj");
        }
        $scope.add = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定添加？').ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addDocumentUrl = "http://localhost:8080/yoyo-server/" + "orderPrice/addOrderPrice.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("price", $scope.orderPrice.price);
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addDocumentUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("添加成功");
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
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/settingApp/order-price-list');
                })
            }
            $scope.showConfirm();
        }
    }

    function DocumentsCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('/page/signin')
            }
        }
        $timeout($scope.login(), 10)
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
        $scope.documentList = [];
        $scope.alldocumentList = [];
        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "21") {
                $scope.isShow = 1;
            }
        }

        function getdocumentList(pageNum, pageSize) {
            $http.post('http://localhost:8080/yoyo-server/' + 'document/getDocumentList.do', {}, {
                params: {
                    documentName: $scope.kwdocumentName,
                    pageNum: pageNum,
                    pageSize: pageSize
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.documentList = data.result;
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
            console.log('$scope.numPerPage==' + $scope.numPerPage);
            if ($scope.isSearch) {
                $scope.searchdocument(page, $scope.numPerPage);
            } else {
                getdocumentList(page, $scope.numPerPage);
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
            console.log($scope.stores);
            return $scope.onFilterChange();
        };
        init = function() {
            console.log($scope.numPerPage);
            $http.post('http://localhost:8080/yoyo-server/' + 'document/getDocumentList.do', {}, {
                params: {
                    documentName: $scope.kwdocumentName,
                    pageNum: 1,
                    pageSize: $scope.numPerPage
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
        $scope.selected = {}; //所有选中的元素
        $scope.isSelectedAll = false; //是否全被选中
        //获取标签选中状态
        $scope.isSelected = function(id) {
            if ($scope.selected[id] == true) {
                return true;
            } else {
                return false;
            }              
        };
        //返回 是否全选 
          
        var judgeSelectedAll = function() {
            var isSelectedAll = true;  
            for (var i = 0; i < $scope.currentPageStores.length; i++) {              
                var document = $scope.currentPageStores[i];
                isSelectedAll &= $scope.selected[document.documentId];  
            }
            return isSelectedAll;   
        };
        //反转标签选中状态
          
        var updateSelected = function(id) {
            // if ($scope.isSelected(id)){
            //     $scope.selected[id] = false;
            // }else{
            //     $scope.selected[id] = true;
            // }
            // $scope.isSelectedAll = judgeSelectedAll();     
                };
        //赋值
        var updateSelectedByStatus = function(id, status) {
            $scope.selected[id] = status;       
        };
        $scope.selectAll = function() {
            //点击全选按钮反转元素状态
            if ($scope.isSelectedAll) {
                $scope.isSelectedAll = false;
            } else {
                $scope.isSelectedAll = true;
            }   //将
            for (var i = 0; i < $scope.currentPageStores.length; i++) {
                var document = $scope.currentPageStores[i];
                updateSelectedByStatus(document.documentId, $scope.isSelectedAll);
            } 
        };
        $scope.selectItem = function(id) {
            // updateSelected(id);
            if ($scope.isSelected(id)) {
                $scope.selected[id] = false;
            } else {
                $scope.selected[id] = true;
            }
            //全选判断
            $scope.isSelectedAll = judgeSelectedAll(); 
        };
        var truth; //是否有元素选中
        $scope.deleteList = function() {
            var temp = "";
            truth = false;
            var form = new FormData();
            //遍历
            for (var i in $scope.selected) { //用javascript的for/in循环遍历对象的属性 
                temp = i;
                if ($scope.selected[i] == true) {
                    form.append("adminId", temp);
                    truth = true;
                }
            }
            if (truth == false) {
                alert('请先选择文案！');
            } else {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除文案')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定删除').cancel('取消删除');
                $mdDialog.show(confirm).then(function() {
                    var modifyTopicUrl = "http://localhost:8080/yoyo-server/" + "document/deletedocument.do"; // 接收上传文件的后台地址
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            $scope.showAlert("批量删除成功");
                            for (var i in $scope.selected) {
                                temp = i;
                                $(".delete-" + temp).css("display", "none");
                                $scope.total--;
                            }
                        } else if (xhr.readyState == 4 && xhr.status != 200) {
                            // $scope.showAlert(xhr.errorMessage);
                            $scope.showAlert("删除失败");
                        }
                    }
                    // init();
                    $scope.showAlert = function(txt) {
                        $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
                    }
                })
            }
        }
        // 搜索文案
        $scope.searchdocument = function(num, size) {
            $scope.documentName = $("#documentName").val();
            $scope.nickName = $("#nickName").val();
            $scope.realName = $("#realName").val();
            console.log($scope.documentName)
            console.log($scope.nickName)
            console.log($scope.realName)
            $scope.isSearch = true;
            $http.post('http://localhost:8080/yoyo-server/' + 'document/getdocumentList.do', {}, {
                params: {
                    documentName: $scope.documentName,
                    nickName: $scope.nickName,
                    realName: $scope.realName,
                    pageNum: num,
                    pageSize: size
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;
                    $scope.currentPageStores = $scope.stores;
                    $scope.total.$apply;
                    $scope.currentPageStores.$apply;
                    console.log("total:" + data.total);
                } else {
                    $scope.showAlert(data.errorMessage);
                }
            })
            // console.log($scope.productType);
            console.log($scope.numPerPage);
        }
        //批量删除
        $scope.deleteList = function() {
            // 确定
            var confirm = $mdDialog.confirm().title('是否确定批量删除')
                // .ariaLabel('Lucky day')
                // .targetEvent(ev)
                .ok('确定删除').cancel('取消删除');
            $mdDialog.show(confirm).then(function() {
                // console.log('确定')
                var modifyTopicUrl = "http://localhost:8080/yoyo-server/" + "batch/deletedocumentBatch.do"; // 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";
                var form = new FormData();
                for (var i in $scope.selected) { //用javascript的for/in循环遍历对象的属性
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
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        $scope.showAlert("删除成功");
                        for (var i in $scope.selected) {
                            temp = i;
                            $(".delete-" + temp).css("display", "none");
                            $scope.total--;
                        }
                    } else if (xhr.readyState == 4 && xhr.status != 200) {
                        // $scope.showAlert(xhr.errorMessage);
                        $scope.showAlert("删除失败");
                    }
                }
                // init();
                $scope.showAlert = function(txt) {
                    $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
                }
            })
        }
        // 删除文案
        $scope.deletedocument = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除该条文案信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/" + "document/deletedocument.do?", {}, {
                        params: {
                            documentId: id
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("删除文案成功");
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
        }
        init();
    }

    function AddDocumentsCtrl($scope, $http, $location, $mdDialog, $timeout) {
        $scope.backClick = function() {
            $location.path("/settingApp/documents-list");
        }
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('')
            }
        }
        $scope.document = {};
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files[0];
        }
        $scope.doUploadMultPhoto = function(element) {
            $scope.carouselFileObj = element.files;
            //console.log("$scope.fileObj");
        }
        $scope.addDocument = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定添加新的文档').ok('确定添加').cancel('取消添加');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addDocumentUrl = "http://localhost:8080/yoyo-server/" + "document/addDocument.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("type", $scope.document.type);
                    form.append("documentContent", $scope.document.documentContent);
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addDocumentUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("录入文档成功");
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
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/settingApp/documents-list');
                })
            }
            $scope.showConfirm();
        }
        $scope.backClick = function() {
            $location.path("/settingApp/documents-list");
        }
    }
    //**************************************************
    //**********修改文档****************
    function ChangeDocumentsCtrl($scope, $http, $location, $mdDialog, $timeout) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('')
            }
        }
        $scope.documentId = $location.search().id;
        $http.post("http://localhost:8080/yoyo-server/" + "document/getDocumentById.do?", {}, {
            params: {
                documentId: $scope.documentId
            }
        }).success(function(data) {
            if (data.errorCode == 0) {
                $scope.document = data.result;
                console.log($scope.document);
                console.log("  " + $scope.document);
            } else {
                $scope.showAlert1(data.errorMessage)
            }
        })
        $scope.document = {};
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files[0];
        }
        $scope.modifyDocument = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改文档')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定修改').cancel('取消修改');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeDocumentUrl = "http://localhost:8080/yoyo-server/" + "document/modifyDocument.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("documentId", $scope.documentId);
                    form.append("documentContent", $scope.document.documentContent);
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeDocumentUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("修改文档成功");
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
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/settingApp/documents-list');
                })
            }
            $scope.showConfirm();
        }
        $scope.backClick = function() {
            $location.path("/settingApp/documents-list");
        }
    }
})();