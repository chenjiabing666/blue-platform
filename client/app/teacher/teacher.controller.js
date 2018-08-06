(function(){
	// 'teacher strick'

	angular.module('app.teacher')
  .controller('TeacherCtrl', ['$scope','$http','$mdDialog','$location','$timeout',TeacherCtrl])
  .controller('AddTeacherCtrl', ['$scope','$http','$location','$mdDialog','$timeout',AddTeacherCtrl])
  .controller('ChangeTeacherCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeTeacherCtrl])

  function TeacherCtrl($scope,$http,$mdDialog,$location,$timeout){
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('/page/signin')
        }
    }
    $timeout($scope.login(),10)


    var init;

    $scope.kwUserName = '';
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
    $scope.teacherList = [];
    $scope.allTeacherList = [];
    $scope.isShow = 0;
    
    var authoritySet = sessionStorage.authoritySet.split(',');
    for (var i = 0; i < authoritySet.length; i++) {
        if (authoritySet[i] == "9") {
            $scope.isShow = 1;
        }
    }

    function getTeacherList(pageNum, pageSize){
     $http.post('http://localhost:8080/aiyixue-server/' + 'teacher/getTeacherList.do',{},{params:{
        userName:$scope.kwUserName,
        pageNum:pageNum,
        pageSize:pageSize
    }}).success(function (data) {
     if (data.errorCode == 0) {
       $scope.teacherList=data.result;
       $scope.stores=data.result;
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

    console.log('$scope.numPerPage=='+$scope.numPerPage);

    if($scope.isSearch){
        $scope.searchTeacher(page,$scope.numPerPage);
    } else {
        getTeacherList(page, $scope.numPerPage);
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

    $http.post('http://localhost:8080/aiyixue-server/' + 'teacher/getTeacherList.do',{},{params:{
        teacherName:$scope.kwTeacherName,
        pageNum:1,
        pageSize:$scope.numPerPage
    }}).success(function (data) {
     if (data.errorCode == 0) {
       $scope.stores=data.result;
       $scope.total = data.total;
       console.log($scope.stores);

       $scope.search();

       $scope.currentPageStores = $scope.stores;

   };
});

};
         $scope.selected = {};//所有选中的元素
            $scope.isSelectedAll = false;//是否全被选中
            //获取标签选中状态
            $scope.isSelected = function (id) {

                if($scope.selected[id] == true){
                    return true;
                }else{
                    return false;

                }
                            
              };

            //返回 是否全选 
              var judgeSelectedAll = function () {
                var isSelectedAll = true;
                  for (var i = 0; i < $scope.currentPageStores.length; i++) {
                                  var teacher = $scope.currentPageStores[i];
                    isSelectedAll &= $scope.selected[teacher.teacherId];
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
                    var teacher = $scope.currentPageStores[i];
                    updateSelectedByStatus(teacher.teacherId, $scope.isSelectedAll);
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
            $scope.deleteList = function(){
                         var temp = ""; 
							truth = false;
                         var form = new FormData();
                            //遍历
                             for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性 
                                temp = i; 
                                if($scope.selected[i] == true){
                                    form.append("adminId", temp);
                                    truth = true;
                                }
                                
                            }
                        if(truth == false){
                            alert('请先选择教师！');
                        }else{

                          // 确定
                          var confirm = $mdDialog.confirm()
                          .title('是否确定删除教师')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定删除')
                            .cancel('取消删除');
    
                            $mdDialog.show(confirm).then(function() {
                                var modifyTopicUrl ="http://localhost:8080/aiyixue-server/"+"teacher/deleteTeacher.do";// 接收上传文件的后台地址
                               

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
                        }



        // 搜索教师
        $scope.searchTeacher = function(num,size){
            $scope.teacherName = $("#teacherName").val();
            $scope.nickName = $("#nickName").val();
            $scope.realName = $("#realName").val();
            console.log($scope.teacherName)
            console.log($scope.nickName)
            console.log($scope.realName)
            $scope.isSearch = true;
            
            $http.post('http://localhost:8080/aiyixue-server/' + 'teacher/getTeacherList.do',{},{params:{
                teacherName:$scope.teacherName,
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


            var modifyTopicUrl ="http://localhost:8080/aiyixue-server/"+"batch/deleteTeacherBatch.do";// 接收上传文件的后台地址
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


        // 删除教师
        $scope.deleteTeacher = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条教师信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/aiyixue-server/"+"teacher/deleteTeacher.do?",{},{params:{
                        teacherId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除教师成功");
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




//**********录入教师************************

function AddTeacherCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.backClick = function(){
        $location.path("/teacher/teacher-list");
    }

    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.teacher = {};
    $scope.doUploadPhoto=function(element){

        $scope.fileObj = element.files[0];
    }

    $scope.doUploadMultPhoto=function(element){

        $scope.carouselFileObj = element.files;
            //console.log("$scope.fileObj");
    }

        $scope.addTeacher = function(){

            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加新的教师')
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addTeacherUrl ="http://localhost:8080/aiyixue-server/" + "teacher/addTeacher.do?";  
                    // FormData 对象
                    var form = new FormData();
                    form.append("teacherName", $scope.teacher.teacherName);                 
                    form.append("authorName", $scope.teacher.authorName);
                    form.append("teacherType", $scope.teacher.teacherType);
                    form.append("imageUrl", $scope.fileObj);                 
                    form.append("homeRecommand", $scope.teacher.homeRecommand);
                    form.append("gender", $scope.teacher.gender);                 
                    form.append("isPublished", $scope.teacher.isPublished);
                    form.append("isFinished", $scope.teacher.isFinished);                 
                    form.append("isFree", $scope.teacher.isFree);
                    form.append("labels", $scope.teacher.labels);                 
                    form.append("wordNumber", $scope.teacher.wordNumber);
                    form.append("publishId", $scope.teacher.publishId);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addTeacherUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成                             
                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           $scope.showAlert("录入教师成功");                      

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
                       $location.path('/teacher/teacher-list');
                   }) 
                }    
                $scope.showConfirm();
            }
            $scope.backClick = function() {
                $location.path("/teacher/teacher-list");
            }

        }

//**************************************************
//**********修改教师****************

function ChangeTeacherCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.teacherId = $location.search().id;
    $http.post("http://localhost:8080/aiyixue-server/"+"teacher/getTeacherById.do?",{},{params:{
        teacherId:$scope.teacherId
    }}).success(function (data){
        if(data.errorCode == 0){
            $scope.teacher = data.result;
            console.log($scope.teacher);
            console.log("  " + $scope.teacher);
        } else {
            $scope.showAlert1(data.errorMessage)
        }                        
    })


    $scope.teacher = {};

    $scope.doUploadPhoto=function(element){

        $scope.fileObj = element.files[0];
    }

    $scope.changeTeacher = function(){
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改教师信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeTeacherUrl ="http://localhost:8080/aiyixue-server/" + "teacher/modifyTeacher.do?";  
                    // FormData 对象
                    var form = new FormData();
                    form.append("teacherId",$scope.teacher.teacherId);
                    form.append("userName",$scope.teacher.userName);
                    form.append("password", $scope.teacher.password);
                    form.append("gender", $scope.teacher.gender);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeTeacherUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成


                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           $scope.showAlert("修改教师信息成功");                      

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
                       $location.path('/teacher/teacher-list');
                   }) 
                }    
                $scope.showConfirm();
            }
            $scope.backClick = function(){
                $location.path("/teacher/teacher-list");
            }

        }

    })();