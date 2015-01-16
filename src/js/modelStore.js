(function(Reflux, NavActions, jsonld, global) {
  'use strict';

  global.ModelStore = Reflux.createStore({
    init: function() {
      this.listenTo(NavActions.navigateTo, this.loadResource);
    },
    loadResource: function(uri) {
      var self = this;

      qwest.get(uri, null, {
        headers: {
          'Accept': 'application/ld+json'
        }
      }).then(function(res) {
        return jsonld.expand(JSON.parse(res)).then(function(expanded) {
          self.trigger(expanded[0]);
        });
      });
    }
  });
})(window.Reflux, window.NavActions, jsonld.promises, window);
