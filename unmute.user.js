// ==UserScript==
// @name         UnMute - start hangout being unmuted (problem of Mac users)
// @namespace    angulary
// @version      0.2
// @description  each time when you start hangout you should turn on your sound it's pretty enoing
// @author       Stepan Suvorov <stevermeister@gmail.com>
// @match        https://plus.google.com/hangouts/*
// @grant        none
// ==/UserScript==


doTry();

function doTry() {
     if(document.querySelector('.Ha-ha-Sb-b') && document.querySelector('.Ha-ha-Sb-b').getAttribute('aria-pressed') === 'true'){
         setTimeout(unMute, 1000);
     } else {
        setTimeout(doTry, 1000);
     }
}

function unMute(){
    var el = document.querySelector('.ha-w-P-y-Xi-f').parentNode;
    el.dispatchEvent(new MouseEvent('mousedown'));
    el.dispatchEvent(new MouseEvent('mouseup'));
    el.dispatchEvent(new MouseEvent('mouseout'));
}
