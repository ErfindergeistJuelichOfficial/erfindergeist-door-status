(function( erfindergeistRoomStatus, $, undefined ) {

  const openStateContainerId = "erfindergeistRoomStatusContainer"; 
  const healthCheckContainerId = "erfindergeistRoomStatusHealthCheckContainer";

  function renderError() {
    const html = `
       <div class="wp-block-coblocks-column__inner has-no-padding has-no-margin">
          Error Loading data.
       </div>
    `
    $(`#${containerId}`).html(html);
  }

  function renderHealthItem(title, value) {
    let html = `<li class="list-group-item d-flex justify-content-between align-items-start ${value < 25 ? "list-group-item-danger" : ""}"> \n`
    html += '<div class="ms-2 me-auto">\n'
    html += `<div class="fw-bold">${title}</div>\n`
    html += `${value}%\n`;
    html += '</div>\n'
    html += '</li>\n'
    return html;
  }

  function renderHealthState(data) {
    if(!$(`#${healthCheckContainerId}`).length) { 
      return;
    }
    if (data) {
      if (!erfindergeistRoomStatusHealthCheckMapping && typeof erfindergeistRoomStatusHealthCheckMapping !== "object") {
        return;
      }


      let html = '<ol class="list-group">\n'

      html += '<li class="list-group-item d-flex justify-content-between align-items-start">\n'
      html += `<h5 class="mb-1 fw-bold">${erfindergeistRoomStatusHealthCheckTitle}</h5>\n`
      html += '</li>\n'

      // const erfindergeistRoomStatusHealthCheckMapping = {
      //   smokeAlertBattery: "Rauchmelder",
      //   lockBattery: "Tür Schloss",
      //   doorBattery: "Sensor Tür",
      //   sensorA4F0Battery: "Sensor A4F0",
      //   sensorA5A8Battery: "Sensor A5A8",
      //   lockFrontDoorBattery: "Haustüre Schloss",
      //   lockAWOBattery: "AWO Schloss"
      // }

      Object.keys(erfindergeistRoomStatusHealthCheckMapping).forEach(key => {
        if(data[key].value) {
          html += renderHealthItem(mapping[key], data[key].value)
        }
      })
     
      html += '</ol>\n';
      $(`#${healthCheckContainerId}`).html(html);
    }
  }

  function renderOpenState(data) {
    if(!$(`#${openStateContainerId}`).length) return;
    if (
      data &&
      data.lockState !== undefined 
    ) {
      let html = "";

      if (data.lockState.value === "unlocked") {
        html += '<p class="is-style-info">';
        html += 'Werkstatt ist offen<br>';
      } else {
        html += '<p class="is-style-error">';
        html += "Werkstatt ist geschlossen<br>";
      }
      html +=
        "Letzte Aktualisierung: " + new Date(data.lockState.dateTime).toLocaleString();

      html += '</p>';

      $(`#${openStateContainerId}`).html(html);
    }
  }

  function render(data) {
    renderOpenState(data);
    renderHealthState(data);  
  }

  function getData() {
    $.getJSON( '/wp-json/erfindergeist/v2/room-status')
      .done(function( json ) {
        render(json);
      })
      .fail(function( jqxhr, textStatus, error ) {
        const err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
        renderError();
      });
  }

  erfindergeistRoomStatus.init = function() {
    getData();
  }
 
}( window.erfindergeistRoomStatus = window.erfindergeistRoomStatus || {}, jQuery ));
 
jQuery( document ).ready(function() {
  erfindergeistRoomStatus.init();
});