<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';
require_once ABSPATH . 'wp-includes/rest-api.php';

function egj_door_status_post_api( WP_REST_Request $request){
  // https://stackoverflow.com/questions/53126137/wordpress-rest-api-custom-endpoint-with-url-parameter
  // $product_ID = $data['id'];
  $token1 = $request->get_param( 'token' );
  $token1_read = get_option( $_SESSION['egj_room_status_token_option_name_1'] );

  $token2 = $request->get_param( 'token2' );
  $token2_read = get_option( $_SESSION['egj_room_status_token_option_name_2'] );

  $token3 = $request->get_param( 'token3' );
  $token3_read = get_option( $_SESSION['egj_room_status_token_option_name_3'] );

  // Check if the tokens match 
  if($token1 !== $token1_read || $token2 !== $token2_read || $token3 !== $token3_read) {
    return new WP_Error();
  }

  // other ways to get the body
  // $body = $request->get_body();

  $oldData = get_option( $_SESSION['egj_room_status_option_name_1'] );

  $newData = json_decode(file_get_contents('php://input'), true);

  // check newData is a one dimensional object
  if (!is_array($newData)) {
    return new WP_Error('invalid_data', 'The data must be a one-dimensional array.', array('status' => 400));
  }

  // add current timestamp
  // $newData['dateTime'] = (new DateTime())->format(DateTime::ATOM);

  // set a dateTime key for each entry of newData
  foreach ($newData as $key => $value) {
    if (is_array($value)) {
      $newData[$key]['dateTime'] = (new DateTime())->format(DateTime::ATOM);
    } else {
      $newData[$key] = [
        'value' => $value,
        'dateTime' => (new DateTime())->format(DateTime::ATOM)
      ];
    }
  }
  // mix old and new data
  if ($oldData) {
    $newData = array_merge($oldData, $newData);
  }

  update_option( $_SESSION['egj_room_status_option_name_1'], $newData );
  $response = new WP_REST_Response($newData );
  $response->set_status(200);

  return $response;
}

function egj_door_status_get_api( $data ) {
  $jsonData = get_option( $_SESSION['egj_room_status_option_name_1'] );

  $response = new WP_REST_Response($jsonData);
  $response->set_status(200);

  return $response;
}

add_action('rest_api_init', function () {
  register_rest_route($_SESSION['egj_room_status_namespace'] .'/' . $_SESSION['egj_door_status_version'] , '/' . $_SESSION['egj_room_status_route'], array(
    'methods'  => 'GET',
    'callback' => 'egj_door_status_get_api',
    'permission_callback' => '__return_true'
  ));
});

add_action('rest_api_init', function () {
  register_rest_route($_SESSION['egj_room_status_namespace'] .'/' . $_SESSION['egj_door_status_version'], '/' . $_SESSION['egj_room_status_route'], array(
    'methods'  => 'POST',
    'callback' => 'egj_door_status_post_api',
    'permission_callback' => '__return_true'
  ));
});
