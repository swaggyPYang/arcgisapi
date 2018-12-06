/**
 * This module is used to provide utility functions for main.js
 */
define([
  "esri/map",
  "esri/Color",
  "esri/graphic",

  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",

  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/PictureFillSymbol",
  "esri/symbols/CartographicLineSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",

  "./resources/js/utils/CurrentState.js",
  "./resources/js/utils/CodeGenerator.js",

  "dojo/dom",
  "dojo/on"
], function (Map, Color, Graphic,
             Point, Polyline, Polygon,
             SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, PictureFillSymbol, CartographicLineSymbol, TextSymbol, Font,
             CurrentState, CodeGenerator,
             dom, On) {

  var initializer = {}, map = null, editor = null, variableHolder, configData;


  var initMap = function () {
    //console.log("... initMap");

    map = new Map("mapDiv", {
      center: [-118, 34.5],
      zoom: 8,
      basemap: "topo"
    });

    On(dom.byId("clearGraphicsbtn"), "click", function () {
      map.graphics.clear();
    });

    var basemapSelector = dom.byId("basemapSelector");

    On(basemapSelector, "change", function () {
      map.setBasemap(basemapSelector.value);
    });

    //_useToolbarListner();
  };

  // TODO - need to change this
  function _useToolbarListner() {
    var useToolbarID = dom.byId("useToolbar");

    On(useToolbarID, "change", function () {
      useToolbar = useToolbarID.checked;

      var toolbarSubmitBtn = dom.byId("toolbarSubmitBtn");
      toolbarSubmitBtn.style.display = useToolbar ? "block" : "none";

      if(useToolbar) {
        objWatchHandlers.forEach(function(handler){
          handler.unwatch();
        });
        objWatchHandlers = [];
      } else{
        enableObjWatch(statefullObject);
      }

      map.graphics.clear();
    })
  }

  var initMsgCenter = function(){
    //console.log("... initMsgCenter");
    var msg = dom.byId("msg"),
      parent = msg.parentNode;

    On(msg, "errMsg", function() {
      parent.style.display = "block";
      parent.style.background = "#e74c3c";

      setTimeout(function(){
        parent.style.display = "none";
      }, 4000);
    });

    On(msg, "notification", function() {
      parent.style.display = "block";
      parent.style.background = "#2ecc71";

      setTimeout(function(){
        parent.style.display = "none";
      }, 4000);
    });
  };

  var initCopy = function() {
    //console.log("... initCopy");

    // set path
    ZeroClipboard.config( { swfPath: "bower_components/zeroclipboard/dist/ZeroClipboard.swf" } );

    // create client
    var client = new ZeroClipboard(dom.byId("copyButton"));

    client.on( 'ready', function(event) {
      //console.log( 'movie is loaded' );

      client.on( 'copy', function(event) {
        event.clipboardData.setData('text/plain', editor.getDoc().getValue());
      } );

      client.on( 'aftercopy', function(event) {
        //console.log('Copied to clipboard: ' + editor.getDoc().getValue());
        var msg = dom.byId("msg");
        msg.innerHTML = "Copied to clipboard!";

        // create event
        var event = new Event("notification");

        // Dispatch the event.
        msg.dispatchEvent(event);
      } );
    } );

    client.on( 'error', function(event) {
      // console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
      ZeroClipboard.destroy();
    } );
  };

  var initEditor = function(config) {
    //console.log("... initEditor");
    var codeArea = dom.byId("code-area");
    configData = config;

    editor = CodeMirror.fromTextArea(codeArea, {
      theme: "monokai",
      // lineWrapping: true, -- removed due to bug
      lineNumbers: true,
      readOnly: true,
      gutters: ["CodeMirror-linenumbers"]
    });

    editor.on('change',function(cm){
      var editorValue = cm.getDoc().getValue();

      if(!_isJsonRegex(editorValue) && editorValue.indexOf("require([") === -1){
        drawOnMap(editorValue);
        _changeMenu(dom.byId("codeOption"));
      }

      //TODO - use esprima to create an AST from this code and reflect these changes in the stateful object
    });
  };


  var _isJsonRegex = function(str) {
    if (str == '') return false;
    str = str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  };

  var initCodeMenu = function() {
    //console.log("... initCodeMenu");
    var menu = dom.byId("codeBlockMenu");
    On(menu, "click", function(event){

      var node = event.target;
      if(!node.id) {
        node = event.target.parentNode;
      }

      _changeMenu(node);

      if(node.id === "codeOption") {
        var code = CodeGenerator.generateCode(CurrentState.ast);
        //console.log(CurrentState.required);
        displayCode(CurrentState.required.commentReqModules.join("\n") + "\n\n" + js_beautify(code));
      }
      else if(node.id === "usageOption") {
        var code = CodeGenerator.generateCode(CurrentState.ast);
        displayCode("// usage: \n\n require([\n" + CurrentState.required.reqModules.join(",\n") + " \n], function(" + CurrentState.required.reqVariables.join(", ")+ "){\n\n" + js_beautify("\t" + code) + "\n\n});");
      }
      else if(node.id === "jsonOption") {
        displayCode(JSON.stringify(variableHolder.toJson(), null, 4));
        //console.log(variableHolder.toJson());
      }
    })
  };

  var _changeMenu = function (node){
    var menu = dom.byId("codeBlockMenu");
    var children = menu.childNodes;
    for (var i = 0; i < children.length; i++) {
      if(children[i].className) {
        children[i].className = "";
        break;
      }
    }

    if(node.id !== "copyButton") {
      node.className = "active";
    }
  };

  var drawOnMap = function(code) {
    //console.log("...drawOnMap");
    map.graphics.clear();

    // This evaluates to "var symbol = new SimpleLineSymbol(); symbol" => symbol will be assigned to sym
    variableHolder = eval(code + configData["variable"]); //execute code

    //console.log(variableHolder);

    if(configData["name"].indexOf("Symbol") > -1) {

      if(code.indexOf("setOffset") > -1){
        var geoLocSym = new SimpleMarkerSymbol();
        geoLocSym.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        geoLocSym.setColor("black");
        geoLocSym.setSize(5);
        var geoLocGraphic = new Graphic(_getGeometry(configData["name"]), geoLocSym);
        map.graphics.add(geoLocGraphic);
      }

      var geometry = _getGeometry(configData["name"]);
      var graphic = new Graphic(geometry, variableHolder);
      map.graphics.add(graphic);
    }
  };

  var displayCode = function(code) {
    //console.log("...displayCode");
    if(map.loaded){
      editor.getDoc().setValue(code);
    } else {
      map.on("load", function(){
        editor.getDoc().setValue(code);
      });
    }
  };

  var initResetBtn = function() {
    //console.log("...initResetBtn");

    On(dom.byId("reset"), "click", function(){
      _resetObj(CurrentState.statefulObject);
      localStorage.removeItem("statefulObject");

      // create a basic AST
      CurrentState.ast = CodeGenerator.getAST(configData["type"], configData["name"], configData["variable"]);
      var code = CodeGenerator.generateCode(CurrentState.ast);

      // display the code in code-area
      displayCode(CurrentState.required.commentReqModules.join("\n") + "\n\n" + js_beautify(code));
    });
  };

  var _resetObj = function (obj) {
    //console.log(obj);
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && prop !== "_watchCallbacks" && prop !== "className") {
        if (obj[prop] instanceof Object && !(obj[prop] instanceof Array)) {
          _resetObj(obj[prop]);
        }
        else {
          if (obj[prop]) {
            obj.set(prop, null);
          }
        }
      }
    }
  };

  var _getGeometry = function(configDataName) {
    var polyline = new Polyline({
      "paths": [[[-115.57, 34.53], [-118, 34.5], [-118.58, 32.85]]],
      "spatialReference": {"wkid": 4326}
    });

    var point = new Point({"x": -118, "y": 34.5, "spatialReference": {"wkid": 4326}});

    var polygon = new Polygon({
      "rings": [[[-118.63, 34.52], [-117.57, 35.53], [-116.52, 34.50], [-115.49, 33.48],
        [-119.64, 33.29], [-118.63, 34.52], [-118.63, 34.52]]], "spatialReference": {"wkid": 4326}
    });

    switch (configDataName) {
      case "SimpleLineSymbol":
        return polyline;
        break;
      case "SimpleMarkerSymbol":
        return point;
        break;
      case "SimpleFillSymbol":
        return polygon;
        break;
      case "PictureMarkerSymbol":
        return point;
        break;
      case "PictureFillSymbol":
        return polygon;
        break;
      case "CartographicLineSymbol":
        return polyline;
        break;
      case "TextSymbol":
        return point;
        break;
    }
  };

  initializer.initMap = initMap;
  initializer.initMsgCenter = initMsgCenter;
  initializer.initCopy = initCopy;
  initializer.initEditor = initEditor;
  initializer.initCodeMenu = initCodeMenu;
  initializer.drawOnMap = drawOnMap;
  initializer.displayCode = displayCode;
  initializer.initResetBtn = initResetBtn;

  initializer.map = map;
  initializer.editor = editor;

  return initializer;

});
