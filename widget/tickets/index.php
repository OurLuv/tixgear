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
	<title>{{translate.tickets.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="tickets-page">
	<div class="bil-main">
		<div growl></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			<div class="bil-wrapper">
				<div class="bil-title">
					<h1 class="fade-in">{{translate.tickets.title}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
				</div>
			</div>
		</div>
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			
			<div class="bil-wrapper">
				<div id="grid" class="ticketsList itemList clearfix" ng-show="loaded && tickets.length">
					<div class="ticketItem item columnContent ticket-{{ticket.actionEventId}}" ng-repeat="ticket in tickets" ng-class="{glasser: !laterThanToday(ticket.date)}">
						<div class="item-info">
							<a href="{{ticket.ticketsUrl}}" class="item-image" target="_blank">
								<img ng-src="{{ticket.smallPosterUrl}}" image-onload="imageOnload()" ng-click="mobileTickets(ticket.actionEventId)">
							</a>
							<div class="item-clearfix DIG">
								<div class="item-date">{{ticket.day}}</div>
								<div class="item-time">{{ticket.time}}</div>
							</div>
							<div class="item-title">{{ticket.actionName}}</div>
						</div>
						<div class="item-bottom">
							<div class="item-actions">
								<a class="btn btn-default buy-btn item-btn" ng-href="{{ticket.ticketsUrl}}" target="_blank">{{translate.tickets.open_button}}</a>
								<div class="btn btn-default remove-btn item-btn" ng-click="removeTickets(ticket.actionEventId)" ng-if="!laterThanToday(ticket.date)">{{translate.tickets.remove_button}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="no-results" ng-show="loaded && !tickets.length">{{translate.tickets.no_results}}</div>
				
				<div class="loader-wrapper" ng-show="!loaded">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		<?php include_once(_tpl($basename, 'templates/basket-popup.php')); ?>
	</div>
</body>
</html>
