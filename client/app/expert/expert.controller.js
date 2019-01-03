(function(){
	// 'expert strick'
    DecedentCtrl
	angular.module('app.expert',[])
  .controller('ExpertCtrl', ['$scope','$http','$mdDialog','$location','$timeout',ExpertCtrl])
  .controller('SkillCtr', ['$scope','$http','$mdDialog','$location','$timeout',SkillCtr])
  .controller('ExpertAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ExpertAddCtrl])
  .controller('SkillAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',SkillAddCtrl])
  .controller('ExpertDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout','$sce',ExpertDetailCtrl])
  .controller('SkillDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout','$sce',SkillDetailCtrl])
  .controller('ExpertchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ExpertchangeCtrl])
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
  .filter('parseExpertStatus',function(){
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
  .filter('parseExpertActivated',function(){
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
    function SkillDetailCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "49") {
                $scope.isShow = 1;
            }
        }

        // //重置密码的权限
        // $scope.isRestShow = 0;
        // //控制权限，如果没有这个权限，不显示
        // for (var i = 0; i < authoritySet.length; i++) {
        //     console.log("authoritySet:"+authoritySet)
        //     if (authoritySet[i] == "50") {
        //         console.log("密码")
        //         $scope.isRestShow = 1;
        //     }
        // }


        // //绑定逝者
        // $scope.bindingDecedent = function(){
        //     $location.path('/expert/expert-bindDecedent');
        // }

        $scope.backClick = function(){
            $location.path('/expert/skill-list');
        }
/*        $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $("#myDeal").attr("disabled",true);
            $("#myManager").attr("disabled",true);
            $(".changeConfirm").css("display","none");
            $("#myManager").css("display","block");
            $(".expert-manager").css("display",'none');

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


        $scope.expertId = $location.search().id;   //获取用户id
        // console.log("id="+$scope.expertId);
        //根据用户id获取用户详细信息
        $http.post('http://localhost:8080/blue-server/' + 'skill/getSkillById.do',{},{params:{
            skillId:$scope.expertId   //用户id
        }}).success( function (data){   
            if(data.code == 0){
                $scope.expert = data.result;
                console.log($scope.expert);
            } else {
                $scope.showAlert(data.message);
            }
        });

        // //技能列表
        // $http.post("http://localhost:8080/blue-server/"+"skill/getSkillList.do?",{},{params:{
        //                 pageNum:1,
        //                 pageSize:100
        //             }}).success(function (data){
        //                 if(data.code == 0){
        //                     $scope.skillList=data.result;
        //                     console.log($scope.skillList);
        //                 } else {
        //                     $scope.showAlert1(data.message)
        //                 }

        //             });

        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }
       

        //修改专家
        $scope.modifyExpert = function(){
                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定修改')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消修改');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"skill/modifySkill.do";// 接收上传文件的后台地址

                var form = new FormData();
                
                form.append("skillId",$scope.expert.skillId);
                form.append("content",$scope.expert.content);
                // form.append("introduction",$scope.expert.expertIntroduction);
                // form.append("sort",$scope.expert.expertSort);
                // form.append("price",$scope.expert.price);
                // form.append("status",$scope.expert.status);
                // form.append("mobile",$scope.expert.mobile);
                // form.append("photo",$scope.imageFileObj);
                // $scope.skillIds="";
                // $("input:checkbox[name='skill']:checked").each(function() {
                //         $scope.skillIds+= $(this).val() + ",";
                // });

                // form.append("skillIds",$scope.skillIds);

                     

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            var data=JSON.parse(xhr.responseText);
                            if (data.code==0) {
                                $scope.showAlert("修改成功");
                            }else{
                                $scope.showAlert(data.message);
                            }
                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.message);
                         $scope.showAlert("修改失败");
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
            $http.post('http://localhost:8080/blue-server/' + 'expert/unbindingDecedent.do',{},{params:{
            expertId:$scope.expertId,  //用户id
            decedentId:decedentId
        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert(data.successMessage);
                $("#delete-"+decedentId).remove();
            } else {
                $scope.showAlert(data.message);
            }
        });
    }, function() {

                        $scope.showAlert("取消绑定");
                    });
        }


        //重置密码
        $scope.resetPassword=function(expertId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定重置密码')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/blue-server/' + 'expert/restPassword.do',{},{params:{
            expertId:$scope.expertId  //用户id
        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert(data.successMessage);
            } else {
                $scope.showAlert(data.message);
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



  function SkillAddCtrl($scope,$http,$location,$mdDialog,$timeout){


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
            if (authoritySet[i] == "44") {
                $scope.isShow = 1;
            }
        }


        $scope.expert = {expertName:'', mobile:'', sort:'',price:'',status:'',description:""};

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
            $location.path("/expert/skill-list");
        }


        //技能列表
        // $http.post("http://localhost:8080/blue-server/"+"skill/getSkillList.do?",{},{params:{
        //                 pageNum:1,
        //                 pageSize:100
        //             }}).success(function (data){
        //                 if(data.code == 0){
        //                     $scope.skillList=data.result;
        //                     console.log($scope.skillList);
        //                 } else {
        //                     $scope.showAlert1(data.message)
        //                 }

        //             });

        $scope.sendCode=function(mobile){
            console.log(mobile);
            $http.post("http://localhost:8080/blue-server/"+"expert/genAuthCode.do?",{},{params:{
                        mobile:mobile
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("验证码发送成功");
                            // alert("验证码发送成功");
                        } else {
                            $scope.showAlert1(data.message)
                        }

                    });
        }

        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }


        //添加专家
        $scope.addExpert = function(){
                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定添加')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消添加');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"skill/addSkill.do";// 接收上传文件的后台地址

                var form = new FormData();
                form.append("content",$scope.content);
                // form.append("introduction",$scope.expert.description);
                // form.append("sort",$scope.expert.sort);
                // form.append("price",$scope.expert.price);
                // form.append("status",$scope.expert.status);
                // form.append("mobile",$scope.expert.mobile);
                // form.append("photo",$scope.imageFileObj);
                // $scope.skillIds="";
                // $("input:checkbox[name='skill']:checked").each(function() {
                //         $scope.skillIds+= $(this).val() + ",";
                // });

                // form.append("skillIds",$scope.skillIds);

                     

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            var data=JSON.parse(xhr.responseText);
                            if (data.code==0) {
                                $scope.showAlert("添加成功");
                            }else{
                                $scope.showAlert(data.message);
                            }
                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.message);
                         $scope.showAlert("添加失败");
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

       


        //添加用户
        $scope.addexpert = function(){

            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加专家')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')




                    $http.post("http://localhost:8080/blue-server/"+"expert/addExpert.do?",{},{params:{
                        mobile:$scope.expert.mobile,
                        expertName:$scope.expert.expertName,
                        code:$scope.expert.code,
                        vipType:$scope.expert.vipType,
                        sex:$scope.expert.sex

                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加用户成功");
                        } else {
                            $scope.showAlert1(data.message)
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
                                    $location.path('/expert/expert-list');
                                })

                            }

                            
                            $scope.showConfirm();
                        }




    }



  function SkillCtr($scope,$http,$mdDialog,$location,$timeout){
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
    $scope.kwExpertId;     //用户id
    $scope.kwMobile;     //手机号码
    $scope.expertName;    //用户名
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
    $scope.expertLists = [];

    $scope.isListExpert = 0;
    $scope.isEditExpert = 0;
    $scope.isDeleteExpert = 0;
    $scope.isAddExpert = 0;

    $scope.expertId="";
    $scope.realName="";
    $scope.expertName="";
    $scope.gender="";
    $scope.isDeveloper="";

    $scope.isShow = 0;

    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "42") {
            $scope.isShow = 1;
        }
    }


    //获取用户列表
    function getExpertList(pageNum, pageSize){
        $http.post('http://localhost:8080/blue-server/' + 'skill/getSkillList.do',{},{params:{
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data)  {
         if (data.code == 0) {
           $scope.expertLists=data.result;
           $scope.stores=data.result;
           $scope.expert=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchExpert(pageNum, $scope.numPerPage);
             }else {
                /*$scope.showAlert(data.message);*/
                $scope.currentPageStores = null;
                console.log("xsxs"+$scope.expertLists);

            }
        });
    }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["用户ID","用户账号","用户名称","性别","墨客币","井通","是否开发者"];
        obj.titleForKey = ["expertId","expertName","realName","gender","moacBalance","swtcBalance","isDeveloper"];
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
                       getExpertList(page, $scope.numPerPage);


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

                    getExpertList(1, $scope.numPerPage);
                };

                $scope.emptyCondition = function(){
                    $scope.kwNickName = '';
                    $scope.kwExpertId = '';
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
                    $http.post('http://localhost:8080/blue-server/' + 'skill/getSkillList.do',{},{params:{
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.code == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchExpert(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchExpert(page,$scope.numPerPage);
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
$scope.expertIdsExcel=[];

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


                      var expert = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[expert.expertId];

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


                      var expert = $scope.currentPageStores[i];



        updateSelectedByStatus(expert.expertId, $scope.isSelectedAll);

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

                var url="http://localhost:8080/blue-server/"+"expert/exportExcel.do?";

                // var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/exportExcel.do";// 接收上传文件的后台地址
                // console.log($scope.selected);
                // var temp = "";

                // var form = new FormData();

                    // console.log($scope.selected[103]);
                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        console.log(i); 
                        
                        if($scope.selected[i]==true){
                            url=url+"expertIds="+i+"&";
                        }
                        
                        // temp = i;
                        // console.log(temp);
                        // form.append("expertIds", temp);
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


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/deleteExpertBatch.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        if ($scope.selected[temp]==true) {
                            form.append("expertIds", temp);
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

       $scope.searchExpert = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.expertId = $("#expertId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/aiyixue-server/' + 'expert/getExpertList.do',{},{params:{
            expertId:$scope.kwExpertId,
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
        $scope.deleteExpert = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/"+"skill/deleteSkillById.do?",{},{params:{
                        skillId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除成功");
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
                        expertId:id,
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

  function ExpertCtrl($scope,$http,$mdDialog,$location,$timeout){
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
    $scope.kwExpertId;     //用户id
    $scope.kwMobile;     //手机号码
    $scope.expertName;    //用户名
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
    $scope.expertLists = [];

    $scope.isListExpert = 0;
    $scope.isEditExpert = 0;
    $scope.isDeleteExpert = 0;
    $scope.isAddExpert = 0;

    $scope.expertId="";
    $scope.realName="";
    $scope.expertName="";
    $scope.gender="";
    $scope.isDeveloper="";

    $scope.isShow = 0;

    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "41") {
            $scope.isShow = 1;
        }
    }


    //获取用户列表
    function getExpertList(pageNum, pageSize){
        $http.post('http://localhost:8080/blue-server/' + 'expert/getExpertListBack.do',{},{params:{
            expertName:$scope.expertName,
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data)  {
         if (data.code == 0) {
           $scope.expertLists=data.result;
           console.log("xsxs"+$scope.expertLists);
           $scope.stores=data.result;
           $scope.expert=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchExpert(pageNum, $scope.numPerPage);
             }else {
                /*$scope.showAlert(data.message);*/
                $scope.currentPageStores = null;
                console.log("xsxs"+$scope.expertLists);

            }
        });
    }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["用户ID","用户账号","用户名称","性别","墨客币","井通","是否开发者"];
        obj.titleForKey = ["expertId","expertName","realName","gender","moacBalance","swtcBalance","isDeveloper"];
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
                       getExpertList(page, $scope.numPerPage);


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

                    getExpertList(1, $scope.numPerPage);
                };

                $scope.emptyCondition = function(){
                    $scope.kwNickName = '';
                    $scope.kwExpertId = '';
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
                    $http.post('http://localhost:8080/blue-server/' + 'expert/getExpertListBack.do',{},{params:{
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.code == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchExpert(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchExpert(page,$scope.numPerPage);
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
$scope.expertIdsExcel=[];

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


                      var expert = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[expert.expertId];

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


                      var expert = $scope.currentPageStores[i];



        updateSelectedByStatus(expert.expertId, $scope.isSelectedAll);

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

                var url="http://localhost:8080/blue-server/"+"expert/exportExcel.do?";

                // var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/exportExcel.do";// 接收上传文件的后台地址
                // console.log($scope.selected);
                // var temp = "";

                // var form = new FormData();

                    // console.log($scope.selected[103]);
                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        console.log(i); 
                        
                        if($scope.selected[i]==true){
                            url=url+"expertIds="+i+"&";
                        }
                        
                        // temp = i;
                        // console.log(temp);
                        // form.append("expertIds", temp);
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


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/deleteExpertBatch.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        if ($scope.selected[temp]==true) {
                            form.append("expertIds", temp);
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

       $scope.searchExpert = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.expertId = $("#expertId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/aiyixue-server/' + 'expert/getExpertList.do',{},{params:{
            expertId:$scope.kwExpertId,
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
        $scope.deleteExpert = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"expert/deleteExpertById.do?",{},{params:{
                        expertId:id
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
                        expertId:id,
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
    function ExpertDetailCtrl($scope,$http,$location,$mdDialog,$timeout,$sce){

        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        //控制权限，如果没有这个权限，不显示
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "49") {
                $scope.isShow = 1;
            }
        }

        // //重置密码的权限
        // $scope.isRestShow = 0;
        // //控制权限，如果没有这个权限，不显示
        // for (var i = 0; i < authoritySet.length; i++) {
        //     console.log("authoritySet:"+authoritySet)
        //     if (authoritySet[i] == "50") {
        //         console.log("密码")
        //         $scope.isRestShow = 1;
        //     }
        // }


        // //绑定逝者
        // $scope.bindingDecedent = function(){
        //     $location.path('/expert/expert-bindDecedent');
        // }

        $scope.backClick = function(){
            $location.path('/expert/expert-list');
        }
/*        $scope.cancelClick = function(){
            $(".cancelClick").css("display","none");
            $("#myDeal").attr("disabled",true);
            $("#myManager").attr("disabled",true);
            $(".changeConfirm").css("display","none");
            $("#myManager").css("display","block");
            $(".expert-manager").css("display",'none');

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


        $scope.expertId = $location.search().id;   //获取用户id
        // console.log("id="+$scope.expertId);
        //根据用户id获取用户详细信息
        $http.post('http://localhost:8080/blue-server/' + 'expert/getExpertById.do',{},{params:{
            expertId:$scope.expertId   //用户id
        }}).success( function (data){   
            if(data.code == 0){
                $scope.expert = data.result;
                console.log($scope.expert);
            } else {
                $scope.showAlert(data.message);
            }
        });

        //技能列表
        $http.post("http://localhost:8080/blue-server/"+"skill/getSkillList.do?",{},{params:{
                        pageNum:1,
                        pageSize:100
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.skillList=data.result;
                            console.log($scope.skillList);
                        } else {
                            $scope.showAlert1(data.message)
                        }

                    });

        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }
       

        //修改专家
        $scope.modifyExpert = function(){
                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定修改专家')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消修改');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/modifyExpert.do";// 接收上传文件的后台地址

                var form = new FormData();
                
                form.append("expertId",$scope.expert.expertId);
                form.append("expertName",$scope.expert.expertName);
                form.append("introduction",$scope.expert.expertIntroduction);
                form.append("sort",$scope.expert.expertSort);
                form.append("price",$scope.expert.price);
                form.append("status",$scope.expert.status);
                form.append("mobile",$scope.expert.mobile);
                form.append("photo",$scope.imageFileObj);
                $scope.skillIds="";
                $("input:checkbox[name='skill']:checked").each(function() {
                        $scope.skillIds+= $(this).val() + ",";
                });

                form.append("skillIds",$scope.skillIds);

                     

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            var data=JSON.parse(xhr.responseText);
                            if (data.code==0) {
                                $scope.showAlert("修改成功");
                            }else{
                                $scope.showAlert(data.message);
                            }
                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.message);
                         $scope.showAlert("修改失败");
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
            $http.post('http://localhost:8080/blue-server/' + 'expert/unbindingDecedent.do',{},{params:{
            expertId:$scope.expertId,  //用户id
            decedentId:decedentId
        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert(data.successMessage);
                $("#delete-"+decedentId).remove();
            } else {
                $scope.showAlert(data.message);
            }
        });
    }, function() {

                        $scope.showAlert("取消绑定");
                    });
        }


        //重置密码
        $scope.resetPassword=function(expertId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定重置密码')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/blue-server/' + 'expert/restPassword.do',{},{params:{
            expertId:$scope.expertId  //用户id
        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert(data.successMessage);
            } else {
                $scope.showAlert(data.message);
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
            $location.path('/expert/expert-bindDecedent');
        }

        $scope.backClick = function(){
            alert("change");
            $location.path('/expert/expert-detail');
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


        $scope.expertId = $location.search().id;   //获取用户id
        console.log("id="+$scope.expertId);
        //根据用户id获取用户详细信息
        $http.post('http://localhost:8080/blue-server/' + 'expert/getExpertById.do',{},{params:{
            expertId:$scope.expertId   //用户id
        }}).success( function (data){   
            if(data.code == 0){
                $scope.expert = data.result;
                console.log($scope.expert.expertIcon);
                if($scope.expert.sex=='1'){
                    $scope.expert.sex='男'
                }else if($scope.expert.sex=='2'){
                    $scope.expert.sex='女'
                }
                else if($scope.expert.sex=='3'){
                    $scope.expert.sex='保密'
                }

                if ($scope.expert.vipType=="1") {
                    $scope.expert.vipType="普通会员";
                }else{
                    $scope.expert.vipType="藏晶苑会员";
                }
                
            } else {
                $scope.showAlert(data.message);
            }
        });


        //根据用户id获取其绑定的逝者信息
        $http.post('http://localhost:8080/blue-server/' + 'expert/getDetailedInformation.do',{},{params:{
            expertId:$scope.expertId   //用户id
        }}).success( function (data){   
            if(data.code == 0){
                $scope.experts = data.result;
                console.log($scope.experts);
                for (var i = 0; i < $scope.experts.length; i++) {
                    if($scope.experts[i].decedentGender=="1"){
                        $scope.experts[i].decedentGender="男";
                    }else if($scope.experts[i].decedentGender=="3"){
                        $scope.experts[i].decedentGender=="保密";
                    }
                    else{
                        $scope.experts[i].decedentGender="女";
                    }
                }
            } else {
                // $scope.showAlert(data.message);
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
            $http.post('http://localhost:8080/blue-server/' + 'expert/unbindingDecedent.do',{},{params:{
            expertId:$scope.expertId,  //用户id
            decedentId:decedentId
        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert(data.successMessage);
                $("#delete-"+decedentId).remove();
            } else {
                $scope.showAlert(data.message);
            }
        });
    }, function() {

                        $scope.showAlert("取消绑定");
                    });
        }


        //重置密码
        $scope.resetPassword=function(expertId){
                     // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定重置密码')
                                // .ariaLabel('Lucky day')
                                // .targetEvent(ev)
                                .ok('确定')
                                .cancel('取消');
                                $mdDialog.show(confirm).then(function() {
            $http.post('http://localhost:8080/blue-server/' + 'expert/restPassword.do',{},{params:{
            expertId:$scope.expertId  //用户id
        }}).success( function (data){   
            if(data.code == 0){  //解除成功
                $scope.showAlert(data.successMessage);
            } else {
                $scope.showAlert(data.message);
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
            $scope.expertId = $location.search().expertId;
            console.log($scope.expertId);

            $scope.backClick = function(){
                alert();
                $location.path("/expert/expert-list");

            }

            $http.post('http://localhost:8080/aiyixue-server/' + 'expert/getExpertByExpertId.do',{},{params:{
                expertId:$scope.expertId
            }}).success( function (data){
                if(data.errorCode == 0){
                    $scope.expert = data.result;
                    $scope.expert.deleted = $scope.expert.deleted+'';


                } else {
                    $scope.showAlert(data.message);
                    console.log($scope.expert)
            }/*if($scope.expert.gender=='1'){
                $scope.expert.gender='男'
            }else if ($scope.expert.gender=='0') {
                $scope.expert.gender='女'
            }*/

        });


            $scope.doUploadPhoto=function(element){
                $scope.fileObj = element.files[0];
            }

            $scope.changeexpert = function(){
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
                    var changeGiftUrl ="http://localhost:8080/aiyixue-server/" + "expert/modifyExpert.do?";  
                    // FormData 对象
                    var form = new FormData();
                    form.append("expertId",$scope.expertId);
                    form.append("nickName",$scope.expert.nickName);
                    form.append("password",$scope.expert.password);
                    form.append("realName",$scope.expert.realName);
                    form.append("sex",$scope.expert.sex);
                    form.append("age",$scope.expert.age);
                    form.append("deleted",$scope.expert.deleted);
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
                     $location.path('/expert/expert-list');
                 }) 
                }    
                $scope.showConfirm();
            }


        }



        // 修改
        function ExpertchangeCtrl($scope,$http,$location,$mdDialog,$timeout){
            $timeout($scope.login(),10)
            $scope.expertId = $location.search().expertId;
            $scope.backClick = function(){
                $location.path("/expert/expert-list");
            }



            var init;

    $scope.stores = []; 
    $scope.kwNickName;     //用户昵称
    $scope.kwExpertId;     //用户id
    $scope.kwMobile;     //手机号码
    $scope.expertName;    //用户名
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
    $scope.expertLists = [];

    $scope.isListExpert = 0;
    $scope.isEditExpert = 0;
    $scope.isDeleteExpert = 0;
    $scope.isAddExpert = 0;

    // $scope.expertId="";
    // $scope.realName="";
    // $scope.expertName="";
    // $scope.gender="";
    // $scope.isDeveloper="";

    $scope.isShow = 0;
    $scope.walletType="";
    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "3") {
            $scope.isShow = 1;
        }
    }


    //获取用户列表
    function getAddress(){
        $http.post('http://localhost:8080/blue-server/' + 'wallet/getAddress.do',{},{params:{
            expertId:$scope.expertId,
            walletType:$scope.walletType
        }}).success(function (data) {
         if (data.code == 0) {
                $scope.address=data.result.address;
                
             }else{
                // $scope.showAlert("该用户没有导入该钱包");
                $scope.address=null;
             }
        });
    }

    //获取用户列表
    function getExpertList(pageNum, pageSize){
        $http.post('http://localhost:8080/blue-server/' + 'wallet/getWalletDetailBack.do',{},{params:{
            expertId:$scope.expertId,
            walletType:$scope.walletType,
            pageNum:pageNum,
            pageSize:pageSize
        }}).success(function (data) {
         if (data.code == 0) {
           $scope.expertLists=data.result;
           console.log("xsxs"+$scope.expertLists);
           $scope.stores=data.result;
           $scope.expert=data.result;
           $scope.currentPageStores = data.result;
           $scope.filteredStores = data.result;
                 // $scope.currentPageStores.$apply;
                 $scope.total = data.total;
                 // $scope.searchExpert(pageNum, $scope.numPerPage);
            //调用获取钱包地址
            getAddress();
             }else {
                /*$scope.showAlert(data.message);*/
                $scope.currentPageStores = null;
                console.log("xsxs"+$scope.expertLists);

            }
        });
    }

    //导出excel
    $scope.export = function(){
        var obj = {title:"", titleForKey:"", data:""};
        obj.title = ["用户ID","用户账号","用户名称","性别","墨客币","井通","是否开发者"];
        obj.titleForKey = ["expertId","expertName","realName","gender","moacBalance","swtcBalance","isDeveloper"];
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
                       getExpertList(page, $scope.numPerPage);


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

                    getExpertList(1, $scope.numPerPage);
                };

                $scope.emptyCondition = function(){
                    $scope.kwNickName = '';
                    $scope.kwExpertId = '';
                    $scope.kwMobile = '';
                    $scope.kwSex = '';
                    $scope.KwLevel = '';
                    $scope.KwStartTime = '';
                    $scope.KwEndTime = '';
                    $scope.search();
                };


                //页面加载完毕立即调用的方法
                init = function() {
                    console.log("初始化");
                    console.log($scope.expertId)
                    $http.post('http://localhost:8080/blue-server/' + 'wallet/getWalletDetailBack.do',{},{params:{
                        expertId:$scope.expertId,
                        pageNum:1,
                        pageSize:$scope.numPerPage
                    }}).success(function (data) {
                     if (data.code == 0) {
                       $scope.stores=data.result;
                       $scope.total = data.total;
                       console.log($scope.stores);

                       // $scope.search();
                     // $scope.searchExpert(1,$scope.numPerPage);
                     $scope.currentPageStores = $scope.stores;
                     // $scope.searchExpert(page,$scope.numPerPage);
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
$scope.expertIdsExcel=[];

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


                      var expert = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[expert.expertId];

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


                      var expert = $scope.currentPageStores[i];



        updateSelectedByStatus(expert.expertId, $scope.isSelectedAll);

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

                var url="http://localhost:8080/blue-server/"+"expert/exportExcel.do?";

                // var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/exportExcel.do";// 接收上传文件的后台地址
                // console.log($scope.selected);
                // var temp = "";

                // var form = new FormData();

                    // console.log($scope.selected[103]);
                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        console.log(i); 
                        
                        if($scope.selected[i]==true){
                            url=url+"expertIds="+i+"&";
                        }
                        
                        // temp = i;
                        // console.log(temp);
                        // form.append("expertIds", temp);
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


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/deleteExpertBatch.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                     for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        console.log(temp);
                        if ($scope.selected[temp]==true) {
                            form.append("expertIds", temp);
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

       $scope.searchExpert = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.expertId = $("#expertId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/aiyixue-server/' + 'expert/getExpertList.do',{},{params:{
            expertId:$scope.kwExpertId,
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
        $scope.deleteExpert = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"expert/deleteById.do?",{},{params:{
                        expertId:id
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
                        expertId:id,
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






       // 增加


       function ExpertAddCtrl($scope,$http,$location,$mdDialog,$timeout){


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
            if (authoritySet[i] == "43") {
                $scope.isShow = 1;
            }
        }


        $scope.expert = {expertName:'', mobile:'', sort:'',price:'',status:'',description:""};

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
            $location.path("/expert/expert-list");
        }


        //技能列表
        $http.post("http://localhost:8080/blue-server/"+"skill/getSkillList.do?",{},{params:{
                        pageNum:1,
                        pageSize:100
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.skillList=data.result;
                            console.log($scope.skillList);
                        } else {
                            $scope.showAlert1(data.message)
                        }

                    });

        $scope.sendCode=function(mobile){
            console.log(mobile);
            $http.post("http://localhost:8080/blue-server/"+"expert/genAuthCode.do?",{},{params:{
                        mobile:mobile
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("验证码发送成功");
                            // alert("验证码发送成功");
                        } else {
                            $scope.showAlert1(data.message)
                        }

                    });
        }

        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }


        //添加专家
        $scope.addExpert = function(){
                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定添加专家')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消添加');

                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"expert/addExpert.do";// 接收上传文件的后台地址

                var form = new FormData();
                form.append("expertName",$scope.expert.expertName);
                form.append("introduction",$scope.expert.description);
                form.append("sort",$scope.expert.sort);
                form.append("price",$scope.expert.price);
                form.append("status",$scope.expert.status);
                form.append("mobile",$scope.expert.mobile);
                form.append("photo",$scope.imageFileObj);
                $scope.skillIds="";
                $("input:checkbox[name='skill']:checked").each(function() {
                        $scope.skillIds+= $(this).val() + ",";
                });

                form.append("skillIds",$scope.skillIds);

                     

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                            var data=JSON.parse(xhr.responseText);
                            if (data.code==0) {
                                $scope.showAlert("添加成功");
                            }else{
                                $scope.showAlert(data.message);
                            }
                        } else if(xhr.readyState == 4 && xhr.status != 200){
                         // $scope.showAlert(xhr.message);
                         $scope.showAlert("添加失败");
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

       


        //添加用户
        $scope.addexpert = function(){

            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加专家')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')




                    $http.post("http://localhost:8080/blue-server/"+"expert/addExpert.do?",{},{params:{
                        mobile:$scope.expert.mobile,
                        expertName:$scope.expert.expertName,
                        code:$scope.expert.code,
                        vipType:$scope.expert.vipType,
                        sex:$scope.expert.sex

                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加用户成功");
                        } else {
                            $scope.showAlert1(data.message)
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
                                    $location.path('/expert/expert-list');
                                })

                            }

                            
                            $scope.showConfirm();
                        }




    }


})();
