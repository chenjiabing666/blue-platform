(function(){
    // 'user strick'

    angular.module('app.user')
           .controller('FeedbackCtrl', ['$scope','$http','$mdDialog','$location','$timeout',FeedbackCtrl])
           .controller('ChangeFeedbackCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeFeedbackCtrl])
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


        //反馈列表
        function FeedbackCtrl($scope,$http,$location,$mdDialog,$timeout){
            $scope.login = function(){
                if(sessionStorage.adminId == undefined){
                    $location.path('/page/signin')
                }
            }

            $timeout($scope.login(),10)

            var init;

    $scope.stores = []; 
    $scope.kwNickName;     //用户昵称
    $scope.kwUserId;     //用户id
    $scope.kwMobile;     //手机号码
    $scope.userName;    //用户名
    $scope.vipType;    //用户类型

    // $scope.kwSex = '';      
    // $scope.KwLevel = '';    
    // $scope.KwStartTime = '';
    // $scope.KwEndTime = '';    
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

    $scope.isListUser = 0;
    $scope.isEditUser = 0;
    $scope.isDeleteUser = 0;
    $scope.isAddUser = 0;

    $scope.userId="";
    $scope.realName="";
    $scope.userName="";
    $scope.gender="";
    $scope.isDeveloper="";

    $scope.isShow = 0;

    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "38") {
            $scope.isShow = 1;
        }
    }


    //获取用户列表
    function getUserList(pageNum, pageSize){
        $http.post('http://localhost:8080/blue-server/' + 'user/getAuthListBack.do',{},{params:{
            mobile:$scope.userName,
            company:$scope.companyName,
            status:$scope.status,
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data)  {
         if (data.code == 0) {
           $scope.userLists=data.result;
           console.log("xsxs"+$scope.userLists);
           $scope.stores=data.result;
           $scope.auth=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchUser(pageNum, $scope.numPerPage);
             }else {
                /*$scope.showAlert(data.message);*/
                $scope.currentPageStores = null;
                console.log("xsxs"+$scope.userLists);

            }
        });
    }

    // $scope.showAlert = function(txt) {

    //                     $mdDialog.show(
    //                         $mdDialog.alert()
    //                         .clickOutsideToClose(false)
    //                         .title(txt)
    //                         .ok('确定')
    //                         )

    //                 }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["用户ID","用户账号","用户名称","性别","墨客币","井通","是否开发者"];
        obj.titleForKey = ["userId","userName","realName","gender","moacBalance","swtcBalance","isDeveloper"];
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
                                if (titleForKey[j]=="gender") {
                                    if (data[i][titleForKey[j]]==1) {
                                        temp.push("男");
                                    }else{
                                        temp.push("女");
                                    }
                                }else if(titleForKey[j]=="isDeveloper"){
                                    if (data[i][titleForKey[j]]==0) {
                                        temp.push("否");
                                    }else{
                                        temp.push("是");
                                    }
                                }else if(titleForKey[j]=="moacBalance"){
                                    if (data[i][titleForKey[j]]==null) {
                                        temp.push("0");
                                    }else{
                                        temp.push(data[i][titleForKey[j]]);
                                    }
                                }else if(titleForKey[j]=="swtcBalance"){
                                    if (data[i][titleForKey[j]]==null) {
                                        temp.push("0");
                                    }else{
                                        temp.push(data[i][titleForKey[j]]);
                                    }
                                }

                                else{
                                    temp.push(data[i][titleForKey[j]]);
                                }
                                
                            }
                            str.push(temp.join(",")+"\n");
                        }
                        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str.join(""));
                        var downloadLink = document.createElement("a");
                        downloadLink.href = uri;
                        downloadLink.download = "用户列表.csv";
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    }


                    function select(page) {
                       getUserList(page, $scope.numPerPage);


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

                    getUserList(1, $scope.numPerPage);
                };

                $scope.emptyCondition = function(){
                    $scope.kwNickName = '';
                    $scope.kwUserId = '';
                    $scope.kwMobile = '';
                    $scope.kwSex = '';
                    $scope.KwLevel = '';
                    $scope.KwStartTime = '';
                    $scope.KwEndTime = '';
                    $scope.search();
                };


                //页面加载完毕立即调用的方法
                init = function() {
                    console.log($scope.numPerPage);
                        console.log($scope.vipType);
                    $http.post('http://localhost:8080/blue-server/' + 'user/getAuthListBack.do',{},{params:{
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.code == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       $scope.auth=data.result;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchUser(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchUser(page,$scope.numPerPage);
                 }
             });

                };




$scope.selected = {};    
$scope.userIdsExcel=[];

$scope.isSelectedAll = false;

    //判断selected的对应id的值是否为false或者true
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


                      var auth = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[auth.enterpriseAuthId];

                }

    return isSelectedAll;
          };
        

        //修改选择
          var updateSelected = function (id) {

            // console.log("$scope.isSelected(id)"+$scope.isSelected(id));

            // console.log("selcted[]"+$scope.selected[107]);


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

        //点击全选
         $scope.selectAll = function () {


            console.log("isSelectedAll1"  + $scope.isSelectedAll);


            if($scope.isSelectedAll){

                $scope.isSelectedAll = false;

            }else{

                $scope.isSelectedAll = true;


            }

                    
                        for (var i = 0; i < $scope.currentPageStores.length; i++) {


                              var auth = $scope.currentPageStores[i];



                updateSelectedByStatus(auth.enterpriseAuthId, $scope.isSelectedAll);

                        }

            


          };


          $scope.selectItem = function (id) {
        console.log("selectItem"  + id);


    updateSelected(id);

          };

    
    //审核
    $scope.modifyAuth = function(status){


                    //       // 确定
                    //       var confirm = $mdDialog.confirm()
                    //       .title('是否确定此操作')
                    //         // .ariaLabel('Lucky day')
                    //         // .targetEvent(ev)
                    //         .ok('确定')
                    //         .cancel('取消操作');

                    //         $mdDialog.show(confirm).then(function() {
                    // // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"user/authExamin.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        if ($scope.selected[temp]==true) {
                            form.append("authIds", temp);
                            // form.getTaskDetail
                        }
                        
                    }

                    form.append("status",status);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            var data=JSON.parse(xhr.responseText);
                            if (data.code==0) {
                                alert("操作成功");
                            }else{
                                alert(data.message);
                            }

                            
                            // for(var i in $scope.selected){
                            //     temp = i;
                            //     if ($scope.selected[temp]==true) {
                            //         $(".delete-"+temp).css("display","none");
                            //         $scope.total--;
                            //     }
                                
                                
                            // }

                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.message);
                         $scope.showAlert("操作失败");
                     }
                 }
                    // init();
                //     $scope.showAlert = function(txt) {

                //         $mdDialog.show(
                //             $mdDialog.alert()
                //             .clickOutsideToClose(false)
                //             .title(txt)
                //             .ok('确定')
                //             )

                //     }

                // })

                        }





