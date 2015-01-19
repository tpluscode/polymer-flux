(function() {

  define('ModelStore', ['reflux', 'jsonld', 'actions', 'qwest'], function(Reflux, jsonld, actions, qwest) {
    'use strict';

    var NavActions = actions.NavActions;
    var jsonld = jsonld.promises;

    var currentModel = { };

    return Reflux.createStore({
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
  })
})();
