(function () {
    'use strict';

    angular.module('app')
    .controller('AppCtrl', [ '$scope', '$rootScope', '$state', '$document', 'appConfig','$location','$timeout', AppCtrl]) // overall control
    .controller('HomeCtrl',['$scope','$http','$location','$timeout',HomeCtrl])
    .directive('line', function() {
        return {
          scope: {
            id: "@",
            legend: "=",
            item: "=",
            data: "="
          },
          restrict: 'E',
          template: '<div style="height:400px;"></div>',
          replace: true,
          link: function($scope, element, attrs, controller) {
            var option = {
              // 提示框，鼠标悬浮交互时的信息提示
              tooltip: {
                show: true,
                trigger: 'item'
              },
              // 图例
              legend: {
                data: $scope.legend
              },
              // 横轴坐标轴
              xAxis: [{
                type: 'category',
                data: $scope.item
              }],
              // 纵轴坐标轴
              yAxis: [{
                type: 'value'
              }],
              // 数据内容数组
              series: function(){
                var serie=[];
                for(var i=0;i<$scope.legend.length;i++){
                  var item = {
                    name : $scope.legend[i],
                    type: 'line',
                    data: $scope.data[i]
                  };
                  serie.push(item);
                }
                return serie;
              }()
            };
            var myChart = echarts.init(document.getElementById($scope.id),'macarons');
            myChart.setOption(option);
          }
        };
      })


    function AppCtrl($scope, $rootScope, $state, $document, appConfig,$location,$timeout) {
      
      $scope.login = function(){
        if(sessionStorage.adminId == undefined){
          $location.path('/page/signin')
        }
      }
      $timeout($scope.login(),10)

      $rootScope.isHome = 1;
      $rootScope.isUser = 1;
      $rootScope.isContent = 1;
      $rootScope.isReview = 1;
      $rootScope.isStatistics = 1;
      $rootScope.isLive = 1;
      $rootScope.isMall = 1;
      $rootScope.isPlatform = 1;
      $rootScope.isSystem = 1;


        

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;

        $scope.$watch('main', function(newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
            $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
            if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                $scope.main.fixedHeader = true;
                $scope.main.fixedSidebar = true;
            }
            if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                $scope.main.fixedHeader = false;
                $scope.main.fixedSidebar = false;
            }
            }
            if (newVal.fixedSidebar === true) {
            $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
            $scope.main.fixedSidebar = false;
            }
        }, true);


        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });
    }

    function HomeCtrl($scope,$http,$location,$timeout){
      $scope.login = function(){
        if(sessionStorage.adminId == undefined){
          $location.path('/page/signin')
        }
      }
      $timeout($scope.login(),10)
       $http.post('http://localhost:8080/xiaoxin-server/' + 'user/getUserList.do',{},{params:{
        pageNum:1,
        pageSize:1
       }}).success(function (data) {
       if (data.errorCode == 0) {
        
         $scope.userTotal = data.total;
         console.log($scope.userTotal);
           };
        });
    }

})(); 