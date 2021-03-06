(function() {

  var getOrigin = function() {
    if (!document.location.origin) {
      return document.location.protocol + "//" + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
    }

    return document.location.origin;
  };

  define(['reflux', 'actions'], function(Reflux, actions) {
    'use strict';

    var NavActions = actions.NavActions;

    return Reflux.createStore({
      init: function() {
        this.listenTo(NavActions.navigateTo.success, this.pushHistory.bind(this));
        window.addEventListener('popstate', this.restoreHistory);
      },
      restoreHistory: function(ev) {
        NavActions.navigateTo(ev.state);
      },
      pushHistory: function(state) {
        var uri  = getOrigin() + document.location.pathname;
        if (state && state['@id'] && state['@id'] !== history.state) {
          uri += '?uri=' + state['@id'];
          history.pushState(state['@id'], '', uri);
        }
      }
    });
  });
})();
