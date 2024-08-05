<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';

class DoorStatusResponse {
  public $status;

  public function __construct(string $status)
  {
    $this->status = $status;
  }

  public function toString() {
    $arr = array('status' => $this->status);
    return json_encode($arr);
  }
}

function egj_door_status_post_api( $data ) {
  // https://stackoverflow.com/questions/53126137/wordpress-rest-api-custom-endpoint-with-url-parameter
  // $product_ID = $data['id'];
  $token_param = $data->get_param( 'token' );
  $token_read = get_option( $_SESSION['egj_door_status_token_option_name'] );

  if($token_param != $token_read) {
    return new WP_Error('rest_custom_error', 'Unknown Error', array('status' => 400));
  }

  $status = $data->get_param( 'status' );

  update_option( $_SESSION['egj_door_status_option_name'], $status );

  $response = new WP_REST_Response();
  $response->set_status(200);

  return $response;

}

function egj_door_status_get_api( $data ) {
  $status = get_option( $_SESSION['egj_door_status_option_name'] );

  $content = new DoorStatusResponse($status);

  $response = new WP_REST_Response(json_decode($content->toString(), true));
  $response->set_status(200);

  return $response;

}

// CUSTOM APIS

add_action('rest_api_init', function () {
  register_rest_route('erfindergeist/v1', '/door-status', array(
    'methods'  => 'GET',
    'callback' => 'egj_door_status_get_api',
    'permission_callback' => '__return_true'
  ));
});

add_action('rest_api_init', function () {
  register_rest_route('erfindergeist/v1', '/door-status', array(
    'methods'  => 'POST',
    'callback' => 'egj_door_status_post_api',
    'permission_callback' => '__return_true'
    
  ));
});

?>