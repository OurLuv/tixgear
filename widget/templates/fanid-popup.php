<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */ ?>

<div id="fanid-popup" style="display: none">
	<div class="popup-title">{{translate.event.fanid.title}}</div>
	<div class="message" ng-class="{error: formErrorFanId}" ng-show="formErrorFanId">{{formErrorFanId}}</div>
	<div class="fanid-get">
		<form name="fanid" class="input-group" ng-submit="SetFanId()" novalidate>
			<input class="form-control iconic" type="text" ng-model="config.fanid" placeholder="{{translate.event.fanid.placeholder}}" ng-pattern="/^[0-9]{8,12}$/" required>
			<span class="input-group-btn">
				<button class="btn btn-default" type="submit">{{translate.event.fanid.button}}</button>
			</span>
		</form>
	</div>
</div>