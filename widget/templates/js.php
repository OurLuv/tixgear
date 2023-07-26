<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */ ?>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="<?php print $basename; ?>lib/ui/jquery-ui.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-animate.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-resource.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-sanitize.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.6/ngStorage.min.js"></script>

<?php foreach ([
	'lib/angular-growl/angular-growl.min',
	'lib/panzoom.min',
	'lib/jquery.maskedinput.min',
	'lib/modernizr-custom',
	'lib/hammer.min',
	'lib/moment.min',
	'lib/jquery.svg-seat-plan',
	'custom/config/reg',
	'scripts/core',
	'scripts/'.$scriptname,
	'scripts/header',
	'scripts/basket',
] as $script): ?>
	<script src="<?php print $basename; ?><?php print $script; ?>.js?q=v<?php print $version; ?>"></script>
<?php endforeach; ?>

<?php include_once($basename.'custom/include.php'); ?>
<script src="<?php print $basename; ?>custom/script.js?q=v<?php print time(); ?>"></script>