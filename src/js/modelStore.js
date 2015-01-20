(function() {

  define(['reflux', 'jsonld', 'actions', 'es6-promise'], function(Reflux, jsonld, actions, promise) {
    'use strict';

    var NavActions = actions.NavActions;
    var jsonld = jsonld.promises;

    var currentModel = { };

    var executeXhr = function(uri) {
      return new promise.Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", uri, true);
        httpRequest.setRequestHeader('Accept','application/ld+json');
        httpRequest.onreadystatechange = function()
      {
        if (httpRequest.readyState != 4) {
          return;
        }

        if (httpRequest.status != 200) {
          reject(httpRequest);
        } else {
          resolve(httpRequest.responseText);
        }
      };

      httpRequest.send(null);
    });
  }

    return Reflux.createStore({
      init: function() {
        this.listenTo(NavActions.navigateTo, this.loadResource);
      },
      loadResource: function(uri) {
        var self = this;

        NavActions.beforeLoad(currentModel);

        executeXhr(uri).then(function(res) {
          return jsonld.expand(JSON.parse(res)).then(function(expanded) {
            NavActions.navigateTo.success(expanded[0]);
          });
        }, function (request) {
          NavActions.navigateTo.failed(request.status);
        });
      }
    });
  })
})();
