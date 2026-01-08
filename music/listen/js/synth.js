// global variable for the current sheet
var abc = ""

//////////////////////////////////////////////////////////////////////////////
// This is the function that blinks the background at every beat

function beat() {
  var timeToDisplay = 0;
  var opacityChangeDelay = 20;
  var opacityChangeAmount = 0.15;

  var inner = $('#inner');

  var fadeOut = function(opacity) {
    opacity = opacity - opacityChangeAmount;

    inner.css('background-color', 'rgba(255, 255, 255, '+(1-opacity)+')');

    if (opacity <= 0) {
      inner.trigger('fadeOut-complete');
      return;
    }
    setTimeout(function() { fadeOut(opacity); }, opacityChangeDelay);
  };

  var blink = function() {
    fadeOut(0);
    inner.css('background-color', 'rgba(255, 255, 255, '+1+');');
    fadeOut(1);
  };

  blink();
}

//////////////////////////////////////////////////////////////////////////////
// The cursor moves as sheet is played

var cursorControl = new CursorControl();

function CursorControl() {
  var self = this;

  self.onStart = function() {
    var svg = document.querySelector("#paper svg");
    var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    cursor.setAttribute("class", "abcjs-cursor");
    cursor.setAttributeNS(null, 'x1', 0);
    cursor.setAttributeNS(null, 'y1', 0);
    cursor.setAttributeNS(null, 'x2', 0);
    cursor.setAttributeNS(null, 'y2', 0);
    svg.appendChild(cursor);
  };

  self.beatSubdivisions = 2;

  self.onBeat = function(beatNumber, totalBeats, totalTime) {
    if (!self.beatDiv)
      if (
          document.getElementById("beatDiv").checked ||
        (!document.getElementById("beatDiv").checked && beatNumber%1 == 0))
      {
        if (document.getElementById("beatBlink").checked)
          beat();
      }
  };

  self.onEvent = function(ev) {
    if (ev.measureStart && ev.left === null)
      return; // this was the second part of a tie across a measure line. Just ignore it.

    var lastSelection = document.querySelectorAll("#paper svg .highlight");
    for (var k = 0; k < lastSelection.length; k++)
      lastSelection[k].classList.remove("highlight");

    var cursor = document.querySelector("#paper svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", ev.left - 2);
      cursor.setAttribute("x2", ev.left - 2);
      cursor.setAttribute("y1", ev.top);
      cursor.setAttribute("y2", ev.top + ev.height);
    }
  };
  self.onFinished = function() {
    var els = document.querySelectorAll("svg .highlight");
    for (var i = 0; i < els.length; i++ ) {
      els[i].classList.remove("highlight");
    }
    var cursor = document.querySelector("#paper svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", 0);
      cursor.setAttribute("x2", 0);
      cursor.setAttribute("y1", 0);
      cursor.setAttribute("y2", 0);
    }
  };

}

//////////////////////////////////////////////////////////////////////////////
// Initialise the Synth

var synthControl;

function setTune(userAction) {

  var abcOptions = {
    add_classes: true,
    responsive: "resize" };

  var visualObj = ABCJS.renderAbc("paper", abc, abcOptions)[0];

  // TODO: This will allow the callback function to have access to timing info
  // This should be incorporated into the render at some point.
  var midiBuffer = new ABCJS.synth.CreateSynth();
  midiBuffer.init({
    visualObj: visualObj,
    // audioContext: new AudioContext(),
    // sequence: [],
    // millisecondsPerMeasure: 2000,
    // debugCallback: function(message) { console.log(message) },
    options: {
      // soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" ,
      // sequenceCallback: function(noteMapTracks, callbackContext) { return noteMapTracks; },
      // callbackContext: this,
      // onEnded: function(callbackContext),
      // pan: [ -0.5, 0.5 ]
    }
  }).then(function (response) {
    console.log(response);
    if (synthControl) {
      synthControl.setTune(visualObj, userAction).then(function (response) {
        console.log("Audio successfully loaded.")
      }).catch(function (error) {
        console.warn("Audio problem:", error);
      });
    }
  }).catch(function (error) {
    console.warn("Audio problem:", error);
  });
}

//////////////////////////////////////////////////////////////////////////////
// When the page is loaded

function loadSynth(sheetIndex) {

  // Load the sheet
  abc = sheetABCs[sheetIndex];
    
  ////////////////////////////////////////////////////////////////////////////

  // Prepare the beat blinker
  beat();

  // Prepare the ABC Synth
  if (ABCJS.synth.supportsAudio()) {
    synthControl = new ABCJS.synth.SynthController();
    synthControl.load("#audio", cursorControl, {displayLoop: false, displayPlay: true, displayRestart: true, displayProgress: true, displayWarp: false});
  } else {
    document.querySelector("#audio").innerHTML = "<div class='audio-error'>Audio is not supported in this browser.</div>";
  }
  setTune(false);
}

