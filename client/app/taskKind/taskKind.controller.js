(function(){
	// 'taskKind strick'

	angular.module('app.taskKind',[])
    .controller('TaskKindCtrl', ['$scope','$http','$mdDialog','$location','$timeout',TaskKindCtrl])
    .controller('TaskKindDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindDetailCtrl])
    .controller('TaskKindchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindchangeCtrl])
    .controller('TaskKindAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindAddCtrl])
    .controller('TaskKindAppCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',TaskKindAppCtrl])
    .filter('isDoing',function(){
        return function(input){
            if(input ==1){
                return '是';
            }else{
                return '否';
            }
        }
    })

    function TaskKindAppCtrl($scope,$http,$mdDialog,$location,$timeout){
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
            if (authoritySet[i] == "49") {
                $scope.isShow = 1;
            }
        }


        $scope.userId="";
        $scope.userName="";
        $scope.realName="";
        $scope.authDate="";
        $scope.provinceCode="";
        $scope.status="";



        //获取地区
        $http.post('http://localhost:8080/blue-server/' + 'address/getProvinces.do',{},{params:{
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.provinces=data.result;
                }
            });



        function getTaskKindList(pageNum, pageSize){

            $scope.authDate=$("#authDate").val();


            $http.post('http://localhost:8080/blue-server/' + 'app/getExaminList.do',{},{params:{
                
                pageNum:pageNum,
                pageSize:pageSize,
                userId:$scope.userId,
                userName:$scope.userName,
                realName:$scope.realName,
                provinceCode:$scope.provinceCode,
                authDate:$scope.authDate,
                status:$scope.status
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.taskKindLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskKind=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
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
            $http.post('http://localhost:8080/blue-server/' + 'app/getExaminList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    // $scope.search();
                    // $scope.searchTaskKind(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchTaskKind(page,$scope.numPerPage);
                    console.log($scope.stores);
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



                updateSelectedByStatus(taskKind.appId, $scope.isSelectedAll);

                        }



                  };


                  $scope.selectItem = function (id) {
            console.log("selectItem"  + id);


            updateSelected(id);

                  };

            $scope.showAlert = function(txt) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                        )

                    }

            //批量审核成功或者审核成功
            $scope.deleteList = function(status){

                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"app/exmain.do";// 接收上传文件的后台地址
                    console.log($scope.selected);
                    var temp = "";

                    var form = new FormData();

                    for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        if ($scope.selected[temp]==true) {
                            form.append("ids", temp);
                        }
                        
                        
                        // form.getTaskDetail
                    }
                    form.append("status",status);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                             var data=eval("("+xhr.responseText+")");

                             if (data.code==0) {
                                // console.log($scope.currentPageStores);
                                    for(var i in $scope.selected){
                                    temp = i;
                                    for (var i = $scope.currentPageStores.length - 1; i >= 0; i--) {
                                        if ($scope.currentPageStores[i].appId==temp) {
                                            console.log(status);
                                            $scope.currentPageStores[i].examinStatus=status;
                                        }
                                    }
                                    
                                 }
                                alert("审核成功")
                             }else{
                                // $scope.showAlert(data.message);
                                alert(data.message);
                             }

                             

                        } 


                    }
                    // init();
                    

                          // 确定
                

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



           $http.post('http://localhost:8080/blue-server/' + 'taskKind/getTaskKindList.do',{},{params:{
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
                    $http.post("http://localhost:8080/blue-server/"+"taskKind/deleteTaskKind.do?",{},{params:{
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
                    $http.post("http://localhost:8080/blue-server/"+"elite/addElite.do?",{},{params:{
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
        $scope.numPerPageOpt = [2, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.currentPage = [];
        $scope.taskKindLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "50") {
                $scope.isShow = 1;
            }
        }


        $scope.userId="";
        $scope.userName="";
        $scope.realName="";
        $scope.authDate="";
        $scope.provinceCode="";
        $scope.status="";



        // //获取地区
        // $http.post('http://localhost:8080/blue-server/' + 'address/getProvinces.do',{},{params:{
        //     }}).success(function (data) {
        //         if (data.code == 0) {
        //             $scope.provinces=data.result;
        //         }
        //     });



        function getTaskKindList(pageNum, pageSize){

            $scope.authDate=$("#authDate").val();


            $http.post('http://localhost:8080/blue-server/' + 'invoice/getInvoiceList.do',{},{params:{
                pageNum:pageNum,
                pageSize:pageSize,
                type:$scope.type,
                number:$scope.number,
                mobile:$scope.mobile,
                status:$scope.status,
                title:$scope.title,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.taskKindLists=data.result;
                    $scope.stores=data.result;
                    $scope.taskKind=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
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
            $http.post('http://localhost:8080/blue-server/' + 'invoice/getInvoiceList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores = $scope.stores;
                    console.log($scope.stores);
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



                updateSelectedByStatus(taskKind.userId, $scope.isSelectedAll);

                        }



                  };


                  $scope.selectItem = function (id) {
            console.log("selectItem"  + id);


            updateSelected(id);

                  };

            //批量审核成功或者审核成功
            $scope.deleteList = function(status){


                          // 确定
                var confirm = $mdDialog.confirm()
                            .title('是否确定批量审核')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定审核')
                            .cancel('取消审核');

                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')


                var modifyTopicUrl ="http://localhost:8080/blue-server/"+"user/exmain.do";// 接收上传文件的后台地址
                    console.log($scope.selected);
                    var temp = "";

                    var form = new FormData();

                    for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                        temp = i;
                        // console.log(temp);
                        form.append("ids", temp);
                        form.append("status",status);
                        // form.getTaskDetail
                    }

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", modifyTopicUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if(xhr.readyState == 4  && xhr.status == 200){
                             var data=eval("("+xhr.responseText+")");

                             if (data.code==0) {
                                    for(var i in $scope.selected){
                                    temp = i;
                                    for (var i = $scope.currentPageStores.length - 1; i >= 0; i--) {
                                        if ($scope.currentPageStores[i].userId==temp) {
                                            $scope.currentPageStores[i].examinStatus=status;
                                        }
                                    }
                                    // $(".delete-"+temp).css("display","none");
                                    //      $scope.total--;
                                 }
                                    $scope.showAlert("审核成功");
                             }else{
                                $scope.showAlert(data.message);
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




       // 搜索

       $scope.searchTaskKind = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskKindId = $("#taskKindId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/blue-server/' + 'taskKind/getTaskKindList.do',{},{params:{
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
        $scope.deleteTaskKind = function(id,status){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定操作')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/"+"invoice/modifyInvoice.do?",{},{params:{
                        invoiceId:id,
                        status:status
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("操作成功");
                            for (var i = 0; i < $scope.stores.length; i++) {
                                if ($scope.stores[i].invoiceId==id) {
                                    $scope.stores[i].status=status;
                                    break;
                                }
                            }
                        } else {
                            $scope.showAlert(data.message);
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
                    $http.post("http://localhost:8080/blue-server/"+"elite/addElite.do?",{},{params:{
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

        $scope.showAlert = function(txt) {
                 // dialog
                 $mdDialog.show(
                    $mdDialog.alert()

                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    );
                }

        $scope.taskKindId = $location.search().id;

        $http.post('http://localhost:8080/blue-server/' + 'user/getUser.do',{},{params:{
            userId:$scope.taskKindId
        }}).success( function (data){
            console.log($scope.taskKindId);
            if(data.code == 0){
                $scope.user = data.result;
    //             console.log("chenjiabing");
				console.log($scope.user);
            }else{
                $scope.showAlert(data.message);
            }
        });


        //下载营业执照
        $scope.download=function(path){
            console.log(path);
            window.location="http://localhost:8080/blue-server/user/download.do?relativePath="+path;
        //     $http.post('http://localhost:8080/blue-server/user/download.do',{},{params:{
        //     relativePath:path
        // }}).success( function (data){
        // });
        // }
    }

    }


    // 修改
    function TaskKindchangeCtrl($scope,$http,$location,$mdDialog,$timeout){
        

        //如果返回列表
        $scope.backClick = function () {
            $location.path("/taskKind/taskKind-appList");
        }

        $scope.showAlert = function (txt) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
            )

        }


        $scope.applicationId = $location.search().id;   //获取管理员Id
        

        //审核通过
        $scope.exmainPass=function(){
            //表单回显
        $http.post('http://localhost:8080/blue-server/' + 'app/examinPass.do',{},{params:{
            appId:$scope.applicationId   //管理员Id
        }}).success( function (data){   
            if(data.code == 0){
               $scope.showAlert("审核成功");
            } else {
                $scope.showAlert(data.message);
            }
        });

        }

        //审核失败
        $scope.exmainFail=function(){
            
        $http.post('http://localhost:8080/blue-server/' + 'app/examinFail.do',{},{params:{
            appId:$scope.applicationId   //管理员Id
        }}).success( function (data){   
            if(data.code == 0){
               $scope.showAlert("审核成功");
            } else {
                $scope.showAlert(data.message);
            }
        });

        }
        
        
        //表单回显
        $http.post('http://localhost:8080/blue-server/' + 'app/getAppDetailInfo.do',{},{params:{
            appId:$scope.applicationId   //管理员Id
        }}).success( function (data){   
            if(data.code == 0){
                // console.log(data.result)
                $scope.app=data.result.app;
                $scope.last=data.result.appVersion;
                // console.log($scope.last)
                $scope.historyVersions=data.result.historyVersions;
                $scope.images=data.result.images;
                $scope.appType=data.result.appType;
            } else {
                $scope.showAlert(data.message);
            }
        });

        //修改密码
        $scope.modifyPassword = function () {
            // console.log($scope.application);
            console.log($scope.application.newPassword==undefined);

            if (($scope.application.newPassword!=undefined&&$scope.application.newPassword!="")&&$scope.application.newPassword.length<6) {
                $scope.showAlert("密码不能少于6位")
                return;
            }

            if (($scope.application.newPassword!=undefined&&$scope.application.newPassword!="")&&$scope.application.newPassword!=$scope.application.confirmPassword) {
                $scope.showAlert("新密码和确认密码不同，请重新输入");
                return;
            }


            $http.post('http://localhost:8080/blue-server/' + 'application/modifApplication.do', {}, {
                params: {
                    email: $scope.application.email,
                    newPwd: $scope.application.newPassword,
                    account: $scope.application.account,
                    mobile:$scope.application.mobile,
                    activated:$scope.application.activated,
                    applicationId:$scope.application.applicationId
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.showAlert("修改成功");
                } else {
                    // $scope.currentPageStores=null;    //变成null，及时更新到页面中
                    // alert(data.message);
                    $scope.showAlert(data.message);
                }
            });

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
        

        $scope.type="";
        $scope.userName="";
        $scope.enterpriseName="";
        $scope.realName="";
        $scope.number="";
        $scope.registerCode="";
        $scope.contactPerson="";
        $scope.provinceCode="";
        $scope.contactAddress="";
        $scope.email="";
        $scope.contactMobile="";
        $scope.qq="";
        $scope.website="";

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "48") {
                $scope.isShow = 1;
            }
        }

        //获取地区信息

        $http.post('http://localhost:8080/blue-server/' + 'address/getProvinces.do',{},{params:{
            }}).success(function (data) {
                if (data.code == 0) {
                    $scope.provinces=data.result;
                    console.log($scope.provinces)
                }
            });


        $scope.addtaskKind = function(){
            $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否对同意认证并注册')
                            .ok('确定认证')
                            .cancel('取消认证');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var addTaskKindUrl ="http://localhost:8080/blue-server/" + "user/authentication.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("type", $scope.type);
                    form.append("userName", $scope.userName);
                    form.append("realName", $scope.realName);
                    form.append("enterpriseName", $scope.enterpriseName);
                    form.append("publishName", $scope.publishName);
                    form.append("number", $scope.number);

                    //如果是注册企业开发者
                    if ($scope.type==2) {
                        
                        for (var i = $scope.provinces.length - 1; i >= 0; i--) {
                            if ($scope.provinces[i].provinceCode==$scope.registerCode) {
                                form.append("registerAddress", $scope.provinces[i].provinceName);  //添加营业执照注册地址
                            }   
                        }

                        //添加营业执照
                        form.append("businessLicense", $scope.fileObj);
                    }else if ($scope.type==1) {}{   //个人开发者
                        form.append("idCardImage", $scope.fileObj);   //添加身份证图片
                    }

                    
                    
                    form.append("contactPerson", $scope.contactPerson);
                    form.append("contactMobile", $scope.contactMobile);
                    form.append("contactAddress", $scope.contactAddress);
                    form.append("email", $scope.email);
                    form.append("qq", $scope.qq);
                    form.append("website", $scope.website);
                    form.append("provinceCode", $scope.provinceCode);

                    

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addTaskKindUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        if (xhr.readyState == 4) {//4代表执行完成
                            if (xhr.status == 200) {//200代表执行成功
                            var data=eval("("+xhr.responseText+")");
                            if (data.code==0) {
                                $scope.showAlert("您的信息已成功提交审核！");
                            }else{
                                $scope.showAlert(data.message);
                             

                         }
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
                    )
                }
                $scope.showConfirm();
            }
        }


    })();
