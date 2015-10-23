// ==UserScript==
// @name         Angulary - make console angular-friendly for developer
// @namespace    angulary
// @version      0.2
// @description  to make console more angular friendly with shortcuts like $injector(), $getService('name'), $rootScope, $getService(element)
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
      if (w.angular || !tryNumber) {
        clearInterval(initWatcher);

        if (w.angular) {
          initAngulary();
        }
      }
      tryNumber--;
    }, 500);

  function initAngulary() {
    var el = w.document.querySelector('.ng-scope');
    //w.$reload = w.angular.reloadWithDebugInfo;
    w.$app = w.angular.element(el);
    w.$injector = w.$app.injector();
    w.$get = w.$injector.get;
    w.$rootScope = w.$app.scope();
    w.$scope = function(element) {
      return w.angular.element(element).scope();
    };
    w.checkDigest = function() {
      console.time('$digest');
      $rootScope.$digest();
      console.timeEnd('$digest');
    };
  }
}
