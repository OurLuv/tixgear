<?php
/*
 * Plugin Name:       WP-BIL24
 * Plugin URI:        https://bil24.pro/
 * Description:       Plugin for integration with BIL24's API
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Andrew Ourluv
 * Author URI:        https://github.com/OurLuv
 * License:           GNU General Public License v3.0 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Update URI:        https://bil24.pro/
 * Text Domain:       wp-bil24
 * Domain Path:       /languages
 */



function wp_bil24_register_block() {
	wp_enqueue_script( 'wp-bil24-bil24-view-script' );
    register_block_type( __DIR__ );
	wp_enqueue_script(
		"wp-bil24-script",
		plugin_dir_url(__FILE__) . "choices/choices.min.js"
	);
	if ( ! is_admin() ) {
		wp_enqueue_script(
			"wp-bil24-script-front",
			plugin_dir_url(__FILE__) . "index.js"
		);
	}
}

add_action( 'init', 'wp_bil24_register_block' );

