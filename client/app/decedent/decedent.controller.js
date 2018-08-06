(function(){
	// 'decedent strick'
    DecedentCtrl
	angular.module('app.decedent',[])
  .controller('DecedentCtrl', ['$scope','$http','$mdDialog','$location','$timeout',DecedentCtrl])
  .controller('DecedentAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DecedentAddCtrl])
  .controller('DecedentDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout','$sce',DecedentDetailCtrl])
  .controller('DecedentchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DecedentchangeCtrl])
  // .controller('DecedentCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DecedentCtrl])
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
  .filter('parseDecedentStatus',function(){
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
  .filter('parseDecedentActivated',function(){
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



  function DecedentCtrl($scope,$http,$mdDialog,$location,$timeout){
    // $scope.level=''
    
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('/page/signin')
        }
    }
    $timeout($scope.login(),10)


    var init;

    $scope.stores = []; 
    // $scope.kwNickName;     //逝者昵称
    $scope.kwDecedentId;     //逝者id
    // $scope.kwMobile;     //手机号码
    $scope.decedentName;    //逝者名
    $scope.idCard;          //身份证
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
    $scope.decedentLists = [];

    $scope.isListDecedent = 0;
    $scope.isEditDecedent = 0;
    $scope.isDeleteDecedent = 0;
    $scope.isAddDecedent = 0;

    $scope.isShow = 0;
    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "37") {
            console.log("authoritySet:"+authoritySet);
            $scope.isShow = 1;
        }
    }


    //获取逝者列表
    function getDecedentList(pageNum, pageSize){
      
        if($scope.kwDecedentId==""){
            $scope.kwDecedentId=undefined;
        }


        if($scope.decedentName==""){
            $scope.decedentName=undefined;
        }

        

        if ($scope.idCard=="") {
            $scope.idCard=undefined;
        }


        $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/getDecedentList.do',{},{params:{
            decedentId:$scope.kwDecedentId,
            // nickName:$scope.kwNickName,
            // mobile:$scope.kwMobile,
            decedentName:$scope.decedentName,
            idCard:$scope.idCard,
            // vipType:$scope.vipType,
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data) {
         if (data.successCode == 0) {
           $scope.decedentLists=data.result;
           $scope.stores=data.result;
           $scope.decedent=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchDecedent(pageNum, $scope.numPerPage);
             }else {
                /*$scope.showAlert(data.errorMessage);*/
                $scope.currentPageStores = null;

            }
        });
    }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["逝者ID","逝者手机","昵称","逝者姓名","注册日期","逝者类型"];
        obj.titleForKey = ["decedentId","mobile","nickName","decedentName","createdDate","vipType"];
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
                        downloadLink.download = "逝者列表.csv";
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    }


                    function select(page) {
                       getDecedentList(page, $scope.numPerPage);


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

                    getDecedentList(1, $scope.numPerPage);
                };

                $scope.emptyCondition = function(){
                    $scope.kwNickName = '';
                    $scope.kwDecedentId = '';
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
                    
                    $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/getDecedentList.do',{},{params:{
                        decedentId:$scope.kwDecedentId,
                        // nickName:$scope.kwNickName,
                        // mobile:$scope.kwMobile,
                        decedentName:$scope.decedentName,
                        idCard:$scope.idCard,
                        // vipType:$scope.vipType,
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.successCode == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchDecedent(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchDecedent(page,$scope.numPerPage);
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
$scope.decedentIdsExcel=[];

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


                      var decedent = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[decedent.decedentId];

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


                      var decedent = $scope.currentPageStores[i];



        updateSelectedByStatus(decedent.decedentId, $scope.isSelectedAll);

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

                var url="http://localhost:8080/lifecrystal-server/"+"decedent/exportExcel.do?";

                // var modifyTopicUrl ="http://localhost:8080/lifecrystal-server/"+"decedent/exportExcel.do";// 接收上传文件的后台地址
                // console.log($scope.selected);
                // var temp = "";

                // var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        if($scope.selected[i]==true){
                            url=url+"decedentIds="+i+"&";
                        }
                        
                        // temp = i;
                        // console.log(temp);
                        // form.append("decedentIds", temp);
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


//批量删除
$scope.deleteList = function(){


                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定删除逝者')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定删除')
                            .cancel('取消删除');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/lifecrystal-server/"+"decedent/deleteDecedentBatch.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        if ($scope.selected[temp]==true) {
                            form.append("ids", temp);
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




       // 搜索

       $scope.searchDecedent = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.decedentId = $("#decedentId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/getDecedentList.do',{},{params:{
            decedentId:$scope.kwDecedentId,
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



        // 删除逝者
        $scope.deleteDecedent = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条逝者员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/lifecrystal-server/"+"decedent/deleteDecedent.do?",{},{params:{
                        decedentId:id
                    }}).success(function (data){
                        if(data.successCode == 0){
                            $scope.showAlert("删除逝者成功");
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
                .title('是否确定设置该逝者为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/lifecrystal-server/"+"elite/addElite.do?",{},{params:{
                        decedentId:id,
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
    function DecedentDetailCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "51") {
                $scope.isShow = 1;
            }
        }

        // //重置密码的权限
        // $scope.isRestShow = 0;
        // var authoritySet = sessionStorage.authoritySet.split(',');
        // //控制权限，如果没有这个权限，不显示
        // for (var i = 0; i < authoritySet.length; i++) {
        //     if (authoritySet[i] == "50") {
        //         $scope.isRestShow = 1;
        //     }
        // }


        //绑定逝者
        $scope.bindingDecedent = function(){
            $location.path('/decedent/decedent-bindDecedent');
        }

        $scope.backClick = function(){
            $location.path('/decedent/decedent-list');
        }
/*        $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $("#myDeal").attr("disabled",true);
            $("#myManager").attr("disabled",true);
            $(".changeConfirm").css("display","none");
            $("#myManager").css("display","block");
            $(".decedent-manager").css("display",'none');

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


        $scope.decedentId = $location.search().id;   //获取逝者id
        
        //根据逝者id获取逝者详细信息
        $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/getDecedentById.do',{},{params:{
            decedentId:$scope.decedentId   //逝者id
        }}).success( function (data){   
            if(data.successCode == 100200){
                $scope.decedent = data.result;
        
                if($scope.decedent.decedentGender=='1'){
                    $scope.decedent.decedentGender='男'
                }else if($scope.decedent.decedentGender=='2'){
                    $scope.decedent.decedentGender='女'
                }
                else if($scope.decedent.decedentGender=='3'){
                    $scope.decedent.decedentGender='保密'
                }

                
                
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });


        //根据逝者id获取其绑定的逝者信息
        $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/getDetailedInformation.do',{},{params:{
            decedentId:$scope.decedentId   //逝者id
        }}).success( function (data){   
            if(data.successCode == 100200){
                $scope.decedents = data.result;
                console.log($scope.decedents);
                for (var i = 0; i < $scope.decedents.length; i++) {
                    if($scope.decedents[i].sex=="1"){
                        $scope.decedents[i].sex="男";
                    }else if($scope.decedents[i].sex=="3"){
                        $scope.decedents[i].sex=="保密";
                    }
                    else if($scope.decedents[i].sex=="2"){
                        $scope.decedents[i].sex="女";
                    }

                    if($scope.decedents[i].vipType=="1"){
                        $scope.decedents[i].vipType="普通会员";
                    }else if ($scope.decedents[i].vipType=="2"){
                        $scope.decedents[i].vipType="藏晶苑会员";
                    }
                }
            } else {
                // $scope.showAlert(data.errorMessage);
            }
        });


        //解除绑定的函数
        $scope.unbindingDecedent=function(userId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定解除绑定信息')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/unbindingUser.do',{},{params:{
            decedentId:$scope.decedentId,  //逝者id
            userId :userId
        }}).success( function (data){   
            if(data.successCode == 100200){  //解除成功
                $scope.showAlert(data.successMessage);
                $("#delete-"+userId).remove();
            } else {
                $scope.showAlert(data.errorMessage);
            }
        });
    }, function() {

                        $scope.showAlert("取消绑定");
                    });
        }


        //重置密码
        $scope.resetPassword=function(decedentId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定重置密码')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/restPassword.do',{},{params:{
            decedentId:$scope.decedentId  //逝者id
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


    
            // 绑定逝者信息
        // function DecedentCtrl($scope,$http,$location,$mdDialog,$timeout){
        //     $timeout($scope.login(),10)
        //     $scope.decedentId = $location.search().decedentId;
        //     console.log($scope.decedentId);

        //     $scope.backClick = function(){
        //         $location.path("/decedent/decedent-list");
        //     }

        //     $http.post('http://localhost:8080/lifecrystal-server/' + 'decedent/getDecedentByDecedentId.do',{},{params:{
        //         decedentId:$scope.decedentId
        //     }}).success( function (data){
        //         if(data.errorCode == 0){
        //             $scope.decedent = data.result;
        //             $scope.decedent.deleted = $scope.decedent.deleted+'';


        //         } else {
        //             $scope.showAlert(data.errorMessage);
        //             console.log($scope.decedent)
        //     }/*if($scope.decedent.gender=='1'){
        //         $scope.decedent.gender='男'
        //     }else if ($scope.decedent.gender=='0') {
        //         $scope.decedent.gender='女'
        //     }*/

        // });


        //     $scope.doUploadPhoto=function(element){
        //         $scope.fileObj = element.files[0];
        //     }

        //     $scope.changedecedent = function(){
        //         $scope.showConfirm = function() {
        //                     // 确定
        //                     var confirm = $mdDialog.confirm()
        //                     .title('是否确定修改逝者信息')
        //                     // .ariaLabel('Lucky day')
        //                     // .targetEvent(ev)
        //                     .ok('确定修改')
        //                     .cancel('取消修改');
        //                     $mdDialog.show(confirm).then(function() {
        //             // console.log('确定')
        //             var changeGiftUrl ="http://localhost:8080/lifecrystal-server/" + "decedent/modifyDecedent.do?";  
        //             // FormData 对象
        //             var form = new FormData();
        //             form.append("decedentId",$scope.decedentId);
        //             form.append("nickName",$scope.decedent.nickName);
        //             form.append("password",$scope.decedent.password);
        //             form.append("realName",$scope.decedent.realName);
        //             form.append("sex",$scope.decedent.sex);
        //             form.append("age",$scope.decedent.age);
        //             form.append("deleted",$scope.decedent.deleted);
        //             form.append("file", $scope.fileObj);

        //             var xhr = new XMLHttpRequest();
        //             var response;
        //             xhr.open("post", changeGiftUrl, true);

        //             xhr.send(form);

        //             xhr.onreadystatechange = doResult;

        //             function doResult() {

        //                 if (xhr.readyState == 4) {//4代表执行完成


        //                     if (xhr.status == 200) {//200代表执行成功
        //                    //将xmlHttpReg.responseText的值赋给ID为resText的元素
        //                    $scope.showAlert("修改逝者信息成功");                      

        //                }
        //            }

        //        }

        //    }, function() {
        //             // //console.log('取消')
        //             $scope.showAlert("取消修改");
        //         });
        //                 };
        //                 $scope.showAlert = function(txt) {
        //          // dialog
        //          $mdDialog.show(
        //             $mdDialog.alert()

        //             .clickOutsideToClose(false)
        //             .title(txt)
        //             .ok('确定')
        //             ).then(function() {
        //              $location.path('/decedent/decedent-list');
        //          }) 
        //         }    
        //         $scope.showConfirm();
        //     }


        // }



        // 修改
        function DecedentchangeCtrl($scope,$http,$location,$mdDialog,$timeout){
            $timeout($scope.login(),10)
            $scope.userId = $location.search().decedentId;
            $scope.clickDecedentId;  //选择的会员id
            $scope.content;
            $scope.result;
            $scope.backClick = function(){
                $location.path("/decedent/decedent-list");
            }



            $scope.searchDecedent=function(){
                if ($scope.content==""||$scope.content==undefined) {
                    $scope.result=null;
                    return;
                }
                $http.post("http://localhost:8080/lifecrystal-server/"+"decedent/getUserListByIdOrMobileOrName.do?",{},{params:{
                        content:$scope.content
                    }}).success(function (data){
                        if(data.successCode == 100200){
                               $scope.result=data.result;
                               // console.log($scope.result);
                        }else{
                            $scope.result=null;
                        }

                    });
            }

            $scope.clickContent=function(userId){
                console.log(userId)
                for (var i = 0; i < $scope.result.length; i++) {
                    if ($scope.result[i].userId==userId) {
                        $scope.content=$scope.result[i].userName+"  "+$scope.result[i].mobile+"   "+$scope.result[i].userId;
                        $scope.clickDecedentId=$scope.result[i].userId;
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
                $http.post("http://localhost:8080/lifecrystal-server/"+"decedent/bindingUser.do?",{},{params:{
                        decedentId:$scope.userId,
                        userId:$scope.clickDecedentId
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


       function DecedentAddCtrl($scope,$http,$location,$mdDialog,$timeout){


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
            if (authoritySet[i] == "38") {
                $scope.isShow = 1;
            }
        }


        $scope.decedent = {decedentName:'', idCard:'', decedentGender:'',birthDay:'',deathDate:''};

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
            $location.path("/decedent/decedent-list");
        }

        $scope.sendCode=function(mobile){
            console.log(mobile);
            $http.post("http://localhost:8080/lifecrystal-server/"+"decedent/genAuthCode.do?",{},{params:{
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
       


        //添加逝者
        $scope.adddecedent = function(){
            console.log($scope.decedent.decedentGender);
            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加逝者')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')




                    $http.post("http://localhost:8080/lifecrystal-server/"+"decedent/addDecedent.do?",{},{params:{

                        decedentName:$scope.decedent.decedentName,
                        idCard:$scope.decedent.idCard,
                        gender:$scope.decedent.decedentGender,
                        birthDay:$scope.decedent.birthDay,
                        deathDate:$scope.decedent.deathDate

                    }}).success(function (data){
                        if(data.successCode == 100200){
                            $scope.showAlert("添加逝者成功");
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
                                    $location.path('/decedent/decedent-list');
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
            $(".decedent-manager").css("display",'none');

        }*/






/*        $scope.changeClick = function(){
            console.log("1");
            $(".cancelClick").css("display","inline");
            $("#myDeal").attr("disabled",false);
            $("#myManager").attr("disabled",false);
            $(".changeConfirm").css("display","block");
            $("#myManager").css("display","none");
            $(".decedent-manager").css("display",'inline');
        }*/
/*        // 确认修改
        $scope.changeConfirm = function(){


            console.log("$scope.decedent.myDeal:"+$scope.decedent.myDeal);
            console.log("$scope.decedent.managerId:"+$scope.decedent.managerId);
            console.log("$scope.decedentId:"+$scope.decedentId);

            $scope.showConfirm = function() {
                // 确定

                var confirm = $mdDialog.confirm()
                            .title('是否确定修改逝者信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/fenxiao-server/"+"decedent/modifyDecedentBydecedentId.do",{},{params:{
                        decedentId:$scope.decedentId,
                        myDeal:$scope.decedent.myDeal,
                        managerId:$scope.decedent.managerId
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改逝者信息成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
                        }
                    })
                }, function() {
                    // console.log('取消')
                    $scope.showAlert1("取消修改逝者信息");
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
                    $(".decedent-manager").css("display",'none');
                    $scope.managerName = $(".decedent-manager").find("option:selected").text();
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
