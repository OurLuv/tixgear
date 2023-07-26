/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2022
 */
(function(){
	'use strict';
	
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
		S.loaded = false;
		
		S.path = 'orders';
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
				$rootScope.$broadcast('getCart', {callback: false});
				S.loadContent();
			}
		});
		
		S.loadContent = function(){
			let request = R.GetRequest($.B24.params({command: 'GET_ORDERS'}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel) message = $.B24.Message(response).join('<br/>');
						growl.error(message);
					
					} else {
						S.orders = [];
						if (response.orderList.length) {
							for (let i = 0; i < response.orderList.length; i++) {
								let order = response.orderList[i];
								if (order.statusExtStr !== 'CANCELLING' && order.statusExtStr !== 'CANCELLED') {
									S.orders.push(order);
								}
							}
							S.orders.sort((a, b) => b.date - a.date);
						}
					}
					S.loaded = true;
				}, function(response){console.log(response)});
			}
		};
		
		S.$watch('orders', function(){
			if (typeof S.orders !== 'undefined') {
				for (let i in S.orders) {
					let order = S.orders[i];
					
					order.currencySymbol = order.currency;
					order.currencyFont = false;
					if ($.B24.currency[order.currency]) {
						order.currencySymbol = $.B24.currency[order.currency];
						order.currencyFont = true;
					}
				}
				S.loaded = true;
			}
		});
		
		S.removeOrder = function(orderId){
			let request = Request.GetRequest($.B24.params({command: 'DELETE', destination: 'ORDER', id: orderId}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel) message = $.B24.Message(response).join('<br/>');
						growl.error(message);
					
					} else {
						$rootScope.$broadcast('getHeaderInfo');
						S.loadContent();
					}
				}, function(response){console.log(response)});
			}
		};
		
		$rootScope.$on('ordersReload', function(){
			S.loadContent();
		});
	};
})();
