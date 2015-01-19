(function(Reflux, NavActions, global) {
  'use strict';

  global.HistoryStore = Reflux.createStore({
    init: function() {
      this.listenTo(NavActions.navigateTo.success, this.pushHistory.bind(this));
      global.addEventListener('popstate', this.restoreHistory);
    },
    restoreHistory: function(ev) {
      NavActions.navigateTo(ev.state);
    },
    pushHistory: function(state) {
      var uri  = 'http://localhost:8080/';
      if (state && state['@id'] && state['@id'] !== history.state) {
        uri += '?uri=' + state['@id'];
        history.pushState(state['@id'], '', uri);
      }
    }
  });
})(window.Reflux, window.NavActions, window);
