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

  function renderHealthState(data) {
    if(!$(`#${healthCheckContainerId}`).length) { 
      return;
    }
    if (data) {

      let html = '<ol class="list-group">'

      html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
      html += '<h5 class="mb-1">Batterie Status</h5>'
      html += '</li>'

      if(data.smokeAlertBattery.value) {
        html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
        html += '<div class="ms-2 me-auto">'
        html += `<div class="fw-bold">SmokeAlert</div>`
        html += `${data.smokeAlertBattery.value}%`;
        html += '</div>'
        html += '</li>'
      }
      if(data.lockBattery.value) {
        html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
        html += '<div class="ms-2 me-auto">'
        html += `<div class="fw-bold">Lock</div>`
        html += `${data.lockBattery.value}%`;
        html += '</div>'
        html += '</li>'
      }
      if(data.doorBattery.value) {
        html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
        html += '<div class="ms-2 me-auto">'
        html += `<div class="fw-bold">Door</div>`
        html += `${data.doorBattery.value}%`;
        html += '</div>'
        html += '</li>'
      }
      if(data.sensorA4F0Battery.value) {
        html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
        html += '<div class="ms-2 me-auto">'
        html += `<div class="fw-bold">Sensor A4F0</div>`
        html += `${data.sensorA4F0Battery.value}%`;
        html += '</div>'
        html += '</li>'
      }
      if(data.sensorA5A8Battery.value) {
        html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
        html += '<div class="ms-2 me-auto">'
        html += `<div class="fw-bold">Sensor A5A8</div>`
        html += `${data.sensorA5A8Battery.value}%`;
        html += '</div>'
        html += '</li>'
      }
     
      html += '</ol>';
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