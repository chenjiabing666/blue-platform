(function(){
    // 'report strick'

    angular.module('app.report')
           .controller('ReportCtrl', ['$scope','$http','$mdDialog','$location','$timeout',ReportCtrl])
           .controller('AddReportCtrl', ['$scope','$http','$location','$mdDialog','$timeout',AddReportCtrl])
           .controller('ChangeReportCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeReportCtrl])
           .filter('textLengthSet', function() {
                return function(value, wordwise, max, tail) {
                    if (!value) return '';

                    max = parseInt(max, 10);

                    if (!max) return value;

                    if (value.length <= max) return value;

                    value = value.substr(0, max);

                    if (wordwise) {
                        var lastspace = value.lastIndexOf('');

                        if (lastspace != -1) {
                            value = value.substr(0, lastspace);
                        }
                    }

                    return value + (tail || '...');//‘...‘可以换成其它文字
                }
            })


  function ReportCtrl($scope,$http,$mdDialog,$location,$timeout){
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
    $scope.reportList = [];
    $scope.allReportList = [];

    $scope.isShow = 0;
    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "28") {
            $scope.isShow = 1;
        }
    }

    function getReportList(pageNum, pageSize){
         $http.post('http://localhost:8080/yoyo-server/' + 'report/getReportList.do',{},{params:{
            reportName:$scope.kwReportName,
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data) {
         if (data.errorCode == 0) {
           $scope.reportList=data.result;
           $scope.stores=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
           // $scope.currentPageStores.$apply;
           $scope.total = data.total;
           console.log($scope.stores);
           };
        });
    }


    function select(page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;

        console.log('$scope.numPerPage=='+$scope.numPerPage);

        if($scope.isSearch){
            $scope.searchReport(page,$scope.numPerPage);
        } else {
            getReportList(page, $scope.numPerPage);
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

        $http.post('http://localhost:8080/yoyo-server/' + 'report/getReportList.do',{},{params:{
            reportName:$scope.kwReportName,
            pageNum:1,
            pageSize:$scope.numPerPage
        }}).success(function (data) {
         if (data.errorCode == 0) {
           $scope.stores=data.result;
           $scope.total = data.total;
           console.log($scope.stores);

           $scope.search();

           $scope.currentPageStores = $scope.stores;
           console.log($scope.currentPageStores)

           }
        });

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


            var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteReportBatch.do";// 接收上传文件的后台地址
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
        $scope.selected = {};//所有选中的元素
        $scope.isSelectedAll = false;//是否全被选中
        //获取标签选中状态
        $scope.isSelected = function (id) {

            if($scope.selected[id] === true){
                return true;
            }else{
                return false;

            }
                        
          };

            //返回 是否全选
            var judgeSelectedAll = function () {
            var isSelectedAll = true;
              for (var i = 0; i < $scope.currentPageStores.length; i++) {
                              var admin = $scope.currentPageStores[i];
                isSelectedAll = $scope.selected[admin.adminId];
              }

                return isSelectedAll;
           };

            //反转标签选中状态
          var updateSelected = function (id) {
            // if ($scope.isSelected(id)){
            //     $scope.selected[id] = false;
            // }else{
            //     $scope.selected[id] = true;
            // }
            // $scope.isSelectedAll = judgeSelectedAll();     
            };


            //赋值
            var updateSelectedByStatus = function (id, status) {
                $scope.selected[id] = status;       
            };

            $scope.selectAll = function () {


                //点击全选按钮反转元素状态
                if($scope.isSelectedAll){

                    $scope.isSelectedAll = false;

                }else{

                    $scope.isSelectedAll = true;

                }
                //将
                for (var i = 0; i < $scope.currentPageStores.length; i++) {
                    var admin = $scope.currentPageStores[i];
                    updateSelectedByStatus(admin.adminId, $scope.isSelectedAll);
                }

             };


            $scope.selectItem = function (id) {
                // updateSelected(id);
                if ($scope.isSelected(id)){
                    $scope.selected[id] = false;
                }else{
                    $scope.selected[id] = true;
                }
                //全选判断
                $scope.isSelectedAll = judgeSelectedAll(); 
            };

            var truth ;//是否有元素选中
            



        // 搜索举报
        $scope.searchReport = function(num,size){
            $scope.reportName = $("#reportName").val();
            $scope.nickName = $("#nickName").val();
            $scope.realName = $("#realName").val();
            console.log($scope.reportName)
            console.log($scope.nickName)
            console.log($scope.realName)
            $scope.isSearch = true;

            $http.post('http://localhost:8080/yoyo-server/' + 'report/getReportList.do',{},{params:{
                reportName:$scope.reportName,
                nickName:$scope.nickName,
                realName:$scope.realName,
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
                    $scope.showAlert(data.errorMessage);
                }
            })
            // console.log($scope.productType);
            console.log($scope.numPerPage);
        }

        // 删除举报
        $scope.deleteReport = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条举报信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"report/deleteReport.do?",{},{params:{
                        reportId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除举报成功");
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
         }

         init();
     }




//**********录入举报************************

function AddReportCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.backClick = function(){
        $location.path("/report/report-list");
    }

    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.report = {};
    $scope.doUploadPhoto=function(element){

        $scope.fileObj = element.files[0];
    }

    $scope.doUploadMultPhoto=function(element){

        $scope.carouselFileObj = element.files;
            //console.log("$scope.fileObj");
        }

        $scope.addReport = function(){

            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加新的举报')
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addReportUrl ="http://localhost:8080/yoyo-server/" + "report/addReport.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("reportName", $scope.report.reportName);
                    form.append("reportText", $scope.report.reportText);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addReportUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成
                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           $scope.showAlert("录入举报成功");

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
                       $location.path('/report/report-list');
                   })
                }
                $scope.showConfirm();
            }
            $scope.backClick = function() {
                $location.path("/report/report-list");
            }

        }

//**************************************************
//**********修改举报****************

function ChangeReportCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.reportId = $location.search().id;
    $http.post("http://localhost:8080/yoyo-server/"+"report/getReportById.do?",{},{params:{
        reportId:$scope.reportId
    }}).success(function (data){
        if(data.errorCode == 0){
            $scope.report = data.result;
            console.log($scope.report);
            console.log("  " + $scope.report);
        } else {
            $scope.showAlert1(data.errorMessage)
        }
    })


    $scope.report = {};

    $scope.doUploadPhoto=function(element){

        $scope.fileObj = element.files[0];
    }

    $scope.modifyReport = function(){
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改举报')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeReportUrl ="http://localhost:8080/yoyo-server/" + "report/modifyReport.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("reportId",$scope.reportId);
                    form.append("reportUserId",$scope.report.reportUserId);
                    form.append("reportObject", $scope.report.reportObject);
                    form.append("reportContent",$scope.reportContent);
                    form.append("adminDescription",$scope.report.adminDescription);
                    form.append("adminId", sessionStorage.adminId);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeReportUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成


                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           $scope.showAlert("修改举报成功");

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
                       $location.path('/report/report-list');
                   })
                }
                $scope.showConfirm();
            }
            $scope.backClick = function(){
                $location.path("/report/report-list");
            }

        }

    })();
