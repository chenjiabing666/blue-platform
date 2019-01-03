(function(){
	// 'taskDuration strick'

	angular.module('app.taskDuration',[])
    .controller('TaskDurationCtrl', ['$scope','$http','$mdDialog','$location','$timeout',TaskDurationCtrl])
    .controller('TaskDurationDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskDurationDetailCtrl])
    .controller('TaskDurationchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskDurationchangeCtrl])
    .controller('TaskDurationAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskDurationAddCtrl])

    function TaskDurationCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        $scope.backClick = function(){
            $location.path('/taskKind/taskKind-list')
        }
        var init;

        $scope.stores = [];
        $scope.kwTaskDuration = '';
        $scope.kwTaskDurationId = '';
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
        $scope.taskDurationLists = [];

        //可以从上一个页面拿到参数，当做全局变量使用！
        $scope.taskKindId=$location.search().id;
        console.log($location);

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "51") {
                $scope.isShow = 1;
            }
        }

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });

        function getTaskDurationList(pageNum, pageSize){

            $http.post('http://localhost:8080/blue-server/' + 'industryIndex/getIndustryIndexList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                name:$scope.name,
                industryId:$scope.industryId
            }}).success(function (data) {
                if (data.code == 0) {
                    console.log(data.result);
                    $scope.taskDurationLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskDuration=data.result;
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
            obj.titleForKey = ["taskDurationId","taskDurationType","nickName","mobile","password",];
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
            getTaskDurationList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/blue-server/' + 'industryIndex/getIndustryIndexList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    // console.log($scope.stores);
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores = $scope.stores;
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


                      var taskDuration = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[taskDuration.taskDurationId];

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


                      var taskDuration = $scope.currentPageStores[i];



        updateSelectedByStatus(taskDuration.taskDurationId, $scope.isSelectedAll);

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


            var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskDurationBatch.do";// 接收上传文件的后台地址
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

       $scope.searchTaskDuration = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskDurationId = $("#taskDurationId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskDuration/getTaskDurationList.do',{},{params:{
            taskDurationId:$scope.kwTaskDurationId,
            nickName:$scope.kwNickName,
                    taskDuration:$scope.kwTaskDuration,
                    taskDurationId:$scope.kwTaskDurationId,
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

        
        
        // 删除时长
        $scope.deleteTaskDuration = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/"+"industryIndex/deleteIndustryIndexById.do?",{},{params:{
                        industryIndexId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除时长成功");
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
                .title('是否确定设置该邀请人为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/blue-server/"+"elite/addElite.do?",{},{params:{
                        taskDurationId:id,
                    }}).success(function(data){
                        if(data.code == 0){
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
    function TaskDurationDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/taskDuration/taskDuration-list');
        }

        $scope.taskDurationId = $location.search().id;
        
        $http.post('http://localhost:8080/blue-server/' + 'taskDuration/getTaskDurationById.do',{},{params:{
            taskDurationId:$scope.taskDurationId
        }}).success( function (data){
            if(data.code == 0){
                $scope.taskDuration = data.result;
            }
        });
    }


    // 修改
    function TaskDurationchangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskDurationId = $location.search().taskDurationId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskDuration/taskDuration-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'taskDuration/getTaskDurationList.do',{},{params:{
            taskKindId:$scope.taskKindId
        }}).success( function (data){
                if(data.code == 0){
                    $scope.taskDuration = data.result;
                    console.log($scope.taskDuration);
                } else {
                    $scope.showAlert(data.errorMessage);
                    console.log($scope.taskDuration)
                }
            });


        $scope.changetaskDuration = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改时长')
                .ok('确定修改')
                .cancel('取消修改');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/"+"taskDuration/modifyTaskDuration.do?",{},{params:{
                        taskDurationId:$scope.taskDurationId,
                        taskKindId:$scope.taskKindId,
                        duration:$scope.taskDuration.duration,
                     
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("修改时长成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
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
                    $location.path('/taskDuration/taskDuration-list');
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
    function TaskDurationAddCtrl($scope,$http,$location,$mdDialog,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.taskDuration = {};

        $scope.backClick = function(){
            $location.path("/taskDuration/taskDuration-list");
        }

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "52") {
                $scope.isShow = 1;
            }
        }


        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });
        
        $scope.addtaskDuration = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {
                    console.log($location.search().id);
                    console.log($scope.taskDuration.duration);
                    $http.post("http://localhost:8080/blue-server/"+"industryIndex/addIndustryIndex.do?",{},{params:{
                        name:$scope.name,
                        industryId:$scope.industryId,
                        pureRate:$scope.pureRate,
                        impureRate:$scope.impureRate,
                        flowRate:$scope.flowRate,
                        depositRate:$scope.depositRate,
                        accountRate:$scope.accountRate,
                        businessRate:$scope.businessRate,
                        profitRate:$scope.profitRate,
                        year:$scope.year
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert(data.message);
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