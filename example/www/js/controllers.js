angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, ionPullUpFooterState) {
      $scope.onFooterExpand = function() {
        console.log('Footer expanded');
      };
      $scope.onFooterCollapse = function() {
          console.log('Footer collapsed');
      };

      $scope.expand = function() {
        $scope.footerState = ionPullUpFooterState.EXPANDED;  
      };
      
      $scope.disableTap = function() {
        $scope.enable = false;
      }
      $scope.enableTap = function() {
        $scope.enable = true;
      }
      $scope.enable = true;
  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('PageCtrl', function($scope) {
   
});
