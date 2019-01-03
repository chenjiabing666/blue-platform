(function() {
    // 'use strict';
    angular.module('app.question')
    .controller('QuestionCtrl', ['$scope', '$filter', '$http', '$mdDialog', QuestionCtrl])
    .controller('QuestionDetailCtrl', ['$scope', '$http', '$location', '$mdDialog', QuestionDetailCtrl])
    .controller('AddQuestionCtrl', ['$scope', '$http', '$mdDialog', AddQuestionCtrl]) //,'$upload'
    // .controller('ImageCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ImageCtrl])
    // .controller('AddImageCtrl', ['$scope', '$http', '$mdDialog', AddImageCtrl]) //,'$upload'
    .controller('ChangeQuestionCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeQuestionCtrl])
    
    function QuestionCtrl($scope, $filter, $http, $mdDialog) {
        var idTmr;

        function getExplorer() {
            var explorer = window.navigator.userAgent;
            //ie 
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
            //firefox 
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
            //Chrome
            else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            }
            //Opera
            else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            }
            //Safari
            else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        }
        var init;
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
        $scope.hstep = "理财一对一"
        $scope.options = ["理财一对一", "活动预览", "理财小常识"]
        $scope.activated1 = "是";
        $scope.activated2 = "否";



       // questionName,questionLocation,questionType,activated,startDate,endDate
       $scope.questionName="";
       $scope.questionLocation="";
       $scope.questionType="";
       $scope.activated="";
       $scope.startDate="";
       $scope.endDate="";
       $scope.platform="";


        $scope.getTable = function() {
            method1("newTable");
        }
        $scope.getallTable = function() {
            method1("allnewTable");
        }
        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "48") {
                $scope.isShow = 1;
            }
        }


        $http.post('http://localhost:8080/blue-server/' + 'module/getModuleList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: 50
                }
            }).success(function(data) {
                if (data.code == 0) {
                   $scope.moduleList=data.result;
                   console.log($scope.moduleList);
                };
            });


        //获取问题列表
        function getQuestionList(pageNum, pageSize) {
            

            $http.post('http://localhost:8080/blue-server/' + 'question/getQuestionListBack.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    content:$scope.content,
                    moduleId:$scope.moduleId,
                    status:$scope.status
                }
            }).success(function(data) {
                if (data.code == 0) {
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                }else{
                    $scope.stores = null;
                }
            });
        } 

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            console.log('$scope.numPerPage=='+$scope.numPerPage);
            getQuestionList(page, $scope.numPerPage);
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
            ////console.log($scope.stores);
            return $scope.onFilterChange();
        };


        //置顶
        $scope.topQuestion = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该问题确定置顶?')
                    
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/blue-server/' + 'question/topQuestion.do',
                        data: $.param({
                            questionId: id
                            // activated: 2
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        // console.log(data.errorCode)
                        if (data.code==0) {
                            $scope.showAlert("置顶成功");
                            init();
                            
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }




        // 上线
        $scope.makeEffect = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该问题是否上线')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/blue-server/' + 'question/upQuestion.do',
                        data: $.param({
                            questionId: id
                            // activated: 2
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        // console.log(data.errorCode)
                        if (data.code==0) {
                            $scope.showAlert("上线成功");
                            for(var i=0;i<$scope.stores.length;i++){
                                if ($scope.stores[i].questionId==id) {
                                    $scope.stores[i].activated=1;
                                    return;
                                }
                            };
                            
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
        
        // 下线
        $scope.makeUnEffect = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该问题是否下线')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/blue-server/' + 'question/downQuestion.do',
                        data: $.param({
                            questionId: id
                            // activated: 1
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        if (data.code=0) {
                            $scope.showAlert("下线成功");
                            for(var i=0;i<$scope.stores.length;i++){
                                if ($scope.stores[i].questionId==id) {
                                    $scope.stores[i].activated=2;
                                    return;
                                }
                            };
                            // init();
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    })
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };
            
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
        init = function() {
            $http.post('http://localhost:8080/blue-server/' + 'question/getQuestionListBack.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage
                }
            }).success(function(data) {
                if (data.code == 0) {
                    // console.log(data.result);
                    // console.log("type:"+$scope.questionType);
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                };
            });
        };


        // 删除公告
        $scope.deleteQuestion = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除该问题')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http.post('http://localhost:8080/blue-server/' + 'question/deleteQuestionById.do', {}, {
                params: {
                    questionId:id
                }
            }).success(function(data) {
                if (data.code == 0) {
                    $scope.showAlert("删除成功");
                    $(".delete-"+id).remove();
                }else{
                    $scope.showAlert(data.message);
                }
            });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消删除问题");
                });
            };


            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
        // 搜索公告
        // $scope.searchQuestion = function(){
        //     $scope.questionName = $(".questionName").val();
        //     $scope.questionType = $(".questionType option:selected").text();
        //     // //console.log($scope.questionName);
        //     // //console.log($scope.questionType);
        //     switch($scope.questionType){
        //         case '主页question': $scope.questionType = 1;break;
        //         case '成功案例question'  : $scope.questionType = 2;break;
        //         case '活动介绍question': $scope.questionType = 3;break;
        //         case '员工风采question': $scope.questionType = 4;break;
        //         case '培训和发展question'  : $scope.questionType = 5;break;
        //         case '企业社会责任question': $scope.questionType = 6;break;
        //         case '行业殊荣question': $scope.questionType = 7;break;
        //     }
        //     //console.log($scope.questionType);
        //     $http.post('http://139.196.7.76:8080/chinatravel-server/' + 'Question/',{},{params:{
        //     }}).success(function (data){
        //     })
        // }
        // function initall(pageNum, pageSize) {
        //     $http({
        //         method: 'POST',
        //         url: 'http://localhost:8080/blue-server/' + 'question/getQuestionList.do',
        //         data: $.param({
        //             pageNum: 1,
        //             pageSize: 200
        //         }), //序列化参数
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //         }
        //     }).success(function(data) {
        //         if (data.errorCode == 0) {
        //             $scope.allstores = data.result;
        //         };
        //     });
        // }
        // initall();
        init();
    }

    function QuestionDetailCtrl($scope, $http, $location, $mdDialog) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)
        $scope.backClick = function() {
            $location.path('/Question/question-list');
        }
        $scope.cancelClick = function() {
            $(".question-detail input").attr('disabled', true);
            $(".questionType").css("display", "block");
            $(".questionTypeSelect").css("display", "none");
            $(".changeConfirm").css("display", "none");
            $(".cancelClick").css("display", "none");
            switch ($scope.question.type) {
                case '主页question':
                    $scope.questionType = 1;
                    break;
                case '成功案例question':
                    $scope.questionType = 2;
                    break;
                case '活动介绍question':
                    $scope.questionType = 3;
                    break;
                case '员工风采question':
                    $scope.questionType = 4;
                    break;
                case '培训和发展question':
                    $scope.questionType = 5;
                    break;
                case '企业社会责任question':
                    $scope.questionType = 6;
                    break;
                case '行业殊荣question':
                    $scope.questionType = 7;
                    break;
            }
        }
        $scope.questionId = $location.search().id;
        //console.log($location.search().id);
        //console.log($scope.questionId);
        $http.post('https://www.citsgbt.com/chinatravel-php/app/index.php?r=Question/GetQuestionById', {}, {
            params: {
                questionId: $scope.questionId
            }
        }).success(function(data) {
            if (data.errorCode == 0) {
                $scope.question = data.result;
                switch ($scope.question.type) {
                    case 1:
                        $scope.question.type = "首页question图";
                        break;
                }
            }
        })
        // 修改
        $scope.changeClick = function() {
            //console.log("修改")
            $(".question-detail input").attr('disabled', false);
            $(".questionId").attr('disabled', true);
            $(".questionType").css("display", "none");
            $(".cancelClick").css("display", "inline");
            $(".questionTypeSelect").css("display", "block");
            $(".changeConfirm").css("display", "block");
        }
        // 确认修改
        $scope.changeConfirm = function() {
            switch ($scope.question.type) {
                case '主页question':
                    $scope.questionType = 1;
                    break;
                case '成功案例question':
                    $scope.questionType = 2;
                    break;
                case '活动介绍question':
                    $scope.questionType = 3;
                    break;
                case '员工风采question':
                    $scope.questionType = 4;
                    break;
                case '培训和发展question':
                    $scope.questionType = 5;
                    break;
                case '企业社会责任question':
                    $scope.questionType = 6;
                    break;
                case '行业殊荣question':
                    $scope.questionType = 7;
                    break;
            }
            //console.log('id='+$scope.question.questionId);
            //console.log('type='+$scope.question.type);
            //console.log($scope.question.imageUrl);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改图片信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    //console.log('id='+$scope.question.questionId);
                    //console.log('type='+$scope.question.type);
                    //console.log($scope.question.imageUrl);
                    // $http.post("http://139.196.7.76:8080/chinatravel-server/"+"Question/modifyQuestion",{},{params:{
                    //     questionId:$scope.question.questionId,
                    //     type:$scope.question.type,
                    //     imageUrl:$scope.question.imageUrl
                    // }}).success(function (data){
                    //     if(data.errorCode == 0){
                    //         $scope.showAlert("修改图片信息成功");
                    //     } else {
                    //         $scope.showAlert1(data.errorMessage);
                    //     }
                    // })
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: "http://139.196.7.76:8080/chinatravel-server/" + "Question/ModifyQuestion",
                        data: {
                            questionId: $scope.question.questionId,
                            type: $scope.question.type,
                            imageUrl: $scope.question.imageUrl
                        },
                        success: function(data) {
                            if (data) {
                                $scope.showAlert("修改图片信息成功");
                            } else {
                                $scope.showAlert1(data.errorMessage);
                            }
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert1("取消修改图片信息");
                });
            };
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                ).then(function() {
                    $(".question-detail input").attr('disabled', true);
                    $(".questionType").css("display", "block");
                    $(".questionTypeSelect").css("display", "none");
                    $(".changeConfirm").css("display", "none");
                    $(".cancelClick").css("display", "none");
                    switch ($scope.question.type) {
                        case '主页question':
                            $scope.questionType = 1;
                            break;
                        case '成功案例question':
                            $scope.questionType = 2;
                            break;
                        case '活动介绍question':
                            $scope.questionType = 3;
                            break;
                        case '员工风采question':
                            $scope.questionType = 4;
                            break;
                        case '培训和发展question':
                            $scope.questionType = 5;
                            break;
                        case '企业社会责任question':
                            $scope.questionType = 6;
                            break;
                        case '行业殊荣question':
                            $scope.questionType = 7;
                            break;
                    }
                })
            }
            $scope.showAlert1 = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                ).then(function() {
                    switch ($scope.question.type) {
                        case '主页question':
                            $scope.questionType = 1;
                            break;
                        case '成功案例question':
                            $scope.questionType = 2;
                            break;
                        case '活动介绍question':
                            $scope.questionType = 3;
                            break;
                        case '员工风采question':
                            $scope.questionType = 4;
                            break;
                        case '培训和发展question':
                            $scope.questionType = 5;
                            break;
                        case '企业社会责任question':
                            $scope.questionType = 6;
                            break;
                        case '行业殊荣question':
                            $scope.questionType = 7;
                            break;
                    }
                })
            }
            $scope.showConfirm();
        }
    }

    function AddQuestionCtrl($scope, $http, $mdDialog, $location) {

        // //如果返回列表
        // $scope.backClick = function () {
        //     $location.path("/question/question-list");
        // }
        $scope.isShow = 0;
        var AuthoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < AuthoritySet.length; i++) {
            if (AuthoritySet[i] == "49") {
                $scope.isShow = 1;
            }
        }
        $scope.question = {
            'jumpUrl': ''
        };


        $scope.questionReasonFile="";
        $scope.adviseFile="";
        $scope.analysisFile="";

        //上传问题的文件
        $scope.doUploadPhoto = function(element) {
            $scope.questionFile = element.files[0];
        }

        $scope.doquestionReasonA = function(element) {
            $scope.questionReasonFileA = element.files[0];
            $scope.questionReasonFile=$scope.questionReasonFile+"1,";
        }

        $scope.doquestionReasonB = function(element) {
            $scope.questionReasonFileB = element.files[0];
            $scope.questionReasonFile=$scope.questionReasonFile+"2,";
        }

        $scope.doquestionReasonC = function(element) {
            $scope.questionReasonFileC = element.files[0];
            $scope.questionReasonFile=$scope.questionReasonFile+"3,";
        }

        $scope.doquestionReasonD = function(element) {
            $scope.questionReasonFileD = element.files[0];
            $scope.questionReasonFile=$scope.questionReasonFile+"4,";
        }

        $scope.doquestionReasonE = function(element) {
            $scope.questionReasonFileE = element.files[0];
            $scope.questionReasonFile=$scope.questionReasonFile+"5,";
        }


        $scope.doadviseA = function(element) {
            $scope.adviseFileA = element.files[0];
            $scope.adviseFile=$scope.adviseFile+"1,";
        }

        $scope.doadviseB = function(element) {
            $scope.adviseFileB = element.files[0];
            $scope.adviseFile=$scope.adviseFile+"2,";
        }

        $scope.doadviseC = function(element) {
            $scope.adviseFileC = element.files[0];
            $scope.adviseFile=$scope.adviseFile+"3,";
        }

        $scope.doadviseD = function(element) {
            $scope.adviseFileD = element.files[0];
            $scope.adviseFile=$scope.adviseFile+"4,";
        }

        $scope.doadviseE = function(element) {
            $scope.adviseFileE = element.files[0];
            $scope.adviseFile=$scope.adviseFile+"5,";
        }

        $scope.doanalysisA = function(element) {
            $scope.analysisFileA = element.files[0];
            $scope.analysisFile=$scope.analysisFile+"1,";
        }

        $scope.doanalysisB = function(element) {
            $scope.analysisFileB = element.files[0];
            $scope.analysisFile=$scope.analysisFile+"2,";
        }

        $scope.doanalysisC = function(element) {
            $scope.analysisFileC = element.files[0];
            $scope.analysisFile=$scope.analysisFile+"3,";
        }

        $scope.doanalysisD = function(element) {
            $scope.analysisFileD = element.files[0];
            $scope.analysisFile=$scope.analysisFile+"4,";
        }

        $scope.doanalysisE = function(element) {
            $scope.analysisFileE = element.files[0];
            $scope.analysisFile=$scope.analysisFile+"5,";
        }




        
        $http.post('http://localhost:8080/blue-server/' + 'module/getModuleList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: 50
                }
            }).success(function(data) {
                if (data.code == 0) {
                   $scope.moduleList=data.result;
                   console.log($scope.moduleList);
                };
            });


        



        //添加问题
        $scope.addQuestion = function() {
            //console.log($scope.question.file);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否添加问题')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    var addQuestionUrl = "http://localhost:8080/blue-server/" + "question/addQuestion.do"; // 接收上传文件的后台地址

                    


                    if ($scope.questionReasonFileA==undefined||$scope.questionReasonFileA==null) {
                        $scope.questionReasonFileA=null;
                    }

                    if ($scope.adviseFileA==undefined||$scope.adviseFileA==null) {
                        $scope.adviseFileA=null;
                    }

                    if ($scope.analysisFileA==undefined||$scope.analysisFileA==null) {
                        $scope.analysisFileA=null;
                    }

                    if ($scope.questionReasonFileB==undefined||$scope.questionReasonFileB==null) {
                        $scope.questionReasonFileB=null;
                    }

                    if ($scope.adviseFileB==undefined||$scope.adviseFileB==null) {
                        $scope.adviseFileB=null;
                    }

                    if ($scope.analysisFileB==undefined||$scope.analysisFileB==null) {
                        $scope.analysisFileB=null;
                    }


                    if ($scope.questionReasonFileC==undefined||$scope.questionReasonFileC==null) {
                        $scope.questionReasonFileC=null;
                    }

                    if ($scope.adviseFileC==undefined||$scope.adviseFileC==null) {
                        $scope.adviseFileC=null;
                    }

                    if ($scope.analysisFileC==undefined||$scope.analysisFileC==null) {
                        $scope.analysisFileC=null;
                    }

                    if ($scope.questionReasonFileD==undefined||$scope.questionReasonFileD==null) {
                        $scope.questionReasonFileD=null;
                    }

                    if ($scope.adviseFileD==undefined||$scope.adviseFileD==null) {
                        $scope.adviseFileD=null;
                    }

                    if ($scope.analysisFileD==undefined||$scope.analysisFileD==null) {
                        $scope.analysisFileD=null;
                    }

                    if ($scope.questionReasonFileE==undefined||$scope.questionReasonFileE==null) {
                        $scope.questionReasonFileE=null;
                    }

                    if ($scope.adviseFileE==undefined||$scope.adviseFileE==null) {
                        $scope.adviseFileE=null;
                    }

                    if ($scope.analysisFileE==undefined||$scope.analysisFileE==null) {
                        $scope.analysisFileE=null;
                    }

                    if ($scope.fileType==undefined||$scope.fileType==null) {
                        $scope.fileType="";
                    }


        //             $scope.questionReasonFile="";
        // $scope.adviseFile="";
        // $scope.analysisFile="";
                    var form = new FormData();
                    // form.append("page", $scope.question.page); // 可以增加表单数据 questionName
                    form.append("content", $scope.content);
                    // form.append("questionLocation", $scope.question.questionLocation);  
                    form.append("moduleId", $scope.moduleId);
                    form.append("fileType", $scope.fileType);
                    form.append("status", $scope.status);
                    form.append("file",$scope.questionFile);
                     form.append("questionReasonFlag",$scope.questionReasonFile);
                      form.append("adviseFileFlag",$scope.adviseFile);
                       form.append("analysisFileFlag",$scope.analysisFile);

                    form.append("answer",1);
                    form.append("quesionReason",$scope.questionReasonA);
                    form.append("advise",$scope.adviseA);
                    form.append("analysis",$scope.analysisA);
                    form.append("scoreLevel",$scope.levelA);
                    form.append("questionReasonFile",$scope.questionReasonFileA);
                    form.append("adviseFile",$scope.adviseFileA);
                    form.append("analysisFile",$scope.analysisFileA);
                    form.append("answerContent",$scope.contentA);

                    form.append("answer",2);
                    form.append("quesionReason",$scope.questionReasonB);
                    form.append("advise",$scope.adviseB);
                    form.append("analysis",$scope.analysisB);
                    form.append("scoreLevel",$scope.levelB);
                    form.append("questionReasonFile",$scope.questionReasonFileB);
                    form.append("adviseFile",$scope.adviseFileB);
                    form.append("analysisFile",$scope.analysisFileB);
                    form.append("answerContent",$scope.contentB);


                    form.append("answer",3);
                    form.append("quesionReason",$scope.questionReasonC);
                    form.append("advise",$scope.adviseC);
                    form.append("analysis",$scope.analysisC);
                    form.append("scoreLevel",$scope.levelC);
                    form.append("questionReasonFile",$scope.questionReasonFileC);
                    form.append("adviseFile",$scope.adviseFileC);
                    form.append("analysisFile",$scope.analysisFileC);
                    form.append("answerContent",$scope.contentC);


                    form.append("answer",4);
                    form.append("quesionReason",$scope.questionReasonD);
                    form.append("advise",$scope.adviseD);
                    form.append("analysis",$scope.analysisD);
                    form.append("scoreLevel",$scope.levelD);
                    form.append("questionReasonFile",$scope.questionReasonFileD);
                    form.append("adviseFile",$scope.adviseFileD);
                    form.append("analysisFile",$scope.analysisFileD);
                    form.append("answerContent",$scope.contentD);


                    form.append("answer",5);
                    form.append("quesionReason",$scope.questionReasonE);
                    form.append("advise",$scope.adviseE);
                    form.append("analysis",$scope.analysisE);
                    form.append("scoreLevel",$scope.levelE);
                    form.append("questionReasonFile",$scope.questionReasonFileE);
                    form.append("adviseFile",$scope.adviseFileE);
                    form.append("analysisFile",$scope.analysisFileE);
                    form.append("answerContent",$scope.contentE);

                    
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addQuestionUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        console.log(xhr.status);
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("问题添加成功");
                                    // // console.log("问题上传成功");
                                    // alert("问题上传成功");
                                }else{
                                    $scope.showAlert(date.message);
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
                            }
                        }
                    }
                }, function() {
                    $scope.showAlert("取消上传");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    // $location.path('/Question/question-list');
                });
            }
            $scope.showConfirm();
        }
    }

    function AddImageCtrl($scope, $http, $mdDialog, $location) {
        $scope.isAddImage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            console.log(authoritySet[i]);
            if (authoritySet[i] == "addImage") {
                $scope.isAddImage = 1;
            }
        }
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files;
            // console.log("$scope.fileObj");
            var files = $scope.fileObj;
            var files = Array.prototype.slice.call(files);
            // console.log(this);
            if (files.length > 6) {
                alert("最多同时只可上传6张图片");
                return;
            }
            files.forEach(function(file, i) {
                if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                var reader = new FileReader();
                var li = document.createElement("li");
                console.log(li);
                var a = document.createElement('a');
                $('.img-list').append($(li));
                $('.img-list li').append($(a));
                reader.onload = function() {
                    var result = this.result;
                    var img = new Image();
                    img.src = result;
                    console.log(result)
                    $(li).css('background-image', "url(" + result + ")");
                    $(a).text('X').css({
                        display: 'none'
                    });
                    $('.img-list li').hover(function() {
                        $(this).find('a').css({
                            display: 'block'
                        });
                    }, function() {
                        $(this).find('a').css({
                            display: 'none'
                        });
                    });
                    $('.img-list li a').click(function(event) {
                        var i = $(this).parent('li').index();
                        console.log(i);
                        var filearray = $scope.fileObj;
                        console.log(typeof(filearray));
                        $(filearray).splice(i, 1);
                        $(this).parent('li').remove();
                        console.log($scope.fileObj);
                    });
                };
                reader.readAsDataURL(file);
            })
        }
        $scope.addImage = function() {
            //console.log($scope.question.file);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否上传图片')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // $http.post("http://139.196.7.76:8080/chinatravel-server/"+"Question/addQuestion",{})
                    var addImageUrl = "http://localhost:8080/blue-server/" + "image/addImage.do"; // 接收上传文件的后台地址
                    // FormData 对象
                    var form = new FormData();
                    //console.log($scope.question.type);
                    form.append("file", $scope.fileObj);

                    var xhr = new XMLHttpRequest();
                    //console.log('111111111111');
                    var response;
                    xhr.open("post", addImageUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("上传图片成功");
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
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
    }

    function ImageCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.login = function() {
            if (sessionStorage.awardId == undefined) {
                $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)
        var init;
        $scope.stores = [];
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
        $scope.isListImage = 0;
        $scope.isAddImage = 0;
        $scope.isEditImage = 0;
        $scope.isDeleteImage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "listImage") {
                $scope.isListImage = 1;
            } else if (authoritySet[i] == "addImage") {
                $scope.isAddImage = 1;
            } else if (authoritySet[i] == "editImage") {
                $scope.isEditImage = 1;
            } else if (authoritySet[i] == "deleteImage") {
                $scope.isDeleteImage = 1;
            }
        }

        function getAwardList(pageNum, pageSize) {
            $http.post('http://localhost:8080/blue-server/' + 'image/getImageList.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
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
            getAwardList(page, $scope.numPerPage);
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
            //console.log($scope.stores);
            return $scope.onFilterChange();
        };
        init = function() {
            console.log($scope.numPerPage);
            $http.post('http://localhost:8080/blue-server/' + 'image/getImageList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage,
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    $scope.currentPageStores = $scope.stores;
                };
            });
        };
        // 删除管理员
        $scope.deleteImage = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除该条图片信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/blue-server/" + "image/deleteImage.do?", {}, {
                        params: {
                            imageId: id
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("删除图片成功");
                            $(".delete-" + id).css("display", "none");
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
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        //修改密码
        $scope.awardId = $location.search().id;
        $scope.awardName = $location.search().name;
        $scope.changeAward = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改密码')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/blue-server/" + "award/modifyAward.do?", {}, {
                        params: {
                            awardId: $scope.awardId,
                            awardName: $scope.awardName,
                            awardContent: $scope.awardContent
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("奖品修改成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消修改");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/award/award-list')
                })
            }
            $scope.showAlert1 = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        $scope.backClick = function() {
            $location.path("/image/image-list");
        }
        init();
    }

function ChangeQuestionCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }
    $scope.platform="" ;  //平台信息
    $scope.questionId = $location.search().id;

    $http.post("http://localhost:8080/blue-server/"+"question/getQuestionById.do?",{},{params:{
        questionId:$scope.questionId
    }}).success(function (data){
        if(data.code == 0){
            $scope.question = data.result;
            $scope.answerList=data.result.answers;
            console.log($scope.question);
        } else {
            $scope.showAlert1(data.message)
        }                        
    })

        $scope.searchShow=0;
        $scope.selectShow=0;
        $scope.appId="";  //应用的Id

        $scope.modApp=function(){
            $scope.selectShow=1;
        }

            $http.post('http://localhost:8080/blue-server/' + 'module/getModuleList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: 50
                }
            }).success(function(data) {
                if (data.code == 0) {
                   $scope.moduleList=data.result;
                   console.log($scope.moduleList);
                };
            });

        

    $scope.doadviseA = function(element) {
            $scope.adviseFileA = element.files[0];
    }

     $scope.doquestionReasonA = function(element) {
            $scope.questionFile = element.files[0];
    }

     $scope.doanalysisA = function(element) {
            $scope.analysisA = element.files[0];
    }




    $scope.changeQuestion = function(id){
        console.log(id)
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改该答案信息')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeQuestionUrl ="http://localhost:8080/blue-server/" + "question/modifyAnswer.do?";

                    var form = new FormData();
                     // form.append("page", $scope.question.questionPageLocation); // 可以增加表单数据 questionName
                    form.append("answerId",id);

                    for (var i = 0; i < $scope.answerList.length; i++) {
                        if ($scope.answerList[i].answerId==id) {
                            form.append("quesionReason", $scope.answerList[i].questionReason);
                            form.append("advise", $scope.answerList[i].advise);   
                            form.append("analysis",$scope.answerList[i].analysis);
                            form.append("content",$scope.answerList[i].content);
                            form.append("scoreLevel",$scope.answerList[i].scroeLevel);  //平台
                            break;
                        }
                    }


                    form.append("questionReasonFile", $scope.questionFile);   
                    form.append("adviseFile", $scope.adviseFileA);   
                    form.append("analysisFile", $scope.analysisA);   

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeQuestionUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("答案修改成功");
                                    // // console.log("问题上传成功");
                                    // alert("问题上传成功");
                                }else{
                                    $scope.showAlert(date.message);
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
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
                       // $location.path('/question/question-list');
                   }) 
                }    
                $scope.showConfirm();
            }
            $scope.backClick = function(){
                $location.path("/question/question-list");
            }

        }



})();
