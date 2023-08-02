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
		
		S.path = 'mecs';
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
			let request = R.GetRequest($.B24.params({command: 'GET_MECS', sizeQrCode: 200, widthBarCode: 200, heightBarCode: 60, rawCoordinates: true}, S.config, LS));
			if (request) {
				request.$promise.then(function(response){
					if (response.resultCode != 0) {
						let message = response.description;
						if (S.config.devel) message = $.B24.Message(response).join('<br/>');
						growl.error(message);
					
					} else {
						S.mecs = response.list;
						S.mecs.sort((a, b) => b.actionName - a.actionName);
					}
					S.loaded = true;
				}, function(response){console.log(response)});
			}
		};
		
		S.$watch('mecs', function(){
			if (typeof S.mecs !== 'undefined') {
				for (let i in S.mecs) {
					let mec = S.mecs[i];
					
					mec.currencySymbol = mec.currency;
					mec.currencyFont = false;
					if ($.B24.currency[mec.currency]) {
						mec.currencySymbol = $.B24.currency[mec.currency];
						mec.currencyFont = true;
					}
				}
				S.loaded = true;
			}
		});
		
		S.OpenMec = function(actionEventId){
			for (let i in S.mecs) {
				let card = S.mecs[i];
				if (card.actionEventId == actionEventId) {
					let html = [
						'<div id="cards-popup">',
							'<div class="popup-title">',
								S.translate.mecs.label + ' "' + card.actionName + '"',
							'</div>',
							'<div class="mecsList">'
					];
					
					for (let i in card.mecList) {
						let mec = card.mecList[i],
								bar = mec.barCodeNumber.split('');
						html = html.concat([
							'<div class="mecItem" data-card="' + card.actionEventId + '" data-mec="' + mec.mecId + '">',
								'<div class="mecItem-row">',
									'<div class="item-info">',
										S.translate.mecs.total,
										' <span class="DIG">' + mec.price + '<span class="cur' + (card.currencyFont ? ' CUR' : '') + '">' + card.currencySymbol + '</span></span>',
									'</div>',
									'<div class="item-info">' + mec.categoryName + '</div>',
									'<div class="item-info">' + S.translate.mecs.city + ' ' + card.cityName + '</div>',
								'</div>',
								'<div class="mecItem-row barCode">',
									'<img src="data:image/png;base64,' + mec.barCodeImg + '"/>',
									'<div class="barCodeNumber DIG"><span>' + bar.join('</span><span>') + '</span></div>',
								'</div>',
								'<div class="mecItem-row qrCode">',
									'<img src="data:image/png;base64,'+ mec.qrCodeImg +'"/>',
								'</div>',
							'</div>'
						]);
					}
					
					html = html.concat([
							'</div>',
						'</div>'
					]);
					$.fancybox.open(html.join(''));
				}
			}
		};
	};
})();
