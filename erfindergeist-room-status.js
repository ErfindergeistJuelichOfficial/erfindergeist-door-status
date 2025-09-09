(function( erfindergeistRoomStatus, $, undefined ) {

  const openStateContainerId = "erfindergeistRoomStatusContainer"; 
  const healthCheckContainerId = "erfindergeistRoomStatusHealthCheckContainer";

  const globalBarContainerId = "erfindergeist-room-status-global";

  function renderError() {
    const html = `
       <div class="wp-block-coblocks-column__inner has-no-padding has-no-margin">
          Error Loading data.
       </div>
    `
    $(`#${containerId}`).html(html);
  }

  function renderHealthItem(title, value) {
    let html = `<li class="list-group-item d-flex justify-content-between align-items-start m-0 ${value < 25 ? "list-group-item-danger" : ""}"> \n`
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

      html += '<li class="list-group-item d-flex justify-content-between align-items-start m-0">\n'
      html += `<h5 class="mb-1 fw-bold">${erfindergeistRoomStatusHealthCheckTitle}</h5>\n`
      html += '</li>\n'

      Object.keys(erfindergeistRoomStatusHealthCheckMapping).forEach(key => {
        if(data[key].value) {
          html += renderHealthItem(erfindergeistRoomStatusHealthCheckMapping[key], data[key].value)
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

  function renderGlobalBar(data) {
    // const wordpressAdminBar = $(`#wpadminbar`);
    // if(wordpressAdminBar.length) {
    //   $(`#${ globalBarContainerId}`).css("margin-top", `${wordpressAdminBar.height()}px`);
    // }

    let html = "";   

    if (data && data.lockWorkshopState && data.lockWorkshopState.value && data.lockWorkshopState.value === "unlocked") {
      html += '<div class="erfindergeist-room-status-open">Werkstatt offen</div>';
    } else {
      html += '<div class="erfindergeist-room-status-closed">Werkstatt geschlossen</div>';
    }

    if (data && data.smokeAlertState && data.smokeAlertState.value && data.smokeAlertState.value === "on") {
      html += '<div class="erfindergeist-room-status-warning">Rauchmelder aktiv - bitte schau jemand nach ob alles in Ordnung ist.</div>';
    }

    if (data && data.floodAlertState && data.floodAlertState.value && data.floodAlertState.value === "on") {
      html += '<div class="erfindergeist-room-status-warning">Wasser im Raum entdeckt - bitte schau jemand nach ob alles in Ordnung ist.</div>';
    }

     $(`#${ globalBarContainerId}`).html(html);   
  }

  function render(data) {
    renderOpenState(data);
    renderHealthState(data);
    renderGlobalBar(data);
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