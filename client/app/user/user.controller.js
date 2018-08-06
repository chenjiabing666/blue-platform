(function(){
	// 'user strick'
    DecedentCtrl
	angular.module('app.user',[])
  .controller('UserCtrl', ['$scope','$http','$mdDialog','$location','$timeout',UserCtrl])
  .controller('UserAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',UserAddCtrl])
  .controller('UserDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout','$sce',UserDetailCtrl])
  .controller('UserchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',UserchangeCtrl])
  .controller('DecedentCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DecedentCtrl])
  .filter('parseGender',function() {
    return function(input){
        if(input == 1){
            return '男';
        }else if(input == 2){
            return '女';
        }else{
            return '';
        }
    }

})
  .filter('parseUserStatus',function(){
    return function(input){
        if(input == 1){
            return '正常';
        }
        if(input == 2){
            return '封号';
        }
        if(input == 3){
            return '暂停';
        }
    }
})
  .filter('parseUserActivated',function(){
    return function(input){
        if(input == 0){
            return '待审核';
        }
        if(input == 1){
            return '已通过';
        }
        if(input == 2){
            return '未通过';
        }
    }
})



  function UserCtrl($scope,$http,$mdDialog,$location,$timeout){
    // $scope.level=''
    
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

    $scope.isShow = 0;
    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "3") {
            $scope.isShow = 1;
        }
    }


    //获取用户列表
    function getUserList(pageNum, pageSize){
        console.log("nickName"+$scope.kwNickName)
        if($scope.kwUserId==""){
            $scope.kwUserId=undefined;
        }

        if($scope.kwMobile==""){
            $scope.kwMobile=undefined;
        }

        if($scope.userName==""){
            $scope.userName=undefined;
        }

        if($scope.vipType==""){
            $scope.vipType=undefined;
        }

        if ($scope.kwNickName=="") {
            $scope.kwNickName=undefined;
        }


        $http.post('http://localhost:8080/lifecrystal-server/' + 'user/getUserList.do',{},{params:{
            userId:$scope.kwUserId,
            nickName:$scope.kwNickName,
            mobile:$scope.kwMobile,
            userName:$scope.userName,
            vipType:$scope.vipType,
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data) {
         if (data.successCode == 0) {
           $scope.userLists=data.result;
           $scope.stores=data.result;
           $scope.user=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchUser(pageNum, $scope.numPerPage);
             }else {
                /*$scope.showAlert(data.errorMessage);*/
                $scope.currentPageStores = null;

            }
        });
    }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["用户ID","用户手机","昵称","用户姓名","注册日期","用户类型"];
        obj.titleForKey = ["userId","mobile","nickName","userName","createdDate","vipType"];
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
                    $http.post('http://localhost:8080/lifecrystal-server/' + 'user/getUserList.do',{},{params:{
                        userId:$scope.kwUserId,
                        nickName:$scope.kwNickName,
                        mobile:$scope.kwMobile,
                        userName:$scope.userName,
                        vipType:$scope.vipType,
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.successCode == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchUser(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchUser(page,$scope.numPerPage);
                 }
             });

                };






//          $scope.selected = {};

//           $scope.isSelected = function (id) {
//             console.log("isSelected");

//             if($scope.selected[id] == true){
//                 return true;



//             }else{
//                 return false;

//             }
//             
//           };
//           $scope.isSelectedAll = function () {
//     console.log("isSelectedAll");
//             return $scope.selected.length === $scope.currentPageStores.length;
//           };

//           var updateSelected = function (action, id) {

//     console.log($scope.isSelected(id));

//             if ($scope.isSelected(id)){


//             $scope.selected[id] = false;


//             }else{

//                 $scope.selected[id] = true;

//             }
//            
//           };
          //更新某一列数据的选择
//           $scope.updateSelection = function (id) {

//             updateSelected(id);
//           };
          //全选操作

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


                      var user = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[user.userId];

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


                      var user = $scope.currentPageStores[i];



        updateSelectedByStatus(user.userId, $scope.isSelectedAll);

                }

            


          };


          $scope.selectItem = function (id) {
        console.log("selectItem"  + id);


    updateSelected(id);

          };




