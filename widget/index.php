<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */

include_once('fn.php');
list($basename, $scriptname) = _tree();
?>
<?php include_once($basename.'config.php'); ?>
<!DOCTYPE html>
<html id="bil" lang="{{config.lng}}" ng-app="bilpro" ng-controller="bilController">
<head>
	<title>{{translate.settings.title}}</title>
	<?php include_once(_tpl($basename, 'templates/head.php')); ?>
</head>
<body class="home-page" data-source="<?php print $source; ?>">
	<div class="bil-main">
		<div growl></div>
		<div growl reference="1" limit-messages="1"></div>
		<?php include(_tpl($basename, 'templates/version.php')); ?>
		<div class="bil-header" ng-controller="bilHeader">
			<?php include_once(_tpl($basename, 'templates/mobile-header.php')); ?>
			<div class="bil-wrapper">
				<div class="bil-title" ng-show="action">
					<h1 class="fade-in">{{action.name}}</h1>
					<?php include(_tpl($basename, 'templates/auth.php')); ?>
					<?php include(_tpl($basename, 'templates/auth-popup.php')); ?>
					<?php include(_tpl($basename, 'templates/menu.php')); ?>
					<?php include_once(_tpl($basename, 'templates/kdp-popup.php')); ?>
					<?php include_once(_tpl($basename, 'templates/fanid-popup.php')); ?>
				</div>
				<div ng-show="action.description" class="bil-description fade-in">{{action.description}}</div>
				<div ng-show="config.cityName && config.venueName" class="bil-venue fade-in DIG">{{config.cityName}}, {{config.venueName}}</div>
				<div class="loader-wrapper" ng-show="!action"><?php include(_tpl($basename, 'templates/loader.php')); ?></div>
			</div>
		</div>
		
		<div class="bil-content">
			<div class="ghost-select"><span></span></div>
			
			<div class="bil-wrapper">
				<div class="venue-list DIG" ng-class="{'fade-in': filter.venues.show}" ng-show="filter.venues.show">
					<div class="venueItem" ng-class="{active: filter.venues.id == venue.venueId, negative: filter.venues.id != -1 && filter.venues.id != venue.venueId}" ng-repeat="venue in filter.venues.list" ng-click="SelectVenue(venue.venueId)">{{venue.title}}</div>
				</div>
				
				<div class="eventMonth-list DIG" ng-class="{'fade-in': filter.months.show}" ng-show="filter.months.show">
					<div class="eventMonthItem" ng-class="{active: filter.months.id == id, negative: filter.months.id != -1 && filter.months.id != id}" ng-repeat="(id, month) in filter.months.list" ng-click="SelectMonth(id)">{{month}}</div>
				</div>
				
				<div class="eventDay-list DIG" ng-class="{'fade-in': filter.days.show}" ng-show="filter.days.show">
					<div class="eventDayItem" ng-class="{active: filter.days.id == id, negative: filter.days.id != -1 && filter.days.id != id}" ng-repeat="(id, day) in filter.days.list" ng-click="SelectDay(id)">{{day}}</div>
				</div>
				
				<div class="eventTime-list DIG" ng-class="{'fade-in': filter.times.show}" ng-show="filter.times.show">
					<div class="eventTimeItem" ng-class="{active: filter.times.id == id, negative: filter.times.id != -1 && filter.times.id != id}" ng-repeat="(id, time) in filter.times.list" ng-click="SelectTime(id)">{{time}}</div>
				</div>
				
				<div class="placement" ng-class="{_wide: shop.scheme.show}" ng-show="action">
					<div class="placement-title hook-to-entry" ng-show="shop.entry.show">
						<span>{{translate.event.entry.title}}</span>
						<button class="scroll-to-scheme btn" ng-show="shop.scheme.show">{{translate.event.entry.scroll_to_scheme}}</button>
					</div>
					<div class="warningInfo" ng-show="cart.entries.tickets">{{translate.event.entry.warning}}</div>
					<div class="placement-withoutPlace" ng-show="shop.entry.show" ng-class="{one: categoriesSort.length == 1}">
						<div class="placementItem clearfix" ng-repeat="cid in categoriesSort">
							<div class="placementItem-title">«{{categories[cid].name}}»</div>
							<div ng-if="!categories[cid].tariffs" class="placementItem-price DIG">{{translate.event.entry.price}} {{categories[cid].price}}<span class="cur" ng-class="{CUR: action.currencyFont}">{{action.currencySymbol}}</span></div>
							
							<div ng-if="categories[cid].tariffs" class="placementItem-price DIG">
								<span>{{translate.price}} <span>{{categories[cid].min}}</span><span ng-if="categories[cid].min != categories[cid].max"> &#8230; </span><span ng-if="categories[cid].min != categories[cid].max">{{categories[cid].max}}</span></span><span class="cur" ng-class="{CUR: action.currencyFont}">{{action.currencySymbol}}</span>
							</div>
							<div class="placementItem-actions">
								<div class="input-group">
									<div class="input-group-btn">
										<div
											class="placementItem-menus btn-default btn"
											ng-click="!categories[cid].tariffs && CategoryClick(cid, -1)"
											ng-disabled="config.email.disabled"
											ng-class="{arr: categories[cid].tariffs, na: !config.email}"
										>
											<span>-</span>
											<div class="hiddenSelect" ng-if="categories[cid].tariffs">
												<select
													class="RUR"
													ng-model="categories[cid].selectTariff"
													ng-options="tid as categories[cid].tariffs[tid].name + (cart.entries.data[cid][tid] ? ' (' + cart.entries.data[cid][tid] + ')' : '') disable when tid == 0 || !cart.entries.data[cid][tid] for tid in categories[cid].tariffsSort"
													ng-change="TariffClick(cid, categories[cid].selectTariff, -1)"
												><option value="" disabled>{{translate.event.tariffs.choose}}</option></select>
											</div>
										</div>
									</div>
									<input
										class="form-control"
										type="text"
										ng-model="categories[cid].tickets"
										ng-change="CategoryInput(cid)"
										ng-disabled="config.email.disabled || categories[cid].tariffs"
										numbers-only
									>
									<div class="input-group-btn">
										<div
											class="placementItem-plus btn-default btn"
											ng-click="!categories[cid].tariffs && CategoryClick(cid, 1)"
											ng-disabled="config.email.disabled"
											ng-class="{arr: categories[cid].tariffs, na: !config.email}"
										>
											<span>+</span>
											<div class="hiddenSelect" ng-if="categories[cid].tariffs">
												<select
													class="RUR"
													ng-model="categories[cid].selectTariff"
													ng-options="tid as categories[cid].tariffs[tid].name + (categories[cid].tariffs[tid].price > categories[cid].max ? '' : ': ' + categories[cid].tariffs[tid].price + ' ' + action.currencySymbol) + (cart.entries.data[cid][tid] ? ' (' + cart.entries.data[cid][tid] + ')' : '') disable when tid == 0 for tid in categories[cid].tariffsSort"
													ng-change="TariffClick(cid, categories[cid].selectTariff, 1)"
												><option value="" disabled>{{translate.event.tariffs.choose}}</option></select>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="placementItem-availability DIG">{{translate.event.entry.available}} {{categories[cid].count}}</div>
						</div>
					</div>
					
					<div class="placement-title hook-to-scheme" ng-show="shop.scheme.show">
						<span>{{translate.event.scheme.title}}</span>
						<button class="scroll-to-entry btn" ng-show="shop.entry.show">{{translate.event.scheme.scroll_to_entry}}</button>
					</div>
					<div class="loader-wrapper loader-scheme" ng-show="shop.scheme.show && !shop.scheme.loaded">
						<?php include(_tpl($basename, 'templates/loader.php')); ?>
						<div class="loader-text" ng-show="shop.scheme.loading">{{translate.event.scheme.loader}}</div>
						<div class="loader-text" ng-show="shop.scheme.rendering">{{translate.event.scheme.rendering}}</div>
					</div>
					<div class="placementScheme" ng-show="shop.scheme.show">
						<div id="scheme"></div>
						
						<div class="placementLegend">
							<div class="legendSlide active">
								<button class="legendToggle">
									<div class="name">{{translate.event.scheme.legend.notation}}</div>
								</button>
								<div class="legendLinks-outer">
									<div class="legendLinks">
										<div class="reservator name" data-pose="-2">
											<span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preservator"><path fill="#4CAF50" d="M4.6,9.1l9.1,9.1L27.4,4.6L32,9.1L13.7,27.4L0,13.7L4.6,9.1z"></path></svg></span>
											<span>&nbsp;—&nbsp;{{translate.event.scheme.legend.my}}</span>
										</div>
										<div class="placementLegend-wrapper"></div>
										<div class="out-of-stock name" data-pose="1000000001">
											<span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preservator"><circle cx="16" cy="16" r="16"></circle></svg></span>
											<span>&nbsp;—&nbsp;{{translate.event.scheme.legend.sold}}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div class="controls">
							<div class="btn-group btn-group-lg">
								<button type="button" class="btn btn-info out" ng-click="ZoomOut($event)"><span class="icon-i"></span></button>
								<button type="button" class="btn btn-info in" ng-click="ZoomIn($event)"><span class="icon-h"></span></button>			
								<button type="button" class="btn btn-info reset" ng-click="ZoomReset()"><span class="icon-k"></span></button>					
							</div>
							<div class="info">x1</div>
						</div>
						<div class="seatHover"></div>
					</div>
					
					<div class="placement-no-result" ng-show="empty">{{translate.events.no_results}}</div>
					<div class="placement-kdp" ng-show="action.kdp && !kdpConfirm">{{translate.event.kdp.message}} <button class="btn ihave-kdp" ng-click="FormKDP()">{{translate.event.kdp.ihave}}</button></div>
				</div>
				
				<div class="loader-wrapper" ng-show="!action">
					<?php include(_tpl($basename, 'templates/loader.php')); ?>
				</div>
			</div>
		</div>
		<?php include_once(_tpl($basename, 'templates/basket-popup.php')); ?>
	</div>
</body>
</html>
