// ==UserScript==
// @name        Jira Agile - Add user avatar and components to agile view
// @namespace   jira-agile
// @description Add avatar of assigned person to Work View
// @include     https://*.atlassian.net/secure/RapidBoard.jspa*
// @version     1.2.0
// @author      Stepan Suvorov <stevermeister@gmail.com>
// ==/UserScript==

(function() {
  var script = function() {
    function getColor(component) {
      function hashCode(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
      }
 
      function intToRGB(i){
        var c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();

        return "00000".substring(0, 6 - c.length) + c;
      }

      // magic cool gamma constant
      return '#' + intToRGB(hashCode(component) * 232 + 1000);
    }

    setAvatars();

    jQuery('#work-toggle').click(function() {
      setAvatars();
    });

    function getData() {
      // return jQuery.get('/rest/greenhopper/1.0/xboard/plan/backlog/data.json?rapidViewId=3&selectedProjectKey=SEA');
      return Promise.all([
        fetch('https://studytube.atlassian.net/rest/agile/1.0/board/3/sprint?state=future,active&maxResults=1000', { mode: 'cors', credentials: 'include' })
          .then(function(data) {
            return data.json().then(function(sprints) {
              return Promise.all(sprints.values.map(function(sprint) {
                return fetch(sprint.self + '/issue?maxResults=1000&fields=key,components,subtasks,assignee', { mode: 'cors', credentials: 'include' })
                  .then(function(data) {
                    return data.json();
                  }).then(function(data) {
                    return data.issues;
                  });
              }));
            });
          }),

        fetch('https://studytube.atlassian.net/rest/agile/1.0/board/3/backlog?maxResults=1000&fields=key,components,subtasks,assignee', { mode: 'cors', credentials: 'include' })
          .then(function(data) {
            return data.json();
          }).then(function(data) {
          return data.issues;
        })
      ]).then(function(results) {
        return results[0].reduce(function(a, b) { return a.concat(b); }).concat(results[1]);
      });
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
            jQuery('.js-issue[data-issue-key="' + issue.key + '"] .ghx-end.ghx-row').each(function(index, issueRow) {
              issue.fields.components.forEach(function(component) {
                jQuery(issueRow).prepend(
                  jQuery('<span class="aui-label own-label ghx-label ghx-label-single" />')
                    .css({ 'backgroundColor': getColor(component.name), 'borderColor': 'rgba(0,0,0,0.2)', 'color': '#fff' })
                    .text(component.name)
                );
              });

              var avatarContainer = jQuery(issueRow).find('.ghx-end');

              var assignees = [];
              if (issue.fields.assignee) {
                assignees.push(issue.fields.assignee.key);
              }

              for (var i = 0; i < issue.fields.subtasks.length; i++) {
                fetch(issue.fields.subtasks[i].self + '?fields=assignee', { mode: 'cors', credentials: 'include' })
                  .then(function(data) { return data.json(); })
                  .then(function(issueData) {
                    if (issueData.fields.assignee && assignees.indexOf(issueData.fields.assignee.key) === -1) {
                      assignees.push(issueData.fields.assignee.key);
                      avatarContainer.prepend('<img src="' + issueData.fields.assignee.avatarUrls['16x16'] + '" width="16" height="16" style="vertical-align: top; margin-right: 3px;">');
                    }
                  });
              }
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
      /*jQuery(function($) {
       getData().then(function(issues) {
       var avatars = issues.map(function(el) {
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
       });*/
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