angular.module('starter.services', [])

    .factory('Missions', function($http) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var missions = [];
        return {
            download: function() {
                return $http.get("http://artifact-server.azurewebsites.net/missions");
            },
            upload: function(data) {
                return $http.post("http://artifact-server.azurewebsites.net/missions", data);
            },
            remove: function(mission, callback) {
                global_var.missions.splice(missions.indexOf(mission), 1);
                callback();
            },
            get: function(missionId) {
                missions = global_var.missions;
                for (var i = 0; i < missions.length; i++) {
                    if (missions[i].id === parseInt(missionId)) {
                        return missions[i];
                    }
                }
                return null;
            },
            add: function(mission, callback) {
                var maxId = -1;
                for (var i = 0; i < global_var.missions.length; i++) {
                    if (global_var.missions[i].id > maxId) {
                        maxId = global_var.missions[i].id;
                    }
                }
                maxId++;
                global_var.missions.push({
                    id: maxId,
                    name: mission.name,
                    descr: mission.descr,
                    details: mission.details,
                    logo: mission.logo
                });
                callback();
            }
        };
    })
    .factory('Camera', ['$q', function($q) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);
