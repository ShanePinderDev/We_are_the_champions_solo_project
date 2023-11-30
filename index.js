// Firebase setup

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://endorsements-app-f3513-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

// DOM constants
const inputFieldEl = document.getElementById("input-field");
const fromInputFieldEl = document.getElementById("from-input-field");
const toInputFieldEl = document.getElementById("to-input-field");
const publishBtnEl = document.getElementById("publish-button");
const endorsementsContainerEl = document.getElementById(
  "endorsements-container"
);

publishBtnEl.addEventListener("click", function () {
  inputFieldEl.style.outline = "none";
  fromInputFieldEl.style.outline = "none";
  toInputFieldEl.style.outline = "none";
  publishBtnEl.innerText = "Publish";

  const inputValue = sanitizeHTML(inputFieldEl.value);
  const fromInputValue = fromInputFieldEl.value;
  const toInputValue = toInputFieldEl.value;

  if (
    inputValue !== null &&
    inputValue.trim() !== "" &&
    (fromInputValue !== null) & (fromInputValue.trim() !== "") &&
    (toInputValue !== null) & (toInputValue.trim() !== "")
  ) {
    push(endorsementsInDB, {
      from: fromInputValue,
      to: toInputValue,
      endorsement: inputValue,
    });
    clearInputFieldEls();
  } else {
    if (!inputValue) {
      inputFieldEl.style.outline = "thick solid firebrick";
      publishBtnEl.innerText = "Please complete all fields";
    }
    if (!fromInputValue) {
      fromInputFieldEl.style.outline = "thick solid firebrick";
      publishBtnEl.innerText = "Please complete all fields";
    }
    if (!toInputValue) {
      toInputFieldEl.style.outline = "thick solid firebrick";
      publishBtnEl.innerText = "Please complete all fields";
    }
  }
});

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    const endorsementsArray = Object.entries(snapshot.val());

    clearEndorsementsContainerEl();

    for (let i = endorsementsArray.length - 1; i >= 0; i--) {
      let currentEndorsement = endorsementsArray[i];
      appendItemToEndorsementsContainerEl(currentEndorsement);
    }
  } else {
    endorsementsContainerEl.innerHTML = `
    <div class="endorsements">
    <p class="endorsement-text">"No endorsements here... yet"</p>
    </div>
    `;
  }
});

function appendItemToEndorsementsContainerEl(itemValue) {
  endorsementsContainerEl.innerHTML += `
  <div class="endorsements" id=${itemValue[0]}>
    <p class="to-from-text">To: ${itemValue[1].to}</p>
    <p>${itemValue[1].endorsement}</p>
    <p class="to-from-text">From: ${itemValue[1].from}</p>
  </div>
    `;

  // deleting entries on double click
  endorsementsContainerEl.addEventListener("dblclick", function (e) {
    if (e.target.id === itemValue[0]) {
      let exactLocationOfEndorsementInDB = ref(
        database,
        `endorsements/${itemValue[0]}`
      );

      remove(exactLocationOfEndorsementInDB);
    }
  });
}

// helper functions

function clearEndorsementsContainerEl() {
  endorsementsContainerEl.innerHTML = "";
}

function clearInputFieldEls() {
  inputFieldEl.value = "";
  fromInputFieldEl.value = "";
  toInputFieldEl.value = "";
}

function sanitizeHTML(str) {
  return str.replace(/javascript:/gi, "").replace(/[^\w-_. ]/gi, function (c) {
    return `&#${c.charCodeAt(0)};`;
  });
}
