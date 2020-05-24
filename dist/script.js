$(document).ready(function () {
  var breakLength = 5; //in minutes
  var breakLengthInMilliseconds = 0;
  var breakTimeLeft;
  var breakMinutes;
  var breakSeconds;
  var breakMillisecondsElapsed = 0;
  var breakTimer;
  var sessionLength = 25; //in minutes
  var sessionLengthInMilliseconds;
  var sessionTimeLeft;
  var minutes;
  var seconds;
  var millisecondsElapsed = 0;
  var timer; //countdown for session
  var sessionTimerIsRunning = false;
  var breakTimerIsRunning = false;
  var resetIsClicked = false;

  $("#break-length").html(5);
  $("#session-length").html(25);
  $("#time-left").html("25:00");

  function sessionUpdate(sessionLength) {
    console.log(sessionLength);
    $("#session-length").html(sessionLength);
    sessionLengthInMilliseconds = sessionLength * 60000;
    $("#time-left").html(sessionLength + ":00");
  }
  function breakUpdate() {
    breakLengthInMilliseconds = breakLength * 60000;
    console.log(breakLengthInMilliseconds);
    $("#break-length").html(breakLength);
  }
  $("#break-increment").click(function () {
    if (breakLength > 59) {
      console.log("Your break can't be that long...");
    } else
    {
      breakLength++;
      breakUpdate();
    }
  });

  $("#break-decrement").click(function () {
    if (breakLength == 0) {
      console.log("You are allowed to take a break!");
    } else
    {
      breakLength--;
      breakUpdate();
    }
  });

  $("#session-increment").click(function () {
    if (sessionLength > 59) {
      console.log("Maybe you should try a shorter session!");
    } else
    {
      sessionLength++;
      sessionUpdate(sessionLength);
    }
  });
  $("#session-decrement").click(function () {
    if (sessionLength == 0) {
      console.log("Try making the session a little longer!");
    } else
    {
      sessionLength--;
      sessionUpdate(sessionLength);
    }
  });

  function disableButtons() {
    $("#session-increment").prop('disabled', true);
    $("#session-decrement").prop('disabled', true);
    $("#break-increment").prop('disabled', true);
    $("#break-decrement").prop('disabled', true);
  }

  function enableButtons() {
    $("#session-increment").prop('disabled', false);
    $("#session-decrement").prop('disabled', false);
    $("#break-increment").prop('disabled', false);
    $("#break-decrement").prop('disabled', false);
  }

  function breakCountDownTimer() {
    breakTimer = setInterval(function ()
    {
      breakLengthInMilliseconds = breakLength * 60000;
      breakTimeLeft = breakLengthInMilliseconds - breakMillisecondsElapsed;
      breakMinutes = Math.floor(breakTimeLeft % (1000 * 60 * 60) / (1000 * 60));
      breakSeconds = Math.round(breakTimeLeft % (1000 * 60) / 1000);
      if (breakTimeLeft >= 0) {
        if (breakSeconds == 60) {
          $("#time-left").html("1:00");
        } else
        if (breakSeconds < 10) {
          $("#time-left").html(breakMinutes + ":0" + breakSeconds);
        } else
        {
          $("#time-left").html(breakMinutes + ":" + breakSeconds);
        }
        breakMillisecondsElapsed += 1000;
      }
    }, 1000);
  }

  function countDownTimer() {
    timer = setInterval(function () {
      console.log(millisecondsElapsed);
      sessionTimeLeft = sessionLengthInMilliseconds - millisecondsElapsed;
      if (sessionTimeLeft >= 0) {
        //convert time left into minutes and seconds  
        minutes = Math.floor(sessionTimeLeft % (1000 * 60 * 60) / (1000 * 60));
        seconds = Math.round(sessionTimeLeft % (1000 * 60) / 1000);
        //this could use some improvement
        if (seconds == 60) {
          $("#time-left").html("1:00");
        } else
        if (seconds < 10) {
          $("#time-left").html(minutes + ":0" + seconds);
        } else
        {
          $("#time-left").html(minutes + ":" + seconds);
        }
        //once session expires move on to break and play audio
        if (sessionTimeLeft == 0) {
          $("#time-left").html("Session end");
          millisecondsElapsed = 0;
          sessionTimerIsRunning = false;
          clearInterval(timer);
          breakTimerIsRunning = true;
          breakCountDownTimer();
          document.getElementById('beep').play();
        }
        millisecondsElapsed += 1000;
      }
    }, 1000);
  }

  $("#start_stop").click(function () {
    sessionLength = $("#session-length").html();
    disableButtons();
    //if sessiontimeleft isn't a number then it's the first time is was clicked
    if (isNaN(sessionTimeLeft)) {
      sessionLengthInMilliseconds = sessionLength * 60 * 1000;
      countDownTimer();
      sessionTimerIsRunning = true;
    }
    //pause 
    else if (sessionTimeLeft > 0 && sessionTimerIsRunning == true) {
        clearInterval(timer);
        sessionTimerIsRunning = false;
      }
      //resume
      else if (sessionTimeLeft > 0 && sessionTimerIsRunning == false) {
          countDownTimer();
          sessionTimerIsRunning = true;
        }
        //if reset is clicked timer resumes
        else if (sessionTimeLeft == 0 && resetIsClicked == true) {
            countDownTimer();
            sessionTimerIsRunning = true;
          }
          //if session has ended and break is running -> pause
          else if (sessionTimeLeft == 0 && breakTimerIsRunning == true) {
              clearInterval(breakTimer);
              breakTimerIsRunning = false;
            }
            //if session has ended and break is running -> resume
            else if (sessionTimeLeft == 0 && breakTimerIsRunning == false) {
                breakCountDownTimer();
                breakTimerIsRunning = true;
              }
  });
  //reset session length, break length and time left
  $("#reset").click(function () {
    clearInterval(timer);
    clearInterval(breakTimer);
    sessionLength = 25;
    breakLength = 5;
    sessionUpdate(sessionLength);
    breakUpdate();
    millisecondsElapsed = 0;
    breakMillisecondsElapsed = 0;
    enableButtons();
    sessionTimerIsRunning = false;
    breakTimerIsRunning = false;
    resetIsClicked = true;
    console.log(sessionLengthInMilliseconds);
  });
});