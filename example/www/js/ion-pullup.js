angular.module('ionic-pull-up', [])
  .directive('ionPullUpFooter', ['$timeout', function($timeout) {
      return {
          restrict: 'AE',
          transclude: true,
          template: '<ng-transclude style="width: 100%;"></ng-transclude>',
          scope: {
              onExpand: '&',
              onCollapse: '&'
          },
          controller: function($scope, $element) {
              var isExpanded = false,
                expandedHeight,
                tabs = document.querySelector('.tabs'),
                hasBottomTabs = document.querySelector('.tabs-bottom'),
                header = document.querySelector('.bar-header'),
                tabsHeight = tabs ? tabs.offsetHeight : 0,
                headerHeight = header ? header.offsetHeight : 0,
                handleHeight = 0,
                posY = 0, lastPosY = 0;

              function computeHeights() {
                  $timeout(function() {
                      expandedHeight = window.innerHeight - headerHeight - handleHeight;
                      if (tabs) {
                          expandedHeight = expandedHeight - tabsHeight;
                      }
                      lastPosY = expandedHeight-headerHeight;
                      $element.css({'height': expandedHeight + 'px', 'transform': 'translate3d(0, ' + lastPosY  + 'px, 0)'});

                  }, 300);
              }

              function expand() {
                  lastPosY = 0;
                  $element.css('transform', 'translate3d(0, 0, 0)');
                  $scope.onExpand();
              }

              function collapse() {
                  lastPosY = expandedHeight-headerHeight;
                  $element.css('transform', 'translate3d(0, ' + lastPosY  + 'px, 0)');
                  $scope.onCollapse();
              }

              this.setHandleHeight = function(height) {
                  handleHeight = height;
                  computeHeights();
              };

              this.onTap = function(e) {
                  if (!isExpanded) {
                      expand();
                  } else {
                      collapse();
                  }

                  isExpanded = !isExpanded;
              };

              this.onDrag = function(e) {
                  e.gesture.srcEvent.preventDefault();
                  e.gesture.preventDefault();

                  switch (e.type) {
                      case 'dragstart':
                          $element.css('transition', 'none');
                          break;
                      case 'drag':
                          posY = Math.round(e.gesture.deltaY) + lastPosY;
                          if (posY < 0 || posY > expandedHeight) return;
                          $element.css('transform', 'translate3d(0, ' + posY + 'px, 0)');
                          break;
                      case 'dragend':
                          $element.css({'transition': '300ms ease-in-out'});
                          lastPosY = posY;
                          break;
                  }
              };

              window.addEventListener('orientationchange', function() {
                  isExpanded && collapse();
                  computeHeights();
              });

              computeHeights();
              $element.css({'-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden', 'transition': '300ms ease-in-out'});
              if (tabs && hasBottomTabs) {
                  $element.css('bottom', tabs.offsetHeight + 'px');
              }

          }
      }
  }])
  .directive('ionPullUpContent', [function() {
      return {
          restrict: 'AE',
          link: function (scope, element, attrs) {
              element.css('display', 'block');
              // add scrolling if needed
              if (attrs.scroll && attrs.scroll.toUpperCase() == 'TRUE') {
                  element.css({'overflow-y': 'scroll', 'overflow-x': 'hidden'});
              }
          }
      }
  }])
  .directive('ionPullUpTrigger', ['$ionicGesture', function($ionicGesture) {
      return {
          restrict: 'AE',
          scope: {},
          require: '^ionPullUpFooter',
          link: function (scope, element, attrs, controller) {
              // add gesture
              $ionicGesture.on('tap', controller.onTap, element);
              $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
          }
      }
  }])
  .directive('ionPullUpHandle', ['$ionicGesture', function($ionicGesture) {
      return {
          restrict: 'AE',
          scope: {
          },
          require: '^ionPullUpFooter',
          link: function (scope, element, attrs, controller) {
              var height = element.css('height'),
                background =  window.getComputedStyle(element.parent().parent()[0]).background;

              controller.setHandleHeight(parseInt(height, 10));

              element.css({
                  display: 'block',
                  background: background,
                  position: 'relative',
                  bottom: height,
                  margin: '0 auto'
                  });

              // add gesture
              $ionicGesture.on('tap', controller.onTap, element);
              $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
          }
      }
  }]);