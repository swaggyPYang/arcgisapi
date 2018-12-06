/**
 * This module is used to provide utility functions for main.js
 */
define([
  "esri/toolbars/draw"
], function (Draw) {

  var toolbarUtils = {}, map, toolbar;

  var initToolbar = function(mapp) {
    console.log("initializing toolbar...");
    map = mapp;
    toolbar = new Draw(map);
    toolbar.on("draw-end", addToMap);
    initiateButtonListner(toolbar);
    console.log("init end...");
  }

  function addToMap(evt) {
    map.enableMapNavigation();
    toolbar.deactivate();
    var graphic = new Graphic(evt.geometry, variableHolder);
    map.graphics.add(graphic);
  }

  function initiateButtonListner(toolbar) {

    On(dom.byId("toolbarSubmitBtn"), "click", function () {

      console.log("submitting...");

      currentAST = CodeGenerator.modifyASTConstructor(configData, currentAST, statefullObject);
      var code = CodeGenerator.generateCode(currentAST);

      displayCode(commentReqModules.join("\n") + "\n\n" + js_beautify(code, beautify_opts));

      // This evaluates to "var symbol = new SimpleLineSymbol(); symbol" => symbol will be assigned to sym
      variableHolder = eval(code + configData["variable"]); //execute code

      console.log(variableHolder);

      map.disableMapNavigation();

      //TODO - Change the arg based on symbol...........
      if(configData["name"] === "SimpleLineSymbol" || configData["name"] === "CartographicLineSymbol"){
        toolbar.activate(Draw.LINE);
      } else if(configData["name"] === "SimpleMarkerSymbol") {
        toolbar.activate(Draw.POINT);
      } else if(configData["name"] === "SimpleFillSymbol" || configData["name"] === "PictureFillSymbol") {
        toolbar.activate(Draw.POLYGON);
      } else if(configData["name"] === "PictureMarkerSymbol" || configData["name"] === "TextSymbol") {
        toolbar.activate(Draw.MULTI_POINT);
      }

      toolbar.setMarkerSymbol(variableHolder);
    });
  }

  toolbarUtils.initToolbar = initToolbar;

  return toolbarUtils;
});