<?PHP
/**
 * Plugin Name: Erfindergeist Room status
 * Description: Room status Erfindergeist Jülich e.V.
 * Author: Lars 'vreezy' Eschweiler
 * Author URI: https://www.vreezy.de
 * Version: 3.0.0
 * Text Domain: erfindergeist
 * Domain Path: /languages
 * Tested up to: 6.5
 *
 *
 * @package Erfindergeist-Room-Status
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';
require_once 'apis.php';
require_once 'styles.php';

function egj_room_status_settings_page() {
    
  $token_val_1 = "";
  $token_val_2 = "";
  $token_val_3 = "";
  $status = "";

  // Check if the user has submitted the form
  if ( !empty($_POST) || wp_verify_nonce($_POST['egj_door_status_field'],'egj_door_status_action') ) {
    $token_val_1 = $_POST[ $_SESSION['egj_room_status_token_input_name_1'] ];
    $token_val_2 = $_POST[ $_SESSION['egj_room_status_token_input_name_2'] ];
    $token_val_3 = $_POST[ $_SESSION['egj_room_status_token_input_name_3'] ];
   
    update_option( $_SESSION['egj_room_status_token_option_name_1'], $token_val_1 );
    update_option( $_SESSION['egj_room_status_token_option_name_2'], $token_val_2 );
    update_option( $_SESSION['egj_room_status_token_option_name_3'], $token_val_3 );

    $status = json_decode($_POST[ $_SESSION['egj_room_status_option_name_1'] ], true);
    if(!json_last_error_msg() ) {
      update_option( $_SESSION['egj_room_status_option_name_1'], $status );
    }
   
    // Put a "settings saved" message on the screen
    ?>
      <div class="updated"><p><strong><?php _e('settings saved.', 'menu-test' ); ?></strong></p></div>
    <?php

    if(json_last_error_msg() ) {
      ?>
        <div class="error"><p><strong><?php _e('Status JSON Error: ' . json_last_error_msg(), 'menu-test' ); ?></strong></p>
          <pre>
              <?php echo $_POST[ $_SESSION['egj_room_status_option_name_1'] ]; ?>
          </pre>
        </div>
      <?php
    }
  }
  else {
    // If the form hasn't been submitted, get the option value
    $token_val_1 = get_option( $_SESSION['egj_room_status_token_option_name_1'] );
    $token_val_2 = get_option( $_SESSION['egj_room_status_token_option_name_2'] );
    $token_val_3 = get_option( $_SESSION['egj_room_status_token_option_name_3'] );
  }

  $status = json_encode(get_option( $_SESSION['egj_room_status_option_name_1'] ),  JSON_PRETTY_PRINT);



  // Form
  ?>
    <div>
      <h3>Erfindergeist Room Status Settings</h3>
      <form name="form1" method="post" action="">
        <?php wp_nonce_field('egj_door_status_action','egj_door_status_field'); ?>

        <label for="token1">Token 1</label><br>
        <input id="token1" type="text" name="<?php echo $_SESSION['egj_room_status_token_input_name_1']; ?>" value="<?php echo isset($token_val_1) ? esc_attr($token_val_1) : ''; ?>"><br>
        <label for="token2">Token 2</label><br>
        <input id="token2" type="text" name="<?php echo $_SESSION['egj_room_status_token_input_name_2']; ?>" value="<?php echo isset($token_val_2) ? esc_attr($token_val_2) : ''; ?>"><br>
        <label for="token3">Token 3</label><br>
        <input id="token3" type="text" name="<?php echo $_SESSION['egj_room_status_token_input_name_3']; ?>" value="<?php echo isset($token_val_3) ? esc_attr($token_val_3) : ''; ?>"><br>
        <label for="status">Token 3</label><br>
        <textarea id="status" name="<?php echo $_SESSION['egj_room_status_option_name_1']; ?>" rows="10" cols="50" style="resize: both"><?php echo isset($status) ? esc_textarea($status) : ''; ?></textarea><br>

        <pre><?php echo $_SESSION['egj_room_status_option_name_1']; ?></pre><br>
        
        <br>
        
        <p class="submit">
          <input type="submit" name="Submit" class="button-primary" value="<?php esc_attr_e('Save Changes') ?>" />
        </p>

       
      </form>
    </div>
  <?php
}

function egj_room_status_plugin_options() {
  ?>
    <div>
      <h3>Erfindergeist</h3>
      <p>Please use Submenus for Options</p>
    </div>
  <?php
}


function egj_room_status_plugin_menu() {
  if ( empty ( $GLOBALS['admin_page_hooks']['erfindergeist'] ) ) {
    add_menu_page(
      'Erfindergeist',
      'Erfindergeist',
      'manage_options',
      'erfindergeist',
      'egj_room_status_plugin_options'
    );
  }

  add_submenu_page(
    'erfindergeist',
    'Room Status',
    'Room Status Settings',
    'manage_options',
    'egj-room-status-options-submenu-handle',
    'egj_room_status_settings_page'
  );
}

add_action( 'admin_menu', 'egj_room_status_plugin_menu' );