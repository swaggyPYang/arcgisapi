/**
 * This module is used to provide data from a json file
 */
define([
  "esri/dijit/ColorPicker",
  "esri/dijit/ColorPicker/colorUtil",

  "./resources/js/utils/DataProvider.js",

  "dojo/Stateful",

  "dojo/_base/declare",
  "dojo/_base/lang",

  "dojo/dom",
  "dojo/on"
], function (ColorPicker, colorUtil,
             DataProvider,
             Stateful,
             declare, lang,
             dom, On) {

  var objectProvider = {};

  var StatefulClass = declare([Stateful], {

  });

  var getStatefullObject = function(configData){
    var obj = new StatefulClass();

    var properties = configData["properties"];

    properties.forEach(function(property) {

      var propObj = {};
      propObj["className"] = configData["name"];

      if(property["method"] || property["constructorArg"]) {
        var propName = property["name"];

        if(property["class"]) {
          var subData = property["config"];

          var subObj = getStatefullObject(subData);
          propObj[propName] = subObj;
        } else {
          propObj[propName] = null;
        }

        lang.mixin(obj, propObj);

        var el = dom.byId(configData["name"] + propName + "ID");
        var type = property["type"];

        if(type === "Number" || type === "String") {

          if(type === "Number" && property["attributes"] && property["attributes"].min && property["attributes"].max) {
            var rangeEl = dom.byId(configData["name"] + propName + "RangeID");

            var isMSIE = /*@cc_on!@*/0;

            if (isMSIE) {
              // do IE-specific things
              rangeEl.addEventListener("change", function() {
                obj.set(propName, rangeEl.value);
              });
            } else {
              // do non IE-specific things
              rangeEl.addEventListener("input", function() {
                obj.set(propName, rangeEl.value);
              });
            }

          }

          // binding from object to element
          obj.watch(propName, function(name, oldValue, value){
            if(property["default"] && value === null) {
              el.value = property["default"];
            } else {
              el.value = value;
            }
            if(property["attributes"] && property["attributes"].min && property["attributes"].max) {
              rangeEl.value = el.value;
            }
            if(propName === "url") {
              var img = new Image();
              img.addEventListener("load", function(){
                obj.set("width", this.naturalWidth);
                obj.set("height", this.naturalHeight);
              });
              img.src = el.value;
            }
          });

          // binding from element to obj
          el.addEventListener("change", function() {

            // input validation
            if(type === "Number" && property["attributes"] && el.value < property["attributes"]["min"]) {
              //alert("cannot be less than " + property["attributes"]["min"] + "!");
              var errMsg = dom.byId("msg");
              errMsg.innerHTML = propName + " cannot be less than " + property["attributes"]["min"] + "!";

              // create event
              var event = new Event("errMsg");

              // Dispatch the event.
              errMsg.dispatchEvent(event);

              obj.set(propName, null);
            } else {
              if(el.value === property["default"]){
                obj.set(propName, null);
              } else {
                obj.set(propName, el.value);
              }
            }

            if(property["attributes"] && property["attributes"].min && property["attributes"].max) {
              var rangeEl = dom.byId(configData["name"] + propName + "RangeID");
              rangeEl.value = el.value;
            }

            if(propName === "url") {
              var img = new Image();
              img.addEventListener("load", function(){
                obj.set("width", this.naturalWidth);
                obj.set("height", this.naturalHeight);
              });
              img.src = el.value;
            }

          }, false);

          if(property["visibility"]) {
            var domElem = dom.byId(configData["name"] + property["visibility"]["name"] + "ID");
            var parent = el.parentNode.parentNode;

            if(domElem.value !== property["visibility"]["value"]) {
              parent.style.display = "none";
            }

            domElem.addEventListener("change", function(){
              if(domElem.value === property["visibility"]["value"]) {
                parent.style.display = "-webkit-box";
                parent.style.display = "-moz-box";
                parent.style.display = "-ms-flexbox";
                parent.style.display = "-webkit-flex";
                parent.style.display = "flex";
                if(property["default"] !== undefined){
                  obj.set(propName, property["default"]);
                }
              } else {
                parent.style.display = "none";
                obj.set(propName, null);
              }
            });
          }
        }

        if(type === "Boolean") {

          // binding from object to element
          obj.watch(propName, function(name, oldValue, value){
            el.value = value;
          });

          el.addEventListener("change", function() {
            if(el.checked) {
              obj.set(propName, true);
            } else {
              obj.set(propName, false);
            }

          }, false);
        }

        if(type === "Color") {

          var colorPicker = new ColorPicker({
            showRecentColors: false,
            showTransparencySlider: true,
            showSuggestedColors: false,
            required: true
          }, el);
          colorPicker.startup();

          var text = dom.byId(configData["name"] + property["name"] + "TextID");
          colorPicker.set("color", property["default"]);
          text.innerHTML = "[" + property["default"] + "]";
          text.style.background = colorPicker.get("color");

          colorPicker.on("color-change", function(){
            var selected = colorPicker.get("color");
            var contrastColor  = colorUtil.getContrastingColor(selected);

            var textVal = selected.toRgba();
            textVal[3] = Math.round(textVal[3] * 100) / 100;
            if(selected === property["default"]){
              obj.set(propName, null);
            } else {
              obj.set(propName, textVal);
            }



            if(textVal.constructor === Array) {
              textVal = "[" + textVal + "]";
            }

            text.innerHTML = textVal;
            text.style.background = selected;
            text.style.color = contrastColor;
          });

          // binding from object to element
          obj.watch(propName, function(name, oldValue, value){
            //el.value = value;
            if(value === null) {
              value = property["default"];
            }
            colorPicker.set("color", value);
          });
        }
      }

      if(property["class"]) {
        var elem = dom.byId(configData["name"] + propName + "ID");
        var textElem = dom.byId(configData["name"] + propName + "TextID");

        var text = [], subObj = obj[property["name"]];

        property["config"]["properties"].forEach(function(prop) {

          if(prop["method"]) {
            if(prop["default"]) {
              var def = prop["default"];
              if(typeof def === "string") {
                def = def.split('_');
                if(def.length > 1) {
                  def = def[1];
                } else {
                  def = def[0];
                }
              } else if(typeof def === "number") {
                def =  Math.round(def * 100) / 100;
              }

              if(def.constructor === Array) {
                def = "[" + def + "]";
              }
              text.push(def);
            } else {
              text.push(prop["name"]);
            }
          }

        });

        textElem.innerHTML = text.join(', ');

        subObj.watch(function(){

          text = [];

          property["config"]["properties"].forEach(function(prop) {

            var def;

            if(prop["method"]) {

              if(subObj[prop["name"]]) {
                def = subObj[prop["name"]];
              } else if(prop["default"]) {
                def = prop["default"];
              } else {
                def = prop["name"];
              }

              if(typeof def === "string") {
                def = def.split('_');
                if(def.length > 1) {
                  def = def[1];
                } else {
                  def = def[0];
                }
              } else if(typeof def === "number") {
                def =  Math.round(def * 100) / 100;
              }

              if(def.constructor === Array) {
                def = "[" + def + "]";
              }
              text.push(def);
            }

          });

          textElem.innerHTML = text.join(', ');
        });
      }

    });

    return obj;
  };

  objectProvider.getStatefullObject = getStatefullObject;
  objectProvider.StatefulClass = StatefulClass;

  return objectProvider;
});