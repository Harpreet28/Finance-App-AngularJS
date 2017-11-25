(function () {
    'use strict';

    angular
        .module('app')
        .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function ForgotPasswordController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.getSecurityQuestions = getSecurityQuestions;
        vm.verifySecurityAnswers = verifySecurityAnswers;
     //   vm.updatePassword = updatePassword;
        
        function getSecurityQuestions() {
    			FlashService.deleteFlashMessage();
            vm.dataLoading = true;
            UserService.GetUserDetailsByUserName(vm.user.username)
                .then(function (response) {
                    if (response.success) {
                    		if (response.data.UserId != 0) {
                    			console.log(response.data);
	                    		vm.user.question1 = response.data.Question1;
	                    		vm.user.question2 = response.data.Question2;
	                    		angular.element(document.querySelector("#userNameContainer")).removeClass("ng-show");
	                    		angular.element(document.querySelector("#userNameContainer")).addClass("ng-hide");
	                    		angular.element(document.querySelector("#securityQuestionsContainer")).removeClass("ng-hide");
                    		} else {
                    			FlashService.Error("Username not found");
                    		}
                    } else {
                        FlashService.Error(response.message);	
                    }
                });
        }
        
        function verifySecurityAnswers(){
        		FlashService.deleteFlashMessage();
        		UserService.GetUserDetailsByUserName(vm.user.username)
        			.then(function (response) {
        				if (response.success) {
        					if ((vm.user.answer1 == response.data.Answer1) && (vm.user.answer2 == response.data.Answer2)){
        						vm.user.password = response.data.Password;
        						angular.element(document.querySelector("#securityQuestionsContainer")).addClass("ng-hide");
        						angular.element(document.querySelector("#displayPasswordContainer")).removeClass("ng-hide");
        						angular.element(document.querySelector("#displayPasswordContainer")).addClass("ng-show");
        					} else {
        						vm.user.answer1="";
        						vm.user.answer2="";
        						FlashService.Error("The answers are incorrect. Please enter the correct answers.");
        					}
        				} else {
        					FlashService.Error(response.message);        					
        				}
        			});
        }
        
        
         
        /*function updatePassword(){
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
        }*/
    }

})();
