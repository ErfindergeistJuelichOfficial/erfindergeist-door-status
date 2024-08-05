<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

function erfindergeist_door_status_styles() {
  wp_enqueue_script(
    'erfindergeist-door-status-script',
    plugins_url( '/', __FILE__ ) . 'erfindergeist-door-status.js',
    array('jquery'),
    1.3,
    true
  );
}

add_action('wp_enqueue_scripts', 'erfindergeist_door_status_styles');