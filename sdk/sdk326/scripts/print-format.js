function printPage(){
  //Set styles same as those in original html file
  var styles = '<link rel="stylesheet" href="../styles/screen.css">'
    + '<link rel="stylesheet" href="../styles/jsdoc.css">'
    + '<link rel="stylesheet" href="../styles/homepage.css">'
    + '<link rel="stylesheet" href="../styles/grid.css">'
    + '<link rel="stylesheet" href="../styles/tree.css">'
    + '<link rel="stylesheet" href="../prettify/prettify.css">'
    + '<link rel="stylesheet" href="../styles/tailcoat-search.css">'
    + '<link rel="shortcut icon" href="../graphics/favicon.ico">';
  //Get content for printing
  var className = document.getElementById("pageBanner").innerHTML;
  var printContent = document.getElementById("topicPane").innerHTML;
  //Set friendly printing style
  var format = "<style>"
    + "body{overflow: visible; width: 1000px; margin: 25px;}"
    + "</style>";

  var printPageWindow = window.open("", "", "");
  printPageWindow.document.open();
  printPageWindow.document.write("<html><head><title>" + className + "</title>" + styles + format + "</head>"
    + "<body><div style='font-size: 150%;'>ArcGIS API for JavaScript</div><br>"
    + printContent + "<script>window.print();</script></body></html>");
  printPageWindow.document.close();
  printPageWindow.focus();
}
