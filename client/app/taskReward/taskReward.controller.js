(function(){
    // 'taskReward strick'

    angular.module('app.taskReward',[])
    .controller('TaskRewardCtrl', ['$scope','$http','$mdDialog','$location','$timeout',TaskRewardCtrl])
    .controller('SWOTCtrl', ['$scope','$http','$mdDialog','$location','$timeout',SWOTCtrl])
    .controller('SWOTCommonCtrl', ['$scope','$http','$mdDialog','$location','$timeout',SWOTCommonCtrl])
    .controller('TaskRewardDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskRewardDetailCtrl])
    .controller('TaskRewardchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskRewardchangeCtrl])
    .controller('PositionAddController', ['$scope', '$http','$location','$mdDialog','$timeout',PositionAddController])
    .controller('CompeteChange', ['$scope', '$http','$location','$mdDialog','$timeout',CompeteChange])
    .controller('RadarChange', ['$scope', '$http','$location','$mdDialog','$timeout',RadarChange])
    .controller('AgentChange', ['$scope', '$http','$location','$mdDialog','$timeout',AgentChange])
     .controller('PositionChange', ['$scope', '$http','$location','$mdDialog','$timeout',PositionChange])
    .controller('PositionEdit', ['$scope', '$http','$location','$mdDialog','$timeout',PositionEdit])
    .controller('SwotEdit', ['$scope', '$http','$location','$mdDialog','$timeout',SwotEdit])
    .controller('TaskRewardAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskRewardAddCtrl])
    .controller('SWOTAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',SWOTAddCtrl])
    .controller('SWOCommonTAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',SWOCommonTAddCtrl])
    .controller('AgentCotroller', ['$scope', '$http','$location','$mdDialog','$timeout',AgentCotroller])
    .controller('PositionController', ['$scope', '$http','$location','$mdDialog','$timeout',PositionController])



// 增加
    function SWOCommonTAddCtrl($scope,$http,$location,$mdDialog,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.taskReward = {};

        $scope.backClick = function(){
            $location.path("/taskReward/swot-common-list");
        }

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        // $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
        //                 pageNum:1,
        //                 pageSize:20
        //             }}).success(function (data){
        //                 if(data.code == 0){
        //                        $scope.industryList=data.result;
        //                        console.log($scope.industryList);
        //                 }

        //             });
        
        $scope.addtaskReward = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/blue-server/"+"swot/addCommonSwot.do?",{},{params:{
                        moduleId:$scope.moduleId,
                        type:$scope.type,
                        advise:$scope.advise
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert1(data.message)
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
                )           
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

 function SWOTCommonCtrl($scope,$http,$mdDialog,$location,$timeout){
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
        $scope.kwTaskReward = '';
        $scope.kwTaskRewardId = '';
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
        $scope.taskRewardLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "56") {
                $scope.isShow = 1;
            }
        }

        //可以从上一个页面拿到参数，当做全局变量使用！
        // $scope.taskKindId=$location.search().id;
        // console.log($location.search().id);

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });

        function getTaskRewardList(pageNum, pageSize){

            $http.post('http://localhost:8080/blue-server/' + 'swot/getCommonSwotList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                moduleId:$scope.moduleId,
            }}).success(function (data) {
                if (data.code == 0) {
                    console.log(data.result);
                    $scope.taskRewardLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskReward=data.result;
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
            obj.titleForKey = ["taskRewardId","taskRewardType","nickName","mobile","password",];
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
            getTaskRewardList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/blue-server/' + 'swot/getCommonSwotList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.filteredStores = data.result;
                    console.log($scope.stores);
                    // $scope.searchTaskReward(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskReward(page,$scope.numPerPage);
                }else{
                    // $scope.showAlert(data.message)
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


                      var taskReward = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[taskReward.taskRewardId];

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


                      var taskReward = $scope.currentPageStores[i];



        updateSelectedByStatus(taskReward.taskRewardId, $scope.isSelectedAll);

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


            var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskRewardBatch.do";// 接收上传文件的后台地址
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

       $scope.searchTaskReward = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskRewardId = $("#taskRewardId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardList.do',{},{params:{
            taskRewardId:$scope.kwTaskRewardId,
            nickName:$scope.kwNickName,
                    taskReward:$scope.kwTaskReward,
                    taskRewardId:$scope.kwTaskRewardId,
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
        $scope.deleteTaskReward = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"swot/deleteSwotById.do?",{},{params:{
                        swotId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除成功");
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
                        taskRewardId:id,
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




    // 查看详情
    function TaskRewardDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/taskReward/taskReward-list');
        }

        $scope.taskRewardId = $location.search().id;
        
        $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardById.do',{},{params:{
            taskRewardId:$scope.taskRewardId
        }}).success( function (data){
            if(data.code == 0){
                $scope.taskReward = data.result;
            }
        });
    }


    // 修改
    function TaskRewardchangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskReward/agent-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'industry/getIndustryList.do',{},{params:{
                pageNum:1,
                pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.industryList=data.result;
                }else {
                    // $scope.currentPageStores = null;    
                }
            });


        $scope.changetaskReward = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定')
                .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/"+"compete/addCompete.do?",{},{params:{
                        industryId:$scope.industryId,
                        quality:$scope.quality,
                        deliver:$scope.deliver,
                        cost:$scope.cost,
                        // type:$scope.type,
                        // content:$scope.content
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
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
                        .ok('确定'))
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
    function CompeteChange($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskReward/agent-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'compete/getCompeteAnalysisList.do',{},{params:{
                // pageNum:1,
                // pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.analysis=data.result;
                    console.log($scope.analysis);
                }else {
                    // $scope.currentPageStores = null;    
                }
            });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            console.log(angular.toJson($scope.analysis));
            $.ajax({
            type: "POST",
            url: "http://localhost:8080/blue-server/compete/modifyCompete.do",
            contentType: "application/json; charset=utf-8",
            data: angular.toJson($scope.analysis),
            dataType: "json",
            success: function (data) {
                // console.log(message);
                if (data.code==0) {
                    $scope.showAlert("修改成功");
                }else{
                    $scope.showAlert(data.message)
                }
            },
            error: function (data) {
                console.log(message);
                // $("#request-process-patent").html("提交数据失败！");
            }
    });

            // $scope.showConfirm = function() {
            //     // 确定
            //     var confirm = $mdDialog.confirm()
            //     .title('是否确定修改')
            //     .ok('确定')
            //     .cancel('取消');

            //     $mdDialog.show(confirm).then(function() {
            //         $http.post("http://localhost:8080/blue-server/"+"compete/addCompete.do?",{},{params:{
            //             industryId:$scope.industryId,
            //             quality:$scope.quality,
            //             deliver:$scope.deliver,
            //             cost:$scope.cost,
            //             type:$scope.type,
            //             content:$scope.content
            //         }}).success(function (data){
            //             if(data.code == 0){
            //                 $scope.showAlert("添加成功");
            //             } else {
            //                 $scope.showAlert1(data.message)
            //             }
                        
            //         })
            //     }, function() {
            //         $scope.showAlert("取消");
            //     });
            // };

            // $scope.showAlert = function(txt) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(false)
            //             .title(txt)
            //             .ok('确定'))
            // }


            // $scope.showAlert1 = function(txt) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //         .clickOutsideToClose(false)
            //         .title(txt)
            //         .ok('确定')
            //     )         
            // } 
            // $scope.showConfirm();
        }
    }


     // 修改
    function SwotEdit($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.agentId = $location.search().id;

        $scope.backClick = function(){
            $location.path('/taskReward/swot-list');
        }

        // $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
        //                 pageNum:1,
        //                 pageSize:20
        //             }}).success(function (data){
        //                 if(data.code == 0){
        //                        $scope.moduleList=data.result;
        //                        console.log($scope.moduleList);
        //                 }

        //             });

       $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });
        
        $http.post("http://localhost:8080/blue-server/"+"swot/getSwotById.do?",{},{params:{
                        swotId:$scope.agentId,
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.swot=data.result;
                               console.log($scope.swot);
                        }else{
                            console.log(data.message)
                        }

                    });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            // $http.post("http://localhost:8080/blue-server/"+"swot/modifySwot.do?",{},{params:{
            //             swotId:$scope.swot.swotId,
            //             industryId:$scope.swot.industryId,
            //             moduleId:$scope.swot.moduleId,
            //             type:$scope.swot.type,
            //             advise:$scope.swot.advise
            //             // pageSize:20
            //         }}).success(function (data){
            //             if(data.code == 0){
            //                  $scope.showAlert("修改成功");
            //             }else{
            //                 $scope.showAlert(data.message);
            //             }

            //         });

                $.ajax({
                    type: "POST",
                    url: " http://localhost:8080/blue-server/swot/modifySwot.do",
                    contentType: "application/json; charset=utf-8",
                    data: angular.toJson($scope.swot),
                    dataType: "json",
                    success: function (data) {
                        if (data.code==0) {
                            $scope.showAlert("修改成功");
                        }else{
                            $scope.showAlert("修改失败");
                        }
                    },
                    error: function (message) {
                        $scope.showAlert("数据提交失败");
                    }
                });



        }
    }


      // 修改
    function PositionEdit($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.agentId = $location.search().id;

        $scope.backClick = function(){
            $location.path('/taskReward/position-list');
        }

        // $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
        //                 pageNum:1,
        //                 pageSize:20
        //             }}).success(function (data){
        //                 if(data.code == 0){
        //                        $scope.moduleList=data.result;
        //                        console.log($scope.moduleList);
        //                 }

        //             });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"position/getPositionById.do?",{},{params:{
                        positionId:$scope.agentId,
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.position=data.result;
                               console.log($scope.position);
                        }else{
                            console.log(data.message)
                        }

                    });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            $http.post("http://localhost:8080/blue-server/"+"position/modifyPositionBase.do?",{},{params:{
                        positionId:$scope.position.positionId,
                        industryId:$scope.position.industryId,
                        score:$scope.position.score,
                        compete:$scope.position.compete,
                        // cost:$scope.compete.cost
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                             $scope.showAlert("修改成功");
                        }else{
                            $scope.showAlert(data.message);
                        }

                    });

        }
    }

    // 修改
    function AgentChange($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.agentId = $location.search().agentId;

        $scope.backClick = function(){
            $location.path('/taskReward/agent-list');
        }

        // $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
        //                 pageNum:1,
        //                 pageSize:20
        //             }}).success(function (data){
        //                 if(data.code == 0){
        //                        $scope.moduleList=data.result;
        //                        console.log($scope.moduleList);
        //                 }

        //             });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"compete/getCompeteById.do?",{},{params:{
                        competeId:$scope.agentId,
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.compete=data.result;
                               console.log($scope.compete);
                        }

                    });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            $http.post("http://localhost:8080/blue-server/"+"compete/modifyCompeteBase.do?",{},{params:{
                        competeId:$scope.compete.competeId,
                        quality:$scope.compete.quality,
                        industryId:$scope.compete.industryId,
                        deliver:$scope.compete.deliver,
                        cost:$scope.compete.cost
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                             $scope.showAlert("修改成功");
                        }else{
                            $scope.showAlert(data.message);
                        }

                    });

        }
    }

    // 修改
    function RadarChange($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.radarId = $location.search().radarId;

        $scope.backClick = function(){
            $location.path('/taskReward/taskReward-list');
        }

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"radar/getRadarById.do?",{},{params:{
                        radarId:$scope.radarId,
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.radar=data.result;
                               console.log($scope.radar);
                        }

                    });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            $http.post("http://localhost:8080/blue-server/"+"radar/modifyRadar.do?",{},{params:{
                        radarId:$scope.radarId,
                        moduleId:$scope.radar.moduleId,
                        industryId:$scope.radar.industryId,
                        avgLevel:$scope.radar.avgLevel
                        // pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                             $scope.showAlert("修改成功");
                        }else{
                            $scope.showAlert(data.message);
                        }

                    });

        }
    }

    // 修改
    function PositionChange($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskReward/position-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'position/getPositionAnalysisList.do',{},{params:{
                // pageNum:1,
                // pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.analysis=data.result;
                    console.log($scope.analysis);
                }else {
                    // $scope.currentPageStores = null;    
                }
            });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            console.log(angular.toJson($scope.analysis));
            $.ajax({
            type: "POST",
            url: "http://localhost:8080/blue-server/position/modifyPosition.do",
            contentType: "application/json; charset=utf-8",
            data: angular.toJson($scope.analysis),
            dataType: "json",
            success: function (data) {
                // console.log(message);
                if (data.code==0) {
                    $scope.showAlert("修改成功");
                }else{
                    $scope.showAlert(data.message)
                }
            },
            error: function (data) {
                console.log(data);
                // $("#request-process-patent").html("提交数据失败！");
            }
    });

            // $scope.showConfirm = function() {
            //     // 确定
            //     var confirm = $mdDialog.confirm()
            //     .title('是否确定修改')
            //     .ok('确定')
            //     .cancel('取消');

            //     $mdDialog.show(confirm).then(function() {
            //         $http.post("http://localhost:8080/blue-server/"+"compete/addCompete.do?",{},{params:{
            //             industryId:$scope.industryId,
            //             quality:$scope.quality,
            //             deliver:$scope.deliver,
            //             cost:$scope.cost,
            //             type:$scope.type,
            //             content:$scope.content
            //         }}).success(function (data){
            //             if(data.code == 0){
            //                 $scope.showAlert("添加成功");
            //             } else {
            //                 $scope.showAlert1(data.message)
            //             }
                        
            //         })
            //     }, function() {
            //         $scope.showAlert("取消");
            //     });
            // };

            // $scope.showAlert = function(txt) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(false)
            //             .title(txt)
            //             .ok('确定'))
            // }


            // $scope.showAlert1 = function(txt) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //         .clickOutsideToClose(false)
            //         .title(txt)
            //         .ok('确定')
            //     )         
            // } 
            // $scope.showConfirm();
        }
    }

