/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2022
 */
'use strict';

(function(){
	$.B24.requestDataExt = true;
	
	angular.module('bilpro', ['angular-growl', 'ngAnimate', 'ngResource', 'ngStorage', 'ngSanitize'])
		.factory('Request', $.B24.Request)
		.directive('masked', $.B24.masked)
		.directive('numbersOnly', $.B24.numbersOnly)
		.config(['growlProvider', function(growlProvider) {growlProvider.globalTimeToLive(5000)}])
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
		
		$.B24.Config(S, L, LS);
		
		S.$watch('config', function(){
			if (typeof S.config !== 'undefined') {
				S.action = false;
				
				S.ResetEntry = function(){
					S.shop.entry = {
						show: false,
						limits: [],
						tariffs: [],
					};
				};
				
				S.ResetScheme = function(){
					SVGSeatPlan.fn.end();
					
					let scheme = document.getElementById('scheme');
					if (typeof scheme !== 'undefined') scheme.innerHTML = '';
					
					S.shop.scheme = {
						show: false,
						loading: false,
						rendering: false,
						loaded: false,
						url: false,
						url: '',
					};
				};
				
				S.ResetShop = function(){
					S.shop = {};
					S.ResetEntry();
					S.ResetScheme();
				};
				
				S.filter = {};
				S.ResetVenue = function(){
					S.filter.venues = {id: -1, list: {}, show: false};
					S.ResetMonth();
				};
				S.ResetMonth = function(){
					S.filter.months = {id: -1, list: {}, show: false};
					S.ResetDay();
				};
				S.ResetDay = function(){
					S.filter.days = {id: -1, list: {}, show: false};
					S.ResetTime();
				};
				S.ResetTime = function(){
					S.filter.times = {id: -1, list: {}, show: false};
					S.ResetShop();
				};
				S.ResetVenue();
				
				S.cart = {
					timeout: {
						function: false,
						time: false,
						format: false,
					},
					entries: {
						data: {},
						tickets: 0,
						events: {},
					},
					reserve: {
						data: [],
						tickets: 0,
					},
					countCharge: 0,
					countSum: 0
				};
				
				S.empty = false;
				
				$.B24.Translate(S, R);
			}
		});
		
		S.$watch('translate', function(){
			if (typeof S.translate !== 'undefined') {
				$.B24.Auth(R, S, growl, LS);
			}
		});
		
		S.$watch('auth', function(){
			if (typeof S.auth !== 'undefined') {
				$rootScope.$broadcast('getCart', {callback: false});
				
				if (typeof S.config.userId !== 'undefined' && S.config.userId) {
					let request = R.GetRequest($.B24.params({command: 'GET_EMAIL'}, S.config, LS));
					if (request) {
						request.$promise.then(function(response){
							if (response.resultCode != 0) {
								let message = response.description;
								if (S.config.devel) message = $.B24.Message(response).join('<br/>');
								growl.error(message);
							
							} else {
								S.config.email = response.email;
								S.loadContent();
							}
						});
					}
				} else {
					S.loadContent();
				}
			}
		});
		
		S.loadContent = function(){
			let request = R.GetRequest($.B24.params({command: 'GET_ACTION_EXT', cityId: S.config.cityId, actionId: S.config.actionId}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel) message = $.B24.Message(response).join('<br/>');
						growl.error(message);
						
					} else {
						let action = response.action;
						
						S.config.cityName = action.cityName;
						
						S.action = {
							name: action.actionName,
							description: action.fullActionName,
						};
						
						for (let i in action.venueList) {
							let venue = action.venueList[i];
							venue.title = venue.venueName;
							venue.events = {};
							S.filter.venues.list[venue.venueId] = venue;
							
							for (let i in venue.actionEventList) {
								let event = venue.actionEventList[i],
										date = event.day.split('.'),
										d = +date[0],
										m = [date[2], date[1]].join('.'),
										day = new Date(date[2], date[1] - 1, date[0]);
										
								if (typeof venue.events[m] === 'undefined') {
									venue.events[m] = {
										title: S.translate.months[date[1]],
										days: {}
									};
								}
								
								if (typeof venue.events[m].days[d] === 'undefined') {
									venue.events[m].days[d] = {
										title: + d + ' ' + S.translate.days[+day.getDay()],
										times: {}
									};
								}
								
								if (typeof venue.events[m].days[d].times[event.time] === 'undefined') {
									venue.events[m].days[d].times[event.time] = event;
								}
							}
							
							for (let m in venue.events) {
								for (let d in venue.events[m].days) {
									let day = venue.events[m].days[d];
									if (Object.keys(day.times).length == 1) {
										console.log(Object.values(day.times));
										
										day.title += ` | ${Object.values(day.times)[0].time}`;
									}
								}
							}
						}
						
						let joinTitle = function(venue){
							
// events (not goods)
							if (!S.config.goods) {
//console.log('events (not goods)');
// one-venue event
								if (Object.keys(venue.events).length == 1) {
//console.log('one-venue event');
// one-month event
//console.log('one-month event');
									let month = Object.values(venue.events)[0];
									venue.title += ' | ' + month.title;
// one-day event
									if (Object.keys(month.days).length == 1) {
//console.log('one-day event');
										let day = Object.values(month.days)[0];
										venue.title += ' ' + day.title;
// one-time event
										if (Object.keys(day.times).length == 1) {
//console.log('one-time event');
											let time = Object.values(day.times)[0];
											venue.title += ' | ' + time.time;
										}
									}
// multi-venues event
								} else {
//console.log('multi-venues event');
									for (let i in venue.events) {
										let month = venue.events[i];
// one-day event
										if (Object.keys(month.days).length == 1) {
//console.log('one-day event');
											let day = Object.values(month.days)[0];
											month.title += ' ' + day.title;
// one-time event
											if (Object.keys(day.times).length == 1) {
//console.log('one-time event');
												let time = Object.values(day.times)[0];
												month.title += ' | ' + time.time;
											}
// multi-days event
										} else {
//console.log('multi-days event');
											for (let i in month.days) {
												let day = month.days[i];
// one-time event
												if (Object.keys(day.times).length == 1) {
//console.log('one-time event');
													let time = Object.values(day.times)[0];
													day.title += ' | ' + time.time;
												}
											}
										}
									}
								}
							}
						};
						
// single venue
						if (Object.keys(S.filter.venues.list).length == 1) {
							joinTitle(Object.values(S.filter.venues.list)[0]);
							
// multi venues
						} else {
							for (let i in S.filter.venues.list) {
								joinTitle(S.filter.venues.list[i]);
							}
						}
						
						if (S.config.venueId < 0) {
							S.config.venueId = Object.keys(S.filter.venues.list)[0];
						}
						
						if (action.kdp) {
							S.action.kdp = true;
							S.config.kdp = '';
							S.kdpConfirm = false;
							S.FormKDP();
							
						} else {
							S.OpenEvent();
						}
					}
				}, function(response){console.log(response)});
			}
		};
		
		S.FormKDP = function(){
			$.fancybox.open({src: '#kdp-popup'});
		};
		
		S.FormFanId = function(){
			$.fancybox.open({src: '#fanid-popup'});
		};
		
		S.OpenEvent = function(){
			S.SelectVenue(S.config.venueId);
			S.filter.venues.show = true;
			
			$('.scroll-to-scheme, .scroll-to-entry').on('click', function(){
				let top = -$('header:visible').outerHeight();
				if ($(this).hasClass('scroll-to-scheme')) {
					top += $('.hook-to-scheme').offset().top;
				} else if ($(this).hasClass('scroll-to-entry')){
					top += $('.hook-to-entry').offset().top;
				}
				$('html, body').animate({scrollTop: top + 10}, 300);
			});
			
			document.querySelector('.legendToggle').addEventListener('click', function(){
				let slider = document.querySelector('.legendSlide');
				if (slider.classList.contains('active')) {
					slider.classList.remove('active');
				} else {
					slider.classList.add('active');
				}
			});
		};
		
		S.SelectVenue = function(venueId) {
console.log('SelectVenue');
			if (S.filter.venues.id == -1 || S.filter.venues.id != venueId) {
				S.ResetMonth();
				
				let venue = S.filter.venues.list[venueId];
				if (typeof venue !== 'undefined') {
					S.filter.venues.id = venue.venueId;
					
					for (let i in venue.events) {
						S.filter.months.list[i] = venue.events[i].title;
					}
					
					if (Object.keys(S.filter.months.list).length == 1) {
						S.SelectMonth(Object.keys(S.filter.months.list)[0]);
						
					} else {
						S.filter.months.show = true;
					}
				}
			}
		};
		
		S.SelectMonth = function(monthId) {
console.log('SelectMonth');
			if (S.filter.months.id == -1 || S.filter.months.id != monthId) {
				S.ResetDay();
				
				let venue = S.filter.venues.list[S.filter.venues.id],
						month = S.filter.months.list[monthId];
						
				if (typeof venue !== 'undefined' && typeof month !== 'undefined') {
					S.filter.months.id = monthId;
					
					for (let i in venue.events[monthId].days) {
						S.filter.days.list[i] = venue.events[monthId].days[i].title;
					}
					
					if (Object.keys(S.filter.days.list).length == 1) {
						S.SelectDay(Object.keys(S.filter.days.list)[0]);
						
					} else {
						S.filter.days.show = true;
					}
				}
			}
		};
		
		S.SelectDay = function(dayId) {
console.log('SelectDay');
			if (S.filter.days.id == -1 || S.filter.days.id != dayId) {
				S.ResetTime();
				
				let venue = S.filter.venues.list[S.filter.venues.id],
						day = S.filter.days.list[dayId];
				if (typeof venue !== 'undefined' && typeof day !== 'undefined') {
					S.filter.days.id = dayId;
					
					for (let i in venue.events[S.filter.months.id].days[dayId].times) {
						let t = venue.events[S.filter.months.id].days[dayId].times[i];
						S.filter.times.list[i] = S.config.goods ? t.currency : i;
					}
					
					if (Object.keys(S.filter.times.list).length == 1) {
						S.SelectTime(Object.keys(S.filter.times.list)[0]);
						
					} else {
						S.filter.times.show = true;
					}
				}
			}
		};
		
		S.SelectTime = function(timeId) {
console.log('SelectTime');
			if (S.filter.times.id == -1 || S.filter.times.id != timeId) {
				S.ResetEntry();
				S.ResetScheme();
				S.empty = true;
				
				S.currentEvent = S.filter.venues.list[S.filter.venues.id].events[S.filter.months.id].days[S.filter.days.id].times[timeId];
				
				if (typeof S.currentEvent !== 'undefined') {
					S.filter.times.id = timeId;
					
					S.action.currency = S.currentEvent.currency;
					S.action.currencySymbol = S.action.currency;
					S.action.currencyFont = false;
					if ($.B24.currency[S.action.currency]) {
						S.action.currencySymbol = $.B24.currency[S.action.currency];
						S.action.currencyFont = true;
					}
					
					let e = S.shop.entry;
					e.show = false;
					e.loading = false;
					e.limits = [];
					e.tariffs = [];
					if (S.currentEvent.categoryLimitList.length > 0) { // event has categories
						e.show = true;
						e.limits = S.currentEvent.categoryLimitList;
						e.tariffs = S.currentEvent.tariffPlanList;
						S.empty = false;
					}
					
					let s = S.shop.scheme;
					if (typeof S.currentEvent.placementUrl !== 'undefined') { // event has scheme
						s.show = false;
						s.loading = false;
						s.rendering = false;
						s.url = S.currentEvent.placementUrl;
						S.empty = false;
						
					} else {
						s.show = false;
						s.loading = false;
						s.rendering = false;
						s.url = false;
						s.url = '';
					}
				}
			}
		};
		
		S.$watch('shop.entry.limits', function(){
			let entry = S.shop.entry;
			
			if (entry.limits) {
				S.categories = {};
				
				let tariffsMap = {};
				for (let i in entry.tariffs) {
					let tariff = entry.tariffs[i];
					tariffsMap[tariff.tariffPlanId] = tariff.tariffPlanName;
				}
				
				for (let i in entry.limits) {
					let limit = entry.limits[i], remainders = [];
					
					for (let i in limit.categoryList) {
						let category = limit.categoryList[i],
								tickets = S.cart.entries.data[category.categoryPriceId];
						let pushCategory = S.categories[category.categoryPriceId] = {
							id: category.categoryPriceId,
							name: category.categoryPriceName,
							price: category.price,
							availability: category.availability,
							count: category.availability,
							tickets: 0,
						};
						
						if (Object.keys(category.tariffIdMap).length) {
							pushCategory.tariffs = {};
							
							let tariffs = pushCategory.tariffs = {};
							
							let min, max;
							for (let i in category.tariffIdMap) {
								if (typeof tariffsMap[i] !== 'undefined') {
									let price = category.tariffIdMap[i];
									
									if (typeof min === 'undefined' || typeof min !== 'undefined' && min > price) min = price;
									if (typeof max === 'undefined' || typeof max !== 'undefined' && max < price) max = price;
									
									tariffs[i] = {
										id: i,
										name: tariffsMap[i],
										price: price,
										tickets: 0,
									};
									
									if (typeof tickets !== 'undefined' && typeof tickets[i] !== 'undefined') tariffs[i].tickets += tickets[i];
								}
							}
							
							pushCategory.min = min;
							pushCategory.max = max;
							pushCategory.price = (min + max) / 2;
							pushCategory.selectTariff = 0;
							
							pushCategory.tariffsSort = Object.keys(pushCategory.tariffs);
							pushCategory.tariffsSort.sort((a, b) => pushCategory.tariffs[b].price - pushCategory.tariffs[a].price);
							
						} else {
							if (typeof tickets !== 'undefined' && typeof tickets[0] !== 'undefined') pushCategory.tickets += tickets[0];
						}
						
						remainders.push(pushCategory.id);
					}
					
					if (typeof limit.remainder !== 'undefined') {
						for (let i in limit.categoryList) {
							let category = S.categories[limit.categoryList[i].categoryPriceId];
							category.remainders = remainders;
							if (category.availability >= limit.remainder) {
								category.availability = limit.remainder;
								category.count = limit.remainder;
							}
						}
					}
				}
				
				S.categoriesSort = Object.keys(S.categories);
				// sort by Price
				//S.categoriesSort.sort((a, b) => S.categories[a].price - S.categories[b].price);
				// sort by Name Alphabetically
				S.categoriesSort.sort((a, b) => {
					if (S.categories[a].name < S.categories[b].name) return -1;
					if (S.categories[a].name > S.categories[b].name) return 1;
					return 0;
				});
			}
		});
		
		S.CategoryClick = function(categoryId, delta){
			if (typeof S.config.email === 'undefined' || !S.config.email) {
				$.B24.OpenAuth(R, S, growl, LS);
				
			} else {
				for (let i in S.categories) {
					let category = S.categories[i];
					if (category.id == categoryId) {
						if (delta == 1 && delta <= category.count) {
							category.tickets++;
						}
						if (delta == -1 && category.tickets > 0) {
							category.tickets--;
						}
						
						S.EntryReserve(category.id);
						break;
					}
				}
			}
		};
		
		S.TariffClick = function(categoryId, tariffId, delta){
			if (typeof S.config.email === 'undefined' || !S.config.email) {
				$.B24.OpenAuth(R, S, growl, LS);
				
			} else {
				for (let i in S.categories) {
					let category = S.categories[i];
					category.selectTariff = 0;
					if (category.id == categoryId) {
						for (let i in category.tariffs) {
							let tariff = category.tariffs[i];
							if (tariff.id == tariffId) {
								if (delta == 1 && delta <= category.count) {
									category.tickets++;
									tariff.tickets++;
								}
								if (delta == -1 && category.tickets > 0) {
									category.tickets--;
									tariff.tickets--;
								}
								
								S.EntryReserve(category.id, tariff.id);
								break;
							}
						}
						break;
					}
				}
			}
		};
		
		S.CategoryInput = function(categoryId){
			if (typeof S.config.email === 'undefined' || !S.config.email) {
				$.B24.OpenAuth(R, S, growl, LS);
			} else {
				S.EntryReserve(categoryId);
			}
		};
		
		S.EntryReserve = function(categoryId, tariffId = 0){
			let category = S.categories[categoryId];
			if (!category.tickets || category.tickets < 0) {
				category.tickets = 0;
			} else if (category.tickets > category.availability) {
				category.tickets = typeof category.remainders === 'undefined' ? category.availability : category.count;
			}
			
			S.UpdateAvailability(category.id);
			
			let entries = S.cart.entries;
			if (category.tickets) {
				
				if (typeof entries.data[category.id] === 'undefined') {
					entries.data[category.id] = {};
					entries.events[category.id] = S.currentEvent.actionEventId;
				}
				
				if (tariffId) {
					entries.data[category.id][tariffId] = category.tariffs[tariffId].tickets;
				} else {
					entries.data[category.id][0] = category.tickets;
				}
			} else {
				delete entries.data[category.id];
			}
			
			$rootScope.$broadcast('UpdateBasket');
		};
		
		S.UpdateAvailability = function(categoryId) {
			let category = S.categories[categoryId];
			
			let in_cart = [], in_cart_all = 0;
			if (S.cart.reserve.tickets) {
				for (let e in S.cart.reserve.data) {
					let event = S.cart.reserve.data[e];
					if (event.actionEventId == S.currentEvent.actionEventId) {
						for (let j in event.seatList) {
							let cid = event.seatList[j].categoryPriceId;
							if (typeof in_cart[cid] === 'undefined') in_cart[cid] = 0;
							in_cart[cid] += 1;
							in_cart_all += 1;
						}
					}
				}
			}
			
			if (typeof category.remainders === 'undefined') {
				let availability = category.availability;
				if (typeof in_cart[categoryId] !== 'undefined') availability -= in_cart[categoryId];
				category.count = availability - category.tickets;
				
			} else {
				let tickets = 0, remainder = 0;
				for (let i in category.remainders) {
					let id = category.remainders[i], cat = S.categories[id];
					tickets += cat.tickets;
					if (remainder < cat.availability) remainder = cat.availability;
				}
				
				if (in_cart_all) remainder -= in_cart_all;
				
				for (let i in category.remainders) {
					let id = category.remainders[i], cat = S.categories[id];
					
					let availability = cat.availability;
					if (typeof in_cart[id] !== 'undefined') availability -= in_cart[id];
					if (availability > remainder) availability = remainder;
					cat.count = availability - cat.tickets;
					
					if (tickets > cat.tickets) {
						let stock = remainder - availability;
						let category_tickets = tickets - cat.tickets;
						if (stock < category_tickets) {
							cat.count -= category_tickets - stock;
						}
					}
				}
			}
		};
		
		S.$watch('shop.scheme.url', function(){
			if (S.shop.scheme.url) {
				S.shop.scheme.show = true;
				
				$timeout(function(){
					$('.scroll-to-scheme').trigger('click');
				}, 100);
				
				let url = S.shop.scheme.url + '&rnd=' + Math.random();
				if (S.config.kdp) url += '&kdp=' + S.config.kdp;
				let request = $resource(url, {}, {
					get: {
						method: 'get',
						transformResponse: function(response){
							return {html: response};
						}
					}
				}).get();
				if (request) {
					S.shop.scheme.loading = true;
					request.$promise.then(function(response){
						S.shop.scheme.loading = false;
						S.shop.scheme.rendering = true;
						$timeout(function(){
							let panzoom = document.querySelector('#scheme');
							panzoom.innerHTML = response.html;
							
							let scheme = panzoom.getElementsByTagName('svg')[0],
									width = scheme.getAttribute('width'),
									height = scheme.getAttribute('height'),
									newWidth = panzoom.offsetWidth,
									newHeight = newWidth * height / width;
							
							if (document.documentElement.classList.contains('desktop') || document.documentElement.classList.contains('landscape')) {
								newHeight += 100;
								scheme.style.height = newHeight + 'px';
							} else {
								if (newHeight < newWidth / 2 * 2) newHeight = newWidth / 2 * 2;
								//scheme.style.height = newHeight + 'px';
								scheme.style.height = '80vh';
							}
							scheme.setAttribute('width', newWidth);
							scheme.setAttribute('height', newHeight);
							
							let legend = document.querySelector('.placementLegend-wrapper');
							legend.innerHTML = '';
							
							let categories = scheme.getElementsByTagName('sbt:category');
							for (let i = 0; i < categories.length; i++) {
								let category = categories[i];
								if (category.getAttribute("sbt:used") == 1) {
									let price, tariffs = category.getElementsByTagName('sbt:tariff');
									
									if (tariffs.length) {
										price = [];
										for (let i = 0; i < tariffs.length; i++) {
											let tariff = tariffs[i];
											price.push(tariff.getAttribute('sbt:price'));
										}
										price = Math.min.apply(null, price) + ' &#8230; ' + Math.max.apply(null, price);
										
									} else {
										price = category.getAttribute("sbt:price");
									}
									
									let e = document.createElement('div');
									e.className = 'placementLegend-item';
									e.innerHTML = [
										'<div class="cat name ' + category.getAttribute("sbt:class") + '">',
											'<span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preservator"><circle cx="16" cy="16" r="16"></circle></svg></span>',
											'<span' + (tariffs.length ? ' class="tariffs"' : '') + '>&nbsp;—&nbsp;<span class="sum">' + price + '</span><span class="cur' + (S.action.currencyFont ? ' CUR' : '') + '">' + S.action.currencySymbol + '</span></span>',
										'</div>',
									].join('');
									legend.appendChild(e);
								}
							}
							
							SVGSeatPlan.fn.init(scheme);
							
							let maxHeight = panzoom.offsetHeight - parseInt($('.legendSlide').css('top'), 10) * 2 - $('.legendToggle').outerHeight();
							$('.legendLinks').css({'max-height': maxHeight + 'px'});
							
							if (!document.documentElement.classList.contains('desktop') && !document.documentElement.classList.contains('landscape')) {
								$('.legendSlide').removeClass('active');
							}
							
							let placementScheme = document.querySelector('.placementScheme'),
									seatHover = placementScheme.querySelector('.seatHover');
							
							scheme.addEventListener('transform.SVGSeatPlan', function(e){
								let controls = placementScheme.querySelector('.controls');
								controls.querySelector('.out').classList.toggle('na', !e.detail.min);
								controls.querySelector('.in').classList.toggle('na', !e.detail.max);
								controls.querySelector('.info').innerHTML = 'x' + e.detail.scale;
							});
							
							scheme.addEventListener('hover.SVGSeatPlan', function(event){
							let {e, circle} = event.detail,
									g = circle.parentNode;
							let infoHTML = [
								'<div class="sector">',
									S.translate.event.scheme.sector + ' <span class="DIG">' + g.getAttribute('sbt:sect') + '</span>',
								'</div>',
								'<div class="row">',
									S.translate.event.scheme.row + ' <span class="DIG">' + g.getAttribute('sbt:row') + '</span>',
								'</div>',
								'<div class="seat">',
									S.translate.event.scheme.seat + ' <span class="DIG">' + circle.getAttribute('sbt:seat') + '</span>',
								'</div>',
							];
							
							let tariff = circle.getAttribute('tariff');
							if (tariff) {
								tariff = scheme.querySelector('sbt\\:tariff[sbt\\:id="' + tariff + '"]');
								if (tariff) {
									infoHTML = infoHTML.concat([
										'<div class="tariff">',
											S.translate.event.tariffs.title + ' <span class="DIG">' + tariff.getAttribute('sbt:name') + '</span>',
										'</div>',
									]);
								}
							}
							
							let buttonsHTML = [],
									state = circle.getAttribute('sbt:state'),
									tariffs = SVGSeatPlan.fn.getTarriffsInfo(circle, ['sbt:id', 'sbt:name', 'sbt:price']);
							if (state == 1) {
								if (tariffs) {
									buttonsHTML = buttonsHTML.concat([
										'<div class="select DIG">',
											'<div class="default">' + S.translate.event.tariffs.choose + '</div>',
									]);
									for (let i in tariffs) {
										buttonsHTML = buttonsHTML.concat([
											'<button type="button" class="option reserve DIG" data-tariff-id="' + tariffs[i].sbt_id + '">',
												tariffs[i].sbt_name + ': ' + tariffs[i].sbt_price,
												'<span class="cur' + (S.action.currencyFont ? ' CUR' : '') + '">' + S.action.currencySymbol + '</span>',
											'</button>'
										]);
									}
									buttonsHTML.push('</div>');
								} else {
									let category = SVGSeatPlan.fn.getCategoryInfo(circle, ['sbt:price']);
									buttonsHTML.push('<button type="button" class="btn reserve DIG">' + category.sbt_price + '<span class="cur' + (S.action.currencyFont ? ' CUR' : '') + '">' + S.action.currencySymbol + '</span></button>');
								}
							} else if (state == 2) {
								buttonsHTML.push('<button type="button" class="btn reserve DIG">' + S.translate.tickets.remove_button + '</button>');
							}
							
							let delta = -5,
									top = delta,
									left = delta;
							seatHover.innerHTML = [
								'<div class="clicker">',
									'<div class="info">' + infoHTML.join('') + '</div>',
									'<div class="buttons">' + buttonsHTML.join('') + '</div>',
								'</div>',
							].join('');
							
							if (typeof e.pageY !== 'undefined') {
								top += e.pageY - placementScheme.offsetTop;
								left += e.pageX - placementScheme.offsetLeft;
							} else if (e.srcEvent ?? false) {
								top += e.srcEvent.pageY - placementScheme.offsetTop;
								left += e.srcEvent.pageX - placementScheme.offsetLeft;
							}
							
							let maxHeight = placementScheme.offsetHeight;
							if ((top + seatHover.offsetHeight) > maxHeight) {
								top -= seatHover.offsetHeight + delta;
							}
							if (top < 0) top = 0;
							
							let maxWidth = placementScheme.offsetWidth;
							if ((left + seatHover.offsetWidth) > maxWidth) {
								left -= seatHover.offsetWidth + delta;
							}
							if (left < 0) left = 0;
							
							seatHover.style.top = top + 'px';
								seatHover.style.left = left + 'px';
								
								seatHover.querySelector('.clicker').addEventListener('click', function(e){
									if (tariffs) {
										let button = e.target;
										if (button.classList.contains('reserve')) {
											circle.setAttribute('tariff', button.getAttribute('data-tariff-id'));
											SVGSeatPlan.fn.trigger(circle, 'click');
										}
									} else {
										SVGSeatPlan.fn.trigger(circle, 'click');
									}
								});
							});
							
							scheme.addEventListener('unhover.SVGSeatPlan', function(e){
								seatHover.innerHTML = '';
							});
							
							scheme.addEventListener('click.SVGSeatPlan', function(e){
								if (typeof S.config.email === 'undefined' || !S.config.email) {
									$.B24.OpenAuth(R, S, growl, LS);
									
								} else {
									S.config.fanid = '';
									let {seat, circle} = S.CleckedSeatDetail = e.detail;
									
									if (seat['sbt_state'] == 1) {
										
										if (S.currentEvent.fanIdRequired) {
											S.FormFanId();
											
										} else {
											S.SeatReservation();
										}
										
									} else if (seat['sbt_state'] == 2) {
										SVGSeatPlan.fn.loading(circle);
										
										SVGSeatPlan.fn.unMarking(circle);
										
										let q = Request.GetRequest($.B24.params({
											command: 'RESERVATION',
											seatList: [seat['sbt_id']],
											type: 'UN_RESERVE'
										}, S.config, $localStorage));
										if (q) {
											q.$promise.then(function(response){
												circle.removeAttribute('tariff');
												SVGSeatPlan.fn.endLoading(circle, function(){
													if (response.resultCode != 0) {
														let message = response.description;
														if (S.config.devel) message = $.B24.Message(response).join('<br/>');
														growl.error(message);
													
													} else {
														document.body.dispatchEvent(new Event('UN_RESERVE', {
															bubbles: true,
														}));
														$rootScope.$broadcast('getCart', {callback: false});
													}
												});
											});
										}
									}
								}
							});
							
							S.shop.scheme.rendering = false;
							S.shop.scheme.loaded = true;
						}, 1000);
					});
				}
			}
		});
		
		S.SeatReservation = () => {
			let {seat, circle} = S.CleckedSeatDetail;
			
			SVGSeatPlan.fn.loading(circle);
			
			SVGSeatPlan.fn.unMarking(circle);
			
			let seatList = {
				seatId: seat['sbt_id'],
			};
			
			if (seat['tariff']) seatList.tariffPlanId = seat['tariff'];
			
			if (S.config.fanid) {
				seatList.fanId = S.config.fanid;
			}
			
			let q = Request.GetRequest($.B24.params({
				command: 'RESERVATION',
				seatList: [seatList],
				type: 'RESERVE',
				kdp: S.config.kdp,
			}, S.config, $localStorage));
			
			if (q) {
				q.$promise.then(function(response){
					SVGSeatPlan.fn.endLoading(circle, function(){
						if (response.resultCode != 0) {
							let message = response.description;
							if (S.config.devel) message = $.B24.Message(response).join('<br/>');
							growl.error(message);
						
						} else {
							document.body.dispatchEvent(new Event('RESERVE', {
								bubbles: true,
							}));
							SVGSeatPlan.fn.marking(circle);
							$rootScope.$broadcast('getCart', {callback: false});
						}
					});
				});
			}
		};
		
		S.$watch('config.scheme.loaded', function(){
			if (S.shop.scheme.loaded) {
				$timeout(function(){
					var offsetTop = document.querySelector('.placement').offsetTop - 10;
					window.scrollTo(0, offsetTop, 'smooth');
				}, 0);
			}
		});
		
		S.ZoomIn = function($event){
			if (!$event.currentTarget.classList.contains('na')) SVGSeatPlan.fn.zoomIn();
		};
		
		S.ZoomOut = function($event){
			if (!$event.currentTarget.classList.contains('na')) SVGSeatPlan.fn.zoomOut();
		};
		
		S.ZoomReset = function(){
			SVGSeatPlan.fn.zoomReset();
		};
		
		S.SetKDP = function(){
			S.formErrorKDP = false;
			
			if (!S.config.kdp) {
				S.formErrorKDP = S.translate.event.kdp.required;
				
			} else {
				let request = R.GetRequest($.B24.params({command: 'CHECK_KDP', actionId: S.config.actionId, kdp: S.config.kdp}, S.config, LS));
				if (request) {
					request.$promise.then(function(response){
						if (response.resultCode != 0) {
							S.formErrorKDP = response.description;
						
						} else {
							$.fancybox.close({src: '#kdp-popup'});
							S.kdpConfirm = true;
							S.OpenEvent();
						}
					}, function(response){console.log(response)});
				}
			}
		};
		
		S.SetFanId = function(){
			S.formErrorFanId = false;
			if (!S.config.fanid) {
				S.formErrorFanId = S.translate.event.fanid.required;
			} else {
				$.fancybox.close({src: '#fanid-popup'});
				S.SeatReservation(S.CleckedSeatDetail);
			}
		};
	}
})();
