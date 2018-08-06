(function(){
	// 'taskKind strick'

	angular.module('app.taskKind',[])
    .controller('TaskKindCtrl', ['$scope','$http','$mdDialog','$location','$timeout',TaskKindCtrl])
    .controller('TaskKindDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindDetailCtrl])
    .controller('TaskKindchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindchangeCtrl])
    .controller('TaskKindAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindAddCtrl])
    .filter('isDoing',function(){
        return function(input){
            if(input ==1){
                return '是';
            }else{
                return '否';
            }
        }
    })

    function TaskKindCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwTaskKindId = '';
        $scope.kwUserId = '';
        $scope.kwTitle = '';
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
        $scope.taskKindLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "14") {
                $scope.isShow = 1;
            }
        }


        function getTaskKindList(pageNum, pageSize){

            $http.post('http://localhost:8080/yoyo-server/' + 'taskKind/getTaskKindList.do',{},{params:{
                taskKindId:$scope.kwTaskKindId,
                title: $scope.kwTitle,
                pageNum:pageNum,
                pageSize:pageSize,
                interfaceType:1,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.taskKindLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskKind=data.result;
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
            obj.title = ["任务品类ID","任务品类类型","昵称","手机号","密码",];
            obj.titleForKey = ["taskKindId","taskKindType","nickName","mobile","password",];
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
            downloadLink.download = "任务品类列表.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        function select(page) {
            getTaskKindList(page, $scope.numPerPage);
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
            return $scope.onFilterChange();
        };


        init = function() {
            $http.post('http://localhost:8080/yoyo-server/' + 'taskKind/getTaskKindList.do',{},{params:{
                taskKindId:$scope.kwTaskKindId,
                title: $scope.kwTitle,
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.search();
                    // $scope.searchTaskKind(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskKind(page,$scope.numPerPage);
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


                              var taskKind = $scope.currentPageStores[i];

                isSelectedAll &= $scope.selected[taskKind.taskKindId];

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


                              var taskKind = $scope.currentPageStores[i];



                updateSelectedByStatus(taskKind.taskKindId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteTaskKindBatch.do";// 接收上传文件的后台地址
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




       // 搜索

       $scope.searchTaskKind = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskKindId = $("#taskKindId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'taskKind/getTaskKindList.do',{},{params:{
            taskKindId:$scope.kwTaskKindId,

                userId:$scope.kwUserId ,
                title: $scope.kwTitle,
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



        // 删除任务品类
        $scope.deleteTaskKind = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条任务品类员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"taskKind/deleteTaskKind.do?",{},{params:{
                        taskKindId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除任务品类成功");
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
                .title('是否确定设置该任务品类为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        taskKindId:id,
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
        init();



    }



    // 查看详情
    function TaskKindDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/taskKind/taskKind-list');
        }

        $scope.taskKindId = $location.search().id;

        $http.post('http://localhost:8080/yoyo-server/' + 'taskKind/getTaskKindById.do',{},{params:{
            taskKindId:$scope.taskKindId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.taskKind = data.result;
				console.log($scope.taskKind);
            } else {
                $scope.showAlert(data.errorMessage);
            }if($scope.taskKind.isOpenDrink=='1'){
                $scope.taskKind.isOpenDrink='是'
            }else if($scope.taskKind.isOpenDrink=='2'){
                $scope.taskKind.isOpenDrink='否'
            }
			if($scope.taskKind.isOpenAnonymity=="1"){
				$scope.taskKind.isOpenAnonymity = "是"
			}else if($scope.taskKind.isOpenAnonymity=="2"){
				$scope.taskKind.isOpenAnonymity = "否"
			}
        });
    }


    // 修改
    function TaskKindchangeCtrl($scope,$http,$location,$mdDialog,$timeout){
        $scope.taskKindId = $location.search().id;
        console.log("$scope.taskKindId========"+$scope.taskKindId);
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)


        $http.post('http://localhost:8080/yoyo-server/' + 'taskKind/getTaskKindById.do',{},{params:{
            taskKindId:$scope.taskKindId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.taskKind = data.result;
                console.log($scope.taskKind);
            }
        });

        $scope.taskKind = {};

        $scope.backClick = function(){
            $location.path("/taskKind/taskKind-list");
        }

        $scope.taskKind = {};

        $scope.doUploadPhoto=function(element){

            $scope.fileObj = element.files[0];
        }

        $scope.doUploadPhoto2=function(element){

            $scope.fileObj2 = element.files[0];
        }

        $scope.doUploadMultPhoto=function(element){

            $scope.carouselFileObj = element.files;
            //console.log("$scope.fileObj");
        }

        $scope.changetaskKind = function(){
            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改任务品类')
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addTaskKindUrl ="http://localhost:8080/yoyo-server/" + "taskKind/modifyTaskKind.do?";
                    // FormData 对象
                    var form = new FormData();
					//console.log("品类标题======="+$scope.taskKind.title);
					//console.log("人数上线是多少呢======="+$scope.taskKind.maxmember);
					form.append("taskKindId", $scope.taskKind.taskKindId);
                    form.append("maxmember",$scope.taskKind.maxmember);
                    form.append("title", $scope.taskKind.title);
                    form.append("imageUrl", $scope.taskKind.imageUrl);
                    form.append("isOpenDrink", $scope.taskKind.isOpenDrink);
                    form.append("isOpenAnonymity", $scope.taskKind.isOpenAnonymity);
                    form.append("titleRemark", $scope.taskKind.titleRemark);
                    form.append("file",$scope.fileObj);
                    form.append("showImageUrl",$scope.fileObj2);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addTaskKindUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) {//4代表执行完成
                            if (xhr.status == 200) {//200代表执行成功
                                $scope.showAlert("修改任务品类成功");

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
                       $location.path('/taskKind/taskKind-list');
                   })
                }
                $scope.showConfirm();
            }
        }






    // 增加
    function TaskKindAddCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.taskKind = {};

        $scope.backClick = function(){
            $location.path("/taskKind/taskKind-list");
        }

        $scope.taskKind = {};

        $scope.doUploadPhoto=function(element){

            $scope.fileObj = element.files[0];
        }
        $scope.doUploadPhoto2=function(element){

            $scope.fileObj2 = element.files[0];
        }

        $scope.doUploadMultPhoto=function(element){

            $scope.carouselFileObj = element.files;
            //console.log("$scope.fileObj");
        }

        $scope.addtaskKind = function(){
            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定添加新的任务品类')
                            .ok('确定添加')
                            .cancel('取消添加');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addTaskKindUrl ="http://localhost:8080/yoyo-server/" + "taskKind/addTaskKind.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("maxmember", $scope.taskKind.maxmember);
                    form.append("title", $scope.taskKind.title);
                    form.append("isOpenDrink", $scope.taskKind.isOpenDrink);
                    form.append("isOpenAnonymity", $scope.taskKind.isOpenAnonymity);
                    form.append("titleRemark", $scope.taskKind.titleRemark);
                    form.append("file", $scope.fileObj);
                    form.append("showImageUrl",$scope.fileObj2);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addTaskKindUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if (xhr.readyState == 4) {//4代表执行完成
                            if (xhr.status == 200) {//200代表执行成功
                             $scope.showAlert("录入任务品类成功");

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
                       $location.path('/taskKind/taskKind-list');
                   })
                }
                $scope.showConfirm();
            }
        }


    })();