//导出到excel
$scope.exportExcel = function(){


                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否导出选择的会员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定导出')
                            .cancel('取消导出');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')

                var url="http://localhost:8080/lifecrystal-server/"+"user/exportExcel.do?";

                // var modifyTopicUrl ="http://localhost:8080/lifecrystal-server/"+"user/exportExcel.do";// 接收上传文件的后台地址
                // console.log($scope.selected);
                // var temp = "";

                // var form = new FormData();

                    console.log($scope.selected[103]);
                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        console.log(i); 
                        
                        if($scope.selected[i]==true){
                            url=url+"userIds="+i+"&";
                        }
                        
                        // temp = i;
                        // console.log(temp);
                        // form.append("userIds", temp);
                        // form.getTaskDetail
                    }
                    // console.log("form"+form);
                    window.location.href=url;

                //     var xhr = new XMLHttpRequest();
                //     var response;
                //     xhr.open("post", modifyTopicUrl, true);
                //     xhr.send(form);
                //     xhr.onreadystatechange = doResult;
                //     function doResult() {
                //         if(xhr.readyState == 4  && xhr.status == 200){
                //             $scope.showAlert("导出成功");
                //             // for(var i in $scope.selected){
                //             //     temp = i;
                //             //     $(".delete-"+temp).css("display","none");
                //             //     $scope.total--;
                //             // }

                //         } else if(xhr.readyState == 4 && xhr.status != 200){
                //          // $scope.showAlert(xhr.errorMessage);
                //          $scope.showAlert("导出失败");
                //      }


                //  }
                //     // init();
                //     $scope.showAlert = function(txt) {

                //         $mdDialog.show(
                //             $mdDialog.alert()
                //             .clickOutsideToClose(false)
                //             .title(txt)
                //             .ok('确定')
                //             )

                //     }

                 })

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


                var modifyTopicUrl ="http://localhost:8080/lifecrystal-server/"+"user/deleteUserBatch.do";// 接收上传文件的后台地址
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
                .title('是否确定删除该条用户员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/lifecrystal-server/"+"user/deleteUser.do?",{},{params:{
                        userId:id
                    }}).success(function (data){
                        if(data.successCode == 0){
                            $scope.showAlert("删除用户成功");
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



    // 查看详情
    function UserDetailCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "49") {
                $scope.isShow = 1;
            }
        }

        //重置密码的权限
        $scope.isRestShow = 0;
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            console.log("authoritySet:"+authoritySet)
            if (authoritySet[i] == "50") {
                console.log("密码")
                $scope.isRestShow = 1;
            }
        }


        //绑定逝者
        $scope.bindingDecedent = function(){
            $location.path('/user/user-bindDecedent');
        }

        $scope.backClick = function(){
            $location.path('/user/user-list');
        }
