// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

  .state('app.cadastrar_pessoa', {
    url: '/cadastrar_pessoa',
    views: {
      'menuContent': {
        templateUrl: 'templates/cadastrar_pessoa.html',
        controller: 'PessoaCtrl'
      }
    }
  })

  .state('app.editar_perfil', {
      url: '/editar_perfil',
      views: {
        'menuContent': {
          templateUrl: 'templates/editar_perfil.html',
          controller: 'AppCtrl'
        }
      }
    })
    .state('app.animais_adocao', {
      url: '/animais_adocao',
      views: {
        'menuContent': {
          templateUrl: 'templates/animais_adocao.html',
          controller: 'DoacaoCtrl'
        }
      }
    })
    .state('app.cadastrar_doacao', {
      url: '/cadastrar_doacao',
      views: {
        'menuContent': {
          templateUrl: 'templates/cadastrar_doacao.html',
          controller: 'DoacaoCtrl'
        }
      }
    })
    .state('app.meus_pets', {
      url: '/meus_pets',
      views: {
        'menuContent': {
          templateUrl: 'templates/meus_pets.html',
          controller: 'DoacaoCtrl'
        }
      }
    })
    .state('app.adocoes_candidatadas', {
      url: '/adocoes_candidatadas',
      views: {
        'menuContent': {
          templateUrl: 'templates/adocoes_candidatadas.html',
          controller: 'DoacaoCtrl'
        }
      }
    })
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
