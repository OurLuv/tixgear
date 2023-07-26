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
	
	$.B24 = {
		requestDataExt: false,
		
		i18n: () => {
			let l = window.navigator ? (window.navigator.language || window.navigator.systemLanguage || window.navigator.userLanguage) : ('en');
			['-', '_'].forEach(symbol => {
				l = (l.search(symbol) > 0) ? l.substring(0, l.search(symbol)).toLowerCase() : l.toLowerCase();
			});
			
			switch (l) {
				case 'ru':// russian
					$.B24.i18n = {
						lng:        'ru',
						local:      'ru_RU',
						localJSON:  'ru_RU.json',
						requestURL: 'https://api.bil24.pro',
					};
					break;
					
				case 'hy':// hayeren
					$.B24.i18n = {
						lng:        'am',
						local:      'am_AM',
						localJSON:  'am_AM.json',
						requestURL: 'https://api.tixgear.com',
					};
				break;
				
				/*case 'tt':// tatar
					$.B24.i18n = {
						lng:        'tt',
						local:      'tt_RU',
						localJSON:  'tt_RU.json',
						requestURL: 'https://api.bil24.pro',
					};
				break;*/
					
				default:// en // english
					$.B24.i18n = {
						lng:        'en',
						local:      'en_EN',
						localJSON: 'en_EN.json',
						requestURL: 'https://api.tixgear.com',
					};
			}
		},
		
		imageOnload: function(){
			return {
				restrict: 'A',
				link: function(scope, element, attrs){
					element.bind('load', function(e){
						scope.$apply(function(){
							scope.$eval(attrs.imageOnload);
						});
						e.preventDefault();
					});
				},
			};
		},
		
		masked: function(){
			return {
				restrict: 'A',
				require: '?ngModel',
				link: function(scope, element, attrs, ngModelCtrl){
					element.mask(attrs.format, {
						completed: function(){
							ngModelCtrl.$setViewValue(element.val());  
							scope.$apply();
						},
					});
				},
			};
		},
		
		numbersOnly: function(){
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, modelCtrl){
					modelCtrl.$parsers.push(function(inputValue){
						if (inputValue == undefined) return '';
						var onlyNumeric = inputValue.replace(/[^0-9]/g, '');
						if (onlyNumeric != inputValue) {
							modelCtrl.$setViewValue(onlyNumeric);
							modelCtrl.$render();
						}
						return onlyNumeric;
					});
				},
			};
		},
		
		local: function(params){
			let local = $.B24.i18n.localJSON;
			switch (params.lng) {
				case 'ru':
					local = 'ru_RU.json';
				break;
				case 'en':
					local = 'en_EN.json';
				break;
				case 'am':
					local = 'am_AM.json';
				break;
			}
			return local;
		},
		
		ext: function($location, path){
			let get = $location.search();
			let loc = window.location;
			
			let resultPages = `${loc.origin}${loc.pathname}`;
			if (typeof path !== 'undefined') {
				resultPages = resultPages.replace(`${path}/`, '');
			}
			
			return $.extend({
				frontendId: -1,
				token: 'none',
				zone: 'test',
				id: -1,
				cityId: -1,
				venueId: -1,
				kindId: -1,
				success: `${loc.origin}${loc.pathname}success/`,
				fail: `${loc.origin}${loc.pathname}fail/`,
				agr: false,
				bank: undefined,
				goods: undefined,
				lng: $.B24.i18n.lng,
				event: undefined,
				devel: undefined,
			}, get);
		},
				
		Config: function(S, G, LS){
			let C = $.B24.ext(G, S.path);
			
			let renameKeys = function(obj, to){
				const keys = Object.keys(obj).map(key => {
					const i = to[key] || key;
					return {[i]: obj[key]};
				});
				return Object.assign({}, ...keys);
			};
			C = renameKeys(C, {
				frontendId: 'fid',
				id: 'actionId',
				success: 'successUrl',
				fail: 'failUrl',
			});
			
			let Z = C.zone == 'real' ? '' : '_';
			
			if (typeof LS[Z + 'userId'] !== 'undefined') {
				C.userId = LS[Z + 'userId'];
			}
			if (typeof LS[Z + 'sessionId'] !== 'undefined') {
				C.sessionId = LS[Z + 'sessionId'];
			}
			
			C.terms = {
				fullName: {required: false, value: ''},
				phone: {required: false, value: ''},
			};
			
			S.config = C;
			S.config.version = 'i18n';
			
			S.cart = {
				timeout: {
					function: false,
					time: false,
					format: false,
				},
				withPlace: {
					data: [],
					count: 0,
					show: false,
					noResults: false,
				},
				entries: {
					data: {},
					tickets: 0,
					show: false,
				},
				totalCharge: 0,
				totalSum: 0,
			};
			
			S.miniBasket = {
				count: 0,
				show: false
			};
			
			S.fullBasket = {
				filled: false,
				loading: false,
				show: false
			};
		},
		
		Translate: function(S, R){
			let L = $.B24.i18n.local;
			switch (S.config.lng) {
				case 'ru':
					L = 'ru_RU';
				break;
				case 'en':
					L = 'en_EN';
				break;
				case 'am':
					L = 'am_AM';
				break;
			}
			S.config.local = L;
			let path = {local: L};
			let i = 1;
			for (let p of window.location.pathname.split('/')) {
				if (p && p != S.path) {
					path['path' + i] = p;
					i++;
				}
			}
			let request = R.GetLocalization(path);
			if (request) {
				request.$promise.then(function(response){
					let localizationCorrection = function(localization, root = null){
						for (let name in localization) {
							if (!name.match(/^\$+/)) {
								if (typeof localization[name] == 'object') {
									let type = localizationCorrection(localization[name], name);
									if (type) localization[name] = type;
								} else {
									let type = S.config.goods ? '_goods' : '_tickets';
									if (name == type) return localization[name];
								}
							}
						}
						return false;
					};
					localizationCorrection(response);
					S.translate = response;
				}, function(response){console.log(response)});
			}
		},
		
		datepicker: function(){
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function(scope, elem, attrs, ngModelCtrl){
					var updateModel = function(dateText){
						scope.$apply(function(){
							ngModelCtrl.$setViewValue(dateText);
						});
					};
					setTimeout(function(){
						let L = scope.translate;
						var options = {
							monthNames: [
								L.months['01'],
								L.months['02'],
								L.months['03'],
								L.months['04'],
								L.months['05'],
								L.months['06'],
								L.months['07'],
								L.months['08'],
								L.months['09'],
								L.months['10'],
								L.months['11'],
								L.months['12']
							],
							dayNamesMin: L.days,
							firstDay: 1,
							inline: true,
							dateFormat: 'dd.mm.yy',
							minDate: new Date(),
							onSelect: function(dateText){
								updateModel(dateText);
							},
						};
						elem.datepicker(options);
					}, 2000);
				},
			};
		},
		
		getPort: (zone) => {
			return zone == 'real' ? 443 : 1240;
		},
		
		Request: function($resource, $location){
			let params = $.B24.ext($location),
					requestURL = `${$.B24.i18n.requestURL}:${$.B24.getPort(params.zone)}/json`;
			
			let requestData = {
				fid: '@fid',
				token: '@token',
				versionCode: '@versionCode',
				command: '@command',
				phone: '@phone',
				fullName: '@fullName',
				userId: '@userId',
				sessionId: '@sessionId',
			};
			
			if ($.B24.requestDataExt) {
				requestData = $.extend({
					categoryQuantityMap: '@categoryQuantityMap',
					code: '@code',
					email: '@email',
					seatList: '@seatList',
					type: '@type',
				}, requestData);
			}
			
			let version = document.querySelector('.bil-version').getAttribute('data-version');
			return $resource(requestURL, JSON.stringify(requestData), {
				GetRequest: {
					method: 'POST',
					headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					isArray: false,
				},
				GetLocalization: {
					method: 'GET',
					url: `/:path1/:path2/:path3/:path4/:path5/:path6/:path7/:path8/:path9/:path10/localization/:local.json?q=${version}`,
					isArray: false,
				},
			});
		},
		
		Message: function(obj){
			let messages = [];
			for (let key in obj) {
				let message = obj[key];
				if (typeof message == 'number' || typeof message == 'string') {
					messages.push(key + ': ' + message);
				}
			}
			return messages;
		},
		
		Auth: function(R, S, growl, LS){
			let Z = S.config.zone == 'real' ? '' : '_';
			
			let auth = function(){
				let request = R.GetRequest($.B24.params({command: 'AUTH'}, S.config, LS));
				if (request) {
					request.$promise.then(function(response){
						if (response.resultCode != 0) {
							//let message = response.description;
							//if (S.config.devel) message = $.B24.Message(response).join('<br/>');
							//growl.error(message);
							localStorage.removeItem('ngStorage-' + Z + 'userId');
							localStorage.removeItem('ngStorage-' + Z + 'sessionId');
							window.location.reload();
							//LS.$reset();
						} else {
							S.auth = true;
						}
					}, function(response){console.log(response)});
				}
			};
			
			if (typeof LS[Z + 'userId'] === 'undefined' || typeof LS[Z + 'sessionId'] === 'undefined') {
				let request = R.GetRequest($.B24.params({command: 'AUTH'}, S.config));
				if (request) {
					request.$promise.then(function(response){
						if (response.resultCode != 0) {
							let message = response.description;
							if (S.config.devel) message = $.B24.Message(response).join('<br/>');
							growl.error(message);
							
						} else {
							LS[Z + 'userId'] = response.userId;
							LS[Z + 'sessionId'] = response.sessionId;
							auth();
						}
					}, function(response){console.log(response)});
				}
			} else {
				auth();
			}
		},
		
		OpenAuth: function(R, S, growl, LS){
			$.fancybox.open({
				src: '#auth-popup',
				beforeShow: function(){
					let request = R.GetRequest($.B24.params({command: 'GET_EMAIL'}, S.config, LS));
					if (request) {
						request.$promise.then(function(response){
							if (response.resultCode != 0) {
								let message = response.description;
								if (S.config.devel) message = $.B24.Message(response).join('<br/>');
								growl.error(message);
							
							} else {
								S.config.email = response.email;
								if (S.config.email) {
									S.authMessage = S.translate.email.message.authorize + ' ' + S.config.email;
									S.authButton = S.translate.email.button.authorize;
								} else {
									S.authMessage = S.translate.email.message.anonymous;
									S.authButton = S.translate.email.button.anonymous;
								}
							}
						});
					}
				}
			});
		},
		
		type: function($scope){
			let localizationCorrection = function(localization, root = null){
				for (let name in localization) {
					if (!name.match(/^\$+/)) {
						if (typeof localization[name] == 'object') {
							let type = localizationCorrection(localization[name], name);
							if (type) localization[name] = type;
						} else {
							let type = $scope.config.goods ? '_goods' : '_tickets';
							if (name == type) return localization[name];
						}
					}
				}
				return false;
			};
			localizationCorrection($scope.localization);
		},
		
		localization: function(config, params){
			if (typeof params.frontendId !== 'undefined') config.fid = params.frontendId;
			if (typeof params.token !== 'undefined') config.token = params.token;
			if (typeof params.id !== 'undefined') config.actionId = params.id;
			if (typeof params.cityId !== 'undefined') config.cityId = params.cityId;
			if (typeof params.zone !== 'undefined') config.zone = params.zone;
			if (typeof params.lng !== 'undefined') config.lng = params.lng;
		},
		
		params: function(params, config, LS = false){
			params = $.extend({
				fid: config.fid,
				token: config.token,
				versionCode: config.versionCode,
				locale: config.lng,
				versionCode: '1.0',
			}, params);
			if (LS) {
				let Z = config.zone == 'real' ? '' : '_';
				
				params = $.extend({
					userId: LS[Z + 'userId'],
					sessionId: LS[Z + 'sessionId'],
				}, params);
			}
			return params;
		},
		
		href: function(config, page, href){
			href = $.extend({
				frontendId: config.fid,
				token: config.token,
				zone: config.zone,
				cityId: config.cityId,
				success: config.successUrl,
				fail: config.failUrl,
				lng: config.lng,
			}, href);
			
			let array = [];
			for (let i in href) array.push(i + '=' + href[i]);
			
			if (config.venueId >= 0) array.push('venueId=' + config.venueId);
			if (config.kindId >= 0) array.push('kindId=' + config.kindId);
			if (config.goods >= 0) array.push('goods=' + config.goods);
			if (config.bank >= 0) array.push('bank=' + config.bank);
			if (config.event >= 0) array.push('event=' + config.event);
			if (config.devel >= 0) array.push('devel=' + config.devel);
			if (config.agr) array.push('agr=' + config.agr);
			
			return page + '#/?' + array.join('&');
		},
		
		currency: {
			RUB: "\u20BD",
			AMD: "\u0534",
			USD: "\u0024",
			EUR: "\u20AC",
		},
	};
	
	$.B24.i18n();
})();
