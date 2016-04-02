var global_var = {
    profileName: "john",
    missions: []
}

angular.module('starter.controllers', ['btford.socket-io'])

    .controller('ActivityCtrl', function($scope) { })

    .controller('DashCtrl', function($scope) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

    })

    .controller('MissionsCtrl', function($scope, $http, $timeout, Missions) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        //$scope.missions = Missions.all();
        getData(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
        function getData(callback) {
            Missions.download().success(function(response, status) {
                console.log(response.data);
                global_var.missions = response.data;
                $timeout(function() {
                    $scope.missions = global_var.missions;
                    callback();
                });
            })
        }
        $scope.doRefresh = function() {
            getData(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        function callback() {
            Missions.upload({ data: global_var.missions }).success(function(response, status) {
                console.log(response.data);
            })
            $scope.missions = global_var.missions;
        }
        $scope.remove = function(mission) {
            Missions.remove(mission, callback);
        };
        $scope.add = function() {
            alert("NEW");
        };

    })
    .directive('input', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function(scope, element, attr) {
                element.bind('focus', function(e) {
                    if (scope.onFocus) {
                        $timeout(function() {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function(e) {
                    if (scope.onBlur) {
                        $timeout(function() {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function(e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function() {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })


    .controller('Messages', function($scope, $timeout, $ionicScrollDelegate) {

        $scope.hideTime = true;
        $scope.messages = [];
        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        $scope.sendMessage = function(data) {
            alternate = !alternate;

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            if (data) {

                $scope.messages.push({
                    userId: '54321',
                    text: data,
                    time: d
                });
            }
            else {

                $scope.messages.push({
                    userId: '12345',
                    text: $scope.data.message,
                    time: d
                });
            }

            delete $scope.data.message;
            //$ionicScrollDelegate.scrollBottom(true);

        };


        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
            // cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];
        $scope.sendMessage("Lets finish the feedback by toady.");
        $scope.sendMessage("Data has be synced with shared folder.");
        $scope.sendMessage("We'll meet tomorrow.");

    })
    .controller('MissionDetailCtrl', function($scope, $stateParams, Missions, socketFactory) {
        $scope.mission = Missions.get($stateParams.missionId);
        $scope.missionDescriptionDisplay = false;
        $scope.toggleDescr = function() {
            console.log("fired!!")
            $scope.missionDescriptionDisplay = !($scope.missionDescriptionDisplay);
        }
        var socket = io('http://artifact-server.azurewebsites.net/', { path: '/socket.io' });
        socket.on('chat message', function(msg) {
            console.log(msg);
        });
        var sendChat = function() {
            socket.emit('chat message', { id: $scope.mission.id, username: global_var.profileName, messg: 'HEllo' }, function(error, message) {
                console.log(error);
                console.log(message);
            });
        }
        console.log(socket);
    })
    .controller('MissionCreateCtrl', function($scope, $stateParams, $ionicNavBarDelegate, Missions, Camera) {
        $scope.newMission = {};
        function callback() {
            Missions.upload({ data: global_var.missions }).success(function(response, status) {
                console.log(response.data);
            })
            $ionicNavBarDelegate.back()
        }
        $scope.performAdd = function(mission) {
            Missions.add(mission, callback);
        }
        $scope.cancelAdd = function() {
            $ionicNavBarDelegate.back();
        }
        $scope.getPhoto = function(source) {
            console.log('Getting camera');
            Camera.getPicture({
                quality: 25,
                targetWidth: 160,
                targetHeight: 160,
                destinationType: 0,
                sourceType: parseInt(source),
                saveToPhotoAlbum: false
            }).then(function(imageData) {
                console.log(imageData);
                $scope.newMission.logo = "data:image/png;base64," + imageData;
            }, function(err) {
                console.err(err);
            });
        }
    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true,
            profileName: global_var.profileName
        };
        $scope.profileNameChanged = function() {
            console.log($scope.settings.profileName);
            global_var.profileName = $scope.settings.profileName;
        }
    });
