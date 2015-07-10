(function(){
var app = angular.module('starter', ['ionic', 'ngRoute']);
var tab;
var img;

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {templateUrl : 'log.html'})
  .when('/up', {templateUrl : 'up.html'})
  .when('/home', {templateUrl : 'home.html'})
  .when('/list', {templateUrl : 'list.html'})
  .when('/view', {templateUrl : 'view.html'})
  .otherwise({redirectTo : '/'})
}]);

app.controller('upController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.inscription = function () {
    if ($scope.email !== "" && $scope.pass !== "") {
      $http.post('http://remikel.fr/api.php?option=inscription', {'password' : $scope.pass, 'email' : $scope.email})
        .success(function (data, status, headers, config) {
          if (!data.error) {
            console.log(data);
            $location.path('/home');
          } else {
            $scope.error = data.error;
            $scope.invalid = true;
            console.log('erreur');
          }
        })
        .error(function (data, status, headers, config) {
              $scope.error = data.error;
              $scope.invalid = true;
              console.log('erreur');
        })
    }
  }
}]);

app.controller('logController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.login = function () {
    if ($scope.email !== "" && $scope.pass !== "")
      $http.post('http://remikel.fr/api.php?option=connexion', {'password' : $scope.pass, 'email' : $scope.email})
        .success(function (data, status, headers, config) {
            if (!data.error) {
              if(localStorage.getItem('token') !== null) {
                localStorage.clear();
                localStorage.setItem('token', data.token + '|' + $scope.email);
              } else {
                localStorage.setItem('token', data.token + '|' + $scope.email);
              }
              $location.path('/home');
            } else {
              $scope.error = data.error;
              $scope.invalid = true;
              console.log('erreur');
            }
        })
        .error(function (data, status, headers, config) {
              $scope.error = data.error;
              $scope.invalid = true;
              console.log('erreur');
        })
  }
}]);

app.controller('listController', ['$scope', '$http', function ($scope, $http) {
  console.log(localStorage.getItem('token'));
  if (localStorage.getItem('token')) {
    tab = localStorage.getItem('token').split('|');
    console.log(tab[0]);
    $http.post('http://remikel.fr/api.php?option=toutlemonde', {'email' : tab[1], 'token' : tab[0]})
    .success(function (data, status, headers, config) {
      if (!data.error) {  
        console.log(img);
        console.log(data.data);
        $scope.list = data.data;
      } else {
        $scope.error = data.error;
        $scope.invalid = true;
        console.log('erreur');
      }
    })
    .error(function (data, status, headers, config) {
          $scope.error = data.error;
          $scope.invalid = true;
          console.log('erreur');
    })
  }
  $scope.show = function ( id ) {    
      ud_user = id;
      console.log(ud_user);
  }

}]);

app.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, {quality : 10});

      return q.promise;
    }
  }
}]);

app.controller('homeController', ['$scope', 'Camera', '$location' , function ($scope, Camera, $location) {

  $scope.snap = function () {
          Camera.getPicture().then(function(imageURI) {
/*            var image = document.getElementById('myImage');
            image.src = imageURI;*/
            img = imageURI;
            $location.path('/list');
          }, function(err) {
            console.log(err);
          });
  }
}]);

app.controller('view', ['$scope', '$http', function ($scope, $http) {
  tab = localStorage.getItem('token').split('|');
    
    $http.post('http://remikel.fr/api.php?option=newsnap', {'email' : tab[1], 'token' : tab[0]})
    .success(function (data, status, headers, config) {
      if (!data.error) {
        console.log(data.data.length);
        console.log(data.data);
        $scope.img = data.data;
      } else {
        $scope.error = data.error;
        $scope.invalid = true;
        console.log('erreur');
        console.log(data.error);
      }
    })
    .error(function (data, status, headers, config) {
          $scope.error = data.error;
          $scope.invalid = true;
          console.log('erreur');
    })
    $scope.tap = function (value) {
      console.log(value);
      var imageV = document.getElementById('vu');
      imageV.src = value;
    }
}]);

app.controller('sendController', ['$scope','$location', function ( $scope, $location ) {

$scope.send = function () {
    tab = localStorage.getItem('token').split('|');

      document.addEventListener('deviceready', function () {

          var options = new FileUploadOptions();
          options.fileKey="file";
          options.fileName="myImage.jpeg";
          options.mimeType="image/jpeg";
          options.headers = {};

           params = {
              email : tab[1],
              token : tab[0],
              u2 : ud_user,
              temps : 10
           };

          options.params = params;

          var ft = new FileTransfer();
          ft.upload(img, encodeURI('http://remikel.fr/api.php?option=image'), 
            function (success) {
              $scope.errore = success;
             console.log(success);
            }, function (err) {
              $scope.errore = err;
              console.log(err) 
            }, options);
             $location.path('/home');
    });
}
}]);

})();
