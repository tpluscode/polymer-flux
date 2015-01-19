(function() {
  'use strict';

  define('actions', ['reflux'], function(Reflux){
      return {
        NavActions: Reflux.createActions({
          'navigateTo': { children: [ 'success', 'failed' ] },
          'beforeLoad': { }
        })
      };
  });
})();
