var app = angular.module('yusome', ['ngRoute', 'ngResource']).run(function ($rootScope, $http, $location) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    $rootScope.signout = function () {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
        $location.path('/login');
    };
});

app.config(function ($routeProvider) {
    $routeProvider
    //the timeline display
        .when('/todo', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        //the login display
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //the signup display
        .when('/', {
            templateUrl: 'register.html',
            controller: 'authController'
        });
});

app.service('postService', function ($http, $rootScope) {
    this.sendUserPost = function (data, callback) {
        $http.post('/api/posts', data).success(function (result) {
            if (!!result) {
                callback(result);
            }
        });
    };
    this.getData = function (callback) {
        var postObj = [];
        $http.get('/api/posts').success(function (getPosts) {
            for (var i in getPosts) {
                if (getPosts[i].created_by == $rootScope.current_user) {
                    postObj.push(getPosts[i])
                }
            }
            callback(postObj);
        })
    }
});


app.controller('mainController', function (postService, $scope, $rootScope,$location) {
    $scope.current_user = $rootScope.current_user;

    if(!$rootScope.authenticated){
        $location.path('/login');
    }
    else {
        postService.getData(function (getPosts) {
            $scope.posts = getPosts;
        });
    }
    $scope.newPost = {created_by: '', text: '', created_at: ''};

    $scope.post = function () {
        $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.sendUserPost($scope.newPost, function (status) {
            if (status) {
                postService.getData(function (getPosts) {
                    $scope.posts = getPosts;
                });
                document.querySelector('.inputPosts').value = '';
            }
        });
    };
});

app.controller('authController', function ($scope, $http, $rootScope, $location) {
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function () {
        $http.post('/auth/login', $scope.user).success(function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/todo');
            }
            else {
                $scope.error_message = data.message;
            }
        });
    };

    $scope.register = function () {
        $http.post('/auth/signup', $scope.user).success(function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/todo');
            }
            else {
                $scope.error_message = data.message;
            }
        });
    };

});