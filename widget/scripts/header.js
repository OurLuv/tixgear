/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2022
 */

'use strict';

(function(){
	$.fancybox.defaults.touch = false;
	
	function isActive(url){
		return window.location.href.indexOf(url) != -1 ? true : false;
	};
	
	angular.module('bilpro')
		.config(['growlProvider', function(growlProvider){growlProvider.globalTimeToLive(5000)}])
		.controller('bilHeader', bilHeader);
	
	function bilHeader(
		$rootScope,
		$scope,
		$location,
		$localStorage,
		$interval,
		growl,
		Request
	){
		let S = $scope,
				L = $location,
				LS = $localStorage,
				R = Request,
				Z = S.config.zone == 'real' ? '' : '_';
				
		S.config = S.$parent.config;
		S.menu = {};
		
		S.openMenu = function(){
			if (typeof LS[Z + 'userId'] !== 'undefined' || LS[Z + 'userId']) {
				let request = R.GetRequest($.B24.params({command: 'GET_USER_INFO'}, S.config, LS));
				if (request) {
					request.$promise.then(function(response){
						if (response.resultCode != 0) {
							let message = response.description;
							if (S.config.devel) message = $.B24.Message(response).join('<br/>');
							growl.error(message);
						
						} else {
							if (response.newOrders) {
								S.menu.orders = response.newOrders;
								let li = document.querySelector('.ordersCount');
								if (li) {
									li.classList.remove('none');
									li.innerHTML = S.menu.orders;
								}
							}
							
							if (response.tickets) {
								S.menu.tickets = response.tickets;
								let li = document.querySelector('.ticketsCount');
								if (li) {
									li.classList.remove('none');
									li.innerHTML = S.menu.tickets;
								}
							}
							
							if (response.promoCodes) {
								S.menu.promocodes = response.promoCodes;
								let li = document.querySelector('.promocodesCount');
								if (li) {
									li.classList.remove('none');
									li.innerHTML = S.menu.promocodes;
								}
							}
							
							if (response.mecs) {
								S.menu.mecs = response.mecs;
								let li = document.querySelector('.mecsCount');
								if (li) {
									li.classList.remove('none');
									li.innerHTML = S.menu.mecs;
								}
							}
						}
					}, function(response){console.log(response)});
				}
			}
			
			let page = $('body').is('.home-page') ? '' : '../',
					menu = [];
			
			$.B24.menu_html = document.querySelector('#menu-template').cloneNode(true);
			$.B24.menu_html.removeAttribute('id');
			$.B24.menu_html.removeAttribute('style');
			
			let menuEvents = $.B24.menu_html.querySelector('.menu-events');
			if (menuEvents) {
				if (typeof S.config.event === 'undefined') {
					if (isActive('/city/')) {
						menuEvents.innerHTML = '<span>' + S.translate.menu.events + '</span>';
					} else {
						menuEvents.innerHTML = '<a href="' + $.B24.href(S.config, page + 'city/', {}) + '">' + S.translate.menu.events + '</a>';
					}
				}
			}
			
			if (typeof LS[Z + 'userId'] !== 'undefined' && LS[Z + 'userId']) { // if user is authorized
				let menuOrders = $.B24.menu_html.querySelector('.menu-orders');
				if (menuOrders) {
					if (isActive('/orders/')) {
						menuOrders.innerHTML = '<span>' + S.translate.menu.orders + '</span>';
					} else {
						menuOrders.innerHTML = '<a href="' + $.B24.href(S.config, page + 'orders/', {}) + '">' + S.translate.menu.orders + '</a>';
					}
					menuOrders.innerHTML += '<i class="ordersCount DIG none"></i>';
				}
				
				let menuTickets = $.B24.menu_html.querySelector('.menu-tickets');
				if (menuTickets) {
					if (isActive('/tickets/')) {
						menuTickets.innerHTML = '<span>' + S.translate.menu.tickets + '</span>';
					} else {
						menuTickets.innerHTML = '<a href="' + $.B24.href(S.config, page + 'tickets/', {}) + '">' + S.translate.menu.tickets + '</a>';
					}
					menuTickets.innerHTML += '<i class="ticketsCount DIG none"></i>';
				}
				
				let menuMecses = $.B24.menu_html.querySelector('.menu-mecses');
				if (menuMecses) {
					if (isActive('/mecs/')) {
						menuMecses.innerHTML = '<span>' + S.translate.menu.mecs + '</span>';
					} else {
						menuMecses.innerHTML = '<a href="' + $.B24.href(S.config, page + 'mecs/', {}) + '">' + S.translate.menu.mecs + '</a>';
					}
					menuMecses.innerHTML += '<i class="mecsCount DIG none"></i>';
				}
				
				let menuPromocodes = $.B24.menu_html.querySelector('.menu-promocodes');
				if (menuPromocodes) {
					if (isActive('/promocodes/')) {
						menuPromocodes.innerHTML = '<span>' + S.translate.menu.promocodes + '</span>';
					} else {
						menuPromocodes.innerHTML = '<a href="' + $.B24.href(S.config, page + 'promocodes/', {}) + '">' + S.translate.menu.promocodes + '</a>';
					}
					menuPromocodes.innerHTML += '<i class="promocodesCount DIG none"></i>';
				}
			}
			
			if (S.config.agr) {
				let menuAgreement = $.B24.menu_html.querySelector('.menu-agreement');
				if (menuAgreement) {
					menuAgreement.innerHTML = '<a href="' + S.config.agr + '" target="_blank">' + S.translate.menu.agreement + '</a>';
				}
			}
			$.fancybox.open($.B24.menu_html.outerHTML);
		};
		
		S.openAuth = function(){
			if (LS[Z + 'userId']) {
				S.AuthorizationV2();
			} else {
				$.B24.OpenAuth(R, S, growl, LS);
			}
		};
		
		S.openBasket = function(){
			$rootScope.$broadcast('openBasket');
		};
		
		S.AuthorizationV2 = () => {
			let url = new URL(`${$.B24.i18n.requestURL}:${$.B24.getPort(S.config.zone)}/user/loginPage`);
			url.searchParams.set('fid', S.config.fid);
			url.searchParams.set('token', S.config.token);
			url.searchParams.set('origin', location.origin);
			url.searchParams.set('return_to', location.href);
			
			let left = (screen.width - 570) / 2;
			let top = (screen.height - 470) / 4;
			
			window.open(url, 'popup', `popup=true,top=${top},left=${left},width=570,height=470`);
		};
		
		S.Message = (e) => {
			let origin = $.B24.i18n.requestURL;
			if (S.config.zone == 'test') origin += `:${$.B24.getPort(S.config.zone)}`;
			if (e.origin == origin) {
				if (e.data == 'logout') {
					localStorage.removeItem('ngStorage-' + Z + 'userId');
					localStorage.removeItem('ngStorage-' + Z + 'sessionId');
					location.reload();
					
				} else {
					try {
						let response = JSON.parse(e.data);
						if (typeof response.email !== 'undefined' && typeof response.userId !== 'undefined' && typeof response.sessionId !== 'undefined') {
							document.body.dispatchEvent(new Event('CONFIRM_EMAIL', {bubbles: true}));
							
							S.config.email = S.email = response.email;
							$.fancybox.close();
							growl.success(S.translate.email.success);
							
							setTimeout(() => {
								if (LS[Z + 'userId'] != response.userId || LS[Z + 'sessionId'] != response.sessionId) {
									LS[Z + 'userId'] = response.userId;
									LS[Z + 'sessionId'] = response.sessionId;
									location.reload();
								}
							}, 100);
						}
					} catch (e) {}
				}
			}
		};
		
		if (parent.window.length) {
			parent.window.addEventListener('message', (e) => S.Message(e));
		} else {
			window.addEventListener('message', (e) => S.Message(e));
		}
	};
})();
