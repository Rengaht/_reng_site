
var routerApp = angular.module('routerApp', ['ui.router','ngAnimate','angular-scroll-animate']);

routerApp.service('projectService', function($http){
    var pitems=null;
    var promise=$http.get("data/plist.json").success(function(data){
        pitems=data.items;     
        console.log('Get projects success!');        
    });
    return{
        promise:promise,        
        getItems:function(){
        	return pitems;
        }
    };
});

routerApp.service('cvService', function($http){
    var pitems=null;
    var promise=$http.get("data/cv_.json").success(function(data){
        pitems=data.items;     
        console.log('Get cv success!');        
    });
    return{
        promise:promise,        
        getItems:function(){
            return pitems;
        }
    };
});
routerApp.service('playService', function($http){
    var pitems=null;
    var promise=$http.get("data/play.json").success(function(data){
        pitems=data.items;     
        console.log('Get play success!');        
    });
    return{
        promise:promise,        
        getItems:function(){
            return pitems;
        }
    };
});

routerApp.service('scrollRevealService',function(){
    return{
        animateElementIn: function($el){
              $el.removeClass('hideToScroll');
              $el.addClass('scrollIn'); 
            },
        animateElementOut: function($el){
              $el.addClass('hideToScroll');
              $el.removeClass('scrollIn'); 
            }
    };
});

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partial/home.html',
            controller:'ProjectCtrl',
            resolve:{
                'ProjectData':function(projectService){
                    return projectService.promise;
                }
            }
        })
        .state('detail',{
            url:'/detail/:pid',
            templateUrl:'partial/detail.html',
            controller:'DetailCtrl'            
        })        
        .state('playground', {
            url: '/playground',
            templateUrl: 'partial/playground.html',
            controller:'PlayCtrl',
            resolve:{
                'PlayData':function(playService){
                    return playService.promise;
                }
            }
        })
        .state('cv', {
            url: '/cv',
            templateUrl: 'partial/cv.html',
            controller:'CVCtrl',
            resolve:{
                'cvData':function(cvService){
                    return cvService.promise;
                }
            }      
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'partial/contact.html'
        });        
});


routerApp.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);


routerApp.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
}]);

routerApp.run(function($rootScope,$state,$stateParams){
    $rootScope.$state=$state;
    $rootScope.$stateParams=$stateParams;
});

routerApp.directive('imageonload', function() {
    return {
        restrict: 'A',
      
        link: function(scope, element) {
          element.on('load', function() {
            // Set visibility: true + remove spinner overlay
              element.removeClass('spinner-hide');
              element.addClass('spinner-show');
              element.parent().find('span').remove();
          });
          scope.$watch('ngSrc', function() {
            // Set visibility: false + inject temporary spinner overlay
              // element.addClass('spinner-hide');
              // element.parent().append('<span class="spinner"></span>');
          });
        }
    };
});