$scope.deleteList = function(){


                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定删除用户')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定删除')
                            .cancel('取消删除');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"user/deleteUserBatch.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        if ($scope.selected[temp]==true) {
                            form.append("userIds", temp);
                            form.getTaskDetail
                        }
                        
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            $scope.showAlert("批量删除成功");
                            for(var i in $scope.selected){
                                temp = i;
                                if ($scope.selected[temp]==true) {
                                    $(".delete-"+temp).css("display","none");
                                    $scope.total--;
                                }
                                
                                
                            }

                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.message);
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

       $scope.searchUser = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.userId = $("#userId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/aiyixue-server/' + 'user/getUserList.do',{},{params:{
            userId:$scope.kwUserId,
            nickName:$scope.kwNickName,
                    /*csName:$scope.csName,
                    level:$scope.level,
                    name:$scope.name,*/
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



        // 删除用户
        $scope.deleteUser = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条用户信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/"+"user/deleteUserById.do?",{},{params:{
                        userId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除用户成功");
                            $(".delete-"+id).css("display","none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.message);
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
                .title('是否确定设置该用户为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/aiyixue-server/"+"elite/addElite.do?",{},{params:{
                        userId:id,
                    }}).success(function(data){
                        if(data.errorCode == 0){
                            $scope.showAlert("设置成功");
                            $(".set-"+id).css("display","none");
                            $scope.total--;
                        }else{
                            $scope.showAlert(data.message);
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


        // $scope.showAlert = function(txt) {
        //      // dialog
        //     $mdDialog.show(
        //         $mdDialog.alert()
        //             // .parent(angular.element(document.querySelector('#popupContainer')))
        //             .clickOutsideToClose(false)
        //             .title(txt)
        //             // .content('You can specify some description text in here.')
        //             // .ariaLabel('Alert Dialog Demo')
        //             .ok('确定')
        //             // .targetEvent()
        //     )
        // }
        init();




        }

//**************************************************
//**********修改用户反馈****************

function ChangeFeedbackCtrl($scope,$http,$location,$mdDialog,$timeout){
    
    $scope.backClick = function () {
            $location.path("/user/user-list");
        }

    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.isShow = 0;
            var authoritySet = sessionStorage.authoritySet.split(',');
            for (var i = 0; i < authoritySet.length; i++) {
                if (authoritySet[i] == "39") {
                    $scope.isShow = 1;
                }
            }

    //获取反馈的Id
    $scope.authId = $location.search().id;
    
    $scope.showAlert = function(txt) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                            )

                    }



    $http.post('http://localhost:8080/blue-server/' + 'user/getAuthById.do',{},{params:{
                    authId:$scope.authId
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.auth=data.result;
                            console.log($scope.auth)
                        }else{
                            $scope.showAlert(data.message);
                        }
                    })


    $scope.reply=function(){
        $http.post('http://localhost:8080/blue-server/' + 'user/replyFeedBack.do',{},{params:{
                    adminId:sessionStorage.adminId,
                    content:$scope.content,
                    userId:$scope.userId
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("回复成功");
                        }else{
                            $scope.showAlert(data.message);
                        }
                    })
    }

    $scope.user = {};

    $scope.doUploadPhoto=function(element){

        $scope.fileObj = element.files[0];
    }

    $scope.modifyAuth = function(status){
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定此操作')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消操作');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeFeedbackUrl ="http://localhost:8080/blue-server/" + "user/authExamin.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("authIds",$scope.authId);
                    form.append("status",status);
                    // form.append("adminDescription",$scope.user.adminDescription);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeFeedbackUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成
                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           var data=JSON.parse(xhr.responseText);
                           if (data.code==0) {
                                $scope.showAlert("操作执行成功");
                           }else{
                                $scope.showAlert(data.message);
                           }
                       }
                   }

               }

           }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消操作");
                });
                        };
                        $scope.showAlert = function(txt) {
                 // dialog
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
                $location.path("/user/user-list");
            }

        }

    })();
