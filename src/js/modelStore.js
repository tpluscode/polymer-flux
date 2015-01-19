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
      }).catch(function (error) {
        NavActions.navigateTo.failed(this.status);
        throw error;
      });
    }
  });
})(window.Reflux, window.NavActions, jsonld.promises, window);
