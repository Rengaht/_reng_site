routerApp.controller('ProjectCtrl',function($scope,$window,$timeout,$location,$anchorScroll,
                                            projectService,scrollRevealService){
    

    $scope.project_list=projectService.getItems();
    $("body").css('background-color','white');
    $('.collapse').collapse("hide");

    $scope.gotoArea=function(text){
       if($location.hash()!==text) $location.hash(text);
       else{ $anchorScroll();}
    };

    $scope.colWidth;
    $scope.colNum;      

    $scope.updateWidth=function(){
      var containerWidth=$('.projectGrid').width();
      if(containerWidth>=800){
          $scope.colNum=3;
      }else{
        $scope.colNum=1;
      }
      $scope.colWidth=containerWidth/$scope.colNum;  
    };
    $scope.getPosition=function(size){    
      // if($scope.colNum==1)
      //   return {
      //       'width': ($scope.colWidth-10)+'px',                    
      //       'height': ($scope.colWidth*.6-10)+'px'
      //   }
      // else
        var mwid=Math.min(size[0],$scope.colNum);
        var mhei=Math.min(size[1],$scope.colNum);
        return {
              // 'top': (Math.floor(index/$scope.colNum) * $scope.colWidth)+'px',
              // 'left': ((index%$scope.colNum) * $scope.colWidth)+'px',   
              'width': ($scope.colWidth*mwid-10)+'px',                    
              'height': ($scope.colWidth*mhei-10)+'px'
        }
    };

    angular.element($window).bind('resize',function(){
      $scope.updateWidth();
      $scope.$apply();

    });
    $timeout(function() {
      $scope.updateWidth();
    },100);


    $scope.animateElementIn=scrollRevealService.animateElementIn;
    $scope.animateElementOut=scrollRevealService.animateElementOut;


});

routerApp.controller('DetailCtrl',
  function($scope,$stateParams,$http,$location,$anchorScroll,
           scrollRevealService){

    $('.collapse').collapse("hide");

    $scope.project;     
    $scope.id=$stateParams.pid;
    $scope.textClass="";
    $scope.textTagClass="";
   
    $http.get('data/detail/item_'+$stateParams.pid+'.json').success(function(data){        
        $scope.project=data;

         if($scope.project.dark){
            $("body").css('background-color','black');
            $scope.textClass="darkText";
            $scope.textTagClass="darkTagColor";
          }else{
            $("body").css('background-color','white');
          }
    });

    // /* scroll reveal */
    $scope.animateElementIn=scrollRevealService.animateElementIn;
    $scope.animateElementOut=scrollRevealService.animateElementOut;
    
    $scope.goTop=function(){
      $anchorScroll(0);
    };
    $scope.goBack=function(){
      $scope.$state.go('home');
    };

});

routerApp.controller('CVCtrl',
  function($scope,$stateParams,$http,$location,$anchorScroll,
           scrollRevealService,cvService){
    $("body").css('background-color','white');
    $('.collapse').collapse("hide");
    $scope.items=cvService.getItems();
    // /* scroll reveal */
    $scope.animateElementIn=scrollRevealService.animateElementIn;
    $scope.animateElementOut=scrollRevealService.animateElementOut;
    


});

routerApp.controller('PlayCtrl',
  function($scope,$stateParams,$http,$location,$anchorScroll,$window,$timeout,
           scrollRevealService,playService){
    
    $("body").css('background-color','#aaa');
    $('.collapse').collapse("hide");

    $scope.items=playService.getItems();
    // /* scroll reveal */
    $scope.animateElementIn=scrollRevealService.animateElementIn;
    $scope.animateElementOut=scrollRevealService.animateElementOut;
    
    $scope.colWidth;
    $scope.colNum;      
    
    $scope.show_group=[false,false];

    $scope.updateWidth=function(){
      var containerWidth=$('.playContainer').width();
      if(containerWidth>=800){
          $scope.colNum=4;
      }else{
        $scope.colNum=1;
      }
      $scope.colWidth=containerWidth/$scope.colNum;  
      
    };
    $scope.getPosition=function(size){    

        var mwid=Math.min(size[0],$scope.colNum);
        var mhei=Math.min(size[1],$scope.colNum);
        return {
              'width': ($scope.colWidth*mwid-10)+'px',                    
              'height': ($scope.colNum==1)?'auto':(($scope.colWidth*mhei-10)+'px')            
        }
    };

    angular.element($window).bind('resize',function(){
      $scope.updateWidth();
      $scope.$apply();
    });
    $timeout(function() {
      $scope.updateWidth();
    },100);

    // $scope.$watch(function(){return $('.playContainer').width();},
    //               function(oldval,newval){
    //                 if(newval!=oldval) $scope.updateWidth();
    // });
  
    $scope.showAnim=function(item){
      // if(item.link!==undefined) return;      
      // item.img=item.img.replace('png','gif');      
    };
    $scope.hideAnim=function(item){
      // if(item.link!==undefined) return;      
      // item.img=item.img.replace('gif','png');      
    };
    $scope.showDetail=function(item){
      if(item.show_group!==undefined){
        $scope.show_group[item.show_group]=!$scope.show_group[item.show_group];
      }      
    };
    $scope.hideDetail=function(item){
      if(item.show_group!==undefined){
        $scope.show_group[item.show_group]=false;
      }
    };

});