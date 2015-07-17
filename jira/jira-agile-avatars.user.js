// ==UserScript==
// @name        Jira Agile - Avatar add
// @namespace   jira-agile
// @description Add avatar of assigned person to Work View
// @include     https://*.atlassian.net/secure/RapidBoard.jspa*
// @version     1.0.17
// @author      Stepan Suvorov <stevermeister@gmail.com>
// ==/UserScript==

(function() {
  var script = function() {

    setAvatars();

    jQuery('#work-toggle').click(function() {
      setAvatars();
    });

    function setAvatars(){
      jQuery(function() {
        jQuery.get('/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=3').then(function(r) {

          var avatars = r.issuesData.issues.map(function(el) {
            return {
              key: el.key,
              avatar: el.avatarUrl
            }
          });

          jQuery.each(avatars, function(index, object) {
            if (!object['avatar']) {
              return;
            }
            jQuery('div[data-issue-key="' + object['key'] + '"] .ghx-parent-key')
              .after('<span class="ghx-assigned-work-stats"><img class="ghx-avatar-img" src="' + object['avatar'] + '"></span>');
          });
        });
      });
    }
  };

  (function(callback) {
    if (document.body.id != 'jira') {
      return;
    }

    var script = document.createElement('script');
    script.textContent = '(' + callback.toString() + ')();';
    document.body.appendChild(script);
  }(script));
}());