angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //VARIÁVEIS INCIAIS
  //$scope.web = "https://haskell-maydandrea.c9users.io";
  $scope.web = "https://hask-aekelly.c9users.io";
  $scope.pid = null;

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
})

.controller('LoginCtrl', function($scope, $http) {
  $scope.data = {};
  
  $scope.logar = function() {
  
    var url = $scope.web + '/login/' + $scope.data.email + '/' + $scope.data.senha;
    
    $http.get(url, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function (response){
      
        $scope.pid = response.data['pid'];
        window.location = "#/app/playlists";
      
    }, function errorCallback(response){
        
        alert("E-mail ou senha incorretos!");
        
      });
    
  }

})

.controller('PessoaCtrl', function($scope, $http) {
    $scope.data = {};
 
    $scope.cadastrar_pessoa = function() {
  
      var data = $scope.data;
      
      var json_pessoa = {
        nome : data.nome,
        cpf : data.cpf,
        endereco : data.endereco,
        contato : data.contato
      };
      
      inserirPessoa(data.nome, data.cpf, data.endereco, data.contato, data.email, data.senha, $scope.web);
        
    }
    
    function inserirPessoa(nome, cpf, endereco, contato, email, senha, ws){
      
      var json_pessoa = {
        nome : nome,
        cpf : cpf,
        endereco : endereco,
        contato : contato
      };
      
      $http.post(ws + '/pessoa/inserir', json_pessoa, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
      }).then(function (response){
        
          var pessoaId = response.data['resp'].replace('CREATED ', '');
          inserirLogin(email, senha, eval(pessoaId), ws);
          return pessoaId;
        
      });
      
    }
    
    function inserirLogin(email, senha, pessoaId, ws){
      
      var json_login = {
        email : email,
        senha : senha,
        idpessoa : pessoaId
      };
      
      $http.post(ws + '/login/inserir', json_login, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
      }).then(function successCallback(response){
     
        alert("Cadastro efetuado com sucesso!");
        $scope.login();
        
      }, function errorCallback(response){
        
          if(response.data['error'] != undefined && response.data['error'].indexOf('23505') != -1){
            
            alert("E-mail já cadastrado!");
            
          }else{
          
            alert("Infelizmente não foi possível efetuar o cadastro, tente novamente mais tarde!");
          
          }
        
      });
      
    }
    
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 1 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 2 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 3 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 4 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 5 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});