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
	<title>{{localization.mecs.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="mecs-page">	
	<div class="bil-main">
		<div growl></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			<div class="bil-wrapper">
				<div class="bil-title">
					<h1 class="fade-in">{{translate.mecs.title}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
				</div>
			</div>
		</div>
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			
			<div class="bil-wrapper">
				<div id="grid" class="mecsList itemList clearfix" ng-show="loaded && mecs.length">
					<div class="mecItem item columnContent mec-{{mec.actionEventId}}" ng-click="OpenMec(mec.actionEventId)" ng-repeat="mec in mecs">
						<div class="item-info">
							<div class="item-image">
								<img ng-src="{{mec.smallPosterUrl}}" image-onload="imageOnload()">
							</div>
							<div class="item-title">{{mec.actionName}}</div>
						</div>
						<div class="item-bottom">
							<div class="item-actions">
								<div class="btn btn-default item-btn">{{translate.mecs.ins}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="no-results" ng-show="loaded && !mecs.length">{{translate.mecs.no_results}}</div>
				
				<div class="loader-wrapper" ng-show="!loaded">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		<?php include_once(_tpl($basename, 'templates/basket-popup.php')); ?>
	</div>
</body>
</html>
