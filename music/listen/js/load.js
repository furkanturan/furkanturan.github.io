var getSheetFromUrl = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
    if (pair[0]=="sheet")
      return pair[1].replace("_"," ");
	}
  return 0;
};

function load() {

  var sheetFromURL = getSheetFromUrl(document.URL);
  var sheetIndex = -1;

  // If there is no sheet info given in URL,
  // Set the sheetIndex for the first sheet
  if (sheetFromURL == 0) {
    sheetIndex = 0;
  }
  // If a target sheet is given by the URL
  else {

    // Search the URL given sheet
    for (var i=0; i<sheetTitles.length; i++)
      if (sheetTitles[i] == sheetFromURL)
        sheetIndex = i;

    // If the sheet is not found
    if (sheetIndex==-1) {
      // Set the sheetIndex for the first sheet
      sheetIndex = 0;

      // Clean the URL too
      var this_URL = document.URL;
      if (this_URL.indexOf('?') != -1) {
        var base_url = this_URL.substring(0, this_URL.indexOf('?'));
        const state = { 'page_id': 1, 'user_id': 1 }
        history.pushState(state, "Listen", base_url);
      }
    }
  }

  loadSynth(sheetIndex);
  loadQPM(sheetIndex);
  loadDownloadLinkByIndex(sheetIndex);
}