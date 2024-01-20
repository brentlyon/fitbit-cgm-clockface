import clock from "clock";
import * as document from "document";
import * as messaging from "messaging";
const arrowImg = document.getElementById("arrow") ;

import { preferences } from "user-settings";

//const arrowImg = document.querySelector('arrow');
const glucoseText = document.getElementById("glucose");
const unitsText = document.getElementById("units");
const timestampText = document.getElementById("timestamp");
const errorText = document.getElementById("error");

function fetchGlucose() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
          command: "glucose"
      });
    }

  }function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Update the clock every minute
clock.granularity = "minutes";
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"];
// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const myDate = document.getElementById("myDate")


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  //let day=days[today.getDay()];
  let day=today.getDay();
  let monthOfyear=today.getMonth();
  let month=months[monthOfyear];
  let dayOfWeek=days[day];
  let date = today.getDate();
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  let mins = zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;
  myDate.text = `${dayOfWeek} ${month} ${date}`;
}

messaging.peerSocket.addEventListener("message", (evt) => {
    if (evt.data && "error" in evt.data) {
        errorText.textContent = evt.data.error;
        glucoseText.textContent = "";
        timestampText.textContent = "";
        unitsText.textContent = "";
        arrowImg.href = "";
    } else if (evt.data && "Value" in evt.data) {
        errorText.textContent = "";
        glucoseText.textContent = evt.data.Value;
        timestampText.textContent = `Last Reading:\n${evt.data.Timestamp}`;
        switch(evt.data.GlucoseUnits) {
            case 1:
                unitsText.textContent = "mg/dL";
                break;
            default:
                unitsText.textContent = "mmol/L";
                break;
        }
        switch(evt.data.MeasurementColor) {
            case 1:
                glucoseText.style.fill = "lime";
                unitsText.style.fill = "lime";
                arrowImg.style.fill = "lime";
                break;
            case 2:
                glucoseText.style.fill = "yellow";
                unitsText.style.fill = "yellow";
                arrowImg.style.fill = "yellow";
                break;
            case 3:
                glucoseText.style.fill = "orange";
                unitsText.style.fill = "orange";
                arrowImg.style.fill = "orange";
                break;
            case 4:
                glucoseText.style.fill = "red";
                unitsText.style.fill = "red";
                arrowImg.style.fill = "red";
                break;
            default:
                glucoseText.style.fill = "grey";
                unitsText.style.fill = "grey";
                arrowImg.style.fill = "grey";
                break;
        }
       
        

        switch(evt.data.TrendArrow) {
            case 1:
                arrowImg.href = "arrow-down-thick.png";
                break;
            case 2:
                arrowImg.href = "arrow-bottom-right-thick.png";
                break;
            case 3:
                arrowImg.href = "arrow-right-thick.png";
                break;
            case 4:
                arrowImg.href = "arrow-top-right-thick.png";
                break;
            case 5:
                arrowImg.image.href = "arrow-up-thick.png";
                break;
            default:
                arrowImg.src = "";
                break;
        }
    }
});
messaging.peerSocket.addEventListener("error", (err) => {
    console.error(`Connection error: ${err.code} - ${err.message}`);
});
setInterval(fetchGlucose, 60000); //call function to read every 60s
