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
<html id="bil" lang="{{config.lng}}" ng-app="bilpro" ng-controller="bilController">
<head>
	<title>{{translate.events.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="event-page">
	<div class="bil-main">
		<div growl></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			<div class="bil-wrapper">
				<div class="bil-title" ng-show="filters">
					<h1 class="fade-in">{{config.cityName}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
				</div>
				
				<div class="filterWrapper" ng-show="filters">
					<div class="filterElem">
						<select class="form-control" ng-model="config.venueId" ng-options="venue.venueId as venue.venueName for venue in filters.venueList" ng-change="displayItems()"></select>
					</div>
					<div class="filterElem">
						<select class="form-control" ng-model="config.kindId" ng-options="kind.kindId as kind.kindName for kind in filters.kindList" ng-change="displayItems()"></select>
					</div>
					<div class="filterElem">
						<input class="form-control iconic" ng-model="filters.date" datepicker ng-change="displayItems()">
					</div>
					<div class="filterElem">
						<input class="form-control iconic" type="text" placeholder="{{translate.events.search}}" ng-model="filters.search" ng-change="displayItems()">
					</div>
				</div>
				<div class="loader-wrapper" ng-show="!filters">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			
			<div class="bil-wrapper">
				<div id="grid" class="eventsList itemList clearfix" ng-show="loaded && events.length">
					<a class="eventItem item columnContent" href="{{makeHref(event)}}" ng-if="displayItem(event)" ng-repeat="event in events">
						<div class="item-info">
							<div class="item-image">
								<img ng-src="{{event.smallPosterUrl}}" image-onload="imageOnload()">
							</div>
							<div class="item-clearfix">
								<div class="item-date DIG">{{event.firstEventDate}}<span ng-if="event.firstEventDate != event.lastEventDate"> - {{event.lastEventDate}}</span></div>
								<div class="item-time DIG" ng-if="event.actionEventTime">{{event.actionEventTime}}</div>
							</div>
							<div class="item-title">{{event.actionName}}</div>
							<div class="item-subtitle" ng-if="event.actionName != event.fullActionName">{{event.fullActionName}}</div>
							<div class="item-description">{{event.posterName}}</div>
						</div>
						<div class="item-bottom">
							<div class="item-actions">
								<div class="btn btn-default item-btn">{{translate.events.buy_button}}</div>
							</div>
						</div>
					</a>
				</div>
				
				<div class="no-results" ng-show="loaded && (!events.length || !events.count)">{{translate.events.no_results}}</div>
				
				<div class="loader-wrapper" ng-show="!loaded">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		<?php include_once(_tpl($basename, 'templates/basket-popup.php')); ?>
	</div>
</body>
</html>
