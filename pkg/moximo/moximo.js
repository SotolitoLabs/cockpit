console.log("DEBUG::Begin Moximo shit")
console.log("Loading kubernetes modules");

/*var angular = require('angular');
require('views/moximo-dashboard.html');
*/
moximo = angular.module('moximo', ['kubernetes',
    'kubernetes.dashboard',
    'ngRoute',
    'kubernetes.details',
    'kubernetes.app',
    'kubernetes.graph',
    'kubernetes.nodes'
]);



moximo.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/moximo-dashboard.html',
        controller: 'DashboardCtrl',
        reloadOnSearch: false,
     });
}]);

moximo.controller('viewCtrl',[
    '$scope',
    'kubeLoader',
    'kubeSelect',
    'dashboardData',
    'dashboardActions',
    'itemActions',
    'nodeActions',
    'nodeData',
    '$location',
    function($scope, $http, loader, select, data, actions, itemActions,
                 nodeActions, nodeData, $location) {

        loader.listen(function() {
            $scope.services = select().kind("Service");
            $scope.nodes = select().kind("Node");
            $scope.pods = select().kind("Pod");
            $scope.volumes = select().kind("PersistentVolume");
            $scope.pvcs = select().kind("PersistentVolumeClaim");
         });



        $scope.advanced_view = true;
        $scope.moximo_services = null;
        //this.ParentCtrl = $controller('MainCtrl', {});
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
                        keys = Object.keys($scope.moximo_services).sort();
                        //Temporal, revisar si no está vacianose items_hash
                        if (hashed_items == null){
                            alert("hashed_items is null!!!");
                            return;
                        }
                        for (i = 0, l = keys.length; i < l; i++) {
                            if(hashed_items[keys[i]] != null) {
                                $scope.moximo_services[keys[i]].live = 
                                    hashed_items[keys[i]];
                            }
                            else {
                                $scope.moximo_services[keys[i]].live = null;   
                            }

                        }
                    }
                );
                //return(ret_data);
            } //get_moximo_services




}]);



/*
    .controller('MainCtrl',[
        '$scope',
        '$location',
        '$rootScope',
        '$timeout',
        '$modal',
        'kubeLoader',
        'kubeSelect',
        'KubeDiscoverSettings',
        'filterService',
        'connectionActions',
        function ($scope) {
            alert("init moximo");
            console.log("Initial function");
        }

])*/;
