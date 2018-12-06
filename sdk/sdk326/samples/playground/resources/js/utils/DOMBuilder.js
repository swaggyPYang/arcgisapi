/**
 * This module is used to build DOM elements
 */
define([
  "./resources/js/utils/DataProvider.js"
], function (DataProvider) {

  "use-strict";

  var domBuilder = {};

  /**
   * Creates Node
   * @param text
   * @returns {Element}
   * @private
   */
  var _createNode = function (data, tag, className, id) {
    var node;
    node = document.createElement(tag);
    if(data){
      node.innerHTML = data;
    }
    if(className){
      node.className = className;
    }
    if(id){
      node.setAttribute("id", id);
    }
    return node;
  };

  var _createListNode = function (list) {
    var listNode = document.createElement("ul");

    list.forEach(function(item){
      var li = document.createElement("li");

      var textNode = _createNode(item["name"], "p");
      textNode.setAttribute("data-config-loc", item["location"]);

      li.appendChild(textNode);
      listNode.appendChild(li);
    });

    return listNode;
  };

  var _createPropertiesList = function (json, className, id) {
    var mainNode, node;
    mainNode = _createNode(null, "div", className, id);

    node = document.createElement("ul");
    node = _appendItems(json, node);
    mainNode.appendChild(node);

    return mainNode;
  };

  var _appendItems = function(json, node){

    var data = json["properties"];

    data.forEach(function(dataItem){

      if(dataItem["method"] || dataItem["constructorArg"]) {
        var item = document.createElement("li");

        var textNode, containerNode;

        if(dataItem["class"] || dataItem["type"] === "Color") {
          var listCheckbox = _createNode(null, "input", "list-checkbox");
          listCheckbox.setAttribute("type", "checkbox");
          listCheckbox.checked = true;
          item.appendChild(listCheckbox);

          var textHolder = _createNode(null, "div", "nested-property-container");

          textNode = _createNode(dataItem["name"], "p", "nested-property-name");
          if(dataItem["required"]){
            var spanNode = _createNode("*", "span");
            textNode.appendChild(spanNode);
          }

          var valueHolder = _createNode(null, "div");
          var valueNode = _createNode("expand", "p", null, json["name"] + dataItem["name"] + "TextID");

          valueHolder.appendChild(valueNode);

          textHolder.appendChild(textNode);
          textHolder.appendChild(valueHolder);

          item.appendChild(textHolder);

          containerNode = _createNode(null, "div", "property-values-container");
        } else {

          textNode = _createNode(dataItem["name"], "p", "property-name");
          if(dataItem["required"]){
            var spanNode = _createNode("*", "span");
            textNode.appendChild(spanNode);
          }
          item.appendChild(textNode);

          containerNode = _createNode(null, "div", "property-value-container");

          item.className = "flexer";
        }

        if (dataItem["type"] === "Number") {

          if(dataItem["attributes"] && dataItem["attributes"].min && dataItem["attributes"].max) {

            var inputNode = _createNode(null, "input", "property-value", json["name"] + dataItem["name"] + "RangeID");
            inputNode.setAttribute("type", "range");
            if(dataItem["default"] !== undefined) {
              inputNode.setAttribute("placeholder", Math.round(dataItem["default"] * 100) / 100);
              inputNode.value =  Math.round(dataItem["default"] * 100) / 100;
            } else {
              inputNode.setAttribute("placeholder", "enter " + dataItem["name"]);
            }

            if(dataItem["attributes"]) {
              for(var attr in dataItem["attributes"]) {
                inputNode.setAttribute(attr, dataItem["attributes"][attr]);
              }
            }

            containerNode.appendChild(inputNode);

            var inputNode = _createNode(null, "input", "property-value", json["name"] + dataItem["name"] + "ID");
            inputNode.setAttribute("type", "number");
            if(dataItem["default"] !== undefined) {
              inputNode.setAttribute("placeholder", Math.round(dataItem["default"] * 100) / 100);
              inputNode.value =  Math.round(dataItem["default"] * 100) / 100;
            } else {
              inputNode.setAttribute("placeholder", "enter " + dataItem["name"]);
            }

            if(dataItem["attributes"]) {
              for(var attr in dataItem["attributes"]) {
                inputNode.setAttribute(attr, dataItem["attributes"][attr]);
              }
            }

            containerNode.appendChild(inputNode);

          } else {

            var inputNode = _createNode(null, "input", "property-value", json["name"] + dataItem["name"] + "ID");
            inputNode.setAttribute("type", "number");
            if(dataItem["default"] !== undefined) {
              inputNode.setAttribute("placeholder", Math.round(dataItem["default"] * 100) / 100);
              inputNode.value =  Math.round(dataItem["default"] * 100) / 100;
            } else {
              inputNode.setAttribute("placeholder", "enter " + dataItem["name"]);
            }

            if(dataItem["attributes"]) {
              for(var attr in dataItem["attributes"]) {
                inputNode.setAttribute(attr, dataItem["attributes"][attr]);
              }
            }

            containerNode.appendChild(inputNode);
          }

        } else if (dataItem["type"] === "Boolean") {

          var checkboxContainer = _createNode(null, "div", "checkbox-container");
          var inputNode = _createNode(null, "input", "property-value", json["name"] + dataItem["name"] + "ID");
          inputNode.setAttribute("type", "checkbox");
          if(dataItem["default"]) {
            inputNode.checked = true;
          }
          var label = _createNode(null, "label");
          label.setAttribute("for", dataItem["name"] + "ID");

          checkboxContainer.appendChild(inputNode);
          checkboxContainer.appendChild(label);
          containerNode.appendChild(checkboxContainer);

        } else if(dataItem["type"] === "String"){

          if(dataItem["options"]){
            var spanHolder = _createNode(null, "span", "arrow");

            var selectNode = _createNode(null, "SELECT", "property-value", json["name"] + dataItem["name"] + "ID");
            selectNode.setAttribute("name", dataItem["name"]);

            var placeHolderNode = _createNode("select " + dataItem["name"], "option");
            placeHolderNode.disabled = true;
            placeHolderNode.selected = true;
            placeHolderNode.style.background = "#ecf0f1";
            selectNode.appendChild(placeHolderNode);

            var constants = dataItem["options"]["values"];
            constants.forEach(function(str){
              var strData = str.split('_');
              if(strData.length > 1) {
                strData = strData[1];
              } else {
                strData = strData[0];
              }
              var optionNode = _createNode(strData, "option");
              optionNode.setAttribute("value", str);
              if(dataItem["default"] && dataItem["default"] === str) {
                optionNode.selected = true;
              }
              selectNode.appendChild(optionNode);
            });
            spanHolder.appendChild(selectNode);
            containerNode.appendChild(spanHolder);
          }

          else if(dataItem["value"]) {
            var defaultNode = _createNode(dataItem["value"] + "(default)", "p", "property-value", json["name"] + dataItem["name"] + "ID");
            containerNode.appendChild(defaultNode);
          }

          else {
            var inputNode = _createNode(null, "input", "property-value", json["name"] + dataItem["name"] + "ID");
            inputNode.setAttribute("type", "text");
            if(dataItem["default"] !== undefined) {
              inputNode.setAttribute("placeholder", dataItem["default"]);
            } else {
              inputNode.setAttribute("placeholder", "enter " + dataItem["name"]);
            }

            containerNode.appendChild(inputNode);
          }

        } else if(dataItem["type"] === "Color"){
          var colorHolderNode = _createNode(null, "div", "colorDiv", json["name"] + dataItem["name"] + "HolderID");
          var colorNode = _createNode(null, "div", "property-value", json["name"] + dataItem["name"] + "ID");
          colorHolderNode.appendChild(colorNode);
          containerNode.appendChild(colorHolderNode);
        } else {

          if(dataItem["class"]) {
            var subData = dataItem["config"];
            var sub_properties = _createPropertiesList(subData);
            containerNode.appendChild(sub_properties);
          }
        }

        item.appendChild(containerNode);
        node.appendChild(item);
      }

    });

    return node;
  };

  var getMainfragment = function (json) {

    var dataContainer = _createNode(null, "div", "data-container");
    var propertiesBlock = _createPropertiesList(json, "data-block", "properties-block");

    var button = _createNode("submit", "button", null, "toolbarSubmitBtn");
    propertiesBlock.appendChild(button);

    dataContainer.appendChild(propertiesBlock);

    // Since the document fragment is in memory and not part of the main DOM tree, appending children to it does not
    // cause page reflow.
    var fragment = document.createDocumentFragment();
    fragment.appendChild(dataContainer);

    return fragment;
  };

  var getIndexfragment = function (json) {

    // Since the document fragment is in memory and not part of the main DOM tree, appending children to it does not
    // cause page reflow.
    var fragment = document.createDocumentFragment();

    if(json.constructor === Array) {

      json.forEach(function(item) {

        var containerNode = _createNode(null, "div", "modules-container");
        var titleNode = _createNode(item["name"], "p", "title");
        var listNode = _createListNode(item["list"]);

        containerNode.appendChild(titleNode);
        containerNode.appendChild(listNode);

        fragment.appendChild(containerNode);
      });
    }

    return fragment;
  };

  domBuilder.getMainfragment = getMainfragment;
  domBuilder.getIndexfragment = getIndexfragment;

  return domBuilder;
});