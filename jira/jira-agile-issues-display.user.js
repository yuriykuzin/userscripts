// ==UserScript==
// @name        Jira Agile - Add user avatar and components to agile view
// @namespace   jira-agile
// @description Add avatar of assigned person to Work View
// @include     https://*.atlassian.net/secure/RapidBoard.jspa*
// @version     1.0.18
// @author      Stepan Suvorov <stevermeister@gmail.com>
// ==/UserScript==

(function() {
  var script = function() {
    var componentsColors = {
      'Academy': 2,
      'Admin': 7,
      'Authoring Tool': 6,
      'Backend': 5,
      'Expert': 9,
      'Law': 3,
      'LnD': 8,
      'Player': 4
    };

    //setAvatars();

    jQuery('#work-toggle').click(function() {
      //setAvatars();
    });

    function getData() {
      return jQuery.get('/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=3');
    }

    function setLabels() {
      jQuery(function($) {
        getData().then(function(data) {
          var issues = data.issuesData.issues;
          // Normalize components
          issues.forEach(function(issue) {
            var componentsField = issue.extraFields.filter(function (field) {
              return field.id === 'components';
            })[0];

            issue.components = componentsField && componentsField.text ? componentsField.text.split(',').map(function(c) { return c.trim() }) : [];
          });

          issues.forEach(function(issue) {
            issue.components.forEach(function(component) {
              $('div[data-issue-key="' + issue.key + '"] .ghx-end.ghx-row').prepend(
                $('<span class="aui-label own-label ghx-label ghx-label-single" />')
                  .addClass('ghx-label-' + componentsColors[component])
                  .text(component)
              );
            });
          });
        });
      });
    }

    var shortest = setInterval(function() {
      var oldLabels = jQuery('div[data-issue-key] .aui-label:not(.own-label)');
      if (oldLabels.length) {
        oldLabels.remove();
        setLabels();
      }
    }, 10);

    function setAvatars(){
/*      jQuery(function($) {
        getData().then(function(data) {
          var avatars = data.issuesData.issues.map(function(el) {
            return {
              key: el.key,
              avatar: el.avatarUrl
            }
          });

          $.each(avatars, function(index, object) {
            if (!object['avatar']) {
              return;
            }
            $('div[data-issue-key="' + object['key'] + '"] .ghx-parent-key')
              .after('<span class="ghx-assigned-work-stats"><img class="ghx-avatar-img" src="' + object['avatar'] + '"></span>');
          });
        });
      }); */
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