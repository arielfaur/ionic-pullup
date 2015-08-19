angular.module('ionic-ui-toolkit', [])
  .directive('ionPullUpFooter', ['$timeout', function($timeout) {
      return {
          restrict: 'AE',
          transclude: true,
          template: '<ng-transclude style="width: 100%;"></ng-transclude>',
          scope: {
              onExpand: '&',
              onCollapse: '&',
              onMinimize: '&',
              minimize: '=',
              maxHeight: '=?',
              defaultHeight: '=?'
          },
          controller: function($scope, $element) {
              var FooterStatus = {
                  DEFAULT: -1,
                  MINIMIZED: 0,
                  EXPANDED: 1
              };
              var
                tabs = document.querySelector('.tabs'),
                hasBottomTabs = document.querySelector('.tabs-bottom'),
                header = document.querySelector('.bar-header'),
                tabsHeight = tabs ? tabs.offsetHeight : 0,
                headerHeight = header ? header.offsetHeight : 0,
                handleHeight = 0,
                footer = {
                  height: 0,
                  posY: 0,
                  lastPosY: 0,
                  status: FooterStatus.DEFAULT
                };

              $scope.maxHeight = parseInt($scope.maxHeight, 10) || 0;
              $scope.defaultHeight = $element[0].offsetHeight;

              function init() {
                  $element.css({'-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden', 'transition': '300ms ease-in-out'});
                  if (tabs && hasBottomTabs) {
                      $element.css('bottom', tabs.offsetHeight + 'px');
                  }
              }

              function computeHeights() {
                  footer.height = $scope.maxHeight > 0 ? $scope.maxHeight : window.innerHeight - headerHeight - handleHeight - tabsHeight;
                  footer.lastPosY = (tabs && hasBottomTabs) ? footer.height - tabsHeight : footer.height - $scope.defaultHeight;

                  $element.css({'height': footer.height + 'px',
                      '-webkit-transform': 'translate3d(0, ' + footer.lastPosY  + 'px, 0)',
                      'transform': 'translate3d(0, ' + footer.lastPosY  + 'px, 0)'
                  });
              }

              function expand() {
                  footer.lastPosY = 0;
                  $element.css({'-webkit-transform': 'translate3d(0, 0, 0)', 'transform': 'translate3d(0, 0, 0)'});
                  $scope.onExpand();
                  footer.status = FooterStatus.EXPANDED;
              }

              function collapse() {
                  footer.lastPosY = (tabs && hasBottomTabs) ? footer.height - tabsHeight : footer.height - $scope.defaultHeight;
                  $element.css({'-webkit-transform': 'translate3d(0, ' + footer.lastPosY  + 'px, 0)', 'transform': 'translate3d(0, ' + footer.lastPosY  + 'px, 0)'});
                  $scope.onCollapse();
                  footer.status = FooterStatus.DEFAULT
              }

              function minimize() {
                  footer.lastPosY = footer.height;
                  $element.css({'-webkit-transform': 'translate3d(0, ' + footer.lastPosY  + 'px, 0)', 'transform': 'translate3d(0, ' + footer.lastPosY  + 'px, 0)'});
                  $scope.onMinimize();
                  footer.status = FooterStatus.MINIMIZED;
              }


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

                  if (footer.status == FooterStatus.DEFAULT) {
                      if ($scope.minimize) {
                          minimize();
                      } else {
                          expand();
                      }
                  } else {
                      if (footer.status == FooterStatus.MINIMIZED) {
                          if ($scope.minimize)
                              collapse();
                          else
                              expand();
                      } else {
                          if ($scope.minimize)
                              minimize();
                          else
                              collapse();
                      }
                  }
              };

              this.onDrag = function(e) {
                  e.gesture.srcEvent.preventDefault();
                  e.gesture.preventDefault();

                  switch (e.type) {
                      case 'dragstart':
                          $element.css('transition', 'none');
                          break;
                      case 'drag':
                          footer.posY = Math.round(e.gesture.deltaY) + footer.lastPosY;
                          if (footer.posY < 0 || footer.posY > footer.height) return;
                          $element.css({'-webkit-transform': 'translate3d(0, ' + footer.posY + 'px, 0)', 'transform': 'translate3d(0, ' + footer.posY + 'px, 0)'});
                          break;
                      case 'dragend':
                          $element.css({'transition': '300ms ease-in-out'});
                          footer.lastPosY = footer.posY;
                          break;
                  }
              };

              window.addEventListener('orientationchange', function() {
                    footer.status != FooterStatus.DEFAULT && collapse();
                    $timeout(function() {
                        computeHeights();
                    }, 500);
              });

              init();
          },
          compile: function(element, attrs) {
              attrs.defaultHeight && element.css('height', parseInt(attrs.defaultHeight, 10) + 'px');
              element.addClass('bar bar-footer');
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
  .directive('ionPullUpHandle', ['$ionicGesture', function($ionicGesture) {
      return {
          restrict: 'AE',
          scope: {
          },
          require: '^ionPullUpFooter',
          link: function (scope, element, attrs, controller) {
              var height = parseInt(attrs.height,10) || 25, width = parseInt(attrs.width, 10) || 100,
                background =  controller.getBackground();

              controller.setHandleHeight(height);

              element.css({
                  display: 'block',
                  background: background,
                  position: 'relative',
                  bottom: height + 'px',
                  height: height + 'px',
                  width: width + 'px',
                  margin: '0 auto',
                  'text-align': 'center'
                  });

              // add gesture
              $ionicGesture.on('tap', controller.onTap, element);
              $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
          }
      }
  }])

  .directive('ionSideTabs', [function() {
      return {
          restrict: 'AE',
          transclude: true,
          template: '<ng-transclude></ng-transclude>',
          scope: {
              onExpand: '&',
              onCollapse: '&'
          },
          controller: function() {
              var count = 0;
              this.addTab = function() {
                  return count++;
              };
          }
      }
  }])
  .directive('ionSideTab', ['$timeout', function($timeout) {
      return {
          restrict: 'AE',
          scope: true,
          transclude: true,
          template: '<ng-transclude></ng-transclude>',
          require: '^ionSideTabs',
          controller: function($scope, $element) {
              var tabClass = document.querySelector('.tabs') ? (document.querySelector('.tabs-bottom') ? 'has-tabs' : 'has-tabs-top') : '',
                headerClass = document.querySelector('.bar-header') ? ' has-header' : '',
                posX = 0, lastPosX = 0, handleWidth = 0, isExpanded = false,
                expandedWidth;

              function init() {
                  $element.addClass('padding scroll-content ionic-scroll ' + tabClass + headerClass);
                  $element.css({transition: '300ms ease-in-out', overflow: 'visible', margin: '0 auto'});
                  //container.style.boxShadow = '-1px 1px #888';
                  computeWidths();
              }

              function computeWidths() {
                  expandedWidth = window.innerWidth;
                  lastPosX = expandedWidth;
                  $element.css({ width: expandedWidth + 'px', '-webkit-transform' : 'translate3d(' + lastPosX  + 'px, 0,  0)', transform : 'translate3d(' + lastPosX  + 'px, 0,  0)'});
              }

              this.setHandleWidth = function(width) {
                  handleWidth = width;
                  $element.css({'padding-right': width + 10 + 'px'});
              };

              this.onDrag = function(e) {
                  e.gesture.srcEvent.preventDefault();
                  e.gesture.preventDefault();

                  switch (e.type) {
                      case 'dragstart':
                          $element.css({transition:'none'});
                          break;
                      case 'drag':
                          posX = Math.round(e.gesture.deltaX) + lastPosX;
                          if (posX < handleWidth || posX > expandedWidth) return;
                          $element.css({'-webkit-transform': 'translate3d(' + posX + 'px, 0, 0)', transform: 'translate3d(' + posX + 'px, 0, 0)'});
                          break;
                      case 'dragend':
                          $element.css({transition: '300ms ease-in-out'});
                          lastPosX = posX;
                          break;
                  }
              };

              this.onTap = function(e) {
                  e.gesture.srcEvent.preventDefault();
                  e.gesture.preventDefault();

                  if (!isExpanded) {
                      lastPosX = handleWidth;
                      $scope.$parent.$parent.onExpand({ index: $scope.tab.index});
                  } else {
                      lastPosX = expandedWidth;
                      $scope.$parent.$parent.onCollapse({ index: $scope.tab.index});
                  }
                  $element.css({'-webkit-transform': 'translate3d(' + lastPosX + 'px, 0, 0)', transform: 'translate3d(' + lastPosX + 'px, 0, 0)'});

                  isExpanded = !isExpanded;
              };

              window.addEventListener('orientationchange', function() {
                  $timeout(function() {
                    computeWidths();
                  }, 500);
              });

              init();
          },
          link: function (scope, element, attrs, controller) {
              scope.tab = {};
              scope.tab.index = controller.addTab();
          }
      }
  }])
  .directive('ionSideTabHandle', ['$ionicGesture', function($ionicGesture) {
      return {
          restrict: 'AE',
          require: '^ionSideTab',
          link: function (scope, element, attrs, controller) {
              var height = parseInt(attrs.height, 10) || 50,
                width = parseInt(attrs.width, 10) || 40;

              element.css({
                  height: height + 'px',
                  width: width + 'px',
                  position: 'absolute',
                  left: '-' + width + 'px',
                  'z-index': '100',
                  //boxShadow: '0 1px #888',
                  display: 'flex',
                  display: '-webkit-flex',                  
                  '-webkit-align-items': 'center',
                  'align-items': 'center',
                  '-webkit-justify-content': 'center',
                  'justify-content': 'center'
              });
              controller.setHandleWidth(width);

              $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
              $ionicGesture.on('tap', controller.onTap, element);


              scope.$parent.$watch ('tab.index', function(index) {
                  if (index==0) return;
                  var tabTop = index*height + 10;
                  element.css({top: tabTop + 'px'});
              });
          }
      }
  }]);