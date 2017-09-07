/* Replaced in production by a javascript bundle. */

require.config({
    map: {
        "*": {
            "angular": "base1/angular",
            "d3": "base1/d3",
        }
    }
});

require([
    "base1/cockpit",
    "translated!base1/po",
    "base1/angular",
    "base1/bootstrap-select",
    "moximo/graphs",
    "moximo/deploy",
    "moximo/adjust",
    "moximo/node",
    "moximo/app",
    "moximo/containers",
    "moximo/dashboard",
    "moximo/details",
    "moximo/images",
    "moximo/topology",
    "moximo/object-describer",
    "moximo/services"
], function(cockpit, po, angular) {
    "use strict";
    cockpit.locale(po);
    cockpit.translate();
    angular.bootstrap(document, ["kubernetes"], {
        strictDi: true
    });
});
