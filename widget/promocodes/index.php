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
	<title>{{translate.promocodes.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="codes-page">
	<div class="bil-main">
		<div growl></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			<div class="bil-wrapper">
				<div class="bil-title">
					<h1 class="fade-in">{{translate.promocodes.title}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
				</div>
			</div>
		</div>
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			
			<div class="bil-wrapper">
				<div id="grid" class="codesList itemList clearfix" ng-show="loaded && promocodes.length">
					<div class="codeItem item columnContent" ng-click="OpenPack(promocode.pack)" ng-repeat="promocode in promocodes">
						<div class="item-info">
							<div class="item-clearfix DIG">
								<div class="item-date">{{promocode.code}}</div>
								<div class="item-time">{{promocode.discount}}%</div>
							</div>
							<div class="item-title">{{promocode.name}}</div>
							<div class="item-description">{{promocode.info}}</div>
						</div>
						<div class="item-bottom">
							<div class="item-actions">
								<div class="btn btn-default item-btn">{{translate.promocodes.ins}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="no-results" ng-show="loaded && !promocodes.length">{{translate.promocodes.no_results}}</div>
				
				<div class="loader-wrapper" ng-show="!loaded">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		<?php include_once(_tpl($basename, 'templates/basket-popup.php')); ?>
	</div>
</body>
</html>
