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
	<title>{{translate.success.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="result-page">
	<div class="bil-main">
		<div growl></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			<div class="bil-wrapper">
				<div class="bil-title">
					<h1 class="fade-in">{{translate.success.title}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
				</div>
			</div>
		</div>
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			<div class="bil-wrapper">
				<div class="no-results">{{translate.success.description}}</div>
				<a class="btn" ng-href="{{event}}">{{translate.success.button}}</a>
			</div>
		</div>
	</div>
</body>
</html>