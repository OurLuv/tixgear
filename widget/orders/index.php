<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */

include_once('../fn.php');
list($basename, $scriptname) = _tree();
?>
<?php include_once($basename.'config.php'); ?>
<!DOCTYPE html>
<html id="bil" lang="ru" ng-app="bilpro" ng-controller="bilController">
<head>
	<title>{{translate.orders.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="orders-page">
	<div class="bil-main">
		<div growl></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			
			<div class="bil-wrapper">
				<div class="bil-title">
					<h1 class="fade-in">{{translate.orders.title}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
				</div>
			</div>
		</div>
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			
			<div class="bil-wrapper">
				<div id="grid" class="ordersList itemList clearfix" ng-show="loaded && orders.length">
					<div class="orderItem item columnContent order-{{order.orderId}}" ng-repeat="order in orders" ng-class="{glasser: order.statusExtInt != 0}">
						<div class="item-info">
							<div class="item-clearfix DIG">{{translate.orders.number}} {{order.orderId}}</div>
							<div class="item-title">{{order.userMessage}}</div>
							<div class="item-description">{{translate.orders.created}} <span class="DIG">{{order.date}}</span></div>
							<div class="item-description">{{translate.orders.count}} <span class="DIG">{{order.quantity}}</span> {{translate.unit}}</div>
							<div class="item-description">{{translate.orders.price}} <span class="DIG">{{order.sum}}</span><span class="cur" ng-class="{CUR: order.currencyFont}">{{order.currencySymbol}}</span></div>
						</div>
						<div class="item-bottom">
							<div class="item-actions">
								<a class="btn btn-default buy-btn item-btn" ng-href="{{order.formUrl}}" ng-if="order.statusExtInt == 0">{{translate.orders.buy_button}}</a>
								<!--div class="btn btn-default remove-btn item-btn" ng-click="removeOrder(order.orderId)">{{translate.orders.remove_button}}</div-->
							</div>
						</div>
					</div>
				</div>
				<div class="no-results" ng-show="loaded && !orders.length">{{translate.orders.no_results}}</div>
				<div class="loader-wrapper" ng-show="!loaded">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		<?php include_once(_tpl($basename, 'templates/basket-popup.php')); ?>
	</div>
</body>
</html>
