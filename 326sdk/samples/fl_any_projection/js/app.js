require([
  "dojo/parser",
  "dojo/dom",
  "dojo/on",
  "dojo/json",
  "dojo/_base/array",
  "esri/Color",
  "dijit/registry",

  "esri/map",
  "esri/SpatialReference",
  "esri/layers/FeatureLayer",
  "esri/geometry/Extent",
  "esri/tasks/GeometryService",

  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/renderers/SimpleRenderer",

  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/form/ComboBox",
  "dojo/domReady!"
], function(
  parser, dom, on, JSON, arr, Color, registry,
  Map, SpatialReference, FeatureLayer, Extent, GeometryService,
  SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer
) {
  parser.parse();

  window.app = {};
  window.app.bounds = new Extent({"xmin":-3805207,"ymin":-3763687,"xmax":3692296,"ymax":1775125,"spatialReference":{"wkid":102003}});

  showInfo(window.app.bounds);
  dom.byId("wkid").value = window.app.bounds.spatialReference.wkid;

  buildMap(window.app.bounds);

  registry.byId("wkid").on("change", projectExtent);
  // highlight the extent JSON text when it's
  // clicked to make copying easier
  on(dom.byId("extent"),"click", selectText);
  on(dom.byId("center"),"click", selectText);

  var gs = new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");

  function buildMap(b) {
    if ( window.app.map ) { // kill the map, if it already exists
      window.app.extentChange && window.app.extentChange.remove();
      window.app.map.destroy();
      window.app.map = null;
      // console.log("destroyed previous map instance");
    }
    window.app.bounds = b || window.app.bounds;
    window.app.map = new Map("map", {
      extent: window.app.bounds,
      showAttribution: false,
      sliderStyle: "small"
    });
    console.log("map extent: ", window.app.map.extent.spatialReference.wkid);
    // USA
    var layer = new FeatureLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3");
    // other layers to use...world regions:
    // var layer = new FeatureLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/2");
    // countries:
    // var layer = new FeatureLayer("https://wwtw.esriuk.com/ArcGIS/rest/services/CG/WorldCountries/MapServer/0");
    var outline = new SimpleLineSymbol("solid", new Color([255, 255, 255, 1]), 1);
    var fill = new SimpleFillSymbol("solid", outline, new Color([64, 64, 64, 0.5]));
    layer.setRenderer(new SimpleRenderer(fill));
    window.app.map.addLayer(layer);
    window.app.extentChange = window.app.map.on("extent-change", showInfo);
  }

  function projectExtent(val) {
    console.log("project extent val: ", val, typeof val);
    var wkid = parseInt(val, 10);
    if ( wkid === window.app.map.spatialReference.wkid ) {
      // no need to project
      // print the map's current extent
      showInfo(window.app.map.extent);
      return;
    }

    // wkid changed, project the map's current extent
    var sr = new SpatialReference(wkid);
    var project = gs.project([ window.app.map.extent ], sr);
    project.then(success, failure);
  }

  function success(result) {
    // console.log("project successful: ", result);
    if ( result.length ) {
      var bounds = result[0];
      buildMap(bounds);
      showInfo(bounds);
    } else {
      console.log("Project was successful, but no results were returned.");
    }
  }

  function failure(err) {
    dom.byId("extent").innerHTML = "Failed, probably an invalid WKID. Check the console for more info.";
    dom.byId("center").innerHTML = "&nbsp;";
    console.log("Project failed:  ", err);
  }

  function showInfo(b) {
    // handle both direct use and event objects
    if(!(b instanceof Extent)){
      b = b.extent;
    }
    // format extent for display
    var bounds = b.toJson();
    arr.forEach(["xmin", "xmax", "ymin", "ymax"], function(c) {
      bounds[c] = roundCoordinate(bounds[c]);
    });
    var boundsText = JSON.stringify(bounds);
    var boundsNode = dom.byId("extent");
    boundsNode.innerHTML = boundsText;
    // select the extent text for easy copying
    selectText(boundsNode);

    // format center for display
    var center = b.getCenter().toJson();
    arr.forEach(["x", "y"], function(c) {
      center[c] = roundCoordinate(center[c]);
    });
    // this would work if always using geographic coordinates:
    // var centerText = "[ " + center.x + "," + center.y + " ]";
    // instead, show full JSON with a spatial reference to accommodate any wkid
    var centerText = JSON.stringify(center);
    dom.byId("center").innerHTML = centerText;
  }

  function roundCoordinate(c) {
    var rounded;
    if ( Math.abs(c) > 360 ) {
      rounded = parseInt(c, 10);
    } else {
      rounded = parseFloat(c.toFixed(3));
    }
    return rounded;
  }

  // from http://stackoverflow.com/a/2838358/1934
  // slightly modified to work with an event object
  // or a DOM node as the first argument
  function selectText(el, win) {
    el = el.target || el;
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
      sel = win.getSelection();
      range = doc.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (doc.body.createTextRange) {
      range = doc.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }
});
