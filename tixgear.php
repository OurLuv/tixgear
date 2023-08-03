<?php
/*
 * Plugin Name:       TixGear
 * Plugin URI:        https://github.com/OurLuv/tixgear
 * Description:       Plugin for adding event/product cards in the Gutenberg editor for sale and integration with the TixGear's API
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Andrew Ourluv
 * Author URI:        https://github.com/OurLuv
 * License:           GNU General Public License v3.0 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Update URI:        https://tixgear.com/
 * Text Domain:       tixgear
 * Domain Path:       /languages
 */



function tixgear_register_block() {
	wp_enqueue_script( 'tixgear-tixgear-view-script' );
    register_block_type( __DIR__ );
	wp_enqueue_script(
		"tixgear-script",
		plugin_dir_url(__FILE__) . "choices/choices.min.js"
	);
	if ( ! is_admin() ) {
		wp_enqueue_script(
			"tixgear-script-front",
			plugin_dir_url(__FILE__) . "index.js"
		);
	}
}

add_action( 'init', 'tixgear_register_block' );

