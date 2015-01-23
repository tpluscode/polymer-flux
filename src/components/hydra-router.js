(function(window, document) {
  'use strict';

  var isIE = 'ActiveXObject' in window;

  require(['actions', 'underscore', 'ModelStore'], function(actions, _) {
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

      stateChange(router);
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
          activateRoute(router, route, newModel);
          return;
        }

        route = route.nextSibling;
      }

      console.log('uh oh, no route');
    };

    function activateRoute(router, route, model) {
      if (router.activeRoute) {
        router.activeRoute.removeAttribute('active');
      }
      router.activeRoute = route;
      router.activeRoute.setAttribute('active', 'active');

      // import custom element or template
      if (route.hasAttribute('import')) {
      //  importAndActivate(router, route.getAttribute('import'), route, url, eventDetail);
      }
      // pre-loaded custom element
      else if (route.hasAttribute('element')) {
        //activateCustomElement(router, route.getAttribute('element'), route, url, eventDetail);
      }
      // inline template
      else if (route.firstElementChild && route.firstElementChild.tagName === 'TEMPLATE') {
        activateTemplate(router, route.firstElementChild, route, model);
      }
    }

    // Create an instance of the template
    function activateTemplate(router, template, route, model) {
      var templateInstance;
      if ('createInstance' in template) {
        // template.createInstance(model) is a Polymer method that binds a model to a template and also fixes
        // https://github.com/erikringsmuth/app-router/issues/19
        var routeModel = createRouteModel(router, route, model);
        templateInstance = template.createInstance(routeModel);
      } else {
        templateInstance = document.importNode(template.content, true);
      }
      activateElement(router, templateInstance, { model: model });
    }

    // Create the route's model
    function createRouteModel(router, route, model) {
      var routeModel = { model: model };

      if (route.hasAttribute('bindRouter') || router.hasAttribute('bindRouter')) {
        routeModel.router = router;
      }
      return routeModel;
    }

    // Replace the active route's content with the new element
    function activateElement(router, element, model) {
      if (!router.current) {
        router.current = document.createElement('div');
        router.appendChild(router.current);
      }

      // add the new content
      while (router.current.firstChild) {
        router.current.removeChild(router.current.firstChild);
      }
      router.current.appendChild(element);
    }

    document.registerElement('hydra-router', {
      prototype: HydraRouter
    });

    function routeHasType(type) {
      /*jshint validthis:true */
      return this.getAttribute('type') === type;
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
