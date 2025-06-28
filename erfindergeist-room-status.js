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
    if(!$(`#${healthCheckContainerId}`).length) return;
    if (data) {
      let html = "<p>";

      if(data.smokeAlertBattery.value) {
        html += `SmokeAlert Battery ${data.smokeAlertBattery.value}<br>`;
      }
      if(data.lockBattery.value) {
        html += `Lock Battery ${data.lockBattery.value}<br>`;
      }
      if(data.doorBattery.value) {
        html += `Door Battery ${data.doorBattery.value}<br>`;
      }
     
      html += '</p>';
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