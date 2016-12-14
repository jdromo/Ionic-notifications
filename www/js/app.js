// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,$cordovaDevice, $cordovaPushV5, $rootScope) {

  var options = {
  	android: {
  	  senderID: "791884707880"
  	},
    ios: {
      alert: "true",
      badge: "true",
      sound: "true"
    },
    windows: {}
  };

  $rootScope.notifications = [];


  $ionicPlatform.ready(function() {

    //Enable
    cordova.plugins.backgroundMode.enable();
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.localStorage.getItem( 'deviceUUID' ) === null){
            if( ionic.Platform.isAndroid() ){
                window.localStorage.setItem( 'deviceModel', $cordovaDevice.getModel());
                window.localStorage.setItem( 'deviceUUID', $cordovaDevice.getUUID());
            }else{
                //TODO: check if we can get this for iOS
                window.localStorage.setItem( 'deviceModel', $cordovaDevice.getModel());
                window.localStorage.setItem( 'deviceUUID', $cordovaDevice.getUUID());
            }
        }

   $cordovaPushV5.initialize(options).then(function() {
    // start listening for new notifications
    $cordovaPushV5.onNotification();
    // start listening for errors
    $cordovaPushV5.onError();
    
    // register to get registrationId
    $cordovaPushV5.register().then(function(registrationId) {
      // save `registrationId` somewhere;
      $rootScope.registrationID = registrationId;
      console.log('Device registered');
      console.log(registrationId);
    })
  });

    $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
        // e.message
        console.log(e.message);
    });

    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, notification){
          // this is the actual push notification. its format depends on the data model from the push server
            $rootScope.notifications.push(notification.message);
            window.localStorage.setItem( 'notifications', $rootScope.notifications);
            alert('message = ' + notification.message);
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
    });

    console.log(cordova.plugins.backgroundMode.isActive());
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'notiCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
