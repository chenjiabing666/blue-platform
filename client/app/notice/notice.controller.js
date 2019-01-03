(function(){
	// 'notice strick'
    noticeCtrl
	angular.module('app.notice',[])
  .controller('noticeCtrl', ['$scope','$http','$mdDialog','$location','$timeout',noticeCtrl])
  .controller('noticeAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',noticeAddCtrl])
  .controller('noticeDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout','$sce',noticeDetailCtrl])
  .controller('noticechangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',noticechangeCtrl])
  .controller('noticecommonCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',noticecommonCtrl])
  // .controller('noticeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',noticeCtrl])
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
  .filter('parsenoticeStatus',function(){
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
  .filter('parsenoticeActivated',function(){
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

     // 查看详情
    function noticecommonCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "51") {
                $scope.isShow = 1;
            }
        }


        $scope.backClick = function(){
            $location.path('/notice/notice-list');
        }


        $scope.showAlert = function(txt) {
             // dialog
            $mdDialog.show(
                $mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    
            )
        }


        $scope.moduleId = $location.search().id;   

        $http.post("http://localhost:8080/blue-server/"+"solution/getSolutionByActivated.do?",{},{params:{
                        activated:1,
                        moduleId:$scope.moduleId
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.solutions=data.result;
                               console.log($scope.solutions);
                               $scope.moduleId=$scope.solutions[0].moduleId;
                        }else{
                            console.log(data.message);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                               // $scope.moduleId=$scope.moduleList[0].moduleId;
                        }

                    });
        
        

        $scope.doUploadPhoto_q1 = function(element) {
            $scope.q1_file = element.files[0];
        }
        
        $scope.doUploadPhoto_ad1 = function(element) {
            $scope.ad1_file = element.files[0];
        }
       
        $scope.doUploadPhoto_an1 = function(element) {
            $scope.an1_file = element.files[0];
        }

        $scope.modifySolution = function(id){


                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定修改')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"solution/modifySolution.do";// 接收上传文件的后台地址
                
                
                var form = new FormData();
                
                    for (var j = $scope.solutions.length - 1; j >= 0; j--) {
                        if ($scope.solutions[j].solutionId==id) {
                                form.append("questionReasons",$scope.solutions[j].questionReason);
                                form.append("solutionId",$scope.solutions[j].solutionId);
                                form.append("advise",$scope.solutions[j].advise);
                                form.append("analysis",$scope.solutions[j].analysis);
                                form.append("questionReasonFile",$scope.q1_file);
                                form.append("adviseFile",$scope.ad1_file);
                                form.append("analysisFile",$scope.an1_file);

                                form.append("qTypes",$scope.solutions[j].questionReasonType);
                                form.append("adTypes",$scope.solutions[j].adviseType);
                                form.append("anTypes",$scope.solutions[j].analysisType);
                                form.append("activated",1);
                        }                   
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                       
                        if(xhr.readyState == 4  && xhr.status == 200){
                             var response=JSON.parse(xhr.responseText);
                             if (response.code==0) {
                                $scope.showAlert("修改成功");
                             }else{
                                $scope.showAlert(response.message);
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
      

        

        


        //重置密码
        $scope.modifyNotice=function(){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定修改模块信息')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/blue-server/' + 'module/modifyModule.do',{},{params:{
                        moduleId:$scope.module.moduleId,
                        moduleName:$scope.module.moduleName,
                        description:$scope.module.description,
                        highScoreMax:$scope.module.highScoreMax,
                        highScoreMin:$scope.module.highScoreMin,
                        mediumScoreMax:$scope.module.mediumScoreMax,
                        mediumScoreMin:$scope.module.mediumScoreMin,
                        lowScoreMax:$scope.module.lowScoreMax,
                        lowScoreMin:$scope.module.lowScoreMin,

        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert("修改成功");
            } else {
                $scope.showAlert("修改失败");
            }
        });
            }, function() {

                        $scope.showAlert("取消修改");
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


       


  function noticeCtrl($scope,$http,$mdDialog,$location,$timeout){
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
    $scope.kwnoticeId;     //逝者id
    // $scope.kwMobile;     //手机号码
    $scope.noticeName;    //逝者名
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
    $scope.noticeLists = [];

    $scope.isListnotice = 0;
    $scope.isEditnotice = 0;
    $scope.isDeletenotice = 0;
    $scope.isAddnotice = 0;

    $scope.isShow = 0;
    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "39") {
            console.log("authoritySet:"+authoritySet);
            $scope.isShow = 1;
        }
    }

    $scope.showAlert = function(txt) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                        )

                }


    //获取逝者列表
    function getnoticeList(pageNum, pageSize){
        console.log("cdcd")
        $http.post('http://localhost:8080/blue-server/' + 'module/getModuleList.do',{},{params:{
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data) {
         if (data.code == 0) {
           $scope.noticeLists=data.result;
           $scope.stores=data.result;
           $scope.notice=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchnotice(pageNum, $scope.numPerPage);
                 console.log($scope.stores);
             }else {
                /*$scope.showAlert(data.message);*/
                $scope.currentPageStores = null;

            }
        });
    }


    //公告置顶
    $scope.topNotice=function(id){
        $http.post('http://localhost:8080/blue-server/' + 'notice/topNotice.do',{},{params:{
                        noticeId:id
                    }}).success(function (data) {
                     if (data.code == 0) {
                        $scope.showAlert("置顶成功");
                        init();
                 }else{
                    $scope.showAlert("置顶失败");
                 }
             });
    }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["逝者ID","逝者手机","昵称","逝者姓名","注册日期","逝者类型"];
        obj.titleForKey = ["noticeId","mobile","nickName","noticeName","createdDate","vipType"];
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
                       getnoticeList(page, $scope.numPerPage);


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

                    getnoticeList(1, $scope.numPerPage);
                };

                $scope.emptyCondition = function(){
                    $scope.kwNickName = '';
                    $scope.kwnoticeId = '';
                    $scope.kwMobile = '';
                    $scope.kwSex = '';
                    $scope.KwLevel = '';
                    $scope.KwStartTime = '';
                    $scope.KwEndTime = '';
                    $scope.search();
                };


                //页面加载完毕立即调用的方法
                init = function() {
                    // console.log($scope.numPerPage);
                    
                    $http.post('http://localhost:8080/blue-server/' + 'module/getModuleList.do',{},{params:{
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.code == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchnotice(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchnotice(page,$scope.numPerPage);
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
$scope.noticeIdsExcel=[];

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


                      var notice = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[notice.noticeId];

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


                      var notice = $scope.currentPageStores[i];



        updateSelectedByStatus(notice.noticeId, $scope.isSelectedAll);

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

                var url="http://localhost:8080/blue-server/"+"notice/exportExcel.do?";

                // var modifyTopicUrl ="http://localhost:8080/blue-server/"+"notice/exportExcel.do";// 接收上传文件的后台地址
                // console.log($scope.selected);
                // var temp = "";

                // var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        if($scope.selected[i]==true){
                            url=url+"noticeIds="+i+"&";
                        }
                        
                        // temp = i;
                        // console.log(temp);
                        // form.append("noticeIds", temp);
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
                //          // $scope.showAlert(xhr.message);
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


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"notice/deletenoticeBatch.do";// 接收上传文件的后台地址
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

       $scope.searchnotice = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.noticeId = $("#noticeId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'notice/getnoticeList.do',{},{params:{
            noticeId:$scope.kwnoticeId,
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



        // 删除公告
        $scope.deletenotice = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该模块')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/"+"module/deleteModuleById.do?",{},{params:{
                        moduleId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除模块成功");
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
                .title('是否确定设置该逝者为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/blue-server/"+"elite/addElite.do?",{},{params:{
                        noticeId:id,
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



    // 查看详情
    function noticeDetailCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "51") {
                $scope.isShow = 1;
            }
        }

        // var E = window.wangEditor;
        // var editor = new E('#detailEditor');
        // // 或者 var editor = new E( document.getElementById('editor') )
        // // 或者 var editor = new E( document.getElementById('editor') )
        //     editor.customConfig.menus = [
        //         // 'head',  // 标题
        //         'bold',  // 粗体
        //         'fontSize',  // 字号
        //         'fontName',  // 字体
        //         'italic',  // 斜体
        //         'underline',  // 下划线
        //         'strikeThrough',  // 删除线
        //         'foreColor',  // 文字颜色
        //         'backColor',  // 背景颜色
        //         'link',  // 插入链接
        //         'list',  // 列表
        //         'justify',  // 对齐方式
        //         'quote',  // 引用
        //         'emoticon',  // 表情
        //         // 'image',  // 插入图片
        //         'table',  // 表格
        //         // 'video',  // 插入视频
        //         'code',  // 插入代码
        //         'undo',  // 撤销
        //         'redo'  // 重复
        //     ];

            //指定上传的文件名，这里必须和后端代码对应
            // editor.customConfig.uploadFileName = 'myFile'
            // editor.customConfig.uploadImgServer = "http://localhost:8080/blue-server/notice/uploadImage.do"  // 上传图片到服务器

            // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
            
            // 隐藏“网络图片”tab
        //     editor.customConfig.showLinkImg = false;
        //     editor.customConfig.zIndex =1;

        // editor.create();


        //绑定逝者
        $scope.bindingnotice = function(){
            $location.path('/notice/notice-bindnotice');
        }

        $scope.backClick = function(){
            $location.path('/notice/notice-list');
        }


        $scope.showAlert = function(txt) {
             // dialog
            $mdDialog.show(
                $mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    
            )
        }


        $scope.moduleId = $location.search().id;   //获取逝者id
        
        $http.post('http://localhost:8080/blue-server/' + 'module/getModuleById.do',{},{params:{
            moduleId:$scope.moduleId   
        }}).success( function (data){   
            if(data.code == 0){
                $scope.module = data.result;
                console.log($scope.module);
                $scope.industryList=data.result.industries;
                           
            } else {
                $scope.showAlert(data.message);
            }
        });

        $scope.doUploadPhoto_q1 = function(element) {
            $scope.q1_file = element.files[0];
        }
        
        $scope.doUploadPhoto_ad1 = function(element) {
            $scope.ad1_file = element.files[0];
        }
       
        $scope.doUploadPhoto_an1 = function(element) {
            $scope.an1_file = element.files[0];
        }

        $scope.modifySolution = function(id){


                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定修改')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"solution/modifySolution.do";// 接收上传文件的后台地址
                
                
                var form = new FormData();
                for (var i = $scope.industryList.length - 1; i >= 0; i--) {
                    for (var j = $scope.industryList[i].solutions.length - 1; j >= 0; j--) {
                        if ($scope.industryList[i].solutions[j].solutionId==id) {
                                form.append("questionReasons",$scope.industryList[i].solutions[j].questionReason);
                                form.append("solutionId",$scope.industryList[i].solutions[j].solutionId);
                                form.append("advise",$scope.industryList[i].solutions[j].advise);
                                form.append("analysis",$scope.industryList[i].solutions[j].analysis);
                                form.append("questionReasonFile",$scope.q1_file);
                                form.append("adviseFile",$scope.ad1_file);
                                form.append("analysisFile",$scope.an1_file);

                                form.append("qTypes",$scope.industryList[i].solutions[j].questionReasonType);
                                form.append("adTypes",$scope.industryList[i].solutions[j].adviseType);
                                form.append("anTypes",$scope.industryList[i].solutions[j].analysisType);
                        }                   
                    }
                }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                       
                        if(xhr.readyState == 4  && xhr.status == 200){
                             var response=JSON.parse(xhr.responseText);
                             if (response.code==0) {
                                $scope.showAlert("修改成功");
                             }else{
                                $scope.showAlert(response.message);
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
      

        

        


        //重置密码
        $scope.modifyNotice=function(){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定修改模块信息')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/blue-server/' + 'module/modifyModule.do',{},{params:{
                        moduleId:$scope.module.moduleId,
                        moduleName:$scope.module.moduleName,
                        description:$scope.module.description,
                        highScoreMax:$scope.module.highScoreMax,
                        highScoreMin:$scope.module.highScoreMin,
                        mediumScoreMax:$scope.module.mediumScoreMax,
                        mediumScoreMin:$scope.module.mediumScoreMin,
                        lowScoreMax:$scope.module.lowScoreMax,
                        lowScoreMin:$scope.module.lowScoreMin,

        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert("修改成功");
            } else {
                $scope.showAlert("修改失败");
            }
        });
            }, function() {

                        $scope.showAlert("取消修改");
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


    


        // 修改
        function noticechangeCtrl($scope,$http,$location,$mdDialog,$timeout){
            $timeout($scope.login(),10)
            $scope.userId = $location.search().noticeId;
            $scope.clicknoticeId;  //选择的会员id
            $scope.content;
            $scope.result;
            $scope.backClick = function(){
                $location.path("/notice/notice-list");
            }
            $scope.showAlert = function(txt) {

                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                            )

                    }

            $scope.moduleId = $location.search().id;   //获取逝者id

            $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });


            $scope.searchnotice=function(){
                if ($scope.content==""||$scope.content==undefined) {
                    $scope.result=null;
                    return;
                }
                $http.post("http://localhost:8080/blue-server/"+"notice/getUserListByIdOrMobileOrName.do?",{},{params:{
                        content:$scope.content
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.result=data.result;
                               console.log($scope.result);
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
                        $scope.clicknoticeId=$scope.result[i].userId;
                        $scope.result=null;
                        return;
                    }
                }
            }

            $scope.mouseOver=function(noticeId){
                $("#notice-"+noticeId).css("background-color","gray");
            }

            $scope.mouseLeave=function(noticeId){
                $("#notice-"+noticeId).css("background-color","rgb(0,0,0,0)");
            }

            //绑定逝者
            $scope.bindingnotice=function(){

                if ($scope.clicknoticeId==""||$scope.clicknoticeId==undefined) {
                    return;
                }
                $http.post("http://localhost:8080/blue-server/"+"notice/bindingUser.do?",{},{params:{
                        noticeId:$scope.userId,
                        userId:$scope.clicknoticeId
                    }}).success(function (data){
                        if(data.code == 0){
                              alert(data.successMessage);
                               // console.log($scope.result);
                        }else{
                            alert(data.message);
                        }

                    });
            }


        $scope.qflag="";
        $scope.adflag="";
        $scope.anflag="";
        $scope.doUploadPhoto_q1 = function(element) {
            $scope.q1_file = element.files[0];
            $scope.qflag=$scope.qflag+"1,";
            // console.log($scope.qflag+"-------------------");
        }
        $scope.doUploadPhoto_q2 = function(element) {
            $scope.q2_file = element.files[0];
            $scope.qflag=$scope.qflag+"2,";
        }
        $scope.doUploadPhoto_q3 = function(element) {
            $scope.q3_file = element.files[0];
            $scope.qflag=$scope.qflag+"3,";
        }
        $scope.doUploadPhoto_ad1 = function(element) {
            $scope.ad1_file = element.files[0];
            $scope.adflag=$scope.adflag+"1,";
        }
        $scope.doUploadPhoto_ad2 = function(element) {
            $scope.ad2_file = element.files[0];
            $scope.adflag=$scope.adflag+"2,";
        }
        $scope.doUploadPhoto_ad3 = function(element) {
            $scope.ad3_file = element.files[0];
            $scope.adflag=$scope.adflag+"3,";
        }
        $scope.doUploadPhoto_an1 = function(element) {
            $scope.an1_file = element.files[0];
            $scope.anflag=$scope.anflag+"1,";
        }
        $scope.doUploadPhoto_an2 = function(element) {
            $scope.an2_file = element.files[0];
            $scope.anflag=$scope.anflag+"2,";
        }
        $scope.doUploadPhoto_an3 = function(element) {
            $scope.an3_file = element.files[0];
            $scope.anflag=$scope.anflag+"3,";
        }




        $scope.addSolution = function(){


                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定添加')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"solution/addSolution.do";// 接收上传文件的后台地址
                
                if ($scope.q1==undefined||$scope.q1=="") {
                    $scope.q1=="";
                }

                if ($scope.q2==undefined||$scope.q2=="") {
                    $scope.q2=="";
                }

                if ($scope.q3==undefined||$scope.q3=="") {
                    $scope.q3=="";
                }

                if ($scope.ad1==undefined||$scope.ad1=="") {
                    console.log("ad1")
                    $scope.ad1=="";
                }

                if ($scope.ad2==undefined||$scope.ad2=="") {
                    console.log("ad2")
                    $scope.ad2=="";
                }

                if ($scope.ad3==undefined||$scope.ad3=="") {
                    console.log("ad3")
                    $scope.ad3=="";
                }

                if ($scope.an1==undefined||$scope.an1=="") {
                   $scope.an1=="";
                }

                if ($scope.an2==undefined||$scope.an2=="") {
                    $scope.an2=="";
                }

                 if ($scope.an3==undefined||$scope.an3=="") {
                    $scope.an3=="";
                }
                
                var form = new FormData();
                form.append("moduleId",$scope.moduleId);
                form.append("industryId",$scope.industryId);
                form.append("questionReasons",$scope.q1);
                form.append("questionReasons",$scope.q2);
                form.append("questionReasons",$scope.q3);
                form.append("advise",$scope.ad1);
                form.append("advise",$scope.ad2);
                form.append("advise",$scope.ad3);
                form.append("analysis",$scope.an1);
                form.append("analysis",$scope.an2);
                form.append("analysis",$scope.an3);
                form.append("types","1");
                form.append("types","2");
                form.append("types","3");
                form.append("questionReasonFiles",$scope.q1_file);
                form.append("questionReasonFiles",$scope.q2_file);
                form.append("questionReasonFiles",$scope.q3_file);
                form.append("adviseFiles",$scope.ad1_file);
                form.append("adviseFiles",$scope.ad2_file);
                form.append("adviseFiles",$scope.ad3_file);
                form.append("analysisFiles",$scope.an1_file);
                form.append("analysisFiles",$scope.an2_file);
                form.append("analysisFiles",$scope.an3_file);

                form.append("qFlag",$scope.qflag);
                 form.append("adFlag",$scope.adflag);
                  form.append("anFlag",$scope.anflag);

                  // form.append("qTypes",$scope.q1_type);
                  // form.append("qTypes",$scope.q2_type);
                  // form.append("qTypes",$scope.q3_type);

                  // form.append("adTypes",$scope.ad1_type);
                  // form.append("adTypes",$scope.ad2_type);
                  // form.append("adTypes",$scope.ad3_type);

                  // form.append("anTypes",$scope.an1_type);
                  // form.append("anTypes",$scope.an2_type);
                  // form.append("anTypes",$scope.an3_type);


                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                       
                        if(xhr.readyState == 4  && xhr.status == 200){
                             var response=JSON.parse(xhr.responseText);
                             if (response.code==0) {
                                $scope.showAlert("添加成功");
                             }else{
                                $scope.showAlert(response.message);
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




        }





        function noticeAddCtrl($scope,$http,$location,$mdDialog,$timeout){
            // console.log("趁机爱那个")
           
            // var E = window.wangEditor
            // var editor = new E('#editor')
            // // 或者 var editor = new E( document.getElementById('editor') )
            // editor.customConfig.menus = [
            //     // 'head',  // 标题
            //     'bold',  // 粗体
            //     'fontSize',  // 字号
            //     'fontName',  // 字体
            //     'italic',  // 斜体
            //     'underline',  // 下划线
            //     'strikeThrough',  // 删除线
            //     'foreColor',  // 文字颜色
            //     'backColor',  // 背景颜色
            //     'link',  // 插入链接
            //     'list',  // 列表
            //     'justify',  // 对齐方式
            //     'quote',  // 引用
            //     'emoticon',  // 表情
            //     // 'image',  // 插入图片
            //     'table',  // 表格
            //     // 'video',  // 插入视频
            //     'code',  // 插入代码
            //     'undo',  // 撤销
            //     'redo'  // 重复
            // ];

            // //指定上传的文件名，这里必须和后端代码对应
            // editor.customConfig.uploadFileName = 'myFile'
            // editor.customConfig.uploadImgServer = "http://localhost:8080/blue-server/notice/uploadImage.do"  // 上传图片到服务器

            // // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
            
            // // 隐藏“网络图片”tab
            // editor.customConfig.showLinkImg = false;
            // editor.customConfig.zIndex =1;

            // editor.create();


           $scope.login = function(){
            if(sessionStorage.adminId == undefined){
               $location.path('/page/signin')
            }
        }

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "40") {
                $scope.isShow = 1;
            }
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
            $location.path("/notice/notice-list");
        }

        $scope.showAddSolution=0;  //显示添加解决方案的按钮

        //发布公告
        $scope.addnotice=function(){
            $http.post("http://localhost:8080/blue-server/"+"module/addModule.do",{},{params:{
                        moduleName:$scope.moduleName,
                        description:$scope.description,
                        highScoreMax:$scope.highScoreMax,
                        highScoreMin:$scope.highScoreMin,
                        mediumScoreMax:$scope.mediumScoreMax,
                        mediumScoreMin:$scope.mediumScoreMin,
                        lowScoreMax:$scope.lowScoreMax,
                        lowScoreMin:$scope.lowScoreMin,
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.module=data.result;
                            $scope.showAddSolution=1;  //显示添加按钮
                           $scope.showAlert("添加成功");
                        }else{
                            $scope.showAlert("添加失败");
                        }
                    });


        };


    }









       // 增加

    //    function noticeAddCtrl($scope,$http,$location,$mdDialog,$timeout){
    //     console.log("趁机爱那个")
           
    //        $scope.login = function(){
    //         if(sessionStorage.adminId == undefined){
    //            $location.path('/page/signin')
    //         }
    //     }

    //     $scope.isShow = 0;
    //     var authoritySet = sessionStorage.authoritySet.split(',');
    //     //控制权限，如果没有这个权限，不显示
    //     for (var i = 0; i < authoritySet.length; i++) {
    //         if (authoritySet[i] == "38") {
    //             $scope.isShow = 1;
    //         }
    //     }



    //     $scope.showAlert = function(txt) {
    //         // dialog
    //         $mdDialog.show(
    //          $mdDialog.alert()
    //                // .parent(angular.element(document.querySelector('#popupContainer')))
    //                .clickOutsideToClose(false)
    //                .title(txt)
    //                // .content('You can specify some description text in here.')
    //                // .ariaLabel('Alert Dialog Demo')
    //                .ok('确定')
    //                // .targetEvent()
    //                )
    //     }

    //     $scope.backClick = function(){
    //         $location.path("/notice/notice-list");
    //     }
    // };


})();
