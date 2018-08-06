(function(){
	// 'appraise strick'

	angular.module('app.appraise',[])
    .controller('AppraiseCtrl', ['$scope','$http','$mdDialog','$location','$timeout',AppraiseCtrl])
    .controller('AppraiseDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',AppraiseDetailCtrl])
    .controller('AppraiseChangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',AppraiseChangeCtrl])
    .controller('AppraiseAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',AppraiseAddCtrl])
    .filter('parseAppraiseType',function(){
        return function(input){
            if(input == 1){
                return '服务态度';
            }else{
                return '相似度';
            }
        }
    })

    function AppraiseCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwAppraise = '';
        $scope.kwAppraiseId = '';
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
        $scope.appraiseLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "18") {
                $scope.isShow = 1;
            }
        }


        function getAppraiseList(pageNum, pageSize){
                $scope.kwToUserId = $("#toUserId").val();
                $scope.kwAppraiseLevel = $("#appraiseLevel").val();
                console.log($scope.kwToUserId);
                console.log($scope.kwAppraiseLevel);
            $http.post('http://localhost:8080/yoyo-server/' + 'appraise/getAppraiseList.do',{},{params:{
                userId:$scope.kwToUserId,
                appraiseLevel:$scope.kwAppraiseLevel,
                pageNum:pageNum,
                pageSize:pageSize,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.appraiseLists=data.result;
                    $scope.stores=data.result;
                    $scope.appraise=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    //拿到的是个数组对象，进行循环遍历去判断赋值
                    for(var i = 0;$scope.appraise.length;i++){
                        switch($scope.appraise[i].appraiseLevel){
                            case 1:
                            $scope.appraise[i].appraiseLevel = "好评";
                            break;
                            case 2:
                            $scope.appraise[i].appraiseLevel = "中评";
                            break;
                            case 3:
                            $scope.appraise[i].appraiseLevel = "差评";
                            break;
                        }
                    }
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
            obj.titleForKey = ["appraiseId","appraiseType","nickName","mobile","password",];
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
            getAppraiseList(page, $scope.numPerPage);
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

            $http.post('http://localhost:8080/yoyo-server/' + 'appraise/getAppraiseList.do',{},{params:{              
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchAppraise(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchAppraise(page,$scope.numPerPage);
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


                              var appraise = $scope.currentPageStores[i];

                isSelectedAll &= $scope.selected[appraise.appraiseId];

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


                              var appraise = $scope.currentPageStores[i];



                updateSelectedByStatus(appraise.appraiseId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteAppraiseBatch.do";// 接收上传文件的后台地址
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

       $scope.searchAppraise = function(pageNum,pageSize){
         $scope.isSearch = true;
         $scope.kwToUserId = $("#toUserId").val();
         $scope.kwAppraiseLevel = $("#appraiseLevel").val();
         /*$scope.csName = $("#csName").val();*/

         /* $scope.name = $("#name").val();*/

         $http.post('http://localhost:8080/yoyo-server/' + 'appraise/getAppraiseList.do',{},{params:{
            userId:$scope.kwToUserId,
            appraiseLevel:$scope.kwAppraiseLevel,
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

          
        // 删除邀请人
        $scope.deleteAppraise = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条评论信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"appraise/deleteAppraise.do?",{},{params:{
                        appraiseId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除评论成功");
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
                .title('是否确定设置该邀请人为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        appraiseId:id,
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
    function AppraiseDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            $location.path('/appraise/appraise-list');
        }

        $scope.appraiseId = $location.search().id;
        
        $http.post('http://localhost:8080/yoyo-server/' + 'appraise/getAppraiseById.do',{},{params:{
            appraiseId:$scope.appraiseId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.appraise = data.result;
            }
        });
    }


    // 修改
    function AppraiseChangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.appraiseId = $location.search().id;

        $scope.backClick = function(){
            $location.path("/appraise/appraise-list");
        }

        $http.post('http://localhost:8080/yoyo-server/' + 'appraise/getAppraiseById.do',{},{params:{
            appraiseId:$scope.appraiseId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.appraise = data.result;
                console.log($scope.appraise);
            } else {
                $scope.showAlert(data.errorMessage);
                console.log($scope.appraise)
            }
        });


        $scope.changeappraise = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改邀请人')
                .ok('确定修改')
                .cancel('取消修改');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/yoyo-server/"+"appraise/modifyAppraise.do?",{},{params:{
                        appraiseId:$scope.appraise.appraiseId,
                        appraise:$scope.appraise.appraise,
                        hallName:$scope.appraise.hallName,
                        origin:$scope.appraise.origin,
                        introduce:$scope.appraise.introduce
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改邀请人成功");
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
                        $location.path('/appraise/appraise-list');
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
    function AppraiseAddCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.appraise = {};

        $scope.backClick = function(){
            $location.path("/appraise/appraise-list");
        }
        
        $scope.addappraise = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加邀请人')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/yoyo-server/"+"appraiseCode/addAppraiseUser.do?",{},{params:{
                        userId:$scope.appraise.userId,
                        userType:$scope.appraise.userType
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("添加邀请人成功");
                        } else {
                            $scope.showAlert1(data.errorMessage)
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
                    ).then(function(){
                        $location.path('/appraise/appraise-list');
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