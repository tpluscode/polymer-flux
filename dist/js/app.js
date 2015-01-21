define(['HistoryStore', 'ModelStore', 'es6-promise'], function() {
  'use strict';

  function getQueryVariable(variable)
  {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split(/=(.+)/);
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

  window.addEventListener('polymer-ready', function() {
    var url = getQueryVariable('uri');
    if (!url) {
      url = 'http://test.wikibus.org/';
    }

    var browser = document.querySelector('ld-browser');
    browser.uri = url;
    browser.load();
  });
});
