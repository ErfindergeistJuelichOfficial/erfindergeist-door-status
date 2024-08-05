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
    if(data.status) {
      let html = ""; 

      if(data.status === "open") {
        html += '<p class="is-style-info">Werkstatt ist offen</p>'
      }

      if(data.status === "close") {        
        html += '<p class="is-style-error">Werkstatt ist geschlossen</p>'
      }
      
      $(`#${containerId}`).html(html);
    }
  }

  function getData() {
    $.getJSON( '/wp-json/erfindergeist/v1/door-status')
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