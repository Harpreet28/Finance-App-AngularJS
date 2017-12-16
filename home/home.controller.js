(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$scope', '$timeout', '$window', 'FlashService', '$location', '$route', '$filter'];
    function HomeController(UserService, $rootScope, $scope, $timeout, $window,  FlashService, $location, $route, $filter) {
        var vm = this;

        vm.user = {};
        vm.tickerSymbols = [];
        vm.addTickerSymbols = addTickerSymbols;
        vm.deleteTickerSymbols = deleteTickerSymbols;
        vm.setInputValue = setInputValue;
        vm.sort_by = sort_by;
        vm.isToggled = isToggled;
        vm.predicate = predicate;
        vm.itemsPerPage = 10;
        vm.saveProfileChanges = saveProfileChanges;
        vm.editProfileObj = {};
        vm.editProfile = editProfile;
        vm.cancelEditProfile = cancelEditProfile;
        vm.displayEditProfileSection = displayEditProfileSection;
        vm.isTickerValid = isTickerValid;
        vm.editProfileSuccess = false;
        vm.addTickerSuccess = false;
        vm.deleteTickerSuccess = false;
        vm.showEditSection = '';

        initController();

        function initController() {
            console.log("Home Controller - Init Controller");
            vm.sortingOrder = 'longName';
            vm.pageSizes = [5,10,25,50];
            vm.reverse = false;
            getAllTickerSymbols();
        }

        function setInputValue(result){
            vm.AddTickerSymbolName = result.ticker;
        }
        function editProfile(){
            vm.showEditSection = '';
            $location.path('/profile');
        }
        function cancelEditProfile(){
            vm.showEditSection = '';
            vm.editProfileSuccess = false;
        }
        function displayEditProfileSection(){
            vm.editProfileObj = angular.copy(vm.user);
            vm.showEditSection = true;
        }
        $scope.$watch('vm.user.DOB', function () {
            vm.editProfile.DOB = $filter('date')(vm.user.DOB, "MM/dd/yyyy");
        });

        function isToggled(index){
            vm.showDetails = vm.showDetails == index ? -1 : index;
        }

        function isTickerValid () {
            for ( var i = 0; i <= vm.tickerSymbols.length; i++){
                if(vm.tickerSymbols[i] && (vm.tickerSymbols[i].ticker === vm.AddTickerSymbolName)) {
                    vm.isTickerValidFlag = true;
                    return;
                } else{
                    vm.isTickerValidFlag = false;
                }   
            }
        }
        // change sorting order
       function predicate(val) {
          return val[vm.sortingOrder];
        }
        function sort_by(newSortingOrder){
            if (vm.sortingOrder == newSortingOrder){
              vm.reverse = !vm.reverse;
            }else{
                vm.sortingOrder = newSortingOrder;
            }  
        }

        function getAllTickerSymbols(){
                console.log("Home Controller - Get All Ticker Symbols ");
                UserService.getAllTickerSymbols()
                .then(function (response) {
                    if (response.success) {
                            response.data.forEach(function(data){
                                vm.tickerSymbols.push(data); 
                            });
                            loadCurrentUser();
                    } else {
                            FlashService.Error(response.message);
                    }
                })
        }
        
        function loadCurrentUser() {
                console.log("Home Controller - Load Current User");
            UserService.GetUserDetailsByUserName($rootScope.globals.currentUser.username)
                .then(function (response) {
                        if (response.success) {
                            vm.user = response.data;
                            loadUserTickersDetails(vm.user.UserId);
                        }
                });
        }
        
        function loadUserTickersDetails(userId){
                console.log("Home Controller - Load User Ticker Details ");
                UserService.GetUserTickersDetails(userId)
                .then(function (response) {
                    if (response.success) {
                            vm.UserTickerSymbols = response.data;
                            if(vm.UserTickerSymbols){
                                angular.forEach(vm.UserTickerSymbols, function (ticker) {
                                    ticker.regularMarketPrice = parseFloat(ticker.regularMarketPrice);
                                    ticker.RegularMarketChangePercent = parseFloat(ticker.RegularMarketChangePercent);
                                });
                            }
                            console.log(vm.UserTickerSymbols);
                    } else {
                            FlashService.Error(response.message);
                    }
                })
        }

        function addTickerSymbols(){
                console.log("Home Controller - Add Ticker Symbol");
                vm.addTickerSymbolName = vm.AddTickerSymbolName;
                UserService.UpdateTickerSymbols(vm.user.UserId, 0, vm.AddTickerSymbolName, true).
                    then(function (response) {
                        if (response.success) {
                            initController();
                            $window.scrollTo(0, 0);
                            vm.AddTickerSymbolName = '';
                            vm.addTickerSuccess = true;
                            $timeout(function() {
                                vm.addTickerSuccess = false;
                        }, 5000);
                        } else {
                            FlashService.Error(response.message);
                        }
                    })
        }
        
        function deleteTickerSymbols(DeleteTickerSymbolName){
            console.log("Home Controller - Delete Ticker Symbol" + DeleteTickerSymbolName);
            vm.deleteTickerSymbolName = DeleteTickerSymbolName;
            UserService.UpdateTickerSymbols(vm.user.UserId, 0, DeleteTickerSymbolName, false).
                then(function (response) {
                    if (response.success) {
                        initController();
                        $window.scrollTo(0, 0);
                        vm.deleteTickerSuccess = true;
                        $timeout(function() {
                            vm.deleteTickerSuccess = false;
                        }, 5000);
                    } else {
                        FlashService.Error(response.message);
                    }
                })
        }
        function saveProfileChanges(){
            vm.editProfileObj = {
                UserName: vm.user.UserName,
                Password: vm.editProfileObj.Password,
                FirstName: vm.editProfileObj.FirstName,
                LastName: vm.editProfileObj.LastName,
                DOB: $filter('date')(vm.user.DOB, "dd/MM/yyyy"),
                EmailAddress: vm.editProfileObj.EmailAddress,
                Address: vm.editProfileObj.Address,
                UserId: vm.user.UserId,
                UserTickerSymbols: [
                ]
            };
            console.log("Home Controller - Update user profile details" + vm.editProfileObj);
            UserService.UpdateUserDetails(vm.editProfileObj).
                then(function (response) {
                    if (response.success) {
                        vm.editProfileSuccess = true;
                        vm.showEditSection = '';
                        $timeout(function() {
                            vm.editProfileSuccess = false;
                        }, 5000);
                        loadCurrentUser();
                    } else {
                        FlashService.Error(response.message);
                    }
                })
        }
    }

})();