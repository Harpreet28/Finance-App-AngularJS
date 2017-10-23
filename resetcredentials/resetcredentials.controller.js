(function () {
    'use strict';

    angular
        .module('app')
        .controller('ResetCredentialsController', ResetCredentialsController);

    ResetCredentialsController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function ResetCredentialsController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.getSecurityQuestions = getSecurityQuestions;
        vm.verifySecurityAnswers = verifySecurityAnswers;
        vm.updatePassword = updatePassword;
        
        function getSecurityQuestions() {
            vm.dataLoading = true;
            console.log("inside security ques");
            UserService.GetUserDetailsByUserName(vm.user.username)
                .then(function (response) {
                    if (response.success) {
                    		console.log("success");
                    		vm.user.question1 = response.data.Question1;
                    		vm.user.question2 = response.data.Question2;
                    		angular.element(document.querySelector("#userNameContainer")).removeClass("ng-show");
                    		angular.element(document.querySelector("#userNameContainer")).addClass("ng-hide");
                    		angular.element(document.querySelector("#securityQuestionsContainer")).removeClass("ng-hide");
                    } else {
                        FlashService.Error(response.message);	
                    }
                });
        }
        
        function verifySecurityAnswers(){
        		console.log("inside verify");
        		UserService.GetUserDetailsByUserName(vm.user.username)
        			.then(function (response) {
        				if (response.success) {
        					angular.element(document.querySelector("#securityQuestionsContainer")).addClass("ng-hide");
        					if ((vm.user.answer1 == response.data.Answer1) && (vm.user.answer2 == response.data.Answer2)){
        						vm.user.password = response.data.Password;
        						angular.element(document.querySelector("#displayPasswordContainer")).removeClass("ng-hide");
        						angular.element(document.querySelector("#displayPasswordContainer")).addClass("ng-show");
        					} else {
        						angular.element(document.querySelector("#newPasswordContainer")).removeClass("ng-hide");
        						angular.element(document.querySelector("#newPasswordContainer")).addClass("ng-show");
        					}
        				} else {
        					FlashService.Error(response.message);	
        				}
        			});
        }
        
        
        //Make backend call to update the new password
        //Return the login page 
        function updatePassword(){
        		console.log("inside update password");
        		if(vm.user.password == vm.password_copy){
        			console.log("New password set");
        			//call Services to update password
        			vm.password_set=true;
        			vm.password_mismatch = false;
        		} else {
        			console.log("Password mismatch!");
        			vm.password_mismatch = true;
        		}
        }
    }

})();