/*        $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $("#myDeal").attr("disabled",true);
            $("#myManager").attr("disabled",true);
            $(".changeConfirm").css("display","none");
            $("#myManager").css("display","block");
            $(".user-manager").css("display",'none');

        }*/

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


        $scope.userId = $location.search().id;   //获取用户id
        console.log("id="+$scope.userId);
        //根据用户id获取用户详细信息
        $http.post('http://localhost:8080/lifecrystal-server/' + 'user/getUserById.do',{},{params:{
            userId:$scope.userId   //用户id
        }}).success( function (data){   
            if(data.successCode == 0){
                $scope.user = data.result;
                console.log($scope.user.userIcon);
                if($scope.user.sex=='1'){
                    $scope.user.sex='男'
                }else if($scope.user.sex=='2'){
                    $scope.user.sex='女'
                }
                else if($scope.user.sex=='3'){
                    $scope.user.sex='保密'
                }

                if ($scope.user.vipType=="1") {
                    $scope.user.vipType="普通会员";
                }else{
                    $scope.user.vipType="藏晶苑会员";
                }
                
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });


        //根据用户id获取其绑定的逝者信息
        $http.post('http://localhost:8080/lifecrystal-server/' + 'user/getDetailedInformation.do',{},{params:{
            userId:$scope.userId   //用户id
        }}).success( function (data){   
            if(data.successCode == 100200){
                $scope.users = data.result;
                console.log($scope.users);
                for (var i = 0; i < $scope.users.length; i++) {
                    if($scope.users[i].decedentGender=="1"){
                        $scope.users[i].decedentGender="男";
                    }else if($scope.users[i].decedentGender=="3"){
                        $scope.users[i].decedentGender=="保密";
                    }
                    else{
                        $scope.users[i].decedentGender="女";
                    }
                }
            } else {
                // $scope.showAlert(data.errorMessage);
            }
        });


        //解除绑定的函数
        $scope.unbindingDecedent=function(decedentId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定解除绑定信息')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'user/unbindingDecedent.do',{},{params:{
            userId:$scope.userId,  //用户id
            decedentId:decedentId
        }}).success( function (data){   
            if(data.successCode == 100200){  //解除成功
                $scope.showAlert(data.successMessage);
                $("#delete-"+decedentId).remove();
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });
    }, function() {

                        $scope.showAlert("取消绑定");
                    });
        }


        //重置密码
        $scope.resetPassword=function(userId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定重置密码')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'user/restPassword.do',{},{params:{
            userId:$scope.userId  //用户id
        }}).success( function (data){   
            if(data.successCode == 100200){  //解除成功
                $scope.showAlert(data.successMessage);
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });
            }, function() {

                        $scope.showAlert("取消重置密码");
                    });
        }


        /** 
        * 视频路径处理 
        */  
        $scope.videoUrl = function(url){  
         return $sce.trustAsResourceUrl(url);  
     }  

     $scope.videoBig = false;
     $scope.videoImg = true;
     $scope.videoClick = function(){
        $scope.videoBig = true;
        $scope.videoImg = false;
    }

    $scope.closeVideo = function(){
        $scope.videoBig = false;
        $scope.videoImg = true;
    }   

}




    //绑定逝者
    function DecedentCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "49") {
                $scope.isShow = 1;
            }
        }

        //重置密码的权限
        $scope.isRestShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "50") {
                $scope.isRestShow = 1;
            }
        }


        //绑定逝者
        $scope.bindingDecedent = function(){
            alert("cdd");
            $location.path('/user/user-bindDecedent');
        }

        $scope.backClick = function(){
            alert("change");
            $location.path('/user/user-detail');
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


        $scope.userId = $location.search().id;   //获取用户id
        console.log("id="+$scope.userId);
        //根据用户id获取用户详细信息
        $http.post('http://localhost:8080/lifecrystal-server/' + 'user/getUserById.do',{},{params:{
            userId:$scope.userId   //用户id
        }}).success( function (data){   
            if(data.successCode == 0){
                $scope.user = data.result;
                console.log($scope.user.userIcon);
                if($scope.user.sex=='1'){
                    $scope.user.sex='男'
                }else if($scope.user.sex=='2'){
                    $scope.user.sex='女'
                }
                else if($scope.user.sex=='3'){
                    $scope.user.sex='保密'
                }

                if ($scope.user.vipType=="1") {
                    $scope.user.vipType="普通会员";
                }else{
                    $scope.user.vipType="藏晶苑会员";
                }
                
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });


        //根据用户id获取其绑定的逝者信息
        $http.post('http://localhost:8080/lifecrystal-server/' + 'user/getDetailedInformation.do',{},{params:{
            userId:$scope.userId   //用户id
        }}).success( function (data){   
            if(data.successCode == 100200){
                $scope.users = data.result;
                console.log($scope.users);
                for (var i = 0; i < $scope.users.length; i++) {
                    if($scope.users[i].decedentGender=="1"){
                        $scope.users[i].decedentGender="男";
                    }else if($scope.users[i].decedentGender=="3"){
                        $scope.users[i].decedentGender=="保密";
                    }
                    else{
                        $scope.users[i].decedentGender="女";
                    }
                }
            } else {
                // $scope.showAlert(data.errorMessage);
            }
        });


        //解除绑定的函数
        $scope.unbindingDecedent=function(decedentId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定解除绑定信息')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'user/unbindingDecedent.do',{},{params:{
            userId:$scope.userId,  //用户id
            decedentId:decedentId
        }}).success( function (data){   
            if(data.successCode == 100200){  //解除成功
                $scope.showAlert(data.successMessage);
                $("#delete-"+decedentId).remove();
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });
    }, function() {

                        $scope.showAlert("取消绑定");
                    });
        }


        //重置密码
        $scope.resetPassword=function(userId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定重置密码')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'user/restPassword.do',{},{params:{
            userId:$scope.userId  //用户id
        }}).success( function (data){   
            if(data.successCode == 100200){  //解除成功
                $scope.showAlert(data.successMessage);
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });
            }, function() {

                        $scope.showAlert("取消重置密码");
                    });
        }


        /** 
        * 视频路径处理 
        */  
        $scope.videoUrl = function(url){  
         return $sce.trustAsResourceUrl(url);  
     }  

     $scope.videoBig = false;
     $scope.videoImg = true;
     $scope.videoClick = function(){
        $scope.videoBig = true;
        $scope.videoImg = false;
    }

    $scope.closeVideo = function(){
        $scope.videoBig = false;
        $scope.videoImg = true;
    }   

}


