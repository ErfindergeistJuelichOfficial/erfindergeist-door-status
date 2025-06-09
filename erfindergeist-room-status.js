(function( erfindergeistDoorStatus, $, undefined ) {
  const containerId = "erfindergeistDoorStatusContainer";

  function renderError() {
    const html = `
       <div class="wp-block-coblocks-column__inner has-no-padding has-no-margin">
          Error Loading data.
       </div>
    `
    $(`#${containerId}`).html(html);
  }

  function render(data) {
    if (
      data &&
      data.doorState !== undefined &&
      data.lockState !== undefined &&
      data.dateTime !== undefined
    ) {
      let html = "";

      if (data.lockState === "open") {
        html += '<p class="is-style-info">';
        html += 'Werkstatt ist offen';
      }

      if (data.lockState === "close") {
        html += '<p class="is-style-error">';
        html += "Werkstatt ist geschlossen";
      }

      html +=
        "Letzte Aktualisierung: " + new Date(data.dateTime).toLocaleString();

      html += '</p>';

      $(`#${containerId}`).html(html);
    }
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

  erfindergeistDoorStatus.init = function() {
    getData();
  }
 
}( window.erfindergeistDoorStatus = window.erfindergeistDoorStatus || {}, jQuery ));
 
jQuery( document ).ready(function() {
  erfindergeistDoorStatus.init();
});