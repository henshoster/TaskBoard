// Constructor for Note
function Note(taskToDo, targetDate, targetTime, currentTime) {
  this.id = currentTime.getTime();
  this.taskToDo = taskToDo;
  this.targetDate = targetDate;
  this.targetTime = targetTime;
  this.currentTime = currentTime;
}
