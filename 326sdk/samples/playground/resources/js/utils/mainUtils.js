/**
 * This module is used to provide utility functions for main.js
 */
define([
  "./resources/js/utils/CurrentState.js",
  "./resources/js/utils/DataProvider.js",
  "./resources/js/utils/Initializer.js",
  "./resources/js/utils/ObjectProvider.js",
  "./resources/js/utils/CodeGenerator.js"
], function (
             CurrentState, DataProvider, Initializer, ObjectProvider, CodeGenerator) {

  var mainUtils = {};

  // parse the config and add the config data of other classes if required using recursion
  var parseConfig = function (url) {
    var json = DataProvider.getJsonData(url);
    if (json["type"] === "class" && CurrentState.required.reqModules.indexOf('\t"' + json["path"] + '"') < 0) {
      CurrentState.required.reqModules.push('\t"' + json["path"] + '"');
      CurrentState.required.commentReqModules.push("// " + json["path"]);
      CurrentState.required.reqVariables.push(json["variable"]);
    }

    // If there is a base class for this, then push the methods and properties of base class to this class
    if (json["baseClass"]) {
      var baseJsonUrl = "resources/data/" + json["baseLocation"];
      var baseJson = parseConfig(baseJsonUrl);

      baseJson["properties"].forEach(function (property) {

        if (property["defaults"]) {
          property["defaults"].forEach(function (defaultVal) {
            if (defaultVal["name"] === json["name"]) {
              property["default"] = defaultVal["value"];
            }
          })
        }

        var removeProps = json["removeProperties"];

        if (removeProps) {
          if (removeProps.indexOf(property["name"]) === -1) {
            json["properties"].push(property);
          }
        } else {
          json["properties"].push(property);
        }
      });
      baseJson["methods"].forEach(function (method) {
        var removeMethods = json["removeMethods"];
        if (removeMethods) {
          if (removeMethods.indexOf(method["name"]) === -1) {
            json["methods"].push(method);
          }
        } else {
          json["methods"].push(method);
        }

      });
    }

    if (json["constructorArgs"]) {
      var constructorArgs = json["constructorArgs"];

      // check if the property is constructor arg and return index
      var _isConstructorArg = function (propName) {
        for (var index = 0; index < constructorArgs.length; index++) {
          if (constructorArgs[index] === propName) {
            return index;
          }
        }
        return -1;
      };

      // add constructorArg property
      json["properties"].forEach(function (property) {
        var pos = _isConstructorArg(property["name"]);
        if (pos > -1) {
          property["constructorArg"] = true;
          property["constructorArgPos"] = pos;
        } else {
          property["constructorArg"] = false;
          property["constructorArgPos"] = constructorArgs.length;
        }
      });

      // sort properties
      json["properties"].sort(function (a, b) {
        return +(a.constructorArgPos > b.constructorArgPos) || +(a.constructorArgPos === b.constructorArgPos) - 1;
      });

    }

    // get nested jsons
    json["properties"].forEach(function (property) {
      if (property["class"]) {
        if (property["location"]) {
          var inner_url = "resources/data/" + property["location"];
          var nestedData = parseConfig(inner_url);
          property.config = nestedData;
        }
      }
    });

    return json;
  };

  var copyObjValues = function (stateObj, obj) {
    for (var prop in obj) {
      if (obj[prop] instanceof Object && !(obj[prop] instanceof Array)) {
        copyObjValues(stateObj[prop], obj[prop]);
      } else {
        if (obj[prop] && prop !== "className") {
          stateObj.set(prop, obj[prop]);
        }
      }
    }
  };

  var enableObjWatch = function(configData, obj) {

    for(var prop in obj) {
      if(obj[prop] instanceof ObjectProvider.StatefulClass){
        enableObjWatch(configData, obj[prop]);
      }
    }

    //console.log("enabling knights watch .......");

    var handler = obj.watch(function (name, oldValue, value) {

      var property = CodeGenerator.getProperty(configData, obj["className"], name);
      if(property.constructorArg){
        //console.log("constructor arg changed...");

        /*if(oldValue !== null && (value === "" || value === null)) {
         currentAST = CodeGenerator.modifyASTConstructor(configData, currentAST, statefulObject);
         } else {*/
        //currentAST = CodeGenerator.addArgToASTConstructor(currentAST, configData, [property], statefulObject);
        CurrentState.ast = CodeGenerator.addASTProperty(CurrentState.ast, configData["variable"], configData["methods"], property, CurrentState.statefulObject);
        /*}*/
      } else{
        //console.log("property changed...");
        //currentAST = CodeGenerator.modifyAST(configData, currentAST, statefulObject);
        CurrentState.ast = CodeGenerator.addASTProperty(CurrentState.ast, configData["variable"], configData["methods"], property, CurrentState.statefulObject);
      }
      var code = CodeGenerator.generateCode(CurrentState.ast);

      localStorage.setItem("statefulObject", JSON.stringify(CurrentState.statefulObject));
      Initializer.displayCode(CurrentState.required.commentReqModules.join("\n") + "\n\n" + js_beautify(code));
    });

    CurrentState.objWatchHandlers.push(handler);
  };


  mainUtils.parseConfig = parseConfig;
  mainUtils.copyObjValues = copyObjValues;
  mainUtils.enableObjWatch = enableObjWatch;

  return mainUtils;

});