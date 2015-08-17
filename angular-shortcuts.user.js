// ==UserScript==
// @name         Angulary - make console make angular friendly
// @namespace    angulary
// @version      0.1
// @description  to make console make angular friendly with shortcuts like $injector(), $getService('name'), $rootScope, $getService(element)
// @author       Stepan Suvorov <stevermeister@gmail.com>
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


var initWatcher = setInterval(function () {
    console.log('watch');
    debugger
    if (unsafeWindow.angular) {
        clearInterval(initWatcher);
        init(unsafeWindow.angular);
    }
}, 5000);

function init(angular) {
    console.log('angular', angular);
    alert('inA')
    app = window.angular.element(document);
    $injector = app.injector;
    $getService = $injector.get;
    $rootScope = app.scope();
    $getService = function(element) {
      return window.angular.element(element).scope();
    }
}


