<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */ ?>

<div id="kdp-popup" style="display: none">
	<div class="popup-title">{{translate.event.kdp.title}}</div>
	<div class="message" ng-class="{error: formErrorKDP}" ng-show="formErrorKDP">{{formErrorKDP}}</div>
	<div class="kdp-get">
		<form name="kdp" class="input-group" ng-submit="SetKDP()" novalidate>
			<input class="form-control iconic" type="text" ng-model="config.kdp" placeholder="{{translate.event.kdp.placeholder}}" ng-pattern="/^\d+$/">
			<span class="input-group-btn">
				<button class="btn btn-default" type="submit">{{translate.event.kdp.button}}</button>
			</span>
		</form>
	</div>
</div>