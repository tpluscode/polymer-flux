Polymer.require = function(tag, deps, func) {
  'use strict';

  require(deps, function() {
    new Polymer(tag, func.apply(this, arguments));
  });
};
