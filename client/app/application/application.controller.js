(function () {
    'use strict';
    angular.module('app.application', [])
        .controller('ApplicationCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ApplicationCtrl])
        .controller('AddApplicationCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', AddApplicationCtrl])
        .controller('ChangeApplicationCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ChangeApplicationCtrl])
        .controller('ApplicationDetailCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ApplicationDetailCtrl])
        .controller('RecommendApplicationCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', RecommendApplicationCtrl])
        .controller('ExportApplicationCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ExportApplicationCtrl])






    //批量导入应用
    function ExportApplicationCtrl($scope, $http, $mdDialog, $location, $timeout) {

        //如果返回列表
        $scope.backClick = function () {
            $location.path("/application/application-list");
        }

        $scope.showAlert = function (txt) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
            )

        }

        //上传excel文件
        $scope.doPackage=function(element){
            // console.log("-----"+element.files.length);
            $scope.packageObj = element.files[0];  //取出第一个文件
        }
        
        $scope.add=function(){

            var form=new FormData();
            form.append("file",$scope.packageObj);

             var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", "http://localhost:8080/applicationMarket-server/app/export.do", true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("导入成功");
                                    // // console.log("广告上传成功");
                                    // alert("广告上传成功");
                                }else{
                                    $scope.showAlert(date.message);
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
                            }
                        }


                 }
        }



        
        
        
    }


    //推荐应用
    function RecommendApplicationCtrl($scope, $http, $mdDialog, $location, $timeout) {

        //如果返回列表
        $scope.backClick = function () {
            $location.path("/application/application-list");
        }

        $scope.showAlert = function (txt) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
            )

        }


        $scope.applicationId = $location.search().id;   //
        $scope.typeId="";  //分类的Id
        
        
        //表单回显
        $http.post('http://localhost:8080/applicationMarket-server/' + 'recommendType/getRecommendTypeList.do',{},{params:{
            pageNum:1,
            pageSize:20

        }}).success( function (data){   
            if(data.code == 0){
                console.log(data.result);
                $scope.types=data.result;
            } else {
                $scope.showAlert(data.message);
            }
        });

        //推荐
        $scope.recommend = function () {

            $http.post('http://localhost:8080/applicationMarket-server/' + 'app/recommend.do', {}, {
                params: {
                    appId:$scope.applicationId,
                    recommendTypeId:$scope.typeId
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("推荐成功");
                } else {
                    $scope.showAlert(data.message);
                }
            });

        }

    }

    function ApplicationDetailCtrl($scope, $http, $mdDialog, $location, $timeout) {

        

       

        //如果返回列表
        $scope.backClick = function () {
            $location.path("/application/application-list");
        }

        $scope.showAlert = function (txt) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
            )

        }


        $scope.applicationId = $location.search().id;   //获取管理员Id
        
        
        //表单回显
        $http.post('http://localhost:8080/applicationMarket-server/' + 'app/getAppDetailInfo.do',{},{params:{
            appId:$scope.applicationId   //管理员Id
        }}).success( function (data){   
            if(data.code == 0){
                // console.log(data.result)
                $scope.app=data.result.app;
                
                $scope.last=data.result.appVersion;
                // console.log($scope.last)
                $scope.historyVersions=data.result.historyVersions;
                $scope.images=data.result.images;
                $scope.appType=data.result.appType;
                // console.log($appType);
            } else {
                $scope.showAlert(data.message);
            }
        });

        //获取类别
        $http.post('http://localhost:8080/applicationMarket-server/' + 'appType/getAppTypeList.do', {}, {
            params: {
            }
        }).success(function (data) {
            if (data.code == 0) {
                $scope.apptypes = data.result.allTypes;
                console.log($scope.apptypes);

            }
            ;
        });

        //修改密码
        $scope.modifyPassword = function () {
            // console.log($scope.application);
            console.log($scope.application.newPassword==undefined);

            if (($scope.application.newPassword!=undefined&&$scope.application.newPassword!="")&&$scope.application.newPassword.length<6) {
                $scope.showAlert("密码不能少于6位")
                return;
            }

            if (($scope.application.newPassword!=undefined&&$scope.application.newPassword!="")&&$scope.application.newPassword!=$scope.application.confirmPassword) {
                $scope.showAlert("新密码和确认密码不同，请重新输入");
                return;
            }


            $http.post('http://localhost:8080/applicationMarket-server/' + 'application/modifApplication.do', {}, {
                params: {
                    email: $scope.application.email,
                    newPwd: $scope.application.newPassword,
                    account: $scope.application.account,
                    mobile:$scope.application.mobile,
                    activated:$scope.application.activated,
                    applicationId:$scope.application.applicationId
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("修改成功");
                } else {
                    // $scope.currentPageStores=null;    //变成null，及时更新到页面中
                    // alert(data.message);
                    $scope.showAlert(data.message);
                }
            });

        }


        //修改信息
        $scope.updateApp=function(){
            $http.post('http://localhost:8080/applicationMarket-server/' + 'app/modifyAppById.do', {}, {
                params: {
                    appId: $scope.applicationId,
                    appName: $scope.app.name,
                    downloadUrl: $scope.last.downloadUrl,
                    packageName:$scope.last.packageName,
                    versionName:$scope.last.versionName,
                    versionNum:$scope.last.versionNumber,
                    type:$scope.appType.appTypeId,
                    personalRecommend:$scope.app.personalRecommend,
                    supportLanguage:$scope.app.supportLanguage,
                    tariffType:$scope.app.tariffType,
                    introduction:$scope.app.introduction,
                    versionIntro:$scope.last.introduction,
                    versionFeatures:$scope.last.versionFeatures,
                    supportSys:$scope.last.supportSys,
                    privacy:$scope.app.privacy,
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("修改成功");
                } else {
                    // $scope.currentPageStores=null;    //变成null，及时更新到页面中
                    // alert(data.message);
                    $scope.showAlert(data.message);
                }
            });
        }



    }

    //更新安装包
    function ChangeApplicationCtrl($scope, $http, $mdDialog, $location, $timeout) {

        

        //绑定表单数据
        $scope.application={"email":"","mobile":"","account":"","newPassword":"","confirmPassword":"","activated":"","applicationId":""};

        //如果返回列表
        $scope.backClick = function () {
            $location.path("/application/application-list");
        }
        // 上传授权书(浏览器--只从相册中选择)
        function getbjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "42") {
                $scope.isShow = 1;
            }
        }


       
        //上传安装包
        $scope.doPackage=function(element){
            // console.log("-----"+element.files.length);
            $scope.packageObj = element.files[0];  //取出第一个文件
        }

        //上传资质许可证明
        // $scope.doUploadlicense=function(element){
        //         $scope.licenseObj = element.files[0];   //取出第一个文件
        // }

        //上传截图 4-5张
        // $scope.doUploadappImage=function(element){
        //         $scope.appImageObj = element.files; //上传数组
        //         // console.log(element.files);
        // }

        //上传应用图标
        $scope.doUploadlogo=function(element){
                $scope.logoObj = element.files[0];  //第一文件即可
                $('#icon').attr('src',getbjectURL($scope.logoObj))
        }


        $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    // $location.path('/Banner/banner-list');
                });
            }



        $scope.applicationId = $location.search().id;
         $scope.platform = $location.search().platform;
        
        $scope.reshow=0;
        


        //更新安装包
        $scope.updateApp=function(){

            

            if ($scope.versionName==undefined) {
                $scope.showAlert("版本名称不能为空");
                $scope.reshow=0;
                return;
            }

            if ($scope.versionNumber==undefined) {
                $scope.showAlert("版本号不能为空");
                $scope.reshow=0;
                return;
            }

            if ($scope.versionIntroduction==undefined) {
                $scope.showAlert("当前版本介绍不能为空");
                $scope.reshow=0;
                return;
            }

            if ($scope.supportSystem==undefined) {
                $scope.showAlert("支持系统不能为空");
                $scope.reshow=0;
                return;
            }
            if ($scope.privacy==undefined) {
                $scope.showAlert("隐私权限说明不能为空");
                $scope.reshow=0;
                return;
            }

            if ($scope.versionFeatures==undefined) {
                $scope.showAlert("新版本特性不能为空");
                $scope.reshow=0;
                return;
            }


            //如果IOS
            if ($scope.platform==2) {
                if ($scope.appUrl==undefined) {
                     $scope.showAlert("应用下载链接不能为空");
                        $scope.reshow=0;
                        return; 
                }


                if ($scope.size==undefined) {
                     $scope.showAlert("安装包大小不能为空");
                        $scope.reshow=0;
                        return; 
                }
            }

            if ($scope.platform==1&&$scope.packageName==undefined) {
                $scope.showAlert("包名不能为空");
                $scope.reshow=0;
                return;
            }

            
            $scope.reshow=1;
            

            var form = new FormData();
            // form.append("platform",$scope.platform);
            form.append("packageFile",$scope.packageObj);
            // form.append("packageName",$scope.packageName);
            form.append("versionName",$scope.versionName);
            form.append("versionNum",$scope.versionNumber);
            form.append("introduction",$scope.versionIntroduction);
            form.append("supportSys",$scope.supportSystem);
            form.append("privacy",$scope.privacy);
            form.append("logo",$scope.logoObj);
            form.append("appId",$scope.applicationId);
            form.append("versionFeatures",$scope.versionFeatures);
            form.append("url",$scope.appUrl);
            form.append("platform",$scope.platform);
            form.append("size",$scope.size);
            // form.append("publishId",sessionStorage.adminId);
            form.append("packageName",$scope.packageName);
            // form.append("examineExplain",$scope.examineExplain);
            // form.append("publishType",$scope.publishType);
            // form.append("publishDay",$scope.day);
            // form.append("publishTime",$scope.time);
            // form.append("downloadMoney",$scope.downloadMoney);


            // for (var i = 0; i < $scope.appImageObj.length; i++) {
            //     form.append("appImage",$scope.appImageObj[i]);
            // }

            var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", "http://localhost:8080/applicationMarket-server/app/updateApp.do", true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("更新成功");
                                    // // console.log("广告上传成功");
                                    // alert("广告上传成功");
                                    $scope.reshow=0;
                                }else{
                                    $scope.showAlert(date.message);
                                    // alert(date.errorMessage);
                                    $scope.reshow=0;
                                }
                                // console.log("---->"+xhr.responseText);
                               
                            }
                        }


                 }

            //获取类别
            // $http.post('http://localhost:8080/applicationMarket-server/' + 'app/addApp.do', {}, {
            //     params: {
            //     }
            // }).success(function (data) {
            //     if (data.code == 0) {
            //         $scope.rs = data.result;
            //         console.log($scope.rs);
            //     }else{
            //         $scope.showAlert(data.message);
            //     };
            // });
        }

        

    }

    //管理员列表的控制器
    function ApplicationCtrl($scope, $http, $mdDialog, $location, $timeout) {

        //验证是否登录
        $scope.login = function () {
            if (sessionStorage.applicationId == undefined) {
                $location.path('/page/signin')
            }
        }

        //$timeout($scope.login(),10)
        var init;
        $scope.flag = 0;   //设置一个标记

        $scope.stores = [];
        $scope.kwApplicationName     //姓名
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
        $scope.applicationLists = [];
        $scope.allApplicationLists = [];
        $scope.authApplication = {};

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "40") {
                $scope.isShow = 1;
            }
        }

        //
        function getApplicationList(pageNum, pageSize) {
         
            $http.post('http://localhost:8080/applicationMarket-server/' + 'app/getAppList.do', {}, {
                params: {
                    appId:$scope.ID,
                    appName:$scope.AppName,
                    platform:$scope.Plateform,
                    publishAccount:$scope.Account,
                    examinStatus:$scope.ExaminStatus,
                    groundStatus:$scope.GroudStatus,
                    isRecommend:$scope.IsRecommend,
                    pageNum: pageNum,    //当前页数
                    pageSize: pageSize,    //每页显示的大小
                    isMust:$scope.isMust
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.applicationLists = data.result;
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;

                    // console.log($scope.currentPageStores);

                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    // console.log($scope.stores);
                } else {
                    $scope.currentPageStores = null;    //变成null，及时更新到页面中
                }
            });
        }


        $scope.cancel=function(id){
            $http.post('http://localhost:8080/applicationMarket- 0/' + 'app/cancelRecommend.do', {}, {
                params: {
                    appId:id
                }
            }).success(function (data) {
                if (data.code == 0) {
                    for (var i = 0; i < $scope.currentPageStores.length; i++) {
                        if ($scope.currentPageStores[i].appId==id) {
                            $scope.currentPageStores[i].isRecommend=0;
                        }
                    }
                    $scope.showAlert("取消成功");
                } else {
                    $scope.showAlert(data.message);
                }
            });
        }


        $scope.export = function () {

            //查询所有管理员记录
            $http.post('http://localhost:8080/bookmall-server/' + 'application/getApplicationList.do', {}, {
                params: {
                    applicationName: $scope.kwApplicationName,
                    roleId: $scope.kwRoleId,
                    pageNum: 1,
                    pageSize: $scope.total

                }
            }).success(function (data) {

                if (data.errorCode == 0) {
                    $scope.allApplicationLists = data.result;
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
                    obj.titleForKey = ["applicationId", "applicationName", "password", "roleName", "description", "createdDate"];
                    obj.data = $scope.allApplicationLists;

                    for (var i in $scope.allApplicationLists) {
                        $scope.allApplicationLists[i].createdDate = formatDate(new Date($scope.allApplicationLists[i].createdDate));
                    }
                    exportCsv(obj);


                }
                ;
            });

        }


        $scope.setMust=function(id,status){
            $http.post('http://localhost:8080/applicationMarket-server/' + 'app/setMust.do', {}, {
                params: {
                    appId:id,
                    status:status
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("设置成功");
                    for (var i = 0; i < $scope.currentPageStores.length; i++) {
                        if ($scope.currentPageStores[i].appId==id) {
                            $scope.currentPageStores[i].isMust=status;
                        }
                    }

                }else{
                    $scope.showAlert("设置成功");
                }
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
            getApplicationList(page, $scope.numPerPage);


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
            getApplicationList(1, $scope.numPerPage);
        };

        // function select(page) {
        //     console.log("page:"+page+"--numPerPage:"+$scope.numPerPage);
        //     getApplicationList(page, $scope.numPerPage);

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
        //      // console.log('$scope.applicationName=='+$scope.applicationName  + ", " + $scope.account+"---"+$scope.status);

        //     getApplicationList(1, $scope.numPerPage);

        // };


        init = function () {
            // console.log($scope.numPerPage);

            // getRoleList(1, 100);

            // console.log(:$scope.kwApplicationName+"----"+$scope.account+);
            $http.post('http://localhost:8080/applicationMarket-server/' + 'app/getAppList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;

                    console.log($scope.stores);
                    $scope.search();

                    $scope.currentPageStores = $scope.stores;

                }
                ;
            });


            /*$http.post('http://localhost:8080/bookmall-server/' + 'application/getApplicationById.do',{},{params:{
                applicationId:sessionStorage.applicationId
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.authApplication=data.result;
                    console.log($scope.authApplication.roleId);
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

       $scope.selected = {};

        $scope.isSelectedAll = false;

                $scope.isSelected = function (id) {
                    // console.log("isSelected==" + $scope.selected[id]);
                    if($scope.selected[id] == true){
                        return true;
                    }else{
                        return false;
                    }         
                };

                var judgeSelectedAll = function () {
            var isSelectedAll = true;


              for (var i = 0; i < $scope.currentPageStores.length; i++) {


                              var app = $scope.currentPageStores[i];

                isSelectedAll &= $scope.selected[app.appId];

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


                              var app = $scope.currentPageStores[i];



                updateSelectedByStatus(app.appId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/applicationMarket-server/"+"app/deleteAppBatch.do";// 接收上传文件的后台地址
                    // console.log($scope.selected);
                    var temp = "";

                    var form = new FormData();

                    for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        
                        if ($scope.selected[temp]==true) {
                            form.append("appIds", temp);
                            console.log(temp);
                        }
                        
                        
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            var data=eval("("+xhr.responseText+")");
                            if (data.code==0) {
                                    $scope.showAlert("删除成功");
                                 for(var i in $scope.selected){
                                    temp = i;
                                    $(".delete-"+temp).css("display","none");
                                         $scope.total--;
                                 }
                             }else{
                                 $scope.showAlert(data.message);
                             }
                            

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


       


        

        //应用下架
        $scope.under = function (id) {
            $scope.showConfirm = function () {
                // 确定
                var confirm = $mdDialog.confirm()
                    .title('是否确定下架应用')
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirm).then(function () {
                    // console.log('确定')
                    $http.post("http://localhost:8080/applicationMarket-server/" + "app/under.do?", {}, {
                        params: {
                            appId: id
                        }
                    }).success(function (data) {
                        console.log(data);
                        if (data.code == 0) {
                            console.log(data.code)
                            $scope.showAlert("下架成功");
                            init();  //重新刷新数据
                        } else {
                            console.log(data.message);
                            $scope.showAlert(data.message);
                        }

                    })
                }, function () {
                    $scope.showAlert("取消下架");
                });
            };


            $scope.showConfirm();
        }


        //应用上架
        $scope.ground = function (id) {
            $scope.showConfirm = function () {
                // 确定
                var confirm = $mdDialog.confirm()
                    .title('是否确定上架应用')
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirm).then(function () {
                    // console.log('确定')
                    $http.post("http://localhost:8080/applicationMarket-server/" + "app/ground.do?", {}, {
                        params: {
                            appId: id
                        }
                    }).success(function (data) {
                        console.log(data);
                        if (data.code == 0) {
                            console.log(data.code)
                            $scope.showAlert("上架成功");
                            init();  //重新刷新数据
                        } else {
                            console.log(data.message);
                            $scope.showAlert(data.message);
                        }

                    })
                }, function () {
                    $scope.showAlert("取消上架");
                });
            };


            $scope.showConfirm();
        }

        //修改密码
        $scope.applicationId = $location.search().id;
        $scope.applicationName = $location.search().name;
        $scope.roleName = $location.search().roleName;
        // 获取权限列表
        // $http.post('http://localhost:8080/bookmall-server/' + 'application/getAuthorityList2.do',{},{params:{
        // }}).success(function (data) {
        //     if (data.errorCode == 0) {
        //         $scope.authorityList=data.result;
        //         console.log($scope.authorityList);
        //         //  获取用户权限val
        //         $http.post("http://localhost:8080/bookmall-server/"+"application/getApplicationAuthorityList.do?",{},{params:{
        //             applicationId:$scope.applicationId
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

                    $http.post("http://localhost:8080/bookmall-server/" + "application/modifyApplication.do?", {}, {
                        params: {
                            applicationId: $scope.applicationId,
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
                    $location.path('/application/application-list')
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
            $location.path("/application/application-list");
        }

        init();
    }


    //
    function AddApplicationCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.isAddApplication = 0;
        $scope.isShow = 0;
        $scope.selectAuthories;




        // 上传授权书(浏览器--只从相册中选择)
        function getbjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }
        


        $scope.backClick = function () {
            $location.path("/application/application-list");
        }

        $scope.login = function () {
            if (sessionStorage.applicationId == undefined) {
                $location.path('')
            }
        }

        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "41") {
                $scope.isShow = 1;
            }
        }
        
        //上传安装包
        $scope.doPackage=function(element){
            // console.log("-----"+element.files.length);
            $scope.packageObj = element.files[0];  //取出第一个文件
        }

        //上传资质许可证明
        $scope.doUploadlicense=function(element){
                $scope.licenseObj = element.files[0];   //取出第一个文件
        }

        $scope.jietu=1;

        //上传截图 4-5张
        $scope.doUploadappImage=function(element){
                $scope.appImageObj = element.files; //上传数组
                for (var i = 0; i < $scope.appImageObj.length; i++) {
                    $('#jietu-'+(i+1)).attr('src',getbjectURL($scope.appImageObj[i]));
                }

                // $scope.jietu=0;
                // console.log(element.files);
        }

        //上传应用图标
        $scope.doUploadlogo=function(element){
                $scope.logoObj = element.files[0];  //第一文件即可
                // console.log(getbjectURL($scope.logoObj))
                $('#icon').attr('src',getbjectURL($scope.logoObj))
                // $scope.jietu=1;
        }


        $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    // $location.path('/Banner/banner-list');
                });
            }



        
        //获取类别
        $http.post('http://localhost:8080/applicationMarket-server/' + 'appType/getAppTypeList.do', {}, {
            params: {
            }
        }).success(function (data) {
            if (data.code == 0) {
                $scope.apptypes = data.result.allTypes;
                console.log($scope.apptypes);

            }
            ;
        });


        $scope.reshow=0;

        //添加应用
        $scope.addApp=function(){

           
            if ($scope.platform==undefined) {
                $scope.showAlert("选择平台不能为空");
                return;
            }

            // if ($scope.packageName==undefined) {
            //     $scope.showAlert("安装包名不能为空");
            //     return;
            // }

            if ($scope.versionName==undefined) {
                $scope.showAlert("版本名称不能为空");
                return;
            }

            if ($scope.versionNumber==undefined) {
                $scope.showAlert("版本号不能为空");
                return;
            }

            if ($scope.apptype==undefined) {
                $scope.showAlert("软件分类不能为空");
                return;
            }
            if ($scope.personalRecommend==undefined) {
                $scope.showAlert("个性推荐语不能为空");
                return;
            }
            if ($scope.supportLanguage==undefined) {
                $scope.showAlert("支持语言不能为空");
                return;
            }
            if ($scope.tariffType==undefined) {
                $scope.showAlert("资费类型不能为空");
                return;
            }
            if ($scope.introduction==undefined) {
                $scope.showAlert("应用简介不能为空");
                return;
            }

            if ($scope.versionIntroduction==undefined) {
                $scope.showAlert("当前版本介绍不能为空");
                return;
            }

            if ($scope.supportSystem==undefined) {
                $scope.showAlert("支持系统不能为空");
                return;
            }
            if ($scope.privacy==undefined) {
                $scope.showAlert("隐私权限说明不能为空");
                return;
            }
            if ($scope.publishType==undefined) {
                $scope.showAlert("发布时间不能为空");
                return;
            }

            if ($scope.examineExplain==undefined) {
                $scope.examineExplain="";
            }
            if ($scope.appName==undefined) {
                $scope.showAlert("应用名称不能为空");
                return;
            }

            if ($scope.versionFeatures==undefined) {
                $scope.showAlert("新版特性不能为空");
                return;
            }

            if ($scope.company==undefined) {
                $scope.showAlert("开发商不能为空");
                return;
            }

            if ($scope.platform==2&&$scope.appUrl==undefined) {
                $scope.showAlert("应用下载链接不能为空");
                return;
            }

              if ($scope.platform==2&&$scope.size==undefined) {
                $scope.showAlert("安装包大小不能为空");
                return;
            }

            if ($scope.platform==1&&$scope.packageName==undefined) {
                $scope.showAlert("包名不能为空");
                return;
            }



            if (($scope.publishType=="2"&&$scope.day==undefined)||($scope.publishType=="2"&&$scope.time==undefined)) {
                $showAlert("定时发布的准确时间不能为空");
                return;
            }

            if ($scope.day==undefined) {
                $scope.day="";
            }
            if ($scope.time==undefined) {
                $scope.time="";
            }

            if ($scope.downloadMoney==undefined) {
                $scope.downloadMoney="";
            }

            if ($scope.userAccount==undefined) {
                $scope.userAccount="";
            }

             $scope.reshow=1;

            var form = new FormData();
            form.append("platform",$scope.platform);
            
            //如果是安卓应用，必须上传安装包
            if ($scope.platform==1) {
                form.append("packageFile",$scope.packageObj);
            }

            // form.append("packageName",$scope.packageName);
            form.append("versionName",$scope.versionName);
            form.append("versionNum",$scope.versionNumber);
            form.append("appTypeId",$scope.apptype);
            form.append("personalRecommend",$scope.personalRecommend);
            form.append("licenseFile",$scope.licenseObj);
            form.append("supportLanguage",$scope.supportLanguage);
            form.append("tariffType",$scope.tariffType);
            form.append("appIntroduction",$scope.introduction);
            form.append("versionIntroduction",$scope.versionIntroduction);
            form.append("supportSystem",$scope.supportSystem);
            form.append("privacy",$scope.privacy);
            form.append("logoFile",$scope.logoObj);
            form.append("publishId",sessionStorage.adminId);
            form.append("appName",$scope.appName);
            form.append("examineExplain",$scope.examineExplain);
            form.append("publishType",$scope.publishType);
            form.append("publishDay",$scope.day);
            form.append("publishTime",$scope.time);
            // form.append("downloadMoney",$scope.downloadMoney);
            form.append("userAccount",$scope.userAccount);
            form.append("versionFeaturs",$scope.versionFeatures);
            form.append("appUrl",$scope.appUrl);
            form.append("size",$scope.size);
            form.append("developCompany",$scope.company);
            form.append("packageName",$scope.packageName);


            for (var i = 0; i < $scope.appImageObj.length; i++) {
                form.append("appImage",$scope.appImageObj[i]);
            }

            var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", "http://localhost:8080/applicationMarket-server/app/addApp.do", true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("添加成功");
                                    // // console.log("广告上传成功");
                                    // alert("广告上传成功");
                                    $scope.reshow=0;
                                }else{
                                    $scope.showAlert(date.message);
                                    $scope.reshow=0;
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
                            }
                        }


                 }

            //获取类别
            // $http.post('http://localhost:8080/applicationMarket-server/' + 'app/addApp.do', {}, {
            //     params: {
            //     }
            // }).success(function (data) {
            //     if (data.code == 0) {
            //         $scope.rs = data.result;
            //         console.log($scope.rs);
            //     }else{
            //         $scope.showAlert(data.message);
            //     };
            // });
        }

        

    }


})();
