/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2015 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */


define([
    "jquery",
    "base1/cockpit",
    "moximo/client",
    "moximo/nulecule",
    "base1/mustache",
], function($, cockpit, kubernetes, nulecule, Mustache) {
    "use strict";

    var _ = cockpit.gettext;

    /* The kubernetes client: valid while dialog is open */
    var client;
    /* The Nulecule client: valid while dialog is open */
    var nulecule_client;

    /* A list of namespaces */
    var namespaces;

    var run_stage = false;

    /* Only add the nulecule option if the basic
     * dependencies are met.
     */
    nulecule.check_requirements().done(function () {
        $("#deploy-app-type option[value='nulecule']")
            .toggleClass('hidden', false);
        $("#deploy-app-type").selectpicker('refresh');
    });

    /* get the content of the services file */
    function get_services() {
        alert("Getting services...");
        var ret_data = null;
        $http.get('/cockpit/@localhost/moximo/services/moximo.json').success(function(data) {
            ret_data = data;
        });
        return(ret_data);
    }

});
