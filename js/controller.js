// Initial settings - Page load - set valus from first use / local storage (reuse)
var isPageRefresh = true;
var notesArray;
if (localStorage.getItem("mynotes") != null) {
  notesArray = JSON.parse(localStorage.getItem("mynotes"));
} else {
  notesArray = [];
}

var sortingValue;
if (localStorage.getItem("sortingvalue") != null) {
  sortingValue = JSON.parse(localStorage.getItem("sortingvalue"));
} else {
  sortingValue = 0;
}

var howManyNotesInPage;
if (localStorage.getItem("numberofnotes") != null) {
  howManyNotesInPage = JSON.parse(localStorage.getItem("numberofnotes"));
} else {
  howManyNotesInPage = 4;
}

// create page notes after initial settings load
changeDisplayNotes(0, howManyNotesInPage);
changeSorting(0, sortingValue);
isPageRefresh = false;

// Validate user inputs then addnote/create alerts
function formValidation(taskToDo, targetDate, targetTime, currentTime) {
  if (taskToDo.value == "") {
    createFormAlerts(taskToDo, taskToDo.id, targetDate.id);
    return false;
  } else if (targetDate.value == "") {
    createFormAlerts(targetDate, taskToDo.id, targetDate.id);
    return false;
  }
  var targetDateForCheck = new Date(targetDate.value);
  var combinedDateAndTime = combiningDateAndTime(
    targetDate.value,
    targetTime.value
  );
  if (combinedDateAndTime.getTime() < currentTime.getTime()) {
    if (
      targetDateForCheck.getFullYear() == currentTime.getFullYear() &&
      targetDateForCheck.getMonth() == currentTime.getMonth() &&
      targetDateForCheck.getDate() == currentTime.getDate()
    ) {
      createFormAlerts(targetTime, taskToDo.id, targetDate.id);
    } else {
      createFormAlerts(targetDate, taskToDo.id, targetDate.id);
    }
    return false;
  }
  return true;
}

// If pass validation adding notes for both: noteArray and notes-container depands on settings: notes display,sorting(adding on the correct place)
function addNote() {
  openAndCloseSettingsTab("close");
  var taskToDo = elementById("taskinput");
  var targetDate = elementById("dateinput");
  var targetTime = elementById("timeinput");
  var currentTime = new Date();
  if (formValidation(taskToDo, targetDate, targetTime, currentTime)) {
    switch (sortingValue) {
      case "0":
        notesArray.push(
          new Note(
            taskToDo.value,
            targetDate.value,
            targetTime.value,
            currentTime
          )
        );
        addNoteToDom(notesArray.length - 1, isPageRefresh);
        break;
      case "1":
        notesArray.splice(
          0,
          0,
          new Note(
            taskToDo.value,
            targetDate.value,
            targetTime.value,
            currentTime
          )
        );
        addNoteToDom(0, isPageRefresh);
        break;
      case "2":
        for (var i = 0; i < notesArray.length; i++) {
          if (
            combiningDateAndTime(
              targetDate.value,
              targetTime.value
            ).getTime() <=
            combiningDateAndTime(
              notesArray[i].targetDate,
              notesArray[i].targetTime
            ).getTime()
          ) {
            break;
          }
        }
        notesArray.splice(
          i,
          0,
          new Note(
            taskToDo.value,
            targetDate.value,
            targetTime.value,
            currentTime
          )
        );
        addNoteToDom(i, isPageRefresh);
        break;
      case "3":
        for (var i = 0; i < notesArray.length; i++) {
          if (
            combiningDateAndTime(
              targetDate.value,
              targetTime.value
            ).getTime() >=
            combiningDateAndTime(
              notesArray[i].targetDate,
              notesArray[i].targetTime
            ).getTime()
          ) {
            break;
          }
        }
        notesArray.splice(
          i,
          0,
          new Note(
            taskToDo.value,
            targetDate.value,
            targetTime.value,
            currentTime
          )
        );
        addNoteToDom(i, isPageRefresh);
        break;
    }
    localStorage.setItem("mynotes", JSON.stringify(notesArray));
    resetFormInputsAndStyle();
  }
}

// By clicking on 'X' remove note from page and from notesArray - 1 second delay for fade-out effect act properly
function removeNote(e) {
  var noteToRemove = e.path[1];
  for (var i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id == noteToRemove.id) {
      styleControl(noteToRemove, "opacity", "0");
      setTimeout(function() {
        removeNoteFromDom(notesArray[i].id);
        notesArray.splice(i, 1);
        localStorage.setItem("mynotes", JSON.stringify(notesArray));
      }, 1000);
      break;
    }
  }
}

// Sorting notesArray depanding on sorting value
function sortingNotesArray() {
  var tempNote, targetDateForCheck;
  switch (sortingValue) {
    case "0":
      for (var i = 0; i < notesArray.length - 1; i++) {
        for (var j = i + 1; j < notesArray.length; j++) {
          if (
            new Date(notesArray[i].currentTime).getTime() >
            new Date(notesArray[j].currentTime).getTime()
          ) {
            tempNote = notesArray[i];
            notesArray[i] = notesArray[j];
            notesArray[j] = tempNote;
          }
        }
      }
      break;
    case "1":
      for (var i = 0; i < notesArray.length - 1; i++) {
        for (var j = i + 1; j < notesArray.length; j++) {
          if (
            new Date(notesArray[i].currentTime).getTime() <
            new Date(notesArray[j].currentTime).getTime()
          ) {
            tempNote = notesArray[i];
            notesArray[i] = notesArray[j];
            notesArray[j] = tempNote;
          }
        }
      }
      break;
    case "2":
      for (var i = 0; i < notesArray.length - 1; i++) {
        for (var j = i + 1; j < notesArray.length; j++) {
          if (
            combiningDateAndTime(
              notesArray[i].targetDate,
              notesArray[i].targetTime
            ).getTime() >
            combiningDateAndTime(
              notesArray[j].targetDate,
              notesArray[j].targetTime
            ).getTime()
          ) {
            tempNote = notesArray[i];
            notesArray[i] = notesArray[j];
            notesArray[j] = tempNote;
          }
        }
      }
      break;
    case "3":
      for (var i = 0; i < notesArray.length - 1; i++) {
        for (var j = i + 1; j < notesArray.length; j++) {
          if (
            combiningDateAndTime(
              notesArray[i].targetDate,
              notesArray[i].targetTime
            ).getTime() <
            combiningDateAndTime(
              notesArray[j].targetDate,
              notesArray[j].targetTime
            ).getTime()
          ) {
            tempNote = notesArray[i];
            notesArray[i] = notesArray[j];
            notesArray[j] = tempNote;
          }
        }
      }
      break;
  }
  localStorage.setItem("sortingvalue", JSON.stringify(sortingValue));
  localStorage.setItem("mynotes", JSON.stringify(notesArray));
}
