(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/tickerSymbols').then(success, error('Failed to get all tickerSymbols'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(success, error('Failed to getuser by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(success, error('Failed to get user by username'));
        }

        function Create(user) {
            return $http.post('/api/users', user).then(success, error('Failed to get creat user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(success, error('Failed to get update user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(success, error('Failed to get delete user'));
        }

        // private functions

        function success(res) {
            return res.data;
        }

        function error(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
