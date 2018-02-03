console.log("DEBUG::Begin Moximo")
console.log("Loading kubernetes modules");
window.debugging = "all"
moximo = angular.module('moximo', ['kubernetes', 'kubeClient',
        'ngRoute',
        'kubernetes.details',
        'kubernetes.app',
        'kubernetes.graph',
        'kubernetes.nodes',
        'ui.bootstrap',
//TEST
        'kubernetes.date',
        'kubernetes.listing',
        'kubeUtils'

])

moximo.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/moximo-dashboard.html',
        controller: 'ViewCtrl',
        reloadOnSearch: false,
     });
}]);

moximo.controller('ViewCtrl',[
    '$scope',
    'kubeLoader',
    'kubeSelect',
    'dashboardData',
    'dashboardActions',
    'itemActions',
    'nodeActions',
    'nodeData',
    '$location',
    '$http',
    '$interval',
    '$modal',
    'CockpitKubeRequest',
    'cockpitKubectlConfig',
    'cockpitConnectionInfo',
    '$q',
    function($scope, loader, select, data, actions, itemActions,
             nodeActions, nodeData, $location, $http, $interval, $modal, CockpitKubeRequest, cockpitKubectlConfig, info, $q) {
        $scope.services = select().kind("Service");
        $scope.mycounter = 1;
        console.log("services? " + $scope.services);

        var service;
        for (service in $scope.services) {
            console.log("service? " + service);
        }


        $interval( function(){
            console.log("Loading moximo services: " + $scope.mycounter);
            get_moximo_services();
            $scope.mycounter++;
        }, 600000 );
        $scope.nodes = select().kind("Node");
        $scope.pods = select().kind("Pod");
        $scope.volumes = select().kind("PersistentVolume");
        $scope.pvcs = select().kind("PersistentVolumeClaim");
        $scope.advanced_view = false;
        $scope.moximo_services = null;
        $scope.currentService = "";
        console.log("advanced_view: " + $scope.advanced_view);
        get_moximo_services();


        /* get the content of the services file */
        function get_moximo_services() {
            var ret_data = null;
            var i, l, keys = 0;
            var hashed_items = $scope.services.items_hash;
            $http.get('/cockpit/@localhost/moximo/services/moximo.json').then(function(data) 
            {
                $scope.moximo_services = data.data;
                console.log("moximo_services? " + $scope.moximo_services);
                keys = Object.keys($scope.moximo_services).sort();
                console.log("moximo_services keys? " + keys.length);
                //TODO, check if items_hash is not being emptied
                if (hashed_items == null){
                    console.log("hashed_items is null!!!");
                            //return;
                }
                for (i = 0, l = keys.length; i < l; i++) {
                    console.log("key: " + keys[i]);
                    /* FOR NOW DON'T CHECK FOR SERVICE STATUS    console.log("key: " + keys[i]);
                    if(hashed_items[keys[i]] != null) {
                        $scope.moximo_services[keys[i]].live = 
                        hashed_items[keys[i]];
                    }
                    else { */
                        $scope.moximo_services[keys[i]].live = null;   
                    //}

                 }
                        console.log("moximo services loaded");
            }); //$http.get
        } //get_moximo_services

        //Assert to true
        function moximoServiceStatus(service) {
            return true;
        }
        
        //Toggle service status
        $scope.toggleService = function toggleService(service) {
            console.log("START SERVICE: " + service.name);
            start_service(service)
        };

        //Modify Service
        $scope.modifyService = function (service) {
                console.log("Configuring service: " + service.name);
                return $modal.open({
                    animation: false,
                    controller: 'ViewCtrl',
                    templateUrl: 'views/config_service.html',
                    controller: ['$scope', function($scope){
                    	$scope.currentService = service;
                    }],
                    //resolve:  { currservice: function() { return service; } },
                }).result;
        }


        /* 
         *  Code taken from the kubernetes package in an act of desperation :'(
         *
         */
        function step(options, kubeConfig) {
            if (!options)
                options = schemes.shift();

                /* No further ports to try? */
                if (!options) {
                    last.statusText = cockpit.gettext("Couldn't find running API server");
                    last.problem = "not-found";
                    $q.defer.reject(last);
                    return;
                }

                /* If options is a function call it, the function is
                * responsible to call step again when ready */
                if (typeof options === "function") {
                    options();
                    return;
                }

                options.payload = "http-stream2";
                debug("trying kube at:", options);
                req = new CockpitKubeRequest("GET", "/api", "", options);
                req.then(function(response) {
                    req = null;
                    var resp = response.data;
                    if (resp && resp.versions) {
                        debug("discovered kube api", resp);
                        if (kubeConfig) {
                            info.kubeConfig = kubeConfig;
                            if (kubectl)
                                info.type = "kubectl";
                            else
                                info.type = "sessionData";
                        } else {
                             info.type = "open";
                        }

                        //$q.defer.resolve(options);
                        //resourcePath(options);
                    } else {
                        debug("not an api endpoint:", options);
                        last = response;
                        kubectl = null;
                        step();
                    }
                })
                .catch(function(response) {
                    req = null;
                    kubectl = null;
                    last = response;

                    if (response.problem === "not-found") {
                       debug("api endpoint not found on:", options);
                       step();
                    } else {
                       debug("connecting to kube failed:", response);
                       $q.defer.reject(response);
                    }
                });
            }


        //TODO optimize for already loaded json file
        function start_service(service) {
            var svc_link = "/api/v1/namespaces/default/services/";
            var rc_link = "/api/v1/namespaces/default/replicationcontrollers";
            console.log("Starting: " + service.name + " " + rc_link);
            $http.get(service.rc_file).then(function(data)
            {
                service.json.service = data.data;
                var options;
                    /*kubectl = cockpitKubectlConfig.read();
                    options = cockpitKubectlConfig.parseKubeConfig(kubectl); */


                 kubectl = cockpitKubectlConfig.read()
                     .then(function(data) {
                         options = cockpitKubectlConfig.parseKubeConfig(data);
                         debug("---- options ??: " + JSON.stringify(options));
                         debug("----------------------------------------------------------");
                         step(options, options ? JSON.parse(data) : null);
                         console.log("Starting RC JSON: " +  JSON.stringify(service.json.service));
                         request = new CockpitKubeRequest("POST", rc_link,
                                   JSON.stringify(service.json.service), options);
                         request.then(function(response) {
                             console.log("START RC RESPONSE: " + String(response));
                         });

                     })
                     .catch(function(options) {
                         console.warn("kubectl failed: " + (options.message || options.problem));
                         step();
                     });
            });

/* COMMENTED DURING TESTS           $http.get(service.service_file).then(function(data)
            {
                service.json.service = data.data;
                console.log("Starting Service JSON: " +  JSON.stringify(data.data));
                request = new CockpitKubeRequest("POST", link, JSON.stringify(data.data), "");
                request.then(function(response) {
                        console.log("START SVC RESPONSE: " + response);
                    });
            });
*/

        }


        function debug(msg, resource) {
            console.log("DEBUG:: " + msg + " resource: " + resource);
        }

}]);

