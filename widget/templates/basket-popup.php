<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */ ?>

<div class="basketBG" ng-controller="bilBasket">
	<div class="basketMini" ng-show="miniBasket.show" ng-class="{'fade-in-down': miniBasket.show, 'fade-out-up': !miniBasket.show}">
		<div class="icon-d"></div>
		<span class="badge chart-badge DIG">{{miniBasket.tickets}}</span>
		<button class="btn btn-info" ng-click="FillBasket(true)">{{translate.basket.mini.buy_button}}</button>
	</div>
	
	<div class="basketFull" ng-show="fullBasket.show" ng-class="{'slide-in-right': fullBasket.show, 'slide-out-right': !fullBasket.show}">
		<div class="basketFull-top clearfix">
			<button type="button" class="close" ng-click="fullBasket.loading = false; fullBasket.show = false">
				<span>×</span>
			</button>
			<div class="time DIG" ng-show="cart.timeout.format">{{cart.timeout.format}}</div>
		</div>
		
		<div class="loader-wrapper" ng-show="fullBasket.loading">
			<?php include(_tpl($basename, 'templates/loader.php')); ?>
			<div class="loader-text" ng-show="fullBasket.processing">{{translate.basket.full.processing}}</div>
		</div>
		
		<div class="basketFull-content" ng-show="!fullBasket.loading">
			<div class="basketFull-empty" ng-show="miniBasket.tickets == 0">{{translate.basket.full.empty}}</div>
			
			<div class="basketFullItem" ng-repeat="action in cart.reserve.data">
				<div class="basketFullItem-action">{{action.actionName}}</div>
				<div class="basketFullItem-date DIG" ng-if="!config.goods">{{action.date.d}} {{action.date.w}}, {{action.date.m}} {{action.date.y}} {{action.date.t}}</div>
				<div class="basketFullItem-venue">{{action.venueName}}</div>
				<div class="basketFullItem-tickets">
					<div class="basketFullItemTicket" ng-repeat="ticket in action.seatList">
						<div class="basketFullItemTicket-top">
							<div class="basketFullItemTicket-place">
								<div class="bold DIG" ng-if="ticket.sector && ticket.row && ticket.number">{{translate.event.scheme.sector}} {{ticket.sector}} {{translate.event.scheme.row}} {{ticket.row}} {{translate.event.scheme.seat}} {{ticket.number}}</div>
								<div class="bold" ng-if="!ticket.sector && !ticket.row && !ticket.number">{{ticket.categoryPriceName}}</div>
								<div class="tariff" ng-if="ticket.tariffPlanName">{{translate.event.tariffs.title}} {{ticket.tariffPlanName}}</div>
							</div>
							<div class="basketFullItemTicket-price DIG">
								<span class="old" ng-if="ticket.discount">{{ticket.nominal}}<span class="cur" ng-class="{CUR: cart.currencyFont}">{{cart.currencySymbol}}</span></span>
								<span>{{ticket.price}}<span class="cur" ng-class="{CUR: cart.currencyFont}">{{cart.currencySymbol}}</span></span>
							</div>
							<div class="basketFullItemTicket-remove">
								<button type="button" class="close" ng-click="UnreserveTicket(ticket)">
									<span>×</span>
								</button>
							</div>
						</div>
						<div class="basketFullItemTicket-bottom" ng-if="ticket.discount">{{ticket.discountReason}}</div>
					</div>
				</div>
			</div>
			
			<div class="basketFullBottom" ng-show="miniBasket.tickets > 0">
				<div class="basketFullBottom-charge clearfix" ng-show="cart.totalCharge > 0">
					<div>{{translate.basket.full.charge}}</div>
					<div class="DIG">{{cart.totalCharge}}<span class="cur" ng-class="{CUR: cart.currencyFont}">{{cart.currencySymbol}}</span></div>
				</div>
				<div class="basketFullBottom-sum clearfix">
					<div>{{translate.basket.full.total}}</div>
					<div class="DIG">{{cart.totalSum}}<span class="cur" ng-class="{CUR: cart.currencyFont}">{{cart.currencySymbol}}</span></div>
				</div>
				
				<div class="basketFullBottom-fullname clearfix" ng-if="config.terms.fullName.required">
					<div class="form-label"><span class="icon-f"></span> {{translate.basket.full.full_name_placeholder}}</div>
					<input class="form-control iconic" type="text" ng-model="config.terms.fullName.value" placeholder="{{translate.basket.full.full_name_placeholder}}">
				</div>
				
				<div class="basketFullBottom-phone clearfix" ng-if="config.terms.phone.required">
					<div class="form-label"><span class="icon-f"></span> {{translate.basket.full.phone_placeholder}}</div>
					<input class="form-control iconic" type="text" masked format="+9 (999)999-99-99" ng-model="config.terms.phone.value" placeholder="{{translate.basket.full.phone_placeholder}}">
				</div>
				
				<div class="form-label">{{translate.promocodes.set_title}}</div>
				<form class="basketFullBottom-promoCodes input-group" ng-submit="SetBasketPromoCodes()" novalidate>
					<input class="form-control iconic" type="text" ng-model="basketPromoCodes" placeholder="{{translate.promocodes.set_placeholder}}" required>
					<span class="input-group-btn">
						<button class="btn btn-default" type="submit" ng-disabled="disabledBasketPromoCodes">{{translate.promocodes.set_button}}</button>
					</span>
				</form>
				
				<form class="basketFullBottom-agreement">
					<div class="agreement" ng-show="config.agr && translate.menu.agreement">
						<input id="agreement" type="checkbox" ng-model="checkAgree">
						<label for="agreement"><span ng-bind-html="translate.basket.full.agreement_prefix+config.agr+translate.basket.full.agreement_suffix"></span></label>
					</div>
					<div class="text-center">
						<button class="btn btn-danger" ng-click="UnreserveAll()" style="margin-left: 10px">{{translate.basket.full.clear}}</button>
						<button class="btn btn-info" ng-click="CreateOrder()" ng-disabled="(config.agr && !checkAgree) || (config.terms.fullName.required && !config.terms.fullName.value) || (config.terms.phone.required && !config.terms.phone.value)">{{translate.basket.full.buy_button}}</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
