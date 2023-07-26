<?php /**          _     _            _           ____
 *       __      _(_) __| | __ _  ___| |_  __   _|___ \
 *       \ \ /\ / / |/ _` |/ _` |/ _ \ __| \ \ / / __) |
 *        \ V  V /| | (_| | (_| |  __/ |_   \ V / / __/ 
 *         \_/\_/ |_|\__,_|\__, |\___|\__|___\_/ |_____|
 *                         |___/                        © consta.prokhorov 2023 */

function _tree(){
	$dirname = dirname($_SERVER['SCRIPT_FILENAME']);
	if (file_exists($dirname.'/config.php')) {
		return ['', 'script'];
	} else {
		return ['../', basename($dirname)];
	}
}

function _tpl($basename, $tpl){
	$custom = 'custom/'.$tpl;
	if (file_exists($basename.$custom)) $tpl = $custom;
	return $basename.$tpl;
}

function _css($basename, $tpl){
	$custom = 'custom/'.$tpl;
	if (file_exists($basename.$custom)) $tpl = $custom;
	return $basename.$tpl;
}
?>