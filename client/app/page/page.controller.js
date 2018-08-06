(function () {
    'use strict';

    angular.module('app.page')
    .controller('invoiceCtrl', ['$scope', '$window', invoiceCtrl])
    .controller('authCtrl', ['$scope', '$window', '$location','$http','$mdDialog','$timeout', authCtrl]);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;
        
        $scope.printInvoice = function() {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;        
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }

    function authCtrl($scope, $window, $location,$http,$mdDialog,$timeout) {
        
        //用户登录的方法
        $scope.login = function() {
            console.log($scope.admin)
            $http.post('http://localhost:8080/lifecrystal-server/' + 'admin/login.do',{},{params:{
             account:$scope.admin,
             password:$scope.password
         }}).success(function (data) {
                console.log(data);
             if (data.successCode == 100200) {
                console.log(data.result.authorityList);
                console.log(data.result.adminId);
                //获取权限列表，放进数组中
                $scope.authorityList = data.result.authorityList;
                $scope.authoritySet = [];
                for (var i = 0; i < $scope.authorityList.length; i++) {
                    console.log("pageUrl =="+ $scope.authorityList[i]);
                    $scope.authoritySet.push($scope.authorityList[i]);
                }
                sessionStorage.adminId = data.result.adminId;
                sessionStorage.username = $scope.admin; 
                sessionStorage.authoritySet = $scope.authoritySet;
                console.log($scope.authoritySet);
                $scope.showAlert("登录成功,点击确定按钮进入主页");
            } else {
                $scope.showAlert1(data.errorMessage)
            }

        });    
     }   


     $scope.showAlert = function(txt) {
             // dialog
             $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(false)
                .title(txt)
                .ok('确定')
                ).then(function(){
                    $location.path('/dashboard');
                })
            }  

            
            $scope.showAlert1= function(txt) {
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
        // console.log(sessionStorage.username);
        $scope.adminName = sessionStorage.username;
        $scope.loginout = function(){
            sessionStorage.clear();
            $location.path('/page/signin');
        }          
    }

})(); 



