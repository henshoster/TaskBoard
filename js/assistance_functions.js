// Convert date input into proper values
function dateConvertor(date) {
  var d = new Date(date);
  var day, month, year;
  if (d.getDate() > 0 && d.getDate() < 10) {
    day = "0" + d.getDate();
  } else {
    day = d.getDate();
  }
  if (d.getMonth() + 1 > 0 && d.getMonth() + 1 < 10) {
    month = "0" + (parseInt(d.getMonth()) + 1);
  } else {
    month = parseInt(d.getMonth()) + 1;
  }
  year = d.getFullYear();
  var properDateString = day + "/" + month + "/" + year;
  return properDateString;
}

// Combine date and time inputs into one value
function combiningDateAndTime(targetDate, targetTime) {
  var targetDateForCheck = new Date(targetDate);
  return new Date(
    targetDateForCheck.getFullYear(),
    targetDateForCheck.getMonth(),
    targetDateForCheck.getDate(),
    targetTime.slice(0, 2),
    targetTime.slice(3, 5)
  );
}
