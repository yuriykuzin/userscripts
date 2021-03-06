// ==UserScript==
// @name         FakerForm - fill in the form quickly
// @namespace    facker-form
// @version      0.1
// @description  For quick testing to fill in the form data
// @author       Stepan Suvorov <stevermeister@gmail.com>
// @match        http://*.studytube.dev/*
// @match        https://*.studytube-staging.nl/*
// @match        https://*.studytube.nl/*
// @grant        none
// @require     https://rawgit.com/Marak/faker.js/master/build/build/faker.min.js
// ==/UserScript==


var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("//rawgit.com/Marak/faker.js/master/build/build/faker.min.js", function () {
  var emailName = '';
  document.addEventListener('keypress', function (event) {
    if (event.altKey && event.keyCode === 174) {
      var app = angular.element('ui-view:last').scope(),
        userData = app.userData;
      userData.firstName = faker.name.firstName();
      userData.lastName = faker.name.lastName();
      emailName = faker.internet.email().split('@')[0];
      userData.email = userData.password = emailName + '@dispostable.com';
      app.$apply();
    }

    if(event.altKey && event.keyCode === 8706){
      var currentUser = angular.element(document).injector().get('CurrentUserService').get();
      if(currentUser && currentUser.email){
        if(currentUser.email.split('@')[1] !== 'dispostable.com'){
          alert('Current User has NOT dispostable email account');
          return ;
        }
        emailName = currentUser.email.split('@')[0];
      }

      if(emailName){
        window.open('http://www.dispostable.com/inbox/' + emailName + '/', '_blank');
      }
    }
  }, false);
});



