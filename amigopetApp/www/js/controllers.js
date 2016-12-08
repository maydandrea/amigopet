angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //VARIÁVEIS INCIAIS
  //$scope.web = "https://haskell-maydandrea.c9users.io";
  $scope.web = "https://hask-aekelly.c9users.io";
  $rootScope.pid = null;
  
  angular.element( document.querySelector('.ativa_logado')).addClass('hide');
  
  $scope.getDadosPessoa = function(){
    
    var url = $scope.web + '/pessoa/listar/' + $scope.pid;
      
    $http.get(url, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function (response){
      
        $scope.pessoaNome = response.data['nome'];
        $scope.pessoaCpf = response.data['cpf'];
        $scope.pessoaEndereco = response.data['endereco'];
        $scope.pessoaContato = response.data['contato'];
      
    }, function errorCallback(response){
        
      alert("Não foi possível carregar as informações!");
      
    });
    
  }
  
$scope.editarDadosPessoa = function(){
    
    var json_pessoa = {
      nome : $scope.pessoaNome,
      cpf : $scope.pessoaCpf,
      endereco : $scope.pessoaEndereco,
      contato : $scope.pessoaContato
    };
    
    var url = $scope.web + '/pessoa/alterar/' + $rootScope.pid;
    
    $http({
      method: 'PUT',
      url: url,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      data: json_pessoa
    }).then(function (response){
      
        
      
    }, function errorCallback(response){
        
      alert("Não foi possível efetuar as alterações!");
      
    });
    
  }
  
})

.controller('LoginCtrl', function($scope, $http, $rootScope) {
  $scope.data = {};
  
  $scope.logar = function() {
  
    var url = $scope.web + '/login/' + $scope.data.email + '/' + $scope.data.senha;
    
    $http.get(url, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function (response){
      
        $rootScope.pid = response.data['pid'];
        
        $('.desativa_logado').addClass('hide');
        $('.ativa_logado').removeClass('hide');

        window.location = "#/app/animais_adocao";
      
    }, function errorCallback(response){
        
        alert("E-mail ou senha incorretos!");
        
      });
    
  }

})

.controller('PessoaCtrl', function($scope, $http) {
    $scope.data = {};
 
    $scope.cadastrar_pessoa = function() {
  
      var data = $scope.data;
      
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

.controller('DoacaoCtrl', function($scope, $rootScope, $http, $compile) {
  $scope.data = {};
  
  $scope.cadastrar_doacao = function(){
    
      var data = $scope.data;
      inserirPet(data.nome_animal, data.raca, data.cor, data.idade, data.especie, eval($rootScope.pid), $scope.web);
  
  }
  
  $scope.excluir_pet = function(petId){

    $http.delete($scope.web + '/pet/deletar/' + petId, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){

      alert('Pet excluído com sucesso!');
      $scope.meus_pets();
      
    });
  
  }
  
  $scope.meus_pets = function(){

    var data = $scope.data;
    $http.get($scope.web + '/pet/listarpets/' + $scope.pid, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){

      var str = [];
   
      if(response.data['resp'].length > 0){

        for(var i = 0; i < response.data['resp'].length; i++){
          
          str.push('<ion-item>');
          str.push('<div style="width:85%; float:left;">');
          str.push('<a href="#/app/animais_adocao/' + response.data['resp'][i]['id']  + '">');
          str.push('<h3>' + response.data['resp'][i]['nome']  + '</h3>');
          str.push('<p>' + response.data['resp'][i]['raca']  + '</p>');
          str.push('<p>' + response.data['resp'][i]['especie']  + '</p>');
          str.push('</a>');
          str.push('</div>');
          str.push('<div style="width:15%; float:right;">');
          str.push('<button class="button button-block button-assertive" ng-controller="DoacaoCtrl" ng-click="excluir_pet(' + response.data['resp'][i]['id'] + ')"><i class="icon ion-ios-trash"></i></button>');
          str.push('</div>');
          str.push('</ion-item>');
          
        }
        
      }else{

          str.push('<ion-item>');
          str.push('<div class="msg_vazio">');
          str.push('<h4>Você não possui animais para adoção!</h4>');
          str.push('</div>');
          str.push('</div>');
          str.push('</ion-item>');
        
      }
      
      str = str.join('');
      $('.meus_pets_field').html($compile(str)($scope));
      
    });
  
  }
  
  function inserirPet(nome_animal, raca, cor, idade, especie, pessoaId, ws){

    var json_pet = {
      nome : nome_animal,
      raca : raca,
      cor : cor,
      idade : idade,
      especie : especie,
      idpessoa : pessoaId
    };
    
    $http.post(ws + '/pet/inserir', json_pet, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){
   
      alert("Cadastro efetuado com sucesso!");
      window.location = "#/app/animais_adocao";
      
    }, function errorCallback(response){
      
      alert("Infelizmente não foi possível efetuar o cadastro, tente novamente mais tarde!");
      
    });
    
  }
  
})

.controller('AnimaisAdocaoCtrl', function($scope, $rootScope) {
  $scope.animais = [
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 1 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 2 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 3 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 4 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 5 },
    { title: 'Max', subtitle: 'Labrador', location: 'Santos - SP', id: 6 }
  ];
  
  $scope.redirect = function(url){
    
    $rootScope.pid != null ? window.location = "#/app/editar_perfil" : window.location = "#/app/login";
    
  }
  
})

.controller('AnimalCtrl', function($scope, $stateParams) {
});