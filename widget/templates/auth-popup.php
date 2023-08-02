<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */ ?>

<!--div id="auth-popup" style="display: none">
	<div class="popup-title">{{translate.email.title}}</div>
	<div class="message" ng-class="{error: formError}" ng-show="formMessage">{{formMessage}}</div>
	
	<div class="email-get" ng-show="!confirm">
		<form name="userMail" class="input-group" ng-submit="SetEmail()" novalidate>
			<input class="form-control iconic" type="email" value="{{config.email}}" placeholder="{{translate.email.form.bind.placeholder}}" ng-model="email" ng-pattern="/^([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,6}$/" required>
			<span class="input-group-btn">
				<button class="btn btn-default" type="submit">{{translate.email.form.bind.button}}</button>
			</span>
		</form>
	</div>
	
	<div class="email-confirm" ng-show="confirm">
		<form class="input-group" ng-submit="ConfirmEmail()" novalidate>
			<input class="form-control iconic" type="text" ng-model="code" placeholder="{{translate.email.form.confirm.placeholder}}" required>
			<span class="input-group-btn">
				<button class="btn btn-default" type="submit">{{translate.email.form.confirm.button}}</button>
			</span>
		</form>
	</div>
</div-->

<div id="auth-popup" style="display: none">
	<div class="popup-title">{{translate.email.title}}</div>
	<div class="message" ng-show="authMessage">{{authMessage}}</div>
	<div class="popup-" style="padding: 1em 0 1.5em;">
		<span class="input-group-btn">
			<button class="btn btn-default" ng-click="AuthorizationV2()">{{authButton}}</button>
		</span>
	</div>
</div>
