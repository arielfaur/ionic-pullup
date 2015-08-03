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
                defaultHeight = $element[0].offsetHeight,
                dragPrevHeight = defaultHeight,
                dragHeight = defaultHeight,
                expandedHeight,
                tabs = document.querySelector('.tabs'),
                hasBottomTabs = document.querySelector('.tabs-bottom'),
                header = document.querySelector('.bar-header'),
                tabsHeight = tabs.offsetHeight,
                headerHeight = header.offsetHeight,
                handleHeight = 0;

              function computeHeights() {
                  $timeout(function() {
                      expandedHeight = window.innerHeight - headerHeight - handleHeight;
                      if (tabs) {
                          expandedHeight = expandedHeight - tabsHeight;
                      }
                  }, 300);
              }

              function expand() {
                  $element.css('min-height', expandedHeight + 'px');
                  dragPrevHeight =  expandedHeight;
                  $scope.onExpand();
              }

              function collapse() {
                  $element.css('min-height', defaultHeight + 'px');
                  dragPrevHeight = defaultHeight;
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
                          var newHeight = Math.round (dragPrevHeight - e.gesture.deltaY);
                          dragHeight = expandedHeight > newHeight ? newHeight : expandedHeight;
                          break;
                      case 'dragend':
                          dragPrevHeight = dragHeight;
                          $element.css('transition', '300ms ease-in-out');
                          (dragHeight == expandedHeight) && (isExpanded = true);
                          break;
                  }

                  $element.css('min-height', dragHeight + 'px');
              };

              window.addEventListener('orientationchange', function() {
                  isExpanded && collapse();
                  computeHeights();
              });

              $element.css({'-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden', 'min-height': defaultHeight + 'px'});
              if (tabs && hasBottomTabs) {
                  $element.css('bottom', tabs.offsetHeight + 'px');
              }

          },
          link: function(scope, element, attrs, controller) {
              // enable transitions
              element.css({'transition': '300ms ease-in-out', transform: 'translate3d(0,0,0)'});
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