angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $rootScope, $location, $state, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //VARIÁVEIS INCIAIS
  $scope.web = "https://haskell-maydandrea.c9users.io";
  //$scope.web = "https://hask-aekelly.c9users.io";
  //$rootScope.pid = null;
  
  $('.desativa_logado').each(function(){
    $(this).removeClass('hide');
  });
  $('.ativa_logado').each(function(){
    $(this).addClass('hide');
  });
  
  $('#animais_adocao').click();
  
  $scope.getDadosPessoa = function(){
    
    var url = $scope.web + '/pessoa/listar/' + $rootScope.pid;
      
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
      nome : $('#pessoaNome').val(),
      cpf : $('#pessoaCpf').val(),
      endereco : $('#pessoaEndereco').val(),
      contato : $('#pessoaContato').val()
    };
    
    var url = $scope.web + '/pessoa/alterar/' + $rootScope.pid;
    
    /*$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.put['dataType'] = 'json';
    $http.put(url, json_pessoa)
    .success(function(response){
      
    })
    .error(function(data, status, header){
      console.log( status);

    });*/
    
    if(confirm("Tem certeza que deseja fazer a alteração?")){
    
      $http({
        method: 'PUT',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        /*headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin" : "self"
        },*/
        data: json_pessoa
      });
      
      $state.go('app.animais_adocao');
  
    }
    /**var json_pessoa = {
      nome : $scope.pessoaNome,
      cpf : $scope.pessoaCpf,
      endereco : $scope.pessoaEndereco,
      contato : $scope.pessoaContato
    };
    
    var url = $scope.web + '/pessoa/alterar/' + $rootScope.pid;
    
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.put['dataType'] = 'json';
    $http.put(url, json_pessoa)
    .success(function(response){
      
    })
    .error(function(data, status, header){
      console.log( status);

    });
    
    
    /**$http({
      method: 'PUT',
      url: url,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin" : "self"
      },
      data: json_pessoa
    }).then(function (response){
      
        
      
    }, function errorCallback(response){
        
      alert("Não foi possível efetuar as alterações!");
      
    }); 
   **/ 
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
        
        $('.desativa_logado').each(function(){
          $(this).addClass('hide');
        });
        $('.ativa_logado').each(function(){
          $(this).removeClass('hide');
        });

        window.location = "#/app/animais_adocao";
      
    }, function errorCallback(response){
        
        alert("E-mail ou senha incorretos!");
        
      });
    
  }
  
  $scope.logout = function() {
  
    $rootScope.pid = null;
    
    $('.desativa_logado').each(function(){
      $(this).removeClass('hide');
    });
    $('.ativa_logado').each(function(){
      $(this).addClass('hide');
    });
    
    window.location = '#/app/animais_doacao';
    
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
      headers: {'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'}  
    }).then(function successCallback(response){

      alert('Pet excluído com sucesso!');
      
      setTimeout($scope.meus_pets(), 1000);
      
    }, function errorCallback(response){
      
      alert("Você não pode excluir este pet pois existe(m) pessoa(s) candidatada(s).");
      
    });
  
  }
  
  $scope.meus_pets = function(){

    var data = $scope.data;
    $http.get($scope.web + '/pet/listarpets/' + $rootScope.pid, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){

      var str = [];
   
      if(response.data['resp'].length > 0){

        var hide = "";
        
        if($rootScope.pid == null)
          hide = "hide";

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
          str.push('<button class="button button-block button-assertive ' + hide + ' ativa_logado" ng-controller="DoacaoCtrl" ng-click="excluir_pet(' + response.data['resp'][i]['id'] + ')"><i class="icon ion-ios-trash"></i></button>');
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
  
  $scope.pets_candidatados = function(){

    var data = $scope.data;
    $http.get($scope.web + '/interessado/listarpets/' + $rootScope.pid, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){

      var str = [];
   
      if(response.data['resp'].length > 0){

        var hide = "";
        
        if($rootScope.pid == null)
          hide = "hide";

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
          str.push('<button class="button button-block button-assertive ' + hide + ' ativa_logado" ng-controller="DoacaoCtrl" ng-click="excluir_candidatura_pet(' + response.data['resp'][i]['id'] + ')"><i class="icon ion-ios-trash"></i></button>');
          str.push('</div>');
          str.push('</ion-item>');
          
        }
        
      }else{

          str.push('<ion-item>');
          str.push('<div class="msg_vazio">');
          str.push('<h4>Você não se candidatou a nenhum animal!</h4>');
          str.push('</div>');
          str.push('</div>');
          str.push('</ion-item>');
        
      }
      
      str = str.join('');
      $('.pets_candidatados_field').html($compile(str)($scope));
      
    });
  
  }

$scope.candidatar_pet = function(petId){

    var json_adocao = {
      idpessoa : $rootScope.pid,
      idpet : petId
    }

    $http.post($scope.web + '/interessado/inserir', json_adocao,{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){
    
      alert('Parabéns, você se candidatou para ser o dono deste animal, caso seja escolhido o doador entrerá em contato.');
    
    }, function errorCallback(response){
      
      alert("Você já está candidatado a esta adoção.");
      
    });
    
}
  
$scope.animais_adocao = function(){

    var data = $scope.data;
    $http.get($scope.web + '/pet/listar', {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
    }).then(function successCallback(response){

      var str = [];
   
      if(response.data['resp'].length > 0){
        
        var hide = "";
        
        if($rootScope.pid == null)
          hide = "hide";
        
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
          str.push('<button class="button button-block button-positive '+ hide +' ativa_logado" ng-controller="DoacaoCtrl" ng-click="candidatar_pet(' + response.data['resp'][i]['id'] + ')"><i class="icon ion-heart"></i></button>');
          str.push('</div>');
          str.push('</ion-item>');
          
        }
        
      }else{

          str.push('<ion-item>');
          str.push('<div class="msg_vazio">');
          str.push('<h4>Não existe animais para adoção!</h4>');
          str.push('</div>');
          str.push('</div>');
          str.push('</ion-item>');
        
      }
      
      str = str.join('');
      $('.animais_field').html($compile(str)($scope));
      
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