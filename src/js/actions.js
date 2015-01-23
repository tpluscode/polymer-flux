(function() {
  'use strict';

  define(['reflux'], function(Reflux){
      return {
        NavActions: Reflux.createActions({
          'navigateTo': { children: [ 'success', 'failed' ] }
        })
      };
  });
})();