// -------------------------------------------------------------------------------------------------------------











    
            
        function change($scope,$http,$location,$mdDialog,$timeout){
            $timeout($scope.login(),10)
            $scope.userId = $location.search().userId;
            console.log($scope.userId);

            $scope.backClick = function(){
                alert();
                $location.path("/user/user-list");

            }

            $http.post('http://localhost:8080/aiyixue-server/' + 'user/getUserByUserId.do',{},{params:{
                userId:$scope.userId
            }}).success( function (data){
                if(data.errorCode == 0){
                    $scope.user = data.result;
                    $scope.user.deleted = $scope.user.deleted+'';


                } else {
                    $scope.showAlert(data.errorMessage);
                    console.log($scope.user)
            }/*if($scope.user.gender=='1'){
                $scope.user.gender='男'
            }else if ($scope.user.gender=='0') {
                $scope.user.gender='女'
            }*/

        });


            $scope.doUploadPhoto=function(element){
                $scope.fileObj = element.files[0];
            }

            $scope.changeuser = function(){
                $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改用户信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeGiftUrl ="http://localhost:8080/aiyixue-server/" + "user/modifyUser.do?";  
                    // FormData 对象
                    var form = new FormData();
                    form.append("userId",$scope.userId);
                    form.append("nickName",$scope.user.nickName);
                    form.append("password",$scope.user.password);
                    form.append("realName",$scope.user.realName);
                    form.append("sex",$scope.user.sex);
                    form.append("age",$scope.user.age);
                    form.append("deleted",$scope.user.deleted);
                    form.append("file", $scope.fileObj);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeGiftUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成


                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           $scope.showAlert("修改用户信息成功");                      

                       }
                   }

               }

           }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消修改");
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
                     $location.path('/user/user-list');
                 }) 
                }    
                $scope.showConfirm();
            }


        }



        // 修改
        function UserchangeCtrl($scope,$http,$location,$mdDialog,$timeout){
            $timeout($scope.login(),10)
            $scope.userId = $location.search().userId;
            $scope.clickDecedentId;  //选择的逝者id
            $scope.content;
            $scope.result;
            $scope.backClick = function(){
                $location.path("/user/user-list");
            }



            $scope.searchDecedent=function(){
                if ($scope.content==""||$scope.content==undefined) {
                    $scope.result=null;
                    return;
                }
                $http.post("http://localhost:8080/lifecrystal-server/"+"user/getDecedentByIdOrIdCardOrName.do?",{},{params:{
                        content:$scope.content
                    }}).success(function (data){
                        if(data.successCode == 100200){
                               $scope.result=data.result;
                               console.log($scope.result);
                        }else{
                            $scope.result=null;
                        }

                    });
            }

            $scope.clickContent=function(decedentId){
                for (var i = 0; i < $scope.result.length; i++) {
                    if ($scope.result[i].decedentId==decedentId) {
                        $scope.content=$scope.result[i].decedentName+"  "+$scope.result[i].idCard+"   "+$scope.result[i].decedentId;
                        $scope.clickDecedentId=$scope.result[i].decedentId;
                        $scope.result=null;
                        return;
                    }
                }
            }

            $scope.mouseOver=function(decedentId){
                $("#decedent-"+decedentId).css("background-color","gray");
            }

            $scope.mouseLeave=function(decedentId){
                $("#decedent-"+decedentId).css("background-color","rgb(0,0,0,0)");
            }

            //绑定逝者
            $scope.bindingDecedent=function(){

                if ($scope.clickDecedentId==""||$scope.clickDecedentId==undefined) {
                    return;
                }
                $http.post("http://localhost:8080/lifecrystal-server/"+"user/bindingDecedent.do?",{},{params:{
                        userId:$scope.userId,
                        decedentId:$scope.clickDecedentId
                    }}).success(function (data){
                        if(data.successCode == 100200){
                              alert(data.successMessage);
                               // console.log($scope.result);
                        }else{
                            alert(data.errorMessage);
                        }

                    });
            }


        }






       // 增加


       function UserAddCtrl($scope,$http,$location,$mdDialog,$timeout){


           $scope.login = function(){
            if(sessionStorage.adminId == undefined){
               $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)

        

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "36") {
                $scope.isShow = 1;
            }
        }


        $scope.user = {userName:'', mobile:'', code:'',vipType:'',sex:''};

        $scope.showAlert1 = function(txt) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(false)
                                    .title(txt)
                                    .ok('确定')
                                    )

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

        $scope.backClick = function(){
            $location.path("/user/user-list");
        }

        $scope.sendCode=function(mobile){
            console.log(mobile);
            $http.post("http://localhost:8080/lifecrystal-server/"+"user/genAuthCode.do?",{},{params:{
                        mobile:mobile
                    }}).success(function (data){
                        if(data.successCode == 112000){
                            $scope.showAlert("验证码发送成功");
                            // alert("验证码发送成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
                        }

                    });
        }
       


        //添加用户
        $scope.adduser = function(){

            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加用户')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')




                    $http.post("http://localhost:8080/lifecrystal-server/"+"user/addUser.do?",{},{params:{

                        mobile:$scope.user.mobile,
                        userName:$scope.user.userName,
                        code:$scope.user.code,
                        vipType:$scope.user.vipType,
                        sex:$scope.user.sex

                    }}).success(function (data){
                        if(data.successCode == 100200){
                            $scope.showAlert("添加用户成功");
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
                                    $location.path('/user/user-list');
                                })

                            }

                            
                            $scope.showConfirm();
                        }



