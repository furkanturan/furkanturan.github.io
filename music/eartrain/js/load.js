var show_hint     = false;
var enable_beat   = false;
var enable_cursor = false;
var enable_prep   = false;
var enable_answer = false;
var enable_melody = false;

var numExercises;
var exIndex;
var exTempo;

function randomSheet(max) {
  return Math.floor(Math.random() * max);
}

function randomTempo() {
  var tempos = Array(40, 45, 50, 55, 65);
  var tempo  = tempos[Math.floor(Math.random()*tempos.length)];
  return tempo;
}

function load() {

  numExercises = exercise_hint.length;

  exIndex = randomSheet(numExercises);
  exTempo = randomTempo();

  document.querySelector(".show_hint").addEventListener("click", toggle_hint);
  document.querySelector(".play").addEventListener("click", play);
  document.querySelector(".enable_beats").addEventListener("click", toggle_beatblink);
  document.querySelector(".enable_cursor").addEventListener("click", toggle_cursor);
  document.querySelector(".enable_prep").addEventListener("click", toggle_prep);
  document.querySelector(".show_answer").addEventListener("click", toggle_answer);
  document.querySelector(".enable_melody").addEventListener("click", toggle_melody);
  document.querySelector(".next_question").addEventListener("click", next_question);

  loadSynth(exIndex, exTempo, enable_prep, enable_melody);

  set_hint     (show_hint    );
  set_beatblink(enable_beat  );
  set_cursor   (enable_cursor);
  set_prep     (enable_prep  );
  set_answer   (enable_answer);
  set_melody   (enable_melody);
}

function toggle_hint     () { show_hint     = !show_hint    ; set_hint     (show_hint    );}
function toggle_beatblink() { enable_beat   = !enable_beat  ; set_beatblink(enable_beat  );}
function toggle_cursor   () { enable_cursor = !enable_cursor; set_cursor   (enable_cursor);}
function toggle_prep     () { enable_prep   = !enable_prep  ; set_prep     (enable_prep  );}
function toggle_answer   () { enable_answer = !enable_answer; set_answer   (enable_answer);}
function toggle_melody   () { enable_melody = !enable_melody; set_melody   (enable_melody);}

function set_hint(status) {
  var p = document.getElementById("paperhint");
  var b = document.querySelector(".show_hint");
  if (status) {
    p.style.display = "block";
    b.style.backgroundColor = "#4CAF50";
    b.innerText = "Hide Hint";
  } else {
    p.style.display = "none";
    b.style.backgroundColor = "#f44336";
    b.innerText = "Show Hint";
  }
}

function set_beatblink(status) {
  var b = document.querySelector(".enable_beats");
  if (status) {
    b.style.backgroundColor = "#4CAF50";
    b.innerText = "Disable Flashing Beats";
  } else {
    b.style.backgroundColor = "#f44336";
    b.innerText = "Enable Flashing Beats";
  }
}

function set_cursor(status) {
  var b = document.querySelector(".enable_cursor");
  if (status) {
    b.style.backgroundColor = "#4CAF50";
    b.innerText = "Disable Cursor";
  } else {
    b.style.backgroundColor = "#f44336";
    b.innerText = "Enable Cursor";
  }
}

function set_prep(status) {
  var b = document.querySelector(".enable_prep");
  if (status) {
    b.style.backgroundColor = "#4CAF50";
    b.innerText = "Disable Preparation Beats";
  } else {
    b.style.backgroundColor = "#f44336";
    b.innerText = "Enable Preparation Beats";
  }

  loadSynth(exIndex, exTempo, enable_prep, enable_melody);
  
  set_hint(show_hint);
  set_beatblink(enable_beat);
  set_cursor(enable_cursor);
  set_answer(enable_answer);
}

function set_answer(status) {
  var p = document.getElementById("paper");
  var b = document.querySelector(".show_answer");
  if (status) {
    p.style.display = "block";
    b.style.backgroundColor = "#4CAF50";
    b.innerText = "Hide Answer";
  } else {
    p.style.display = "none";
    b.style.backgroundColor = "#f44336";
    b.innerText = "Show Answer";
  }
}

function set_melody(status) {
  var b = document.querySelector(".enable_melody");
  if (status) {
    b.style.backgroundColor = "#4CAF50";
    b.innerText = "Disable Melody";
  } else {
    b.style.backgroundColor = "#f44336";
    b.innerText = "Enable Melody";
  }

  loadSynth(exIndex, exTempo, enable_prep, enable_melody);

  set_hint(show_hint);
  set_beatblink(enable_beat);
  set_cursor(enable_cursor);
  set_answer(enable_answer);
}

function next_question() {
  exIndex = randomSheet(numExercises);
  exTempo = randomTempo();

  loadSynth(exIndex, exTempo, enable_melody);

  show_hint     = false;
  enable_beat   = false;
  enable_cursor = false;
  enable_answer = false;
  enable_melody = false;

  set_hint(show_hint);
  set_beatblink(enable_beat);
  set_cursor(enable_cursor);
  set_answer(enable_answer);
  set_melody(enable_melody);
}

