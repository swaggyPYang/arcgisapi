/**
 * This module is used to provide data from a json file
 */
define([
  "dojo/Deferred"
], function (Deferred) {

  var dataProvider = {};

  dataProvider.getJsonData = function (url, async) {

    if(async){
      // Variable declaration
      var deferred = new Deferred(),
        xhr = new XMLHttpRequest();
      //url = "resources/data/symbols/SimpleLineSymbol.json";

      /**
       * XHR stuff
       */
      xhr.open("GET", url, true); //Asynchronous request

      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            //console.log(response);
            deferred.resolve(response);
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
        deferred.reject(e);
      };
      xhr.send();

      return deferred;
    } else {
      var request = new XMLHttpRequest();
      request.open("GET", url, false);  // `false` makes the request synchronous
      request.send();

      if (request.status === 200) {
        return JSON.parse(request.responseText);
      }
    }



  };

  return dataProvider;
});