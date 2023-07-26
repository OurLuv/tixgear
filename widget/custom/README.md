# Widget customization instructions.

## Overview

You can fully customize your copy of the widget, and your changes will not be lost after the update. To do this, you must strictly follow this simple instruction.

## The main general rule

You should only make any changes to the `/custom` folder. Only such actions can guarantee the correct result.

## CSS

### Add styles

Add your new styles to the `/custom/style.css`.
You can also add any folders to the `/custom/styles` folder. For example, to include fonts or images.

### Override or remove styles

If the default styles conflict with your styles, you can override them by copying the `/styles/core.css` file to the `/custom/styles/core.css` and making changes to it.

## JS

### Add scripts

Add your new scripts to the `/custom/script.js`.

### User events tracking

We have compiled a selection of the most interesting custom events and made it possible for you to assign custom event handlers to them. Examples: `/custom/script_default.js`.

### JS code to the head tag

You can also add js code to the `<head>` tag. For example, to place a counter code on the page. To do this, you need to add your code (wrapped in a `<script>` tag) to the `/custom/include.php`.

## HTML templates

You can override some HTML templates. Just copy the template from `/templates` to `/custom/templates` and upload your changes to it.

### Attention!

The template files contain important scripts that affect the functionality of the widget.

## Directory structure:

* `/custom`
	* `/config` - Configuration folder
		* `/reg.js` - Regional configuration file
	* `/templates` - Templates folder
	* `/styles` - Styles folder
	* `/include.php` - File adding JS code to the `<head>` tag
	* `/script_default.js` - Default script file
	* `/script.js` - Script file
	* `/style.css` - Style file

- - -
© 2023 consta.prokhorov - BIL24. All Rights Reserved.
