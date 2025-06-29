# erfindergeist-room-status

Wordpress plugin "Erfindergeist Room Status"


## Using

### HealthState

``` HTML
<script>
const erfindergeistRoomStatusHealthCheckTitle = "Batterie Status"
const erfindergeistRoomStatusHealthCheckMapping =
{
  smokeAlertBattery: "Rauchmelder",
  lockBattery: "Tür Schloss",
  doorBattery: "Sensor Tür",
  sensorA4F0Battery: "Sensor A4F0",
  sensorA5A8Battery: "Sensor A5A8",
  lockFrontDoorBattery: "Haustüre Schloss",
  lockAWOBattery: "AWO Schloss"
}
</script>
<div id="erfindergeistRoomStatusHealthCheckContainer">
  // content
</div>
```

## dev

### serve with docker

- copy the compose.yml to a empty folder
- bash: ```docker-compose up```
- docker downloads all dependencies and folder wordpress is created.
- go into "wordpress/wp-content/plugins" and clone a this project into this folder
- missing: how to enable /wp-json/

## vs code plugins

- `esbenp.prettier-vscode`
- `humao.rest-client`
- `yogensia.searchwpdocs`
- `streetsidesoftware.code-spell-checker`
- `streetsidesoftware.code-spell-checker-german` 

