<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

function erfindergeist_room_status_styles() {
  wp_enqueue_style(
    'erfindergeist-room-status-style',
    plugins_url( '/', __FILE__ ) . 'erfindergeist-room-status.css',
    array('bootstrap'),
    "1.1"
  );

  wp_enqueue_script(
    'erfindergeist-room-status-script',
    plugins_url( '/', __FILE__ ) . 'erfindergeist-room-status.js',
    array('jquery'),
    1.4,
    true
  );
}

add_action('wp_enqueue_scripts', 'erfindergeist_room_status_styles');