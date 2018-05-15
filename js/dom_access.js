// Get element by id - mainly created to help controler access element;
function elementById(id) {
  return document.getElementById(id);
}

// Set style attribute and value to element
function styleControl(element, key, value) {
  element.style[key] = value;
}

// Adding note to page on correct place depanding on sorting value with all its information from its constructor
function addNoteToDom(i, isPageRefresh, forSorting) {
  var container = elementById("notes-container");
  var newNote = document.createElement("div");
  newNote.setAttribute("class", "note");
  newNote.setAttribute("id", notesArray[i].id);
  if (isPageRefresh != true) {
    styleControl(newNote, "opacity", "0");
  }
  setTimeout(function() {
    styleControl(newNote, "opacity", "1");
  }, 1);

  var innerDivForText = document.createElement("div");
  innerDivForText.innerText = notesArray[i].taskToDo;
  innerDivForText.setAttribute("class", "innerDivForText");

  var innerDivForCurrentDate = document.createElement("div");
  innerDivForCurrentDate.innerText = dateConvertor(notesArray[i].currentTime);
  innerDivForCurrentDate.setAttribute("class", "innerDivForCurrentDate");

  var innerDivForTargetDate = document.createElement("div");
  innerDivForTargetDate.innerText =
    dateConvertor(notesArray[i].targetDate) + "  " + notesArray[i].targetTime;
  innerDivForTargetDate.setAttribute("class", "innerDivForTargetDate");

  var targetTextDiv = document.createElement("div");
  targetTextDiv.innerText = "Target Date: ";
  targetTextDiv.setAttribute("class", "targetTextDiv");

  var removeButton = document.createElement("div");
  removeButton.innerText = "X";
  removeButton.setAttribute("class", "removeButton");
  removeButton.setAttribute("onclick", "removeNote(event)");

  newNote.appendChild(innerDivForText);
  newNote.appendChild(innerDivForCurrentDate);
  newNote.appendChild(innerDivForTargetDate);
  newNote.appendChild(targetTextDiv);
  newNote.appendChild(removeButton);
  if (isPageRefresh == true || forSorting == true) {
    container.appendChild(newNote);
  } else {
    switch (sortingValue) {
      case "0":
        container.appendChild(newNote);
        break;
      case "1":
        container.insertBefore(newNote, container.childNodes[0]);
        break;
      case "2":
        container.insertBefore(newNote, container.childNodes[i]);
        break;
      case "3":
        container.insertBefore(newNote, container.childNodes[i]);
        break;
    }
  }
}

// Remove note from dom
function removeNoteFromDom(noteId) {
  var notePath = elementById(noteId);
  notePath.parentNode.removeChild(notePath);
}

// Create form alerts if not pass validation
function createFormAlerts(whereToCreateAlert, taskToDoId, targetDateId) {
  var alertsDiv = elementById("alerts");
  switch (whereToCreateAlert.id) {
    case taskToDoId:
      alertsDiv.innerText =
        "You must enter your task into the right place (Marked in red)";
      whereToCreateAlert.classList.add("not-pass-validation");
      break;
    case targetDateId:
      if (whereToCreateAlert.value == "") {
        alertsDiv.innerText =
          "You must enter your target date for mission into the right place (Marked in red) in the proper format: dd/mm/yyyy";
        whereToCreateAlert.classList.add("not-pass-validation");
      } else {
        alertsDiv.innerText =
          "The Date you entered already passed, please enter a new one";
        whereToCreateAlert.classList.add("not-pass-validation");
      }
      break;
    case "timeinput":
      alertsDiv.innerText =
        "You are creating task for today,Please check the 'hour' value";
      whereToCreateAlert.classList.add("not-pass-validation");
      break;
  }
  alertsDiv.classList.add("not-pass-validation");
  removeAlertsFromInputs(whereToCreateAlert, alertsDiv);
}

//Remove alerts after user changes input
function removeAlertsFromInputs(whereToRemoveAlert, alertsDiv) {
  whereToRemoveAlert.addEventListener("change", function(event) {
    event.target.classList.remove("not-pass-validation");
    alertsDiv.classList.remove("not-pass-validation");
    alertsDiv.innerText = "";
  });
}

// Reset all form inputs and alerts
function resetFormInputsAndStyle() {
  openAndCloseSettingsTab("close");
  setTimeout(function() {
    var taskInput = elementById("taskinput");
    var dateInput = elementById("dateinput");
    var timeInput = elementById("timeinput");
    var alertsInput = elementById("alerts");
    taskInput.classList.remove("not-pass-validation");
    taskInput.value = "";
    dateInput.classList.remove("not-pass-validation");
    dateInput.value = "";
    timeInput.value = "00:00";
    timeInput.classList.remove("not-pass-validation");
    alertsInput.classList.remove("not-pass-validation");
    alertsInput.innerText = "";
  }, 1);
}

// Openning and close advanced settings tab
function openAndCloseSettingsTab(whatToDo) {
  elementById("taskinput").classList.remove("not-pass-validation");
  elementById("dateinput").classList.remove("not-pass-validation");
  elementById("timeinput").classList.remove("not-pass-validation");
  elementById("alerts").classList.remove("not-pass-validation");
  elementById("alerts").innerText = "";
  var settingsContainer = elementById("settingscontainer");
  if (whatToDo == "close") {
    settingsContainer.style.display = "none";
  } else {
    if (settingsContainer.style.display == "block") {
      settingsContainer.style.display = "none";
    } else {
      settingsContainer.style.display = "block";
    }
  }
}

// Sets the amount of notes that will be displayed in row
function changeDisplayNotes(event, number) {
  var displayChoose;
  if (event != 0) {
    displayChoose = event.target.options[event.target.selectedIndex].value;
  } else {
    displayChoose = number;
  }
  document.styleSheets[0].cssRules[2].style.gridTemplateColumns =
    "repeat(" + displayChoose + ", 1fr)";
  localStorage.setItem("numberofnotes", JSON.stringify(displayChoose));
  var selectElement = elementById("notesdisplay");
  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value == displayChoose) {
      selectElement.options[i].selected = true;
    } else {
      selectElement.options[i].selected = false;
    }
  }
}

// change the order of the notes depands on sortingValue (input from localstorage/sorting-option selected)
function changeSorting(event, number) {
  if (event != 0) {
    sortingValue = event.target.value;
  } else {
    sortingValue = number;
  }
  sortingNotesArray();
  var container = elementById("notes-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (var i = 0; i < notesArray.length; i++) {
    addNoteToDom(i, isPageRefresh, true);
  }
  var selectElement = elementById("sortingnotes");
  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value == sortingValue) {
      selectElement.options[i].selected = true;
    } else {
      selectElement.options[i].selected = false;
    }
  }
}
