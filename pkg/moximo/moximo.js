console.log("DEBUG::Begin Moximo")
console.log("Loading kubernetes modules");

moximo = angular.module('moximo', ['kubernetes', 'kubeClient',
        'ngRoute',
        'kubernetes.details',
        'kubernetes.app',
        'kubernetes.graph',
        'kubernetes.nodes'
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
    function($scope, loader, select, data, actions, itemActions,
                 nodeActions, nodeData, $location, $http, $interval) {
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
                //Temporal, revisar si no está vacianose items_hash
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
}]);

