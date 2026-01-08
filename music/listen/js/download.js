loadDownloadLinkByIndex = function (sheetIndex) {
  var url = "https://music.furkanturan.com/sheets/";
  url = url.concat(sheetTitles[sheetIndex].replace(" ","_"));
  url = url.concat(".pdf");
  url = url.toLocaleLowerCase();
  document.getElementById("downlink").href=url;
}
  
loadDownloadLinkByName= function (sheetName) {
  var url = "https://music.furkanturan.com/sheets/";
  url = url.concat(sheetName.replace(" ","_"));
  url = url.concat(".pdf");
  url = url.toLocaleLowerCase();
  document.getElementById("downlink").href=url;
}