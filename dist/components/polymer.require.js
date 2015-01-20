'use strict';

Polymer.require = function(tag, deps, func) {
  require(deps, function() {
    Polymer(tag, func.apply(this, arguments));
  });
};
