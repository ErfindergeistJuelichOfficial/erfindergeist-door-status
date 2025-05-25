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
  
  if( isset($_POST[ $_SESSION['egj_door_status_hidden_field_input_name'] ]) && $_POST[ $_SESSION['egj_door_status_hidden_field_input_name'] ] === $hash ) {
    $token_val = $_POST[ $_SESSION['egj_door_status_token_input_name'] ];
    $token_val_2 = $_POST[ $_SESSION['egj_door_status_token_input_name_2'] ];
    $token_val_3 = $_POST[ $_SESSION['egj_door_status_token_input_name_3'] ];
   
    update_option( $_SESSION['egj_door_status_token_option_name'], $token_val );
    update_option( $_SESSION['egj_door_status_token_option_name_2'], $token_val_2 );
    update_option( $_SESSION['egj_door_status_token_option_name_3'], $token_val_3 );
   
    // Put a "settings saved" message on the screen
    ?>
      <div class="updated"><p><strong><?php _e('settings saved.', 'menu-test' ); ?></strong></p></div>
    <?php
  }

  // read tokens from options
  $token = get_option( $_SESSION['egj_door_status_token_option_name'] );
  $token2 = get_option( $_SESSION['egj_door_status_token_option_name_2'] );
  $token3 = get_option( $_SESSION['egj_door_status_token_option_name_3'] );

  // Form
  ?>
    <div>
      <h3>Erfindergeist Door Status Settings</h3>
      <form name="form1" method="post" action="">
        <input type="hidden" name="<?php echo $_SESSION['egj_door_status_hidden_field_input_name']; ?>" value="<?php esc_attr($hash) ?>">
        <p>Token:</p>
        <input type="text" name="<?php echo $_SESSION['egj_door_status_token_input_name']; ?>" value="<?php echo isset($token) ? esc_attr($token) : ''; ?>">
        <input type="text" name="<?php echo $_SESSION['egj_door_status_token_input_name_2']; ?>" value="<?php echo isset($token2) ? esc_attr($token2) : ''; ?>">
        <input type="text" name="<?php echo $_SESSION['egj_door_status_token_input_name_3']; ?>" value="<?php echo isset($token3) ? esc_attr($token3) : ''; ?>">
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