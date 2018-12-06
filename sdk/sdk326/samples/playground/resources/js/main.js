"use strict";

require([
  "./resources/js/utils/CurrentState.js",
  "./resources/js/utils/mainUtils.js",
  "./resources/js/utils/Initializer.js",
  "./resources/js/utils/DOMBuilder.js",
  "./resources/js/utils/CodeGenerator.js",
  "./resources/js/utils/ObjectProvider.js",

  "dojo/dom",
  "dojo/domReady!"
], function (
             CurrentState, mainUtils, Initializer, DOMBuilder, CodeGenerator, ObjectProvider,
             dom) {

  var configData;

  init();

  function init() {

    Initializer.initMap();

    var configUrl = "resources/data/" + location.hash.split("=")[1];

    if(localStorage.getItem("configData") && localStorage.getItem("reqModules")) {
      configData = JSON.parse(localStorage.getItem("configData"));
      CurrentState.required.reqModules = JSON.parse(localStorage.getItem("reqModules"));
      CurrentState.required.commentReqModules = JSON.parse(localStorage.getItem("commentReqModules"));
      CurrentState.required.reqVariables = JSON.parse(localStorage.getItem("reqVariables"));
    }

    if(!configData || (configData && configUrl.indexOf(configData["name"]) === -1)) {
      localStorage.clear();
      CurrentState.required.reqModules = [];
      CurrentState.required.commentReqModules = ["// Modules required: "];
      CurrentState.required.reqVariables = [];
      configData = mainUtils.parseConfig(configUrl);
      localStorage.setItem("configData", JSON.stringify(configData));
      localStorage.setItem("reqModules", JSON.stringify(CurrentState.required.reqModules));
      localStorage.setItem("commentReqModules", JSON.stringify(CurrentState.required.commentReqModules));
      localStorage.setItem("reqVariables", JSON.stringify(CurrentState.required.reqVariables));
    }

    // initialize Header
    dom.byId("pageTitle").innerHTML = configData["name"];
    dom.byId("pageSubTitle").innerHTML = configData["summary"];

    // use config data to create DOM elements
    var fragment = DOMBuilder.getMainfragment(configData);
    var playArea = dom.byId("play-area");
    playArea.appendChild(fragment);

    // create a stateful obj that watches the properties data
    CurrentState.statefulObject = ObjectProvider.getStatefullObject(configData);

    // watch properties data for changes
    mainUtils.enableObjWatch(configData, CurrentState.statefulObject);

    // create a basic AST
    CurrentState.ast = CodeGenerator.getAST(configData["type"], configData["name"], configData["variable"]);

    if(localStorage.getItem("statefulObject")) {
      var storageObject = JSON.parse(localStorage.getItem("statefulObject"));
      mainUtils.copyObjValues(CurrentState.statefulObject, storageObject);
    }

    var code = CodeGenerator.generateCode(CurrentState.ast);
    code = CurrentState.required.commentReqModules.join("\n") + "\n\n" + js_beautify(code);
    // display the code in code-area
    Initializer.initEditor(configData);
    Initializer.displayCode(code);

    // Initializing data
    if(configData["name"] === "PictureMarkerSymbol") {
      CurrentState.statefulObject.set("url", "http://img3.wikia.nocookie.net/__cb20140427224234/caramelangel714/images/7/72/Location_Icon.png");
    } else if(configData["name"] === "TextSymbol") {
      CurrentState.statefulObject.set("text", "Sample Text");
    } else if(configData["name"] === "PictureFillSymbol") {
      CurrentState.statefulObject.set("url", "http://www.free.designquery.com/01/bg0245.jpg");
    }

    // initialize toolbar
    /*if(configData["toolbar"]){
      initToolbar();
    }*/

    Initializer.initMsgCenter();
    Initializer.initCopy();
    Initializer.initCodeMenu();
    Initializer.initResetBtn();

  }
});
