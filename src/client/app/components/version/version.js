'use strict';

angular.module('biblio.version', [
  'biblio.version.interpolate-filter',
  'biblio.version.version-directive'
])

.value('version', '0.1');
