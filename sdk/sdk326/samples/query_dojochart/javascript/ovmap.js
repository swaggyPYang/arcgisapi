dojo.require("esri.dijit.OverviewMap");
//add the overview map 
function addOverview(map){
//attachTo:bottom-right,bottom-left,top-right,top-left
//opacity: opacity of the extent rectangle - values between 0 and 1. 
//color: fill color of the extnet rectangle
//maximizeButton: When true the maximize button is displayed
//expand factor: The ratio between the size of the ov map and the extent rectangle.
//visible: specify the initial visibility of the ovmap.
  var overviewMapDijit = new esri.dijit.OverviewMap({
    map: map,
    visible: true,
    attachTo: "bottom-right",
    opacity: 0.5,
    color: "#000000",
    expandfactor: 2,
    maximizeButton: false,
    visible: true
  });
  overviewMapDijit.startup();
}