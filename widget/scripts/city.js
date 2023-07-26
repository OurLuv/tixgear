/**          _     _            _           ____  
 * __      _(_) __| | __ _  ___| |_  __   _|___ \ 
 * \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *  \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *   \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                   |___/     © npoxop.sochi 2022
 */
(function(){
	'use strict';
	
	$(window).resize(function(){
		$('#ui-datepicker-div').hide();
	});
	
	angular.module('bilpro', ['angular-growl','ngAnimate', 'ngResource', 'ngStorage', 'ngSanitize'])
		.factory('Request', $.B24.Request)
		.directive('imageOnload', $.B24.imageOnload)
		.directive('masked', $.B24.masked)
		.directive('datepicker', $.B24.datepicker)
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
		
		S.path = 'city';
		$.B24.Config(S, L, LS);
		
		S.$watch('config', function(){
			if (typeof S.config !== 'undefined') {
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
				
				{
					let request = R.GetRequest($.B24.params({command: 'GET_FILTER'}, S.config, LS));
					if (request) {
						request.$promise.then(function(response){
							if (response.resultCode != 0) {
								let message = response.description;
								if (S.config.devel) message = $.B24.Message(response).join('<br/>');
								growl.error(message);
							
							} else {
								S.filters = {
									venueList: [{venueId: -1, venueName: S.translate.events.all_venues}],
									kindList: [{kindId: -1, kindName: S.translate.events.all_kinds}],
									date: moment(new Date()).format('DD.MM.YYYY'),
									search: '',
								};
								for (let i in response.cityList) {
									let city = response.cityList[i];
									if (city.cityId == S.config.cityId) {
										S.config.cityName = city.cityName;
										let wrongVenue = S.config.venueId >= 0 ? false : true;
										for (let i in city.venueList) {
											let venue = city.venueList[i];
											if (S.config.venueId == venue.venueId) {
												wrongVenue = false;
												S.config.venueId = venue.venueId;
												S.config.venueName = venue.venueName;
											}
											S.filters.venueList.push({venueId: venue.venueId, venueName: venue.venueName});
										}
										if (wrongVenue) {
											S.config.venueId = -1;
											S.config.venueName = S.translate.events.all_venues;
										}
									}
								}
								for (let i in response.kindList) {
									let kind = response.kindList[i];
									S.filters.kindList.push({kindId: kind.kindId, kindName: kind.kindName});
								}
							}
						}, function(response){console.log(response)});
					}
				}
				{
					let request = R.GetRequest($.B24.params({command: 'GET_ACTIONS_V2', cityId: S.config.cityId}, S.config, LS));
					if (request) {
						request.$promise.then(function(response){
							if (response.resultCode != 0) {
								let message = response.description;
								if (S.config.devel) message = $.B24.Message(response).join('<br/>');
								growl.error(message);
							
							} else {
								S.events = response.actionList;
								S.events.count = S.events.length;
							}
						}, function(response){console.log(response)});
					}
				}
			}
		});
		
		S.$watch('filters', function(){
			if (typeof S.filters !== 'undefined' && typeof S.events !== 'undefined') {
				S.loaded = true;
			}
		});
		
		S.$watch('events', function(){
			if (typeof S.filters !== 'undefined' && typeof S.events !== 'undefined') {
				S.loaded = true;
			}
		});
		
		S.displayItems = function(){
			$timeout(function(){
				S.events.count = $('.eventItem').length;
			}, 100);
		};
		
		S.makeHref = function(e){
			return $.B24.href(S.config, '../', {
				id: e.actionId,
				goods: e.kindId == 6 || e.kindId == 7 ? true : undefined,
			});
		};
		
		S.displayItem = function(e){
			let C = S.config, F = S.filters;
			
			let inVenueMap = function(venueMap){
				for (let i in venueMap) {
					if (C.venueId == i) return true;
				}
				return false;
			};
			
			let getDate = function(e){
				return moment(e.firstEventDate, 'DD.MM.YYYY');
			};
			
			let laterThan = function(date){
				if (typeof F === 'undefined') return false;
				return moment(date, 'DD.MM.YYYY').isAfter(moment(F.date, 'DD.MM.YYYY').subtract(1, 'days'));
			};
			
			let liveSearch = function(title, description){
				if (title.toLowerCase().indexOf(F.search.toLowerCase()) != -1 || description.toLowerCase().indexOf(F.search.toLowerCase()) != -1) {
					return true;
				}
				return false;
			};
			
			if ((C.venueId < 0 || inVenueMap(e.venueMap)) && (C.kindId < 0 || e.kindId == C.kindId) && laterThan(e.lastEventDate) && (!F.search || liveSearch(e.actionName, e.posterName))) {
				return true;
			} else {
				return false;
			}
		};
	};
})();
