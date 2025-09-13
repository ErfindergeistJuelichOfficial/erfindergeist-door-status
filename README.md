# erfindergeist-room-status

Wordpress plugin "Erfindergeist Room Status"

## Using

### Install Plugin

- upload all files to a plugin folder.
- enable plugin in wordpress admin center
- configure tokens in plugin settings in admin center

### Home Assistant

- add configuration to "rest_command" section in configuration.yaml
- replace all <TEMPLATE> variables with values

```yml
rest_command:
egj_room_status_get:
    url: "https://<URL_TO_WORDPRESS>/wp-json/erfindergeist/v2/room-status"
    method: get
  egj_room_status_post:
    url: "https://<URL_TO_WORDPRESS>/wp-json/erfindergeist/v2/room-status?token=<TOKEN1>&token2=<TOKEN2>&token3=<TOKEN3>"
    method: post
    content_type: "application/json"
    payload: "{{ payload }}"
```

- add a automation that send some data to endpoint of plugin
- there are examples in the "homeAssistant" folder

### Wordpress add Open/Close State

- on any page:
- add a "individually HTML" block
- add following HTML to the block:

```HTML
<div id="erfindergeistRoomStatusContainer"></div>
```

will show a status if the door is open or close

### Wordpress add Battery Status

- on any page
- add a "individually HTML" block
- add following HTML to the block:

``` HTML
<script>
const erfindergeistRoomStatusHealthCheckSettings =
[
  {
    title: "Batterie Status",
    type: "Battery",
    mapping: {
      smokeAlertBattery: "Rauchmelder",
      floodAlertBattery: "Wassermelder",
      doorBattery: "Tür Sensor",
      lockWorkshopBattery: "Werkstatt Schloss",
      lockFrontDoorBattery: "Haustüre Schloss",
      lockAWOBattery: "Veranstaltungen Schloss",
      sensorA4F0Battery: "Sensor A4F0",
      sensorA5A8Battery: "Sensor A5A8"
    }
  }
]
</script>
<div id="erfindergeistRoomStatusHealthCheckContainer">
  // content will be automatically replaced
</div>
```
- will show BatteryState of all the sensor data

## dev

### serve with docker

- WORK IN PROGRESS
- copy the compose.yml to a empty folder
- bash: ```docker-compose up```
- docker downloads all dependencies and folder wordpress is created.
- go into "wordpress/wp-content/plugins" and clone a this project into this folder
- missing: how to enable /wp-json/

## Continuous Deploy

- ".github\workflows\"
- Stage bases CD Pipelines

## tests

- folder ./test
- install vscode extension `humao.rest-client`
- copy `.env.example`
- rename to `.env`
- add values to `.env`
- click "send request"