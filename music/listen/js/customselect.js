// global variable for the current sheet
var abc = ""

//////////////////////////////////////////////////////////////////////////////
// Functions below are for modifying QPM

function changeQPM(abc, qpm) {
  var before = abc.substring(0, abc.search("Q:"));
  var after = abc.substring(abc.search("Q:"), abc.length);

  var mid = after.substring(0, after.search("\n"));
  after = after.substring(after.search("\n"), after.length);

  var newabc = before + "Q:1/4=" + qpm.toString() + after;

  return newabc;
}

function getQPM(abc) {
  var after = abc.substring(abc.search("Q:"), abc.length);
  var mid = after.substring(after.search("Q:")+6, after.search("\n"));

  return parseInt(mid);
}

function reloadQPMlist(abc){
  var qpm = getQPM(abc);
  document.getElementById("qpmSelect").innerHTML = qpm;
  
  // Remove all existing elements
  const myNode = document.getElementById("qpmList");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }

  // Add the new elements and their handlers
  var extras = ["+50", "+25", "+10", "" , "-10", "-25", "-50"];
  for(var i = 0; i < 7; i++) {
    var newoption_li = document.createElement("li");
    var newoption_a  = document.createElement("a");
    newoption_a.innerHTML = qpm.toString() + extras[i];
    newoption_a.onclick = function () {
      qpmSelected($(this));
    };
    
    newoption_li.appendChild(newoption_a);
    document.getElementById("qpmList").appendChild(newoption_li);
  }
}

function qpmSelected(elem) {
  var index = elem.parent().index();
  
  $('#qpmSelect').text( elem.text() ).css('opacity', '1');

  $('#qpmList').find('li').eq(index).prependTo('#qpmList');
  $('#qpmList').toggle();

  var newqpm = parseInt(elem.text());
  if      (elem.text().includes("-50")==true) {newqpm -= 50;}
  else if (elem.text().includes("-25")==true) {newqpm -= 25;}
  else if (elem.text().includes("-10")==true) {newqpm -= 10;}
  else if (elem.text().includes("+10")==true) {newqpm += 10;}
  else if (elem.text().includes("+25")==true) {newqpm += 25;}
  else if (elem.text().includes("+50")==true) {newqpm += 50;}
  
  abc = changeQPM(abc, newqpm);
  setTune(false);
}

//////////////////////////////////////////////////////////////////////////////
// When the page is loaded

function loadQPM(sheetIndex) {

  // Clear all existing options first
  document.getElementById("sheetSelect").innerHTML = sheetTitles[sheetIndex];
  document.getElementById("sheetList").innerHTML = "";

  // Load the ComboBox with Sheet Names
  // Populate the list with options:
  for(var i = 0; i < sheetTitles.length; i++) {
    var opt = sheetTitles[i];
    var newoption_li = document.createElement("li");
    var newoption_a  = document.createElement("a");
    newoption_a.innerHTML = opt;
    newoption_li.appendChild(newoption_a);
    document.getElementById("sheetList").appendChild(newoption_li);
  }

  reloadQPMlist(abc);

  ////////////////////////////////////////////////////////////////////////////
  // Handlers for qpmlist content
  
  $('#qpmSelect').on('click', function (ev) {
    $('#qpmSelect').css('opacity', '0');
    $('#qpmList').toggle();
  });

  $('#sheetSelect').on('click', function (ev) {
    $('#sheetSelect').css('opacity', '0');
    $('#sheetList').toggle();
  });
  
  // As qpmlist changes dynamically for the selected sheet, 
  // the handler reloads the list with reloadQPMlist()
  $('#sheetList a').on('click', function (ev) {
    ev.preventDefault();
    var index = $(this).parent().index();

    // Update the comboBox
    $('#sheetSelect').text( $(this).text() ).css('opacity', '1');
    $('#sheetList').find('li').eq(index).prependTo('#sheetList');
    $('#sheetList').toggle();

    // Reload the sheet
    // Update the list of qpms for the selected sheet
    for (i = 0; i < sheetTitles.length; i++) {
      if (sheetTitles[i] == $(this).text()) {
        reloadQPMlist(abc);
        abc = sheetABCs[i];
        setTune(false);          
      }
    } 

    // Update the URL with the selected sheet name
    var this_URL = document.URL;
    var base_url = this_URL;
    if (this_URL.indexOf('?') != -1)
      base_url = this_URL.substring(0, this_URL.indexOf('?'));
    var new_url = base_url;
    // if (new_url.indexOf("listen/") == -1)
    // new_url = new_url.concat("listen/");
    new_url = new_url.concat("?sheet=");
    new_url = new_url.concat($(this).text().replace(" ","_"));
    const state = { 'page_id': 1, 'user_id': 1 };
    history.pushState(state, "Listen", new_url);

    loadDownloadLinkByName($(this).text());

    return false;
  });

}