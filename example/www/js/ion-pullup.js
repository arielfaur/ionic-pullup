angular.module('ionic-pull-up', [])
  .directive('ionPullUpFooter', ['$timeout', function($timeout) {
      return {
          restrict: 'AE',
          transclude: true,
          template: '<ng-transclude style="width: 100%;"></ng-transclude>',
          scope: {
              onExpand: '&',
              onCollapse: '&',
              onMinimize: '&',
              minimize: '='
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
                  lastPosY = $scope.minimize ? expandedHeight : (expandedHeight - headerHeight);
                  $element.css('transform', 'translate3d(0, ' + lastPosY  + 'px, 0)');
                  $scope.minimize ? $scope.onMinimize() : $scope.onCollapse();
              }

              //function minimize() {
              //    lastPosY = expandedHeight;
              //    $element.css('transform', 'translate3d(0, ' + lastPosY  + 'px, 0)');
              //    $scope.onMinimize();
              //}

              this.setHandleHeight = function(height) {
                  handleHeight = height;
                  computeHeights();
              };

              this.getHeight = function() {
                  return $element[0].offsetHeight;
              };

              this.getBackground = function() {
                return window.getComputedStyle($element[0]).background;
              };

              this.onTap = function(e) {
                  e.gesture.srcEvent.preventDefault();
                  e.gesture.preventDefault();

                  if (!isExpanded) {
                      expand();
                  } else {
                      collapse();
                  }

                  isExpanded = !isExpanded;
              };

              this.onDoubleTap = function(e) {
                  e.gesture.srcEvent.preventDefault();
                  e.gesture.preventDefault();
                  minimize();
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
          require: '^ionPullUpFooter',
          link: function (scope, element, attrs, controller) {
              var hasHandle = element.parent().find('ion-pull-up-handle').length > 0,
                footerHeight = controller.getHeight();
              element.css({'display': 'block', 'margin-top': hasHandle ? 0 : footerHeight + 'px'});
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
          require: '^ionPullUpFooter',
          link: function (scope, element, attrs, controller) {
              // add gesture
              $ionicGesture.on('tap', controller.onTap, element);
              $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
          }
      }
  }])
  .directive('ionPullUpHandle', [function() {
      return {
          restrict: 'AE',
          scope: {
          },
          require: '^ionPullUpFooter',
          link: function (scope, element, attrs, controller) {
              var height = element.css('height'),
                background =  controller.getBackground();

              controller.setHandleHeight(parseInt(height, 10));

              element.css({
                  display: 'block',
                  background: background,
                  position: 'relative',
                  bottom: height,
                  margin: '0 auto'
                  });

          }
      }
  }]);