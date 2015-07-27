(function() {

  require(['reflux'], function(Reflux) {
    'use strict';

    var HistoryElement = Object.create(HTMLElement.prototype);

    HistoryElement.attachedCallback = function() {
      if (this.hasAttribute('basePath')) {
        this.setAttribute('basePath', '/' + trim(this.getAttribute('basePath'), '/') + '/');
      } else {
        this.setAttribute('basePath', '/');
      }

      var NavActions = document.createElement('wb-actions');
      NavActions.navigateTo.listen(this.pushHistory.bind(this));
      window.addEventListener('popstate', this.restoreHistory);
      NavActions.navigateTo(getResourceUri(this));
    };

    HistoryElement.restoreHistory = function(ev) {
      var NavActions = document.createElement('wb-actions');
      NavActions.navigateTo(ev.state);
    };

    HistoryElement.pushHistory = function(resourceUri) {
      var uri = this.getAttribute('basePath');
      if (resourceUri !== history.state) {
        var baseUri = this.getAttribute('baseUri');
        uri += resourceUri.replace(new RegExp('^' + baseUri), '');
        history.pushState(resourceUri, '', uri);
      }
    };

    function getResourceUri(router) {
      var resourcePath = document.location.pathname;

      if (router.hasAttribute('basePath')) {
        resourcePath = resourcePath.replace(new RegExp('^' + router.getAttribute('basePath')), router.getAttribute('baseUri'));
      }

      return resourcePath;
    }

    document.registerElement('ld-history', {
      prototype: HistoryElement
    });
  });
})();
