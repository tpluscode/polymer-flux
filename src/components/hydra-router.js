(function(window, document) {
  'use strict';

  var isIE = 'ActiveXObject' in window;

  require(['actions', 'underscore'], function(actions, _) {
    var NavActions = actions.NavActions;

    var HydraRouter = Object.create(HTMLElement.prototype);

    HydraRouter.attachedCallback = function() {
      this.init();
    };

    HydraRouter.init = function() {
      var router = this;
      if (router.isInitialized) {
        return;
      }
      router.isInitialized = true;

      if (router.hasAttribute('basePath')) {
        router.setAttribute('basePath', '/' + trim(router.getAttribute('basePath'), '/') + '/');
      } else {
        router.setAttribute('basePath', '/');
      }

      router.stateChangeHandler = stateChange.bind(null, router);
      window.addEventListener('popstate', router.stateChangeHandler, false);
      if (isIE) {
        // IE bug. A hashchange is supposed to trigger a popstate event, making popstate the only event you
        // need to listen to. That's not the case in IE so we make another event listener for it.
        window.addEventListener('hashchange', router.stateChangeHandler, false);
      }

      NavActions.navigateTo.listen(onNavigating.bind(null, router));
      NavActions.navigateTo.success.listen(navigationComplete.bind(null, router));

      window.addEventListener('polymer-ready', function() {
        stateChange(router);
      }, false);
    };

    // clean up global event listeners
    HydraRouter.detachedCallback = function() {
      window.removeEventListener('popstate', this.stateChangeHandler, false);
      if (isIE) {
        window.removeEventListener('hashchange', this.stateChangeHandler, false);
      }
    };

    var stateChange = function stateChange(router) {
      NavActions.navigateTo(getResourceUri(router));
    };

    var onNavigating = function(router, resourceUri) {
      var uri = router.getAttribute('basePath');
      if (resourceUri !== history.state) {
        var baseUri = router.getAttribute('baseUri');
        uri += resourceUri.replace(new RegExp('^' + baseUri), '');
        history.pushState(resourceUri, '', uri);
      }
    };

    var navigationComplete = function(router, newModel) {
      var route = router.firstElementChild;
      var types = newModel['@type'];

      while (route) {
        if (route.tagName === 'HYDRA-ROUTE' && (!route.hasAttribute('type') || _.any(types, routeHasType, route))) {
          console.log('will use route', route);
          return;
        }

        route = route.nextSibling;
      }

      console.log('uh oh, no route');
    };

    document.registerElement('hydra-router', {
      prototype: HydraRouter
    });

    function activateRoute() {

    }

    function routeHasType(type) {
      /*jshint validthis:true */
      return this.type === type;
    }

    function getResourceUri(router) {
      var resourcePath = document.location.pathname;

      if (router.hasAttribute('basePath')) {
        resourcePath = resourcePath.replace(new RegExp('^' + router.getAttribute('basePath')), router.getAttribute('baseUri'));
      }

      return resourcePath;
    }

    function trimLeft(str, charlist) {
      if (charlist === undefined)
        charlist = '\s';

      return str.replace(new RegExp('^[' + charlist + ']+'), '');
    }

    function trimRight(str, charlist) {
      if (charlist === undefined)
        charlist = '\s';

      return str.replace(new RegExp('[' + charlist + ']+$'), '');
    }

    function trim(str, charlist) {
      return trimRight(trimLeft(str, charlist), charlist);
    }
  });
})(window, document);
