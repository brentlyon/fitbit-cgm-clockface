import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
const arrowImg = document.getElementById("arrow");
const glucoseText = document.getElementById("glucose");
const unitsText = document.getElementById("units");
const timestampText = document.getElementById("timestamp");
const errorText = document.getElementById("error");
function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Update the clock every minute
clock.granularity = "minutes";
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const myDate = document.getElementById("myDate")

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  //let day=days[today.getDay()];
  let day=today.getDay();
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
  myDate.text = `${dayOfWeek} ${date}`;
}
