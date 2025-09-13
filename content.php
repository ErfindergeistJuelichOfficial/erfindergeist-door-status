<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';

function custom_content_after_body_open_tag() {
  ?>
  <div id="erfindergeist-room-status-global"></div>
  <?php
}
add_action('wp_body_open', 'custom_content_after_body_open_tag');
