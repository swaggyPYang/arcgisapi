var map;
require([
  "esri/map", "esri/layers/FeatureLayer", "esri/geometry/Point", "esri/tasks/query",
  "esri/graphic", "esri/layers/GraphicsLayer", "esri/symbols/SimpleMarkerSymbol", "esri/renderers/SimpleRenderer",
  "esri/config", "esri/Color", "dojo/string", "dojo/dom", "dijit/DialogUnderlay", "dojo/domReady!"
], function(
  Map, FeatureLayer, Point, Query, 
  Graphic, GraphicsLayer, SimpleMarkerSymbol, SimpleRenderer,
  esriConfig, Color, string, dom, Underlay
) {

  //IE needs to use a proxy to get worker scripts.
  //Other browsers won"t use this.
  esriConfig.defaults.io.proxyUrl = "/proxy";

  map = new Map("mapDiv", {
    basemap: "topo",
    center: [-97.25, 37.70],
    zoom: 12,
    slider: false,
    plugins: [{
      id: "esri/plugins/spatialIndex",
      options: {
        indexType: "kdtree",
        drawFeatures: false,
        passFeatures: false
      }
    }]
  });

  //get features in an effcient, tiled manner using on-demand mode, but don"t draw (draw mode == false)
  var ptsLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/SedgCountyWaterWells/FeatureServer/0", {
    outFields: ["*"]
  });

  var highlightLayer = new GraphicsLayer();

  // selection symbol used to draw the selected census block points within the buffer polygon
  var symbol = new SimpleMarkerSymbol(
    SimpleMarkerSymbol.STYLE_CIRCLE,
    6,
    null,
    new Color([207, 34, 171, 0.5])
  );
  ptsLayer.setSelectionSymbol(symbol);
  highlightLayer.setRenderer(new SimpleRenderer(symbol));

  var once = ptsLayer.on("update-end", function() {
    Underlay.hide();
    dom.byId("step1").hidden = true;
    dom.byId("step2").hidden = false;
    console.log("total feature count: " + ptsLayer.graphics.length);
    once.remove();
    //enable map interaction
    //when the map is clicked create a buffer around the click point of the specified distance.
    var clickStart = map.on("click", function() {
      clickStart.remove();
      map.on("mouse-move", function(evt) {
        map.spatialIndex.nearest({
          point: evt.mapPoint,
          count: 100
        }).then(selectInBuffer);
      });
    });
  });

  map.on("load", function() {
    Underlay.show();
    map.addLayers([ptsLayer, highlightLayer]);
  });

  var infoString = "<h3>For the nearest 100 wells</h3>" +
    "<b>Average distance</b> is <i>${average.distance}</i><br>" +
    "<b>Average well depth</b> is <i>${average.WELL_DEPTH}</i><br>" +
    "<b>Total estimated yield</b> is <i>${sum.EST_YIELD}</i>";

  function selectInBuffer(response) {
    var features = response.results;
    var len = features.length;
    highlightLayer.clear();
    while (len--) {
      /*console.log("Found " + features.length + " total");*/
      var f = features[len][0];
      var pt = new Point(f);
      highlightLayer.add(new Graphic(pt, null, f));
      var stats = calcStats(features);
      dom.byId("messages").innerHTML = string.substitute(infoString, stats);
      /*console.log("feature stats %o", stats);*/
    }
  }

  function calcStats(features) {
    var depths = 0,
      yields = 0,
      dist = 0;
    for (var x = 0, len = features.length, attr; x < len; x++) {
      attr = features[x][0];
      depths += parseInt(attr["WELL_DEPTH"], 10) || 0;
      yields += parseInt(attr["EST_YIELD"], 10) || 0;
      dist += features[x][1];
    }
    return {
      sum: {
        "WELL_DEPTH": depths,
        "EST_YIELD": yields,
        "distance": dist
      },
      average: {
        "WELL_DEPTH": Math.round(depths / len) || 0,
        "EST_YIELD": Math.round(yields / len) || 0,
        "distance": Math.round(dist / len) || 0
      },
      total: len
    };
  }
});
