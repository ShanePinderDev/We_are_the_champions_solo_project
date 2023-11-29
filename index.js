import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const inputFieldEl = document.getElementById("input-field");
const fromInputFieldEl = document.getElementById("from-input-field");
const toInputFieldEl = document.getElementById("to-input-field");
const publishBtnEl = document.getElementById("publish-button");
const endorsementsContainerEl = document.getElementById(
  "endorsements-container"
);
const appSettings = {
  databaseURL: "https://endorsements-app-f3513-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

publishBtnEl.addEventListener("click", function () {
  // let inputValue = inputFieldEl.value;
  let inputValue = sanitizeHTML(inputFieldEl.value);
  let fromInputValue = fromInputFieldEl.value;
  let toInputValue = toInputFieldEl.value;
  push(endorsementsInDB, {
    from: fromInputValue,
    to: toInputValue,
    endorsement: inputValue,
  });
  clearInputFieldEls();
});

function sanitizeHTML(str) {
  return str.replace(/javascript:/gi, "").replace(/[^\w-_. ]/gi, function (c) {
    return `&#${c.charCodeAt(0)};`;
  });
}

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementsArray = Object.values(snapshot.val());

    clearEndorsementsContainerEl();

    for (let i = endorsementsArray.length - 1; i >= 0; i--) {
      let currentEndorsement = endorsementsArray[i];
      appendItemToEndorsementsContainerEl(currentEndorsement);
    }
  } else {
    endorsementsContainerEl.innerHTML = `
    <div class="endorsements" id="endorsements">
    <p class="endorsement-text">"No endorsements here... yet"</p>
    </div>
    `;
  }
});

function clearEndorsementsContainerEl() {
  endorsementsContainerEl.innerHTML = "";
}

function clearInputFieldEls() {
  inputFieldEl.value = "";
  fromInputFieldEl.value = "";
  toInputFieldEl.value = "";
}

function appendItemToEndorsementsContainerEl(itemValue) {
  endorsementsContainerEl.innerHTML += `
  <div class="endorsements" id="endorsements">
    <p class="to-from-text">To: ${itemValue.to}</p>
    <p>${itemValue.endorsement}</p>
    <p class="to-from-text">From: ${itemValue.from}</p>
  </div>
    `;
}
