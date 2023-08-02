# BIL24 web widget is a web widget for selling tickets to events using the BIL24 ticketing system.

## Overview

Congratulations! You are reading this because you have received a licensed copy of our legendary web widget. Now you can sell tickets to events through your website or social media accounts and receive commissions from the BIL24 ticketing system.

The BIL24 web widget can be used to sell merchandise or other products.

## Install

To install the BIL24 web widget on a website, download and place the `/widget` folder in the root directory of the website.

## Creating a Link

To create a selling link, sign in to the Agent or Operator account in the BIL24 Manager app, open the Widget tab, and fill in all required fields.

Link parameters:
* **One event** `/widget/#/`
	* `frontendId`: Interface identifier in the BIL24 system (website or another interface)
	* `token`: Interface token (password)
	* `zone`: Operating mode (test for testing or real for production, default: test)
	* `id`: Event identifier in the BIL24 system
	* `cityId`: City identifier in the BIL24 system
	* `venueId`: Venue identifier in the BIL24 system (optional)
	* `success`: URL to redirect on successful purchase (default: /widget/success/)
	* `fail`: URL to redirect on failed purchase (default: /widget/fail/)
	* `agr`: Offer page URL (optional)
	* `bank`: Whether to open the bank page in a new tab (optional, 1 - new tab, default: in the same tab)
	* `goods`: Tickets, or goods (optional, 1 - for goods, default: tickets)
	* `lng`: Data language (optional, default: ru)
	* `devel`: Enable debug mode (optional, 1 - show error messages, default: hide error messages)

* **Event list** `/widget/city/#/`
	* `frontendId`: Interface identifier in the BIL24 system (website or another interface)
	* `token`: Interface token (password)
	* `zone`:Operating mode (test for testing or real for production, default: test)
	* `cityId`: City identifier in the BIL24 system
	* `venueId`: Venue identifier in the BIL24 system (optional, default: - all venues)
	* `kindId`: Kind identifier in the BIL24 system (optional, default: - all kinds)
	* `success`: URL to redirect on successful purchase (default: /widget/success/)
	* `fail`: URL to redirect on failed purchase (default: /widget/fail/)
	* `agr`: Offer page URL (optional)
	* `goods`: Tickets, or goods (optional, 1 - for goods, default: tickets)
	* `lng`: Data language (optional, default: ru)
	* `devel`: Enable debug mode (optional, 1 - show error messages, default: hide error messages)

## Helpful Links

* [BIL24 Docs](https://bil24.pro/index.html)
* [Manager Docs](https://bil24.pro/manager.html)
* [Webwidget Docs](https://bil24.pro/webwidget.html)


- - -
© 2023 consta.prokhorov - BIL24. All Rights Reserved.