/*        $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $("#myDeal").attr("disabled",true);
            $("#myManager").attr("disabled",true);
            $(".changeConfirm").css("display","none");
            $("#myManager").css("display","block");
            $(".user-manager").css("display",'none');

        }*/






/*        $scope.changeClick = function(){
            console.log("1");
            $(".cancelClick").css("display","inline");
            $("#myDeal").attr("disabled",false);
            $("#myManager").attr("disabled",false);
            $(".changeConfirm").css("display","block");
            $("#myManager").css("display","none");
            $(".user-manager").css("display",'inline');
        }*/
/*        // 确认修改
        $scope.changeConfirm = function(){


            console.log("$scope.user.myDeal:"+$scope.user.myDeal);
            console.log("$scope.user.managerId:"+$scope.user.managerId);
            console.log("$scope.userId:"+$scope.userId);

            $scope.showConfirm = function() {
                // 确定

                var confirm = $mdDialog.confirm()
                            .title('是否确定修改用户信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/fenxiao-server/"+"user/modifyUserByuserId.do",{},{params:{
                        userId:$scope.userId,
                        myDeal:$scope.user.myDeal,
                        managerId:$scope.user.managerId
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改用户信息成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
                        }
                    })
                }, function() {
                    // console.log('取消')
                    $scope.showAlert1("取消修改用户信息");
                });
            };

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

                ).then(function(){
                    $(".cancelClick").css("display","none");
                    $("#myDeal").attr("disabled",true);
                    $("#myManager").attr("disabled",true);
                    $(".changeConfirm").css("display","none");
                    $("#myManager").css("display","inline");
                    $(".user-manager").css("display",'none');
                    $scope.managerName = $(".user-manager").find("option:selected").text();
                })
            }
            $scope.showAlert1 = function(txt) {
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
            $scope.showConfirm();
        }*/

        
    }


})();
