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

      NavActions.navigateTo.success.listen(navigationComplete.bind(null, router));
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
