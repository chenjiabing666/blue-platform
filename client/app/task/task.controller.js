(function(){
	// 'task strick'

	angular.module('app.task',[])
    .controller('taskCtrl', ['$scope','$http','$mdDialog','$location','$timeout',taskCtrl])
    .controller('CustomTaskCtrl', ['$scope','$http','$mdDialog','$location','$timeout',CustomTaskCtrl])
    .controller('taskDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',taskDetailCtrl])
    .controller('taskchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',taskchangeCtrl])
    .controller('taskAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',taskAddCtrl])
    .controller('TaskDealCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskDealCtrl])
    .filter("paseTaskStatus",function(){
        return function(input){
            if (input == 1) {
                return '未支付';
            }else if(input == 2){
                return '已支付';
            }else if(input == 2){
                return '已支付';
            }else if(input == 3){
                return '已抢满';
            }else if(input == 4){
                return '已完成';
            }else if(input == 5){
                return '已取消';
            }
        }
    })

    function taskCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwtTaskTitle = '';
        $scope.kwtMobile = '';
        $scope.kwStatus1 = '';
        $scope.kwStatus2 = '';
        $scope.KwStartTime = '';
        $scope.KwEndTime = '';
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
        $scope.taskLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "49") {
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


        function gettaskList(pageNum, pageSize){
            $http.post('http://localhost:8080/blue-server/' + 'order/getOrderListBack.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                mobile:$scope.mobile,
                orderNum:$scope.orderNum,
                status:$scope.status,
                userType:$scope.userType,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.taskLists=data.result;
                    $scope.stores=data.result;
                    $scope.task=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.total = data.total;
                }else {
                    $scope.currentPageStores = null;
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
            obj.titleForKey = ["taskId","taskType","nickName","mobile","password",];
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

            var uri = 'data:text/txt;charset=utf-8,' + encodeURIComponent(str.join(""));
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "邀请人列表.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        function select(page) {
            gettaskList(page, $scope.numPerPage);
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


        $scope.emptyCondition = function(){
            $scope.kwtTaskTitle = '';
            $scope.kwtMobile = '';
            $scope.kwStatus1 = '';
            $scope.kwStatus2 = '';
            $scope.KwStartTime = '';
            $scope.KwEndTime = '';
            $scope.search();
        };

       //获取所有的订单列表或者根据条件获取订单列表
        init = function() {
            


            // console.log($scope.numPerPage);
            console.log($scope.status);
            $http.post('http://localhost:8080/blue-server/' + 'order/getOrderListBack.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
                
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.filteredStores = data.result;
                    // $scope.search();
                    // $scope.searchtask(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchtask(page,$scope.numPerPage);
                }
            });
        };

        $scope.selected = {};

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


                      var task = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[task.taskId];

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


                      var task = $scope.currentPageStores[i];



        updateSelectedByStatus(task.taskId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskBatch.do";// 接收上传文件的后台地址
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


        //生效或者失效
        $scope.UpOrUnderTask=function(id,status){
                $http.post('http://localhost:8080/blue-server/' + 'task/UpOrUnderTask.do',{},{params:{
            taskId:id,
            status:status,
                
                }}).success(function (data){
                    if(data.code == 0){
                        for (var i = $scope.currentPageStores.length - 1; i >= 0; i--) {
                            if ($scope.currentPageStores[i].taskId==id) {
                                $scope.currentPageStores[i].status=status;
                            }
                        }
                       $scope.showAlert("操作成功");
                    }else{
                        $scope.showAlert(data.message);
                    }
                })
        }




       // 搜索

       $scope.searchtask = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskId = $("#taskId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'task/gettaskList.do',{},{params:{
            taskId:$scope.kwtaskId,
            nickName:$scope.kwNickName,
                    task:$scope.kwtask,
                    taskId:$scope.kwtaskId,
                    mobile:$scope.mobile,
                    pageNum:pageNum,
                    pageSize:pageSize
                }}).success(function (data){
                    if(data.code == 0){
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



        // 删除订单列表
        $scope.deleteTask = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条订单列表信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/"+"task/deleteTask.do?",{},{params:{
                        taskId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除订单成功");
                            $(".delete-"+id).css("display","none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.message);
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
                .title('是否确定设置该邀请人为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/blue-server/"+"elite/addElite.do?",{},{params:{
                        taskId:id,
                    }}).success(function(data){
                        if(data.code == 0){
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
        init();



    }


function CustomTaskCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwtTaskTitle = '';
        $scope.kwtMobile = '';
        $scope.kwStatus1 = '';
        $scope.kwStatus2 = '';
        $scope.KwStartTime = '';
        $scope.KwEndTime = '';
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
        $scope.taskLists = [];
        $scope.kwExamine = 3;

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "26") {
                $scope.isShow = 1;
            }
        }


        function gettaskList(pageNum, pageSize){
                $scope.kwtTaskTitle = $("#taskTitle").val();
            $http.post('http://localhost:8080/blue-server/' + 'task/getTaskListPlatform.do',{},{params:{
                mobile:$scope.kwtMobile,
                status:$scope.kwStatus1,
                status2:$scope.kwStatus2,
                startTime:$scope.KwStartTime,
                endTime:$scope.KwEndTime,
                pageNum:pageNum,
                pageSize:pageSize,
                taskTitle:$scope.kwtTaskTitle,
                interfaceType:1,
                platformType:1,
                taskTypeId:12,
                activated:$scope.kwExamine
            }}).success(function (data) {
                if (data.code == 0) {
                    //console.log("data.result");
                    //console.log(data.result[1].duration);
                    $scope.taskLists=data.result;
                    $scope.stores=data.result;
                    $scope.task=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                }else {
                    $scope.currentPageStores = null;
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
            obj.titleForKey = ["taskId","taskType","nickName","mobile","password",];
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

            var uri = 'data:text/txt;charset=utf-8,' + encodeURIComponent(str.join(""));
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "邀请人列表.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        function select(page) {
            gettaskList(page, $scope.numPerPage);
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


        $scope.emptyCondition = function(){
            $scope.kwtTaskTitle = '';
            $scope.kwtMobile = '';
            $scope.kwStatus1 = '';
            $scope.kwStatus2 = '';
            $scope.KwStartTime = '';
            $scope.KwEndTime = '';
            $scope.search();
        };

       //获取所有的订单列表或者根据条件获取订单列表
        init = function() {
            console.log($scope.numPerPage);
            $http.post('http://localhost:8080/blue-server/' + 'task/getTaskListPlatform.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
                 platformType:1,
                 taskTypeId:12,
                 activated:$scope.kwExamine
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchtask(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchtask(page,$scope.numPerPage);
                }
            });
        };

        $scope.selected = {};

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


                      var task = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[task.taskId];

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


                      var task = $scope.currentPageStores[i];



        updateSelectedByStatus(task.taskId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskBatch.do";// 接收上传文件的后台地址
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

       $scope.searchtask = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskId = $("#taskId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'task/gettaskList.do',{},{params:{
            taskId:$scope.kwtaskId,
            nickName:$scope.kwNickName,
                    task:$scope.kwtask,
                    taskId:$scope.kwtaskId,
                    mobile:$scope.mobile,
                    pageNum:pageNum,
                    pageSize:pageSize
                }}).success(function (data){
                    if(data.code == 0){
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



        // 删除订单列表
        $scope.deleteTask = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条订单列表信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                            $location.path("/task/custom-task-list");
                    // console.log('确定')
                    // $http.post("http://localhost:8080/blue-server/"+"task/deleteTask.do?",{},{params:{
                    //     taskId:id
                    // }}).success(function (data){
                    //     if(data.code == 0){
                    //         $scope.showAlert("删除订单成功");
                    //         $(".delete-"+id).css("display","none");
                    //         $scope.total--;
                    //     } else {
                    //         $scope.showAlert(data.message);
                    //     }if($scope.total<$scope.numPerPage){
                    //         $scope.filteredStores.length=$scope.total;
                    //     }

                    // })
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
                                .then(function(){
                                    $location.path("/task/custom-task-list");
                                })
                                
                                )

                        }
                        $scope.showConfirm();
                    }


        //审核
       $scope.reviewTask = function(id,status){
            $scope.showConfirm = function() {
                //弹窗
                var confirm;

                if(status == 1){
                    confirm = $mdDialog.confirm()
                        .title('是否通过')
                        .ok('确定')
                        .cancel('取消');
                }else if(status == 2){
                     confirm = $mdDialog.confirm()
                        .title('是否拒绝')
                        .ok('确定')
                        .cancel('取消');
                }

                $mdDialog.show(confirm).then(function() {

                    $http({
                       method:'post',
                       url:'http://localhost:8080/blue-server/' + 'task/reviewTask.do',
                       data: $.param({
                            taskId:id,
                            activated:status,
                            adminId:sessionStorage.adminId
                       }),
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (data){
                        if(data){
                           $scope.showAlert("应用成功");
                           $http.post('http://localhost:8080/blue-server/' + 'task/getTaskListPlatform.do',{},{params:{
                                pageNum:1,
                                pageSize:$scope.numPerPage,
                                 platformType:1,
                                 taskTypeId:12,
                                 activated:$scope.kwExamine
                            }}).success(function (data) {
                                if (data.code == 0) {
                                    $scope.stores=data.result;
                                    $scope.total = data.total;
                                    console.log($scope.stores);
                                    $scope.search();
                                    // $scope.searchtask(1,$scope.numPerPage);
                                    $scope.currentPageStores = $scope.stores;
                                    // $scope.searchtask(page,$scope.numPerPage);
                                }
                            });
                           // init();
                        } else {
                            $scope.showAlert(message);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                ) 
            };

            $scope.showConfirm();
        };
        init();



    }




    // 查看详情
    function taskDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/task/task-list');
        }

        $scope.taskId = $location.search().id;
        $scope.modapp=0;

        //任务类型
        $http.post("http://localhost:8080/blue-server/"+"task/getTaskTypeList.do?",{},{params:{
                       
                    }}).success(function (data){
                        if(data.code == 0){
                           // console.log(data.result);
                           $scope.types=data.result;
                           console.log($scope.types)
                        } 
                    });


        //获取任务详情
        $http.post('http://localhost:8080/blue-server/' + 'task/getTask.do',{},{params:{
            taskId:$scope.taskId
        }}).success( function (data){
            if(data.code == 0){
                $scope.task = data.result;
                console.log($scope.task);
            }
        });


        //根据应用名称查找
        $scope.searchApp=function(){
             $scope.searchShow=1;
            if ($scope.appName==undefined) {
                $scope.appName="";
            }

            $http.post("http://localhost:8080/blue-server/"+"app/searchByAppName.do?",{},{params:{
                        appName:$scope.appName
                    }}).success(function (data){
                        if(data.code == 0){
                            // $scope.showAlert("添加邀请人成功");
                            // console.log(data.result);
                            $scope.appInfo=data.result;
                        }else{
                            $scope.appInfo=null;
                        }
                    })



        }


         $scope.clickContent=function(appId){
            console.log(appId)
                for (var i = 0; i < $scope.appInfo.length; i++) {
                    if ($scope.appInfo[i].appId==appId) {
                        // console.log(appId)
                        $scope.appName=$scope.appInfo[i].name;
                        $scope.task.appId=$scope.appInfo[i].appId;
                        $scope.appInfo=null;
                        $scope.searchShow=0;
                        return;
                    }
                }
            }

            $scope.mouseOver=function(appId){
                $("#app-"+appId).css("background-color","gray");
            }

            $scope.mouseLeave=function(appId){
                $("#app-"+appId).css("background-color","rgb(0,0,0,0)");
            }

            
            $scope.mod=function(){
                $scope.modapp=1;  
            }


             $scope.modtask = function(){

                if ($scope.task.link==undefined) {
                    $scope.task.link="";
                }

                //获取开始时间和结束时间
                $scope.task.startDate=$("#startDate").val();
                $scope.task.endDate=$("#endDate").val();

                $scope.showConfirm = function() {
                    // 确定
                    var confirm = $mdDialog.confirm()
                    .title('是否确定修改')
                    .ok('确定修改')
                    .cancel('取消修改');
                    $mdDialog.show(confirm).then(function() {

                        $http.post("http://localhost:8080/blue-server/"+"task/modifyTask.do?",{},{params:{
                            taskId:$scope.taskId,
                            taskName:$scope.task.taskName,
                            introduction:$scope.task.introduction,
                            // typeId:$scope.task.taskTypeId,
                            appId:$scope.task.appId,
                            link:$scope.task.link,
                            money:$scope.task.rewardMoney,
                            num:$scope.task.allowNumber,
                            poupLeve:$scope.task.poupLeve,
                            startDate:$scope.task.startDate,
                            endDate:$scope.task.endDate,
                            status:$scope.task.status,
                            activated:$scope.task.activated
                            // publishId:sessionStorage.adminId
                        }}).success(function (data){
                            if(data.code == 0){
                                $scope.showAlert("修改成功");
                            } else {
                                $scope.showAlert(data.message)
                            }
                        })
                    },  function() {
                            $scope.showAlert("取消修改");
                        });
                };

                $scope.showAlert = function(txt) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                    );
                }

                $scope.showAlert1 = function(txt) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                     )
                }

                $scope.showConfirm();
        }




        
    }


    // 修改
    function taskchangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskId = $location.search().taskId
        $scope.status = $location.search().status;
        $scope.backClick = function(){
            $location.path("/task/task-list");
        }

        $http.post('http://localhost:8080/blue-server/' + 'task/getTaskById.do',{},{params:{
            taskId:$scope.taskId,
        }}).success( function (data){
                if(data.code == 0){
                    $scope.task = data.result;
                    console.log($scope.task);
                } else {
                    $scope.showAlert(data.message);
                    console.log($scope.task)
                }
            });


        $scope.changetask = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改订单信息')
                .ok('确定修改')
                .cancel('取消修改');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/"+"task/modifyTask.do?",{},{params:{
                        taskId:$scope.taskId,
                        userId:$scope.task.userId,
                        taskTitle:$scope.task.taskTitle,
                        rewardMoney:$scope.task.rewardMoney,
                        status:$scope.task.status,
                        addressRemark:$scope.task.addressRemark,
                        adminId:sessionStorage.adminId,
                        adminDescription:$scope.task.adminDescription,

                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("修改订单成功");
                        } else {
                            $scope.showAlert1(data.message)
                        }

                    })
                }, function() {
                    $scope.showAlert("取消修改");
                });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')).then(function(){
                    $location.path('/task/task-list');
                })
            }


            $scope.showAlert1 = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                )
            }
            $scope.showConfirm();
        }
    }



     // 订单处理
    function TaskDealCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskId = $location.search().taskId
        $scope.status = $location.search().status;
        $scope.backClick = function(){
            $location.path("/task/task-list");
        }

        $http.post('http://localhost:8080/blue-server/' + 'task/getTaskById.do',{},{params:{
            taskId:$scope.taskId,
        }}).success( function (data){
                if(data.code == 0){
                    $scope.task = data.result;
                    console.log($scope.task);
                } else {
                    $scope.showAlert(data.message);
                    console.log($scope.task)
                }
            });


        $scope.changetask = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定处理订单信息')
                .ok('确定')
                .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/"+"task/dealTask.do?",{},{params:{
                        dealType:$scope.dealType,
                        taskId:$scope.taskId,
                        userId:$scope.task.userId,
                        taskTitle:$scope.task.taskTitle,
                        refundsRatio:$scope.refundsRatio,
                        PercentageDeductions:$scope.PercentageDeductions,
                        rewardMoney:$scope.task.rewardMoney,
                        dealDescription:$scope.dealDescription,
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("处理订单成功");
                        } else {
                            $scope.showAlert1(data.message)
                        }

                    })
                }, function() {
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')).then(function(){
                    $location.path('/task/task-list');
                })
            }


            $scope.showAlert1 = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                )
            }
            $scope.showConfirm();
        }
    }






    // 增加
    function taskAddCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)


        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "46") {
                $scope.isShow = 1;
            }
        }


        $scope.task = {"taskName":"","introduction":"","taskTypeId":"","appId":"","link":"","rewardMoney":"","allowNumber":"","poupLeve":"","startDate":"","endDate":"","status":""};

        $scope.backClick = function(){
            $location.path("/task/task-list");
        }


        //任务类型
        $http.post("http://localhost:8080/blue-server/"+"task/getTaskTypeList.do?",{},{params:{
                       
                    }}).success(function (data){
                        if(data.code == 0){
                           // console.log(data.result);
                           $scope.types=data.result;
                        } 
                    });

        $scope.searchShow=0;

        //根据应用名称查找
        $scope.searchApp=function(){
             $scope.searchShow=1;
            if ($scope.appName==undefined) {
                $scope.appName="";
            }

            $http.post("http://localhost:8080/blue-server/"+"app/searchByAppName.do?",{},{params:{
                        appName:$scope.appName
                    }}).success(function (data){
                        if(data.code == 0){
                            // $scope.showAlert("添加邀请人成功");
                            // console.log(data.result);
                            $scope.appInfo=data.result;
                        }else{
                            $scope.appInfo=null;
                        }
                    })



        }


         $scope.clickContent=function(appId){
            console.log(appId)
                for (var i = 0; i < $scope.appInfo.length; i++) {
                    if ($scope.appInfo[i].appId==appId) {
                        // console.log(appId)
                        $scope.appName=$scope.appInfo[i].name;
                        $scope.task.appId=$scope.appInfo[i].appId;
                        $scope.appInfo=null;
                        $scope.searchShow=0;
                        return;
                    }
                }
            }

            $scope.mouseOver=function(appId){
                $("#app-"+appId).css("background-color","gray");
            }

            $scope.mouseLeave=function(appId){
                $("#app-"+appId).css("background-color","rgb(0,0,0,0)");
            }


            //添加任务
        $scope.addtask = function(){

            if ($scope.task.link==undefined) {
                $scope.task.link="";
            }

            //获取开始时间和结束时间
            $scope.task.startDate=$("#startDate").val();
            $scope.task.endDate=$("#endDate").val();

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/blue-server/"+"task/addTask.do?",{},{params:{
                        taskName:$scope.task.taskName,
                        introduction:$scope.task.introduction,
                        typeId:$scope.task.taskTypeId,
                        appId:$scope.task.appId,
                        link:$scope.task.link,
                        money:$scope.task.rewardMoney,
                        num:$scope.task.allowNumber,
                        poupLeve:$scope.task.poupLeve,
                        startDate:$scope.task.startDate,
                        endDate:$scope.task.endDate,
                        status:$scope.task.status,
                        activated:$scope.task.activated,
                        publishId:sessionStorage.adminId
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert(data.message)
                        }
                    })
                },  function() {
                        $scope.showAlert("取消添加");
                    });
            };

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                );
            }

            $scope.showAlert1 = function(txt) {
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
            $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(false)
                .title(txt)
                .ok('确定')
            )
        }
    }


})();
