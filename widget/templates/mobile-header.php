<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */ ?>

<header>
	<button type="button" class="basketClose" ng-click="fullBasket.loading = false; fullBasket.show = false" ng-show="fullBasket.show">
		<span class="icon-a"></span>
	</button>
	<?php if (strpos($_SERVER['REQUEST_URI'], '/settings/') == false): ?>
		<?php include(_tpl($basename, 'templates/auth.php')); ?>
	<?php endif; ?>
	<?php include(_tpl($basename, 'templates/menu.php')); ?>
	<div class="basketTrigger" ng-show="miniBasket.show" ng-click="openBasket()">
		<div class="icon-d"></div>
		<span class="DIG">{{miniBasket.tickets}}</span>
	</div>
</header>