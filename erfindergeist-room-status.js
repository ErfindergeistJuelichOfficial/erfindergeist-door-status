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

  // https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function renderBatteryHealthStateItem(title, value) {

    if(!isNumeric(value) && parseInt(value) > -1 && parseInt(value) < 101) {
      return;
    }

    let gradientColor1 = "#52cc6eff";
    let gradientColor2 = "#baf2c7ff";

    if(parseInt(value) < 51) {
      gradientColor1 = "#c1d866ff";
      gradientColor2 = "#f1f7daff";
    }

    if(parseInt(value) < 20) {
      gradientColor1 = "#cf6065ff";
      gradientColor2 = "#f9d4d6ff";
    }

    let html = `<li class="list-group-item d-flex justify-content-between align-items-start m-0" style="background: linear-gradient(45deg, ${gradientColor1} ${value}%, ${gradientColor2} ${100 - value}%)"> \n`
    html += '<div class="ms-2 me-auto">\n'
    html += `<div class="fw-bold">${title}</div>\n`
    html += `${value}%\n`;
    html += '</div>\n'
    html += '</li>\n'
    return html;
  }

  function renderBatteryHealthState(data, settings) {
    let html = '<ol class="list-group">\n'

    html += '<li class="list-group-item d-flex justify-content-between align-items-start m-0">\n'
    html += `<h5 class="mb-1 fw-bold">${settings.title}</h5>\n`
    html += '</li>\n'

    Object.keys(settings.mapping).forEach(key => {
      if(data[key]?.value) {
        html += renderBatteryHealthStateItem(settings.mapping[key], data[key].value)
      }
    })
    
    html += '</ol>\n';
    $(`#${healthCheckContainerId}`).html(html);
  }

  function renderNormalHealthStateItem(title, value) {
    let html = `<li class="list-group-item d-flex justify-content-between align-items-start m-0 ${value < 25 ? "list-group-item-danger" : ""}"> \n`
    html += '<div class="ms-2 me-auto">\n'
    html += `<div class="fw-bold">${title}</div>\n`
    html += `${value}\n`;
    html += '</div>\n'
    html += '</li>\n'
    return html;
  }

  function renderNormalHealthState(data, settings) {
      let html = '<ol class="list-group">\n'

      html += '<li class="list-group-item d-flex justify-content-between align-items-start m-0">\n'
      html += `<h5 class="mb-1 fw-bold">${settings.title}</h5>\n`
      html += '</li>\n'

      Object.keys(settings.mapping).forEach(key => {
        if(data[key]?.value) {
          html += renderNormalHealthStateItem(settings.mapping[key], data[key].value)
        }
      })
     
      html += '</ol>\n';
      $(`#${healthCheckContainerId}`).html(html);
  }

  function renderHealthState(data) {
    if(!$(`#${healthCheckContainerId}`).length) { 
      return;
    }

    // Type erfindergeistRoomStatusHealthCheckSettings
    // [
    //   {
    //     title: string;
    //     type: "Normal" | "Battery"
    //     mapping: {
    //       key: string
    //     }
    //   }
    // ]

    if (data) {
      if (!erfindergeistRoomStatusHealthCheckSettings && Array.isArray(erfindergeistRoomStatusHealthCheckSettings)) {
        return;
      }

      for (const currentSetting of erfindergeistRoomStatusHealthCheckSettings) {
        if (!currentSetting?.title && !currentSetting?.type && !currentSetting?.mapping) {
          continue;
        }

        switch(currentSetting.type) {
          case "Normal": 
            renderNormalHealthState(data, currentSetting);
            break;
          case "Battery":
            renderBatteryHealthState(data, currentSetting);
            break;
          default:
            continue;
        }
      }
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
    const erfindergeistBarContainer = $(`#${ globalBarContainerId}`);
    const wordpressAdminBarcontainer = $(`#wpadminbar`);
    const pageContainer = $(`#page`);

    if(!erfindergeistBarContainer.length) return;
    if(!data) return;

    let html = "";   

    if (data && data.lockWorkshopState && data.lockWorkshopState.value && data.lockWorkshopState.value === "unlocked") {
      html += '<div class="erfindergeist-room-status-open">🔓 Werkstatt ist offen - kommt gerne spontan vorbei. 🔓</div>';
    }
    // else {
    //   html += '<div class="erfindergeist-room-status-closed">Werkstatt geschlossen</div>';
    // }

    if (data && data.smokeAlertState && data.smokeAlertState.value && data.smokeAlertState.value === "on") {
      html += '<div class="erfindergeist-room-status-warning">🔥 Rauchmelder aktiv - bitte schau jemand nach ob alles in Ordnung ist. 🔥</div>';
    }

    if (data && data.floodAlertState && data.floodAlertState.value && data.floodAlertState.value === "on") {
      html += '<div class="erfindergeist-room-status-warning">💧 Wasser im Raum entdeckt - bitte schau jemand nach ob alles in Ordnung ist. 💧</div>';
    }

    erfindergeistBarContainer.html(html);   
   
    if(wordpressAdminBarcontainer && wordpressAdminBarcontainer.length) {
      erfindergeistBarContainer.css("top", `${wordpressAdminBarcontainer.height()}px`);
      if(pageContainer && pageContainer.length) {
        pageContainer.css("margin-top", `${wordpressAdminBarcontainer.height() + erfindergeistBarContainer.height()}px`);
      }
    }
  }

  function render(data) {
    renderOpenState(data);
    renderHealthState(data);
    // renderGlobalBar(data);
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