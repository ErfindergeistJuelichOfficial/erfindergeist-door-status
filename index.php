<?PHP
/**
 * Plugin Name: Erfindergeist Door status
 * Description: Door status Erfindergeist Jülich e.V.
 * Author: Lars 'vreezy' Eschweiler
 * Author URI: https://www.vreezy.de
 * Version: 1.0.0
 * Text Domain: erfindergeist
 * Domain Path: /languages
 * Tested up to: 6.5
 *
 *
 * @package Erfindergeist-Door-Status
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';
require_once 'apis.php';
require_once 'styles.php';

function egj_door_status_settings_page() {
  $hash = "egj"; 
  
  $token = "";
  $token2 = "";
  $token3 = "";

  ?>
  <p>isset: <?php echo isset($_POST[ $_SESSION['egj_door_status_hidden_field_input_name'] ]) ? "yes": "no" ?></p>
  <p>hash is eq: <?php echo  $_POST[ $_SESSION['egj_door_status_hidden_field_input_name'] ] === $hash ? "yes": "no" ?></p>

  <?php
  // Check if the user has submitted the form
  if( isset($_POST[ $_SESSION['egj_door_status_hidden_field_input_name'] ]) && $_POST[ $_SESSION['egj_door_status_hidden_field_input_name'] ] === $hash ) {
    $token = $_POST[ $_SESSION['egj_door_status_token_input_name'] ];
    $token2 = $_POST[ $_SESSION['egj_door_status_token_input_name_2'] ];
    $token3 = $_POST[ $_SESSION['egj_door_status_token_input_name_3'] ];
   
    update_option( $_SESSION['egj_door_status_token_option_name'], $token );
    update_option( $_SESSION['egj_door_status_token_option_name_2'], $token2 );
    update_option( $_SESSION['egj_door_status_token_option_name_3'], $token3 );
   
    // Put a "settings saved" message on the screen
    ?>
      <div class="updated"><p><strong><?php _e('settings saved.', 'menu-test' ); ?></strong></p></div>
    <?php
  }
  else {
    // If the form hasn't been submitted, get the option value
    $token = get_option( $_SESSION['egj_door_status_token_option_name'] );
    $token2 = get_option( $_SESSION['egj_door_status_token_option_name_2'] );
    $token3 = get_option( $_SESSION['egj_door_status_token_option_name_3'] );
  }

  // Form
  ?>
    <div>
      <h3>Erfindergeist Door Status Settings</h3>
      <form name="form1" method="post" action="">
        <input type="hidden" name="<?php echo $_SESSION['egj_door_status_hidden_field_input_name']; ?>" value="<?php echo esc_attr($hash) ?>">

        <label for="token1">Token 1</label><br>
        <input id="token1" type="text" name="<?php echo $_SESSION['egj_door_status_token_input_name']; ?>" value="<?php echo isset($token) ? esc_attr($token) : ''; ?>"><br>
        <label for="token2">Token 2</label><br>
        <input id="token2" type="text" name="<?php echo $_SESSION['egj_door_status_token_input_name_2']; ?>" value="<?php echo isset($token2) ? esc_attr($token2) : ''; ?>"><br>
        <label for="token3">Token 3</label><br>
        <input id="token3" type="text" name="<?php echo $_SESSION['egj_door_status_token_input_name_3']; ?>" value="<?php echo isset($token3) ? esc_attr($token3) : ''; ?>"><br>
        <p class="submit">
          <input type="submit" name="Submit" class="button-primary" value="<?php esc_attr_e('Save Changes') ?>" />
        </p>
      </form>
    </div>
  <?php
}

function egj_door_status_plugin_options() {
  ?>
    <div>
      <h3>Erfindergeist</h3>
      <p>Please use Submenus for Options</p>
    </div>
  <?php
}


function egj_door_status_plugin_menu() {
  if ( empty ( $GLOBALS['admin_page_hooks']['erfindergeist'] ) ) {
    add_menu_page(
      'Erfindergeist',
      'Erfindergeist',
      'manage_options',
      'erfindergeist',
      'egj_door_status_plugin_options'
    );
  }

  add_submenu_page(
    'erfindergeist',
    'Door Status',
    'Door Status Settings',
    'manage_options',
    'egj-door-status-options-submenu-handle',
    'egj_door_status_settings_page'
  );
}

add_action( 'admin_menu', 'egj_door_status_plugin_menu' );