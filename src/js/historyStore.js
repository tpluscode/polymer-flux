(function() {

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
        var uri  = document.location.origin + document.location.pathname;
        if (state && state['@id'] && state['@id'] !== history.state) {
          uri += '?uri=' + state['@id'];
          history.pushState(state['@id'], '', uri);
        }
      }
    });
  });
})();
