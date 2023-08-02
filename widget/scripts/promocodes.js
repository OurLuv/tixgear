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
		
		S.path = 'promocodes';
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
			let request = R.GetRequest($.B24.params({command: 'GET_PROMO_CODES'}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel) message = $.B24.Message(response).join('<br/>');
						growl.error(message);
						
					} else {
						S.promocodes = response.promoPackList;
						let active = [], passive = [];
						for (let i in response.promoPackList) {
							let pack = response.promoPackList[i],
									info = S.translate.promocodes.since + ' ' + pack.startTime + ' ' + S.translate.promocodes.until + ' ' + pack.endTime + ' ' + S.translate.promocodes.discount + ' ' + pack.discountPercent + '%';
							if (pack.maxDiscountSum) {
								info += ', ' + S.translate.promocodes.max_discount + ' ' + pack.maxDiscountSum;
							}
							if (pack.maxTickets) {
								info += ', ' + S.translate.promocodes.max_tickets + ' ' + pack.maxTickets + ' ' + S.translate.promocodes.unit;
							}
							if (pack.activeNow) {
								for (let i in pack.promoCodeList) {
									let code = pack.promoCodeList[i];
									code.name = pack.name;
									code.discount = pack.discountPercent;
									code.info = info;
									code.description = pack.description;
									code.pack = pack.promoPackId;
									if (code.used || code.spent) {
										code.active = false;
										passive.push(code);
									} else {
										code.active = true;
										active.push(code);
									}
								}
							} else {
								for (let i in pack.promoCodeList){
									let code = pack.promoCodeList[i];
									code.name = pack.name;
									code.discount = pack.discountPercent;
									code.info = info;
									code.description = pack.description;
									code.pack = pack.promoPackId;
									code.active = false;
									passive.push(code);
								}
							}
						}
						S.promocodes = active.concat(passive);
					}
					S.loaded = true;
				}, function(response){console.log(response)});
			}
		};
		
		S.OpenPack = function(packId){
			for (let i in S.promocodes) {
				let pack = S.promocodes[i];
				if (pack.pack == packId) {
					let html = [
						'<div id="pack-popup">',
							'<div class="popup-title">' + pack.name + '</div>',
							'<div class="popup-content">' + pack.description  + '</div>',
						'</div>',
					];
					$.fancybox.open(html.join(''));
					break;
				}
			}
		};
	};
})();
