(function(Reflux, global) {
  'use strict';

  global.NavActions = Reflux.createActions({
      'navigateTo': { children: [ 'success', 'failed' ] }
  });
})(window.Reflux, window);
