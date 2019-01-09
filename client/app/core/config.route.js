(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var routes, setRoutes;

            routes = [
                'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                'chart/charts', 'chart/flot', 'chart/chartjs',
                'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                'app/calendar',
                'user/user-list','user/user-add','user/user-change','user/user-detail','user/user-bindDecedent',
                'expert/expert-list','expert/expert-add','expert/expert-change','expert/expert-detail','expert/expert-bindDecedent','expert/skill-list','expert/skill-add','expert/skill-detail',
                'invitation/invitation-list','invitation/agent-list','invitation/invitation-user-list','invitation/invitation-add',
                'invitation/invitation-change','invitation/invitation-detail','invitation/agent-change',
                'admin/admin-list','admin/admin-add','admin/admin-change',
                'recommend/recommend-list','recommend/recommend-add','recommend/recommend-change',
                'application/application-list','application/application-add','application/application-change','application/application-detail','application/application-recommend','application/application-export',
                'setting/setting-change','setting/customize-page','setting/home-page','setting/page-add','setting/page-list',
                'teacher/teacher-list','teacher/teacher-add','teacher/teacher-detail','teacher/teacher-change',
                'taskKind/taskKind-list','taskKind/taskKind-add','taskKind/taskKind-detail','taskKind/taskKind-change','taskKind/taskKind-appList',
                'clazz/clazz-list','clazz/clazz-add','clazz/clazz-detail','clazz/clazz-change',
                'message/message-list','message/message-detail','message/message-change','message/message-add',
                'browse/browse-list','browse/browse-add','browse/browse-detail','browse/browse-message','browse/share-list',
                'taskDuration/taskDuration-list','taskDuration/taskDuration-add','taskDuration/taskDuration-detail','taskDuration/taskDuration-change',
                'taskReward/taskReward-list','taskReward/taskReward-add','taskReward/taskReward-detail','taskReward/taskReward-change','taskReward/agent-list','taskReward/swot-add','taskReward/swot-list','taskReward/compete-change','taskReward/position-list','taskReward/position-add','taskReward/position-change','taskReward/radar-change','taskReward/agent-change','taskReward/position-edit','taskReward/swot-change','taskReward/swot-common-list','taskReward/swot-common-add',
                'task/task-list','task/custom-task-list','task/task-add','task/task-detail','task/task-change','task/task-deal',
                'feedback/feedback-list','feedback/feedback-add','feedback/feedback-detail','feedback/feedback-change',
                'report/report-list','report/report-change',
                'appraise/appraise-list','appraise/appraise-add','appraise/appraise-detail','appraise/appraise-change',
                'settingApp/settingApp-detail','settingApp/order-price-list','settingApp/order-price-change','settingApp/order-price-add',
                'settingApp/documents-list','settingApp/documents-add','settingApp/documents-change',
                'deal/deal-list','deal/completeTask-list','deal/deal-detail','deal/recharge-list','deal/divide-into-list','deal/taskDeal-list',
                'authentication/authentication-list','authentication/authentication-detail',
                'transfer/transfer-list','transfer/transfer-detail',
                'banner/banner-list','banner/banner-add','banner/banner-detail','banner/banner-change',
                'question/question-list','question/question-add','question/question-detail','question/question-change',
                'cancelReason/cancelReason-list','cancelReason/cancelReason-add','cancelReason/cancelReason-change','cancelReason/cancelReason-detail',
                'rule/rule-list','rule/rule-add','rule/rule-detail','rule/rule-change',
                'notice/notice-list','notice/notice-add','notice/notice-change','notice/notice-detail','notice/notice-bindUser','notice/notice-common',
                'image/image-list','video/video-list','setting/setting-list'


            ]   

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html',
                    params:{
                        listType:null,
                        id:null
                    }
                };
                $stateProvider.state(route, config);

                return $stateProvider;
            };

            routes.forEach(function(route) {
            return setRoutes(route);
            });

            $urlRouterProvider
                .when('/', '/dashboard')
                .otherwise('/dashboard');


            $stateProvider.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html'
            });

        }]
    );

})();
