/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2023
 */
(function(){
	'use strict';
	
	let rel = localStorage.getItem('ngStorage-orderHash');
	if (rel) {
		localStorage.removeItem('ngStorage-orderHash');
		window.location.href += JSON.parse(rel);
	}
	
	angular.module('bilpro', ['angular-growl','ngAnimate', 'ngResource', 'ngStorage', 'ngSanitize'])
		.factory('Request', $.B24.Request)
		.directive('masked', $.B24.masked)
		.config(['growlProvider', function(growlProvider){growlProvider.globalTimeToLive(5000)}])
		.controller('bilController', bilController);
		
	function bilController(
		$rootScope,
		$scope,
		$location,
		$localStorage,
		$resource,
		$interval,
		$timeout,
		growl,
		Request
	){
		let S = $scope,
				L = $location,
				LS = $localStorage,
				R = Request;
		
		S.path = 'success';
		$.B24.Config(S, L, LS);
		
		S.$watch('config', function(){
			if (typeof S.config !== 'undefined') {
				$.B24.Translate(S, R);
			}
		});
		
		S.$watch('translate', function(){
			if (typeof S.translate !== 'undefined') {
				$.B24.Auth(R, S, growl, LS, true);
			}
		});
		
		S.$watch('auth', function(){
			if (typeof S.auth !== 'undefined') {
				S.event = window.location.href.replace('success/', '');
			}
		});
	};
})();