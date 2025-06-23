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

  function renderOpenState(data) {
    
    if(!$(`#${openStateContainerId}`).length) return;
    if (
      data &&
      data.lockState !== undefined 
    ) {
      let html = "";

      if (data.lockState.value === "open") {
        html += '<p class="is-style-info">';
        html += 'Werkstatt ist offen<br>';
      } else if (data.lockState.value === "close") {
        html += '<p class="is-style-error">';
        html += "Werkstatt ist geschlossen<br>";
      } else {
        html += '<p class="is-style-error">';
        html += "Werkstatt unbekannter Zustand<br>";
      }

      html +=
        "Letzte Aktualisierung: " + new Date(data.lockState.dateTime).toLocaleString();

      html += '</p>';

      $(`#${openStateContainerId}`).html(html);
    }
  }

  function render(data) {
    renderOpenState(data)   
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