// 修改
    function PositionAddController($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskReward/position-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'industry/getIndustryList.do',{},{params:{
                pageNum:1,
                pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.industryList=data.result;
                }else {
                    // $scope.currentPageStores = null;    
                }
            });


        $scope.changetaskReward = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定')
                .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/"+"position/addPosition.do?",{},{params:{
                        industryId:$scope.industryId,
                        score:$scope.score,
                        compete:$scope.compete,
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
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
                        .ok('确定'))
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

    function PositionController($scope,$http,$mdDialog,$location,$timeout){
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
        $scope.kwTaskReward = '';
        $scope.kwTaskRewardId = '';
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
        $scope.taskRewardLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "55") {
                $scope.isShow = 1;
            }
        }


        $http.post('http://localhost:8080/blue-server/' + 'industry/getIndustryList.do',{},{params:{
                pageNum:1,
                pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.industryList=data.result;
                }else {
                    // $scope.currentPageStores = null;    
                }
            });

        $scope.deleteSetting=function(id){
             $http.post('http://localhost:8080/blue-server/' + 'position/deletePositionById.do',{},{params:{
               positionId:id
            }}).success(function (data) {
                if (data.code == 0) {
                   alert("删除成功");
                   $(".delete-"+id).css("display","none");
                                 $scope.total--;
                }else {
                    alert(data.message);
                }
            });
        }
       

        $scope.showAlert = function(txt) {

                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title(txt)
                                .ok('确定')
                                ) 
                            
                        }  

        function getTaskRewardList(pageNum, pageSize){

            $http.post('http://localhost:8080/blue-server/' + 'position/getPositionList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                industryId:$scope.industryId
            }}).success(function (data) {
                if (data.code == 0) {
                    console.log(data.result);
                    $scope.taskRewardLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskReward=data.result;
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
            obj.titleForKey = ["taskRewardId","taskRewardType","nickName","mobile","password",];
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
            getTaskRewardList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/blue-server/' + 'position/getPositionList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.filteredStores = data.result;
                    console.log($scope.stores);
                    // $scope.searchTaskReward(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskReward(page,$scope.numPerPage);
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


                      var taskReward = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[taskReward.taskRewardId];

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


                      var taskReward = $scope.currentPageStores[i];



        updateSelectedByStatus(taskReward.taskRewardId, $scope.isSelectedAll);

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


            var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskRewardBatch.do";// 接收上传文件的后台地址
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

       $scope.searchTaskReward = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskRewardId = $("#taskRewardId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardList.do',{},{params:{
            taskRewardId:$scope.kwTaskRewardId,
            nickName:$scope.kwNickName,
                    taskReward:$scope.kwTaskReward,
                    taskRewardId:$scope.kwTaskRewardId,
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
        $scope.deleteTaskReward = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"radar/deleteRadarById.do?",{},{params:{
                        radarId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除成功");
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
                        taskRewardId:id,
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


    function AgentCotroller($scope,$http,$mdDialog,$location,$timeout){
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
        $scope.kwTaskReward = '';
        $scope.kwTaskRewardId = '';
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
        $scope.taskRewardLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "54") {
                $scope.isShow = 1;
            }
        }


        $http.post('http://localhost:8080/blue-server/' + 'industry/getIndustryList.do',{},{params:{
                pageNum:1,
                pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.industryList=data.result;
                }else {
                    // $scope.currentPageStores = null;    
                }
            });

        $scope.deleteSetting=function(id){
             $http.post('http://localhost:8080/blue-server/' + 'compete/deleteCompeteById.do',{},{params:{
               competeId:id
            }}).success(function (data) {
                if (data.code == 0) {
                   alert("删除成功");
                   $(".delete-"+id).css("display","none");
                                 $scope.total--;
                }else {
                    alert(data.message);
                }
            });
        }
       

        $scope.showAlert = function(txt) {

                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title(txt)
                                .ok('确定')
                                ) 
                            
                        }  

        function getTaskRewardList(pageNum, pageSize){

            $http.post('http://localhost:8080/blue-server/' + 'compete/getCompeteList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                industryId:$scope.industryId
            }}).success(function (data) {
                if (data.code == 0) {
                    console.log(data.result);
                    $scope.taskRewardLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskReward=data.result;
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
            obj.titleForKey = ["taskRewardId","taskRewardType","nickName","mobile","password",];
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
            getTaskRewardList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/blue-server/' + 'compete/getCompeteList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.filteredStores = data.result;
                    console.log($scope.stores);
                    // $scope.searchTaskReward(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskReward(page,$scope.numPerPage);
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


                      var taskReward = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[taskReward.taskRewardId];

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


                      var taskReward = $scope.currentPageStores[i];



        updateSelectedByStatus(taskReward.taskRewardId, $scope.isSelectedAll);

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


            var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskRewardBatch.do";// 接收上传文件的后台地址
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

       $scope.searchTaskReward = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskRewardId = $("#taskRewardId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardList.do',{},{params:{
            taskRewardId:$scope.kwTaskRewardId,
            nickName:$scope.kwNickName,
                    taskReward:$scope.kwTaskReward,
                    taskRewardId:$scope.kwTaskRewardId,
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
        $scope.deleteTaskReward = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"radar/deleteRadarById.do?",{},{params:{
                        radarId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除成功");
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
                        taskRewardId:id,
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

    function TaskRewardCtrl($scope,$http,$mdDialog,$location,$timeout){
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
        $scope.kwTaskReward = '';
        $scope.kwTaskRewardId = '';
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
        $scope.taskRewardLists = [];

        //可以从上一个页面拿到参数，当做全局变量使用！
        $scope.taskKindId=$location.search().id;
        console.log($location.search().id);

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "53") {
                $scope.isShow = 1;
            }
        }

        function getTaskRewardList(pageNum, pageSize){

            $http.post('http://localhost:8080/blue-server/' + 'radar/getRadarList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                moduleId:$scope.moduleId,
                industryId:$scope.industryId
            }}).success(function (data) {
                if (data.code == 0) {
                    console.log(data.result);
                    $scope.taskRewardLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskReward=data.result;
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
            obj.titleForKey = ["taskRewardId","taskRewardType","nickName","mobile","password",];
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
            getTaskRewardList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/blue-server/' + 'radar/getRadarList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.filteredStores = data.result;
                    console.log($scope.stores);
                    // $scope.searchTaskReward(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskReward(page,$scope.numPerPage);
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


                      var taskReward = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[taskReward.taskRewardId];

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


                      var taskReward = $scope.currentPageStores[i];



        updateSelectedByStatus(taskReward.taskRewardId, $scope.isSelectedAll);

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


            var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskRewardBatch.do";// 接收上传文件的后台地址
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

       $scope.searchTaskReward = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskRewardId = $("#taskRewardId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardList.do',{},{params:{
            taskRewardId:$scope.kwTaskRewardId,
            nickName:$scope.kwNickName,
                    taskReward:$scope.kwTaskReward,
                    taskRewardId:$scope.kwTaskRewardId,
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
        $scope.deleteTaskReward = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"radar/deleteRadarById.do?",{},{params:{
                        radarId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除成功");
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
                        taskRewardId:id,
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


     function SWOTCtrl($scope,$http,$mdDialog,$location,$timeout){
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
        $scope.kwTaskReward = '';
        $scope.kwTaskRewardId = '';
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
        $scope.taskRewardLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "56") {
                $scope.isShow = 1;
            }
        }

        //可以从上一个页面拿到参数，当做全局变量使用！
        // $scope.taskKindId=$location.search().id;
        // console.log($location.search().id);

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });

        function getTaskRewardList(pageNum, pageSize){

            $http.post('http://localhost:8080/blue-server/' + 'swot/getSwotList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                moduleId:$scope.moduleId,
                industryId:$scope.industryId
            }}).success(function (data) {
                if (data.code == 0) {
                    console.log(data.result);
                    $scope.taskRewardLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskReward=data.result;
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
            obj.titleForKey = ["taskRewardId","taskRewardType","nickName","mobile","password",];
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
            getTaskRewardList(page, $scope.numPerPage);
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
            $http.post('http://localhost:8080/blue-server/' + 'swot/getSwotList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.filteredStores = data.result;
                    console.log($scope.stores);
                    // $scope.searchTaskReward(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskReward(page,$scope.numPerPage);
                }else{
                    // $scope.showAlert(data.message)
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


                      var taskReward = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[taskReward.taskRewardId];

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


                      var taskReward = $scope.currentPageStores[i];



        updateSelectedByStatus(taskReward.taskRewardId, $scope.isSelectedAll);

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


            var modifyTopicUrl ="http://localhost:8080/blue-server/"+"batch/deleteTaskRewardBatch.do";// 接收上传文件的后台地址
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

       $scope.searchTaskReward = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskRewardId = $("#taskRewardId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardList.do',{},{params:{
            taskRewardId:$scope.kwTaskRewardId,
            nickName:$scope.kwNickName,
                    taskReward:$scope.kwTaskReward,
                    taskRewardId:$scope.kwTaskRewardId,
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
        $scope.deleteTaskReward = function(id){
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
                    $http.post("http://localhost:8080/blue-server/"+"swot/deleteSwotById.do?",{},{params:{
                        swotId:id
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("删除成功");
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
                        taskRewardId:id,
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




    // 查看详情
    function TaskRewardDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/taskReward/taskReward-list');
        }

        $scope.taskRewardId = $location.search().id;
        
        $http.post('http://localhost:8080/blue-server/' + 'taskReward/getTaskRewardById.do',{},{params:{
            taskRewardId:$scope.taskRewardId
        }}).success( function (data){
            if(data.code == 0){
                $scope.taskReward = data.result;
            }
        });
    }


    // 修改
    function TaskRewardchangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskReward/agent-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'industry/getIndustryList.do',{},{params:{
                pageNum:1,
                pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.industryList=data.result;
                }else {
                    // $scope.currentPageStores = null;    
                }
            });


        $scope.changetaskReward = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定')
                .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/"+"compete/addCompete.do?",{},{params:{
                        industryId:$scope.industryId,
                        quality:$scope.quality,
                        deliver:$scope.deliver,
                        cost:$scope.cost,
                        // type:$scope.type,
                        // content:$scope.content
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
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
                        .ok('确定'))
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
    function CompeteChange($scope,$http,$location,$mdDialog,$timeout){

        $scope.taskRewardId = $location.search().taskRewardId;
        $scope.taskKindId = $location.search().taskKindId;

        $scope.backClick = function(){
            $location.path('/taskReward/agent-list');
        }

        $http.post('http://localhost:8080/blue-server/' + 'compete/getCompeteAnalysisList.do',{},{params:{
                // pageNum:1,
                // pageSize:100,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.analysis=data.result;
                    console.log($scope.analysis);
                }else {
                    // $scope.currentPageStores = null;    
                }
            });

            $scope.showAlert = function(txt) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定'))
            }


        $scope.changetaskReward = function(){

            console.log(angular.toJson($scope.analysis));
            $.ajax({
            type: "POST",
            url: "http://localhost:8080/blue-server/compete/modifyCompete.do",
            contentType: "application/json; charset=utf-8",
            data: angular.toJson($scope.analysis),
            dataType: "json",
            success: function (data) {
                // console.log(message);
                if (data.code==0) {
                    $scope.showAlert("修改成功");
                }else{
                    $scope.showAlert(data.message)
                }
            },
            error: function (data) {
                console.log(message);
                // $("#request-process-patent").html("提交数据失败！");
            }
    });

            // $scope.showConfirm = function() {
            //     // 确定
            //     var confirm = $mdDialog.confirm()
            //     .title('是否确定修改')
            //     .ok('确定')
            //     .cancel('取消');

            //     $mdDialog.show(confirm).then(function() {
            //         $http.post("http://localhost:8080/blue-server/"+"compete/addCompete.do?",{},{params:{
            //             industryId:$scope.industryId,
            //             quality:$scope.quality,
            //             deliver:$scope.deliver,
            //             cost:$scope.cost,
            //             type:$scope.type,
            //             content:$scope.content
            //         }}).success(function (data){
            //             if(data.code == 0){
            //                 $scope.showAlert("添加成功");
            //             } else {
            //                 $scope.showAlert1(data.message)
            //             }
                        
            //         })
            //     }, function() {
            //         $scope.showAlert("取消");
            //     });
            // };

            // $scope.showAlert = function(txt) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(false)
            //             .title(txt)
            //             .ok('确定'))
            // }


            // $scope.showAlert1 = function(txt) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //         .clickOutsideToClose(false)
            //         .title(txt)
            //         .ok('确定')
            //     )         
            // } 
            // $scope.showConfirm();
        }
    }


    // 增加
    function TaskRewardAddCtrl($scope,$http,$location,$mdDialog,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.taskReward = {};

        $scope.backClick = function(){
            $location.path("/taskReward/taskReward-list");
        }

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });
        
        $scope.addtaskReward = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/blue-server/"+"radar/addRadar.do?",{},{params:{
                        moduleId:$scope.moduleId,
                        industryId:$scope.industryId,
                        avgLevel:$scope.avgLevel
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert1(data.message)
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
                )           
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


     // 增加
    function SWOTAddCtrl($scope,$http,$location,$mdDialog,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.taskReward = {};

        $scope.backClick = function(){
            $location.path("/taskReward/swot-list");
        }

        $http.post("http://localhost:8080/blue-server/"+"module/getModuleList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.moduleList=data.result;
                               console.log($scope.moduleList);
                        }

                    });

        $http.post("http://localhost:8080/blue-server/"+"industry/getIndustryList.do?",{},{params:{
                        pageNum:1,
                        pageSize:20
                    }}).success(function (data){
                        if(data.code == 0){
                               $scope.industryList=data.result;
                               console.log($scope.industryList);
                        }

                    });
        
        $scope.addtaskReward = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/blue-server/"+"swot/addSwot.do?",{},{params:{
                        moduleId:$scope.moduleId,
                        industryId:$scope.industryId,
                        type:$scope.type,
                        advise:$scope.advise
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("添加成功");
                        } else {
                            $scope.showAlert1(data.message)
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
                )           
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