<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';

enum State: string {
  case Open = 'open';
  case Close = 'close';
}

enum AlertState: string {
  case Yes = "yes";
  case No = "No";
}

class RoomState {
  public State $doorState;
  public State $lockState;

  public AlertState $camPersonState;
  public AlertState $camAnimalState;
  public AlertState $camMotionState;

  public AlertState $smokeAlertState;

  public string $roomTemp;

  public string $dateTime;
}

$requiredRoomStateProps = ['doorState', 'lockState', 'camPersonState', 'camAnimalState', 'camMotionState', 'smokeAlertState', 'roomTemp'];

function validateJsonWithRequiredFields(string $json, array $requiredFields): bool {
  $data = json_decode($json, true);

  if (json_last_error() !== JSON_ERROR_NONE) {
    return false; // Ungültiges JSON
  }

  foreach ($requiredFields as $field) {
    if (!array_key_exists($field, $data)) {
        return false; // Feld fehlt
    }
  }

  return true;
}

function json_string_to_room_state(string $json_string): RoomState {
  $data = json_decode($json_string, true);
  
  $state = new RoomState();
  $state->doorState = $data->doorState;
  $state->lockState = $data->lockState;
  $state->camPersonState = $data->camPersonState;
  $state->camAnimalState = $data->camAnimalState;
  $state->camMotionState = $data->camMotionState;
  $state->smokeAlertState = $data->smokeAlertState;
  $state->roomTemp = $data->roomTemp;

  return $state;
}

function egj_door_status_post_api( $data ) {
  // https://stackoverflow.com/questions/53126137/wordpress-rest-api-custom-endpoint-with-url-parameter
  // $product_ID = $data['id'];
  $token_param = $data->get_param( 'token' );
  $token_read = get_option( $_SESSION['egj_door_status_token_option_name'] );

  $token_param2 = $data->get_param( 'token2' );
  $token_read2 = get_option( $_SESSION['egj_door_status_token_option_name_2'] );

  $token_param3 = $data->get_param( 'token3' );
  $token_read3 = get_option( $_SESSION['egj_door_status_token_option_name_3'] );

  if($token_param !== $token_read && $token_param2 === $token_read2 && $token_param3 === $token_read3) {
    return new WP_Error('rest_custom_error', 'Unknown Error', array('status' => 400));
  }

  if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
    $jsonData = file_get_contents('php://input');

    if(validateJsonWithRequiredFields($jsonData, $requiredRoomStateProps) === false) {
      return new WP_Error('rest_custom_error', 'Invalid JSON', array('status' => 400));
    }

    $state = json_string_to_room_state($jsonData);
    $now = new DateTime();
    $dateTime = $now->format(DateTime::ATOM);
    $state->dateTime = $dateTime;

    update_option( $_SESSION['egj_door_status_option_name'], json_encode($state, true) );

    $response = new WP_REST_Response();
    $response->set_status(200);
  
    return $response;

  } else {
    // Handle non-JSON requests -> toggle doorState
    $jsonData = get_option( $_SESSION['egj_door_status_option_name'] );

    if(validateJsonWithRequiredFields($jsonData, $requiredRoomStateProps) === false) {
      return new WP_Error('rest_custom_error', 'Invalid JSON in Options', array('status' => 400));
    }

    $state = json_string_to_room_state($jsonData);
    $state->doorState = !$state->doorState;

    update_option( $_SESSION['egj_door_status_option_name'], json_encode($state, true) );

    $response = new WP_REST_Response(json_decode($jsonData, true));
    $response->set_status(200);

    return $response;
  }
}

function egj_door_status_get_api( $data ) {
  $jsonData = get_option( $_SESSION['egj_door_status_option_name'] );

  if(validateJsonWithRequiredFields($jsonData, $requiredRoomStateProps) === false) {
    return new WP_Error('rest_custom_error', 'Invalid JSON in Options', array('status' => 400));
  }

  $response = new WP_REST_Response(json_decode($jsonData, true));
  $response->set_status(200);

  return $response;

}

// CUSTOM APIS

add_action('rest_api_init', function () {
  register_rest_route($_SESSION['egj_door_status_namespace'] .'/' . $_SESSION['egj_door_status_version'] , '/' . $_SESSION['egj_door_status_route'], array(
    'methods'  => 'GET',
    'callback' => 'egj_door_status_get_api',
    'permission_callback' => '__return_true'
  ));
});

add_action('rest_api_init', function () {
  register_rest_route($_SESSION['egj_door_status_namespace'] .'/' . $_SESSION['egj_door_status_version'], '/' . $_SESSION['egj_door_status_route'], array(
    'methods'  => 'POST',
    'callback' => 'egj_door_status_post_api',
    'permission_callback' => '__return_true'
    
  ));
});
