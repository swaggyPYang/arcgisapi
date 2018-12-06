"use strict";

require([

  "./resources/js/utils/DataProvider.js",
  "./resources/js/utils/DOMBuilder.js",

  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function (DataProvider, DOMBuilder,
             dom, On) {

  var configUrl = "resources/data/index-config.json";

  init();


  function init() {

    var selectionContainer = dom.byId("selectionContainer");

    DataProvider.getJsonData(configUrl, true).then(function (data) {
      var fragment = DOMBuilder.getIndexfragment(data);
      selectionContainer.appendChild(fragment);
    });

    On(selectionContainer, "click", function(event) {
      var target = event.target;

      if(target.hasAttribute("data-config-loc")) {
        window.location.href = "main.html" + "#/config=" + target.getAttribute("data-config-loc");
      }
    });
  }

});