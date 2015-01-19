(function(Reflux, global) {
  'use strict';

  global.NavActions = Reflux.createActions({
      'navigateTo': { children: [ 'success', 'failed' ] },
      'beforeLoad': { }
  });
})(window.Reflux, window);
