(function() {

  define(['reflux', 'jsonld', 'actions', 'es6-promise', 'jquery'], function(Reflux, jsonld, actions, promise, $) {
    'use strict';

    var NavActions = actions.NavActions;
    var jsonldp = jsonld.promises;

    var executeXhr = function(uri) {
      return $.ajax({
          type: 'GET',
          url: uri,
          contentType: 'text/plain',
          headers: {
            'Accept': 'application/ld+json'
          }
      });
    };

    return Reflux.createStore({
      init: function() {
        this.listenTo(NavActions.navigateTo, this.loadResource);
      },
      loadResource: function(uri) {
        var self = this;

        if (self.request) {
          if (self.currentUri === uri) {
            return;
          }

          self.request.abort();
        }

        self.currentUri = uri;
        self.request = executeXhr(uri);

        self.request.then(function(res) {
          self.request = null;
          return jsonldp.expand(res).then(function(expanded) {
            NavActions.navigateTo.success(expanded[0]);
          });
        }, function (request) {
          self.request = null;
          NavActions.navigateTo.failed(request.status);
        });
      }
    });
  });
})();
