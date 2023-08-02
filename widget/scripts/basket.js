/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2022
 */
(function(){
	'use strict';
	
	angular.module('bilpro').controller('bilBasket', bilBasket);
	
	function bilBasket(
		$rootScope,
		$scope,
		$location,
		$localStorage,
		$interval,
		$timeout,
		$window,
		growl,
		Request,
		$http
	){	
		let S = $scope,
				L = $location,
				LS = $localStorage,
				R = Request;
				
		$rootScope.$on('getCart', function(event, args){
			S.getCart(args.callback);
		});
		
		S.disabledBasketPromoCodes = true;
		
		S.getCart = function(callback){
			let request = R.GetRequest($.B24.params({command: 'GET_CART', rawCoordinates: true}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel !== 'undefined') message = $.B24.Message(response).join('<br/>');
						growl.error(message);
						
					} else {
						$interval.cancel(S.cart.timeout.function);
						
						S.cart.timeout.function = false;
						S.cart.timeout.time = false;
						S.cart.timeout.format = false;
						
						if (typeof S.cart.reserve === 'undefined') S.cart.reserve = {};
						S.cart.reserve.data = [];
						S.cart.reserve.tickets = 0;
						
						S.cart.currency = response.currency;
						S.cart.currencySymbol = S.cart.currency;
						S.cart.currencyFont = false;
						if ($.B24.currency[S.cart.currency]) {
							S.cart.currencySymbol = $.B24.currency[S.cart.currency];
							S.cart.currencyFont = true;
						}
						
						for (let i in response.actionEventList) {
							let action = response.actionEventList[i];
							
							if (action.fullNameRequired) S.config.terms.fullName.required = true;
							if (action.phoneRequired) S.config.terms.phone.required = true;
							
							S.cart.reserve.tickets += Object.keys(action.seatList).length;
						}
						
						if (typeof response.time !== 'undefined' && response.time != 0) {
							S.cart.timeout.time = response.time;
							S.cart.timeout.function = $interval(function(){
								S.cart.timeout.time--;
							}, 1000);
							S.cart.reserve.data = response.actionEventList;
						}
						S.cart.totalCharge = response.totalServiceCharge;
						S.cart.totalSum = response.totalSum + response.totalServiceCharge;
						
						S.UpdateBasket();
						
						if (!S.cart.reserve.tickets) S.fullBasket.show = false;
						
						if (callback) {
							$timeout(function(){
								S.MakeTicketString();
							}, 0);
						}
					}
				}, function(response){console.log(response)});
			}
		};
		
		S.MakeTicketString = function(){
			for (let i in S.cart.reserve.data) {
				let ticket = S.cart.reserve.data[i];
				let date = ticket.day.split('.'),
						day = new Date(date[2] + '.' + date[1] + '.' + date[0] + ' '+ ticket.time);
				ticket.date = {
					d: date[0],
					w: S.translate.days[+day.getDay()],
					m: S.translate.months[date[1]],
					y: date[2],
					t: ticket.time
				};
			}
			
			S.fullBasket.loading = false;
		};
		
		$rootScope.$on('UpdateBasket', function(){
			S.UpdateBasket();
		});
		
		S.UpdateBasket = function(){
			S.cart.entries.tickets = 0;
			
			for (let i in S.cart.entries.data) {
				let category = S.cart.entries.data[i];
				for (let i in category) {
					let tariff = category[i];
					S.cart.entries.tickets += parseInt(tariff);
				}
			}
			
			S.miniBasket.tickets = S.cart.reserve.tickets + S.cart.entries.tickets;
			S.miniBasket.show = S.miniBasket.tickets != 0 ? true : false;
			
			let headerHeight;
			if (!document.documentElement.classList.contains('touchevents')) {
				headerHeight = document.getElementsByClassName('bil-header')[0];
				document.getElementsByClassName('basketMini')[0].style.top = (headerHeight.clientHeight + 6) + 'px';
			}
		};
		
		S.ClearBasket = function(){
			S.cart.reserve.tickets = 0;
			for (let i in S.cart.reserve.data) {
				let action = S.cart.reserve.data[i];
				for (let i in action.seatList) {
					let ticket = action.seatList[i];
					let seat = S.FindByAttributeValue('circle', 'sbt:id', ticket.seatId);
					if (typeof seat !== 'undefined') {
						SVGSeatPlan.fn.unMarking(seat);
						SVGSeatPlan.fn.loading(seat);
						seat.removeAttribute('tariff');
						SVGSeatPlan.fn.endLoading(seat, function(){});
					} else {
						let cid = ticket.categoryPriceId,
								tid = typeof ticket.tariffPlanId !== 'undefined' ? ticket.tariffPlanId : 0;
						S.UpdateEntryList(cid, tid, 1);
					}
				}
			}
			S.cart.reserve.data = {};
			S.fullBasket.show = false;
			
			S.miniBasket.tickets = 0;
			S.miniBasket.show = false;
		};
		
		$rootScope.$on('openBasket', function(event, args){
			S.FillBasket(true);
		});
		
		S.$watch('fullBasket.show', function(){
			if (S.fullBasket.show) {
				document.documentElement.classList.add('basket-opened');
				S.fullBasket.loading = true;
				S.fullBasket.processing = false;
				S.checkAgree = false;
				S.getCart(true);
			} else {
				document.documentElement.classList.remove('basket-opened');
			}
		});
		
		S.FillBasket = function(button = false){
			if (button) {
				document.body.dispatchEvent(new Event('BASKET', {
					bubbles: true,
				}));
			}
			
			if (S.cart.entries.tickets) {
				let categoryListByEvents = {};
				
				for (let cid in S.cart.entries.data) {
					let event = S.cart.entries.events[cid],
							category = S.cart.entries.data[cid];
					
					if (typeof categoryListByEvents[event] === 'undefined') {
						categoryListByEvents[event] = [];
					}
					
					for (let tid in category) {
						let item, qty = category[tid];
						if (qty > 0) {
							item = {
								categoryPriceId: cid,
								quantity: qty,
							}
							if (tid > 0) item.tariffPlanId = tid;
							categoryListByEvents[event].push(item);
						}
					}
				}
				
				if (Object.keys(categoryListByEvents).length) {
					async function Reservation(categoryList) {
						let request = R.GetRequest($.B24.params({
							command: 'RESERVATION',
							type: 'RESERVE',
							categoryList: categoryList,
							kdp: S.config.kdp,
						}, S.config, LS));
						
						if (request) {
							request.$promise.then(function(response){
								if (response.resultCode != 0) {
									let message = response.description;
									if (S.config.devel) message = $.B24.Message(response).join('<br/>');
									growl.error(message);
									
								} else {
									
									let entries = {};
									for (let i in response.seatList) {
										let entry = response.seatList[i];
										if (entry.new) {
											if (!entry.placement) {
												document.body.dispatchEvent(new Event('RESERVE', {
													bubbles: true,
												}));
												
												let cid = entry.categoryPriceId,
														tid = typeof entry.tariffPlanId !== 'undefined' ? entry.tariffPlanId : 0;
												if (typeof entries[cid] === 'undefined') entries[cid] = {};
												if (typeof entries[cid][tid] === 'undefined') entries[cid][tid] = 0;
												entries[cid][tid]--;
											}
										}
									}
									for (let cid in entries) {
										for (let tid in entries[cid]) {
											S.cart.entries.data[cid][tid] += entries[cid][tid];
											if (!S.cart.entries.data[cid][tid]) {
												delete S.cart.entries.data[cid][tid];
											}
											S.UpdateEntryList(cid, tid, entries[cid][tid]);
										}
										if (!Object.keys(S.cart.entries.data[cid]).length) {
											delete S.cart.entries.data[cid];
										}
									}
									
									S.fullBasket.show = true;
								}
							}, function(response){console.log(response)});
						}
					}
					
					async function processReservation(categoryLists) {
						for (let eid in categoryLists) {
							await Reservation(categoryLists[eid]);
						}
					}
					
					processReservation(categoryListByEvents);
				}
				
			} else {
				S.fullBasket.show = true;
			}
		};

		S.UpdateEntryList = function(cid, tid, qty){
			if (qty < 0) {
				if (typeof S.categories[cid] !== 'undefined') {
					S.categories[cid].tickets += qty;
					if (tid && typeof S.categories[cid].tariffs !== 'undefined' && typeof S.categories[cid].tariffs[tid] !== 'undefined') {
						S.categories[cid].tariffs[tid].tickets += qty;
					}
				}
				
			} else {
				if (typeof S.categories[cid] !== 'undefined') {
					S.categories[cid].count += qty;
					
					if (S.categories[cid].count > S.categories[cid].availability) {
						S.categories[cid].count = S.categories[cid].availability;
					}
					
					if (typeof S.categories[cid].remainders !== 'undefined') {
						let remainder = 0;
						for (let i in S.categories[cid].remainders) {
							let id = S.categories[cid].remainders[i];
							if (remainder < S.categories[id].availability) remainder = S.categories[id].availability;
						}
						
						for (let i in S.categories[cid].remainders) {
							let id = S.categories[cid].remainders[i];
							if (typeof S.categories[id] !== 'undefined') {
								if (id != cid) {
									if (S.categories[id].availability > S.categories[cid].availability) {
										S.categories[id].count += qty;
										
										if (S.categories[id].count > S.categories[id].availability) {
											S.categories[id].count = S.categories[id].availability;
										}
									}
								}
							}
						}
					}
				}
			}
		};
		
		S.FindByAttributeValue = function(tagName, attribute, value){
			var all = document.getElementsByTagName(tagName);
			for (var i = 0; i < all.length; i++) {
				if (all[i].getAttribute(attribute) == value) {
					return all[i];
				}
			}
		};
		
		S.UnreserveTicket = function(ticket){
			let request = R.GetRequest($.B24.params({command: 'RESERVATION', type: 'UN_RESERVE', seatList: [ticket.seatId]}, S.config, LS));
			if (request) {
				let seat = S.FindByAttributeValue('circle', 'sbt:id', ticket.seatId);
				
				if (typeof seat !== 'undefined') {
					SVGSeatPlan.fn.unMarking(seat);
					SVGSeatPlan.fn.loading(seat);
					
					request.$promise.then(function(response){
						seat.removeAttribute('tariff');
						SVGSeatPlan.fn.endLoading(seat, function(){
							if (response.resultCode != 0) {
								let message = response.description;
								if (S.config.devel !== 'undefined') message = $.B24.Message(response).join('<br/>');
								growl.error(message);
								
							} else {
								document.body.dispatchEvent(new Event('UN_RESERVE', {
									bubbles: true,
								}));
								
								S.fullBasket.loading = true;
								$rootScope.$broadcast('getCart', {callback: true});
							}
						});
					}, function(response){console.log(response)});
					
				} else {
					request.$promise.then(function(response){
						if (response.resultCode != 0) {
							let message = response.description;
							if (S.config.devel !== 'undefined') message = $.B24.Message(response).join('<br/>');
							growl.error(message);
							
						} else {
							document.body.dispatchEvent(new Event('UN_RESERVE', {
								bubbles: true,
							}));
							
							let cid = ticket.categoryPriceId,
									tid = typeof ticket.tariffPlanId !== 'undefined' ? ticket.tariffPlanId : 0;
							S.UpdateEntryList(cid, tid, 1);
							S.fullBasket.loading = true;
							$rootScope.$broadcast('getCart', {callback: true});
						}
					}, function(response){console.log(response)});
				}
			}
		};
		
		S.UnreserveAll = function(){
			let request = R.GetRequest($.B24.params({command: 'RESERVATION', type: 'UN_RESERVE_ALL'}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if(response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel !== 'undefined') message = $.B24.Message(response).join('<br/>');
						growl.error(message);
						
					} else {
						document.body.dispatchEvent(new Event('UN_RESERVE_ALL', {
							bubbles: true,
						}));
						
						$interval.cancel(S.cart.timeout.function);
						S.cart.timeout.function = false;
						S.cart.timeout.time = false;
						S.cart.timeout.format = false;
						
						S.ClearBasket();
						S.UpdateBasket();
					}
				}, function(response){console.log(response)});
			}
		};
		
		S.$watch('cart.timeout.time', function(){
			if (S.cart.timeout.time === 0) {
				$interval.cancel(S.cart.timeout.function);
				S.ClearBasket();
				S.UpdateBasket();
				
				S.cart.timeout.format = false;
				S.fullBasket.show = false;
				growl.error(S.translate.basket.full.cleared);
				
			} else if (S.cart.timeout.time) {
				var min = Math.floor(S.cart.timeout.time / 60);
				var sec = S.cart.timeout.time - min * 60;
				if (sec < 10 ) sec = '0' + sec;
				S.cart.timeout.format = min +':'+ sec;
			}
		});
		
		S.CreateOrder = function(){
			if (typeof S.basketPromoCodes !== 'undefined' && S.basketPromoCodes != '') {
				S.SetBasketPromoCodes();
				
			} else {
				S.fullBasket.loading = true;
				S.fullBasket.processing = true;
				
				let request = R.GetRequest($.B24.params({
					command: 'CREATE_ORDER',
					successUrl: S.config.successUrl,
					failUrl: S.config.failUrl,
					phone: S.config.terms.phone.value,
					fullName: S.config.terms.fullName.value,
				}, S.config, LS));
				if (request) {
					request.$promise.then(function(response){
						if (response.resultCode != 0) {
							let message = response.description;
							if (S.config.devel !== 'undefined') message = $.B24.Message(response).join('<br/>');
							growl.error(message);
							
							S.fullBasket.loading = false;
							S.fullBasket.processing = false;
							S.fullBasket.show = false;
							
							S.ClearBasket();
							S.UpdateBasket();
							
						} else {
							document.body.dispatchEvent(new Event('CREATE_ORDER', {
								bubbles: true,
							}));
							
							let location = function(){
								let href = response.formUrl != '' ? response.formUrl : S.config.successUrl;
								
								let loc = window.location;
								if (S.config.successUrl == `${loc.origin}${loc.pathname}success/` || S.config.failUrl == `${loc.origin}${loc.pathname}fail/`) {
									LS['orderHash'] = window.location.hash;
								}
								
								if (typeof S.config.bank === 'undefined') {
									$window.location.href = href;
									
								} else {
									$window.open(href, '_blank');
									
									S.fullBasket.loading = false;
									S.fullBasket.show = false;
									
									S.ClearBasket();
									S.UpdateBasket();
								}
							};
							location();
						}
					}, function(response){console.log(response)});
				}
			}
		};
		
		S.SetBasketPromoCodes = function(){
			let promocodes = S.basketPromoCodes.split(' ');
			let request = R.GetRequest($.B24.params({command: 'ADD_PROMO_CODES', promoCodeList: promocodes}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel !== 'undefined') message = $.B24.Message(response).join('<br/>');
						growl.error(message);
						
					} else {
						let s = '';
						if (response.newPromoCodeList.length > 0) {
							S.getCart();
							if (response.errorPromoCodeList.length > 1) s = 's';
							growl.success(S.translate.promocodes['set' + s + '_success_prefix'] + response.newPromoCodeList[0] + S.translate.promocodes['set' + s + '_success_suffix'], {ttl: 10000});
						} else {
							growl.error(S.translate.promocodes['set' + s + '_error']);
						}
						S.basketPromoCodes = '';
					}
				});
			}
		};
		
		S.$watch('basketPromoCodes', function(){
			S.disabledBasketPromoCodes = S.basketPromoCodes ? false : true;
		});
	};
})();
