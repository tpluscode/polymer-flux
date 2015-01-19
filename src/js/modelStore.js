(function(Reflux, NavActions, jsonld, global) {
  'use strict';

  var currentModel = { };

  global.ModelStore = Reflux.createStore({
    init: function() {
      this.listenTo(NavActions.navigateTo, this.loadResource);
    },
    loadResource: function(uri) {
      var self = this;

      NavActions.beforeLoad(currentModel);

      qwest.get(uri, null, {
        headers: {
          'Accept': 'application/ld+json'
        }
      }).then(function(res) {
        return jsonld.expand(JSON.parse(res)).then(function(expanded) {
          NavActions.navigateTo.success(expanded[0]);
        });
      });
    }
  });
})(window.Reflux, window.NavActions, jsonld.promises, window);
