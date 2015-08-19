// ==UserScript==
// @name         Angulary - make console make angular friendly
// @namespace    angulary
// @version      0.1
// @description  to make console make angular friendly with shortcuts like $injector(), $getService('name'), $rootScope, $getService(element)
// @author       Stepan Suvorov <stevermeister@gmail.com>
// @match        *://*/*
// @grant        none
// ==/UserScript==

if(document.querySelector('[src*="angular"]')) {
  init();
}

function init() {
  var w = typeof unsafeWindow == 'undefined' ? window : unsafeWindow,
    tryNumber = 20,
    initWatcher = setInterval(function() {
      var appElement = w.document.querySelector('.ng-scope');
      if (appElement || tryNumber) {
        clearInterval(initWatcher);

        if (appElement) {
          initAngulary(appElement);
        }
      }
      tryNumber--;
    }, 500);

  function initAngulary(el) {
    w.$reload = w.angular.reloadWithDebugInfo;
    w.$app = w.angular.element(el);
    w.$injector = w.$app.injector();
    w.$get = w.$injector.get;
    w.$rootScope = w.$app.scope();
    w.$scope = function(element) {
      return w.angular.element(element).scope();
    };
  }
}
