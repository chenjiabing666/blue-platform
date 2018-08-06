(function(){
	// 'deal strick'

	angular.module('app.deal',[])
    .controller('DealCtrl', ['$scope','$http','$mdDialog','$location','$timeout',DealCtrl])
    .controller('CompleteTaskCtrl', ['$scope','$http','$mdDialog','$location','$timeout',CompleteTaskCtrl])
    .controller('DealDetailCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DealDetailCtrl])
    .controller('DealchangeCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DealchangeCtrl])
    .controller('DealAddCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',DealAddCtrl])
    .controller('RechargeCtrl', ['$scope','$http','$mdDialog','$location','$timeout',RechargeCtrl])
    .controller('DivideIntoCtrl', ['$scope','$http','$mdDialog','$location','$timeout',DivideIntoCtrl])
    .controller('TaskDealCtrl', ['$scope','$http','$mdDialog','$location','$timeout',TaskDealCtrl])
    .filter('parsePayType',function() {
            return function(input){
                if(input == 1){
                    return '支付宝';
                }else{
                    return '余额';
                }
            }

        })
    .filter('parseDealStatus',function() {
            return function(input){
                if(input == 1){
                    return '已完成';
                }else if(input == 2){
                    return '未完成';
                }else{
                    return '';
                }
            }

    })
    .filter('parseDealType',function() {
            return function(input){
                if(input == 1){
                    return '发单';
                }else if(input == 2){
                    return '充值';
                }else if(input == 3){
                    return '提现';
                }else if(input == 4){
                    return '购买普通vip';
                }else if(input == 5){
                    return '购买钻石vip';
                }else if(input == 6){
                    return '送礼物';
                }else if(input == 7){
                    return '收礼物';
                }else if(input == 10){
                    return '奖励';
                }else if(input == 11){
                    return '提现手续费';
                }else if(input == 12){
                    return '订单退款';
                }
            }

        })
    .filter('parseUserType',function() {
            return function(input){
                if(input == 1){
                    return '发单方经纪人';
                }else if(input == 2){
                    return '发单方邀请人';
                }else if(input == 3){
                    return '接单方';
                }else if(input == 4){
                    return '接单方经纪人';
                }else if(input == 5){
                    return '接单方推荐人';
                }else if(input == 6){
                    return '平台';
                }
            }

        })
    .filter('parseTaskDealStatus',function() {
            return function(input){
                if(input == 1){
                    return '未支付';
                }else if(input == 2){
                    return '待处理';
                }else if(input == 3){
                    return '待完成';
                }else if(input == 4){
                    return '已完成';
                }else if(input == 5){
                    return '已取消';
                }
            }

        })
    .filter('parseTaskDealType',function() {
            return function(input){
                if(input == 4){
                    return '线上单';
                }else {
                    return '线下单';
                }
            }

        })

        

    function DealCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwDealId = '';
        $scope.kwUserlId = '';
        $scope.kwUserMobile = '';
        $scope.kwDealType = '';
        $scope.kwPayType = '';
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
        $scope.dealLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "6") {
                $scope.isShow = 1;
            }
        }
        function getDealList(pageNum, pageSize){

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/gatBalanceList.do',{},{params:{
                userId:$scope.kwUserId,
                dealId:$scope.kwDealId,
                userMobile:$scope.kwUserMobile,
                dealType:$scope.kwDealType,
                payType:$scope.kwPayType,
                startTime:$scope.KwStartTime,
                endTime:$scope.KwEndTime,
                pageNum:pageNum,
                pageSize:pageSize,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.dealLists=data.result;
                    $scope.stores=data.result;
                    $scope.deal=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    $scope.totalExpenditure = data.totalExpenditure;
                    $scope.totalIncome = data.totalIncome;
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["交易ID","交易类型","昵称","手机号","密码",];
            obj.titleForKey = ["dealId","dealType","nickName","mobile","password",];
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
            downloadLink.download = "交易列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getDealList(page, $scope.numPerPage);
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

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/gatBalanceList.do',{},{params:{
                userId:$scope.kwUserId,
                dealId:$scope.kwDealId,
                userMobile:$scope.kwUserMobile,
                dealType:$scope.kwDealType,
                payType:$scope.kwPayType,              
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.totalExpenditure = data.totalExpenditure;
                    $scope.totalIncome = data.totalIncome;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchDeal(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchDeal(page,$scope.numPerPage);
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


                      var deal = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[deal.dealId];

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


                      var deal = $scope.currentPageStores[i];



        updateSelectedByStatus(deal.dealId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteDealBatch.do";// 接收上传文件的后台地址
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

       $scope.searchDeal = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.dealId = $("#dealId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealList.do',{},{params:{
            dealId:$scope.kwDealId,
            nickName:$scope.kwNickName,
                    deal:$scope.kwDeal,
                    dealId:$scope.kwDealId,
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

        
        
        // 删除交易
        $scope.deleteDeal = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条交易员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"deal/deleteDeal.do?",{},{params:{
                        dealId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除交易成功");
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
                .title('是否确定设置该交易为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        dealId:id,
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


    function CompleteTaskCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwDealId = '';
        $scope.kwUserId = '';
        $scope.kwUserMobile = '';
        $scope.kwDealType = '';
        $scope.kwPayType = '';
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
        $scope.dealLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "23") {
                $scope.isShow = 1;
            }
        }

        function getDealList(pageNum, pageSize){
            $http.post('http://localhost:8080/yoyo-server/' + 'deal/gatBalanceList.do',{},{params:{
                userId:$scope.kwUserId,
                dealId:$scope.kwDealId,
                userMobile:$scope.kwUserMobile,
                dealType:-2,
                status:1,
                payType:$scope.kwPayType,
                startTime:$scope.KwStartTime,
                endTime:$scope.KwEndTime,
                pageNum:pageNum,
                pageSize:pageSize,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.dealLists=data.result;
                    $scope.stores=data.result;
                    $scope.deal=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total; 
                    $scope.totalExpenditure = data.totalExpenditure;
                    $scope.totalIncome = data.totalIncome;                   
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["交易ID","交易类型","昵称","手机号","密码",];
            obj.titleForKey = ["dealId","dealType","nickName","mobile","password",];
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
            downloadLink.download = "交易列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getDealList(page, $scope.numPerPage);
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

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/gatBalanceList.do',{},{params:{
                userId:$scope.kwUserId,
                dealId:$scope.kwDealId,
                userMobile:$scope.kwUserMobile,
                dealType:-2,
                status:1,
                payType:$scope.kwPayType,              
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.totalExpenditure = data.totalExpenditure;
                    $scope.totalIncome = data.totalIncome;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchDeal(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchDeal(page,$scope.numPerPage);
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


                      var deal = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[deal.dealId];

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


                      var deal = $scope.currentPageStores[i];



        updateSelectedByStatus(deal.dealId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteDealBatch.do";// 接收上传文件的后台地址
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

       $scope.searchDeal = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.dealId = $("#dealId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealList.do',{},{params:{
            dealId:$scope.kwDealId,
            nickName:$scope.kwNickName,
                    deal:$scope.kwDeal,
                    dealId:$scope.kwDealId,
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

        
        
        // 删除交易
        $scope.deleteDeal = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条交易员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"deal/deleteDeal.do?",{},{params:{
                        dealId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除交易成功");
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
                .title('是否确定设置该交易为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        dealId:id,
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
    function DealDetailCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.backClick = function(){
            if($location.search().pageType==1){
                $location.path('/deal/deal-list');
            }else if($location.search().pageType==2){
                $location.path('/deal/recharge-list');
            }else if($location.search().pageType==3){
                $location.path('/deal/divide-into-list');
            }
            
        }

        $scope.dealId = $location.search().id;
        
        $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealById.do',{},{params:{
            dealId:$scope.dealId
        }}).success( function (data){
            if(data.errorCode == 0){
                $scope.deal = data.result;
            }
        });
    }


    // 修改
    function DealchangeCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.dealId = $location.search().id;

        $scope.backClick = function(){
            $location.path("/deal/deal-list");
        }

        $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealById.do',{},{params:{
            dealId:$scope.dealId
        }}).success( function (data){
                if(data.errorCode == 0){
                    $scope.deal = data.result;
                    console.log($scope.deal);
                } else {
                    $scope.showAlert(data.errorMessage);
                    console.log($scope.deal)
                }
            });


        $scope.changedeal = function(){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定修改交易')
                .ok('确定修改')
                .cancel('取消修改');

                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/yoyo-server/"+"deal/modifyDeal.do?",{},{params:{
                        dealId:$scope.deal.dealId,
                        deal:$scope.deal.deal,
                        hallName:$scope.deal.hallName,
                        origin:$scope.deal.origin,
                        introduce:$scope.deal.introduce
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("修改交易成功");
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
                    $location.path('/deal/deal-list');
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
    function DealAddCtrl($scope,$http,$location,$mdDialog,$timeout){

        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('')
            }
        }
        $timeout($scope.login(),10)

        $scope.deal = {};

        $scope.backClick = function(){
            $location.path("/deal/deal-list");
        }
        
        $scope.adddeal = function(){

            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定添加交易')
                .ok('确定添加')
                .cancel('取消添加');
                $mdDialog.show(confirm).then(function() {

                    $http.post("http://localhost:8080/yoyo-server/"+"deal/addDeal.do?",{},{params:{
                        deal:$scope.deal.deal,
                        hallName:$scope.deal.hallName,
                        origin:$scope.deal.origin,
                        introduce:$scope.deal.introduce
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("添加交易成功");
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
                    $location.path('/deal/deal-list');
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



    //收入账
    function DivideIntoCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwDealId = '';
        $scope.kwUserlId = '';
        $scope.kwUserMobile = '';
        $scope.kwDealType = '';
        $scope.kwPayType = '';
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
        $scope.dealLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "8") {
                $scope.isShow = 1;
            }
        }
        
        $scope.dealId = $location.search().id;
        $scope.pageType = $location.search().pageType;
        $scope.backClick = function(){
            if($scope.pageType == 3){
                $location.path('/deal/taskDeal-list');
            }else{
                $location.path('/deal/completeTask-list');
            }
        }
        function getDealList(pageNum, pageSize){

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealListById.do',{},{params:{
                dealId:$scope.dealId,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.dealLists=data.result;
                    $scope.stores=data.result;
                    $scope.deal=data.result;
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
            obj.title = ["交易ID","交易类型","昵称","手机号","密码",];
            obj.titleForKey = ["dealId","dealType","nickName","mobile","password",];
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
            downloadLink.download = "交易列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getDealList(page, $scope.numPerPage);
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

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealListById.do',{},{params:{
                dealId:$scope.dealId,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchDeal(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchDeal(page,$scope.numPerPage);
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


                      var deal = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[deal.dealId];

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


                      var deal = $scope.currentPageStores[i];



        updateSelectedByStatus(deal.dealId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteDealBatch.do";// 接收上传文件的后台地址
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

       $scope.searchDeal = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.dealId = $("#dealId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealList.do',{},{params:{
            dealId:$scope.kwDealId,
            nickName:$scope.kwNickName,
                    deal:$scope.kwDeal,
                    dealId:$scope.kwDealId,
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

        
        
        // 删除交易
        $scope.deleteDeal = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条交易员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"deal/deleteDeal.do?",{},{params:{
                        dealId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除交易成功");
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
                .title('是否确定设置该交易为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        dealId:id,
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


    //收入账
    function RechargeCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwDealId = '';
        $scope.kwUserlId = '';
        $scope.kwUserMobile = '';
        $scope.kwDealType = '-1';
        $scope.kwPayType = '';
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
        $scope.dealLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "7") {
                $scope.isShow = 1;
            }
        }


        function getDealList(pageNum, pageSize){

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/gatBalanceList.do',{},{params:{
                userId:$scope.kwUserId,
                dealId:$scope.kwDealId,
                userMobile:$scope.kwUserMobile,
                dealType:$scope.kwDealType,
                startTime:$scope.KwStartTime,
                endTime:$scope.KwEndTime,
                payType:1,
                pageNum:pageNum,
                pageSize:pageSize,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.dealLists=data.result;
                    $scope.stores=data.result;
                    $scope.deal=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    $scope.totalExpenditure = data.totalExpenditure;
                    $scope.totalIncome = data.totalIncome;
                }else {
                    $scope.currentPageStores = null;    
                }
            });
        }

        $scope.export = function(){
            var obj = {title:"", titleForKey:"", data:""};
            obj.title = ["交易ID","交易类型","昵称","手机号","密码",];
            obj.titleForKey = ["dealId","dealType","nickName","mobile","password",];
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
            downloadLink.download = "交易列表.csv"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
        }

        function select(page) {
            getDealList(page, $scope.numPerPage);
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

            $http.post('http://localhost:8080/yoyo-server/' + 'deal/gatBalanceList.do',{},{params:{
                userId:$scope.kwUserId,
                dealId:$scope.kwDealId,
                userMobile:$scope.kwUserMobile,
                dealType:-1,
                payType:1,              
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.totalExpenditure = data.totalExpenditure;
                    $scope.totalIncome = data.totalIncome;
                    console.log($scope.stores);
                    $scope.search();
                    // $scope.searchDeal(1,$scope.numPerPage);
                    $scope.currentPageStores = $scope.stores;
                    // $scope.searchDeal(page,$scope.numPerPage);
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


                      var deal = $scope.currentPageStores[i];

        isSelectedAll &= $scope.selected[deal.dealId];

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


                      var deal = $scope.currentPageStores[i];



        updateSelectedByStatus(deal.dealId, $scope.isSelectedAll);

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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteDealBatch.do";// 接收上传文件的后台地址
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

       $scope.searchDeal = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.dealId = $("#dealId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'deal/getDealList.do',{},{params:{
            dealId:$scope.kwDealId,
            nickName:$scope.kwNickName,
                    deal:$scope.kwDeal,
                    dealId:$scope.kwDealId,
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

        
        
        // 删除交易
        $scope.deleteDeal = function(id){
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm()
                .title('是否确定删除该条交易员信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定')
                            .cancel('取消');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/yoyo-server/"+"deal/deleteDeal.do?",{},{params:{
                        dealId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除交易成功");
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
                .title('是否确定设置该交易为精英')
                .ok('确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function(){
                    $http.post("http://localhost:8080/yoyo-server/"+"elite/addElite.do?",{},{params:{
                        dealId:id,
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


    function TaskDealCtrl($scope,$http,$mdDialog,$location,$timeout){
        $scope.login = function(){
            if(sessionStorage.adminId == undefined){
                $location.path('/page/signin')
            }
        }

        $timeout($scope.login(),10)

        var init;

        $scope.stores = [];
        $scope.kwtOutOrderNo = '';
        $scope.kwFMobile = '';
        $scope.kwTMobile = '';
        $scope.kwPayType = '';
        $scope.kwTaskTypeId = '';
        $scope.kwStatus = '';
        $scope.KwCreatedStartTime = '';
        $scope.KwCreatedEndTime = '';
        $scope.KwCompleteStartTime = '';
        $scope.KwCompleteEndTime = '';
        $scope.filteredStores = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.search = search;
        $scope.numPerPageOpt = [20, 50, 100, 200];
        $scope.numPerPage = $scope.numPerPageOpt[0];
        $scope.currentPage = 1;
        $scope.currentPage = [];
        $scope.taskLists = [];

        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "15") {
                $scope.isShow = 1;
            }
        }


        function gettaskList(pageNum, pageSize){
                $scope.kwtTaskTitle = $("#taskTitle").val();
            $http.post('http://localhost:8080/yoyo-server/' + 'task/getTaskDealList.do',{},{params:{
                outOrderNo:$scope.kwtOutOrderNo,
                fMobile:$scope.kwFMobile,
                tMobile:$scope.kwTMobile,
                payType:$scope.kwPayType,
                taskTypeId:$scope.kwTaskTypeId,
                status:$scope.kwStatus,
                createdStartTime:$scope.KwCreatedStartTime,
                createdEndTime:$scope.KwCreatedEndTime,
                completeStartTime:$scope.KwCompleteStartTime,
                completeEndTime:$scope.KwCompleteEndTime,
                pageNum:pageNum,
                pageSize:pageSize
                
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    //console.log("data.result");
                    //console.log(data.result[1].duration);
                    $scope.taskLists=data.result;
                    $scope.stores=data.result;
                    $scope.task=data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    $scope.sumPrice = data.totalIncome;
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
            $http.post('http://localhost:8080/yoyo-server/' + 'task/getTaskDealList.do',{},{params:{
                pageNum:1,
                pageSize:$scope.numPerPage,
            }}).success(function (data) {
                if (data.errorCode == 0) {
                    $scope.stores=data.result;
                    $scope.total = data.total;
                    $scope.sumPrice = data.totalIncome;
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


                var modifyTopicUrl ="http://localhost:8080/yoyo-server/"+"batch/deleteTaskBatch.do";// 接收上传文件的后台地址
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

       $scope.searchtask = function(pageNum,pageSize){
           $scope.isSearch = true;

           $scope.taskId = $("#taskId").val();
           $scope.nickName = $("#nickName").val();
           /*$scope.csName = $("#csName").val();*/
           console.log($scope.nickName)


           /* $scope.name = $("#name").val();*/
           $scope.mobile = $("#mobile").val();



           $http.post('http://localhost:8080/yoyo-server/' + 'task/gettaskList.do',{},{params:{
            taskId:$scope.kwtaskId,
            nickName:$scope.kwNickName,
                    task:$scope.kwtask,
                    taskId:$scope.kwtaskId,
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
                    $http.post("http://localhost:8080/yoyo-server/"+"task/deleteTask.do?",{},{params:{
                        taskId:id
                    }}).success(function (data){
                        if(data.errorCode == 0){
                            $scope.showAlert("删除订单成功");
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
                        taskId:id,
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





})();