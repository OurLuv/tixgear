/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2022
 */
(function(){
	'use strict';
	$.B24.requestDataExt = true;
	
	angular.module('bilpro', ['angular-growl','ngAnimate', 'ngResource', 'ngStorage', 'ngSanitize'])
		.factory('Request', $.B24.Request)
		.directive('imageOnload', $.B24.imageOnload)
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
		
		S.path = 'tickets';
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
			let request = R.GetRequest($.B24.params({command: 'GET_ACTION_EVENTS_GROUPED_BY_TICKETS'}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel) message = $.B24.Message(response).join('<br/>');
						growl.error(message);
						
					} else {
						S.tickets = response.list;
						for (let i in S.tickets) {
							let ticket = S.tickets[i],
									d = ticket.day.split('.');
							ticket.date = Date.parse([d[1], d[0], d[2]].join('.') + ' ' + ticket.time);
						}
						S.tickets.sort((a, b) => b.date - a.date);
					}
					S.loaded = true;
				}, function(response){console.log(response)});
			}
		};
		
		S.removeTickets = function(actionEventId){
			let request = Request.GetRequest($.B24.params({command: 'DELETE', destination: 'TICKETS_BY_ACTION_EVENT', id: actionEventId}, S.config, LS));
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
		
		S.laterThanToday = function(date){
			return moment(date).isAfter();
		};
		
		$rootScope.$on('ticketsReload', function(){
			S.loadContent();
		});
	};
})();
