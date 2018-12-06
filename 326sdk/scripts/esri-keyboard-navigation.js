require([
  "dojo/on",
  "dojo/topic"
], function (on, topic){

  topic.subscribe("keyboard:mousetrap", function (options){
    var key = options.event.key;
    var keyCombination = options.combination;
    var navigation = options.navigation;

    var sectionTestRegEx = /js(samples|api|help)(?=\/)/i;
    if (sectionTestRegEx.test(document.location.href)) {
      navigation = {
        "h": "../index.html",
        "g": "../jshelp/index.html",
        "a": "../jsapi/index.html",
        "s": "../jssamples/index.html"
      };
    }
    else {
      navigation = {
        "h": "./index.html",
        "g": "./jshelp/index.html",
        "a": "./jsapi/index.html",
        "s": "./jssamples/index.html"
      };
    }
    var siteSearchElement = document.querySelector(".site-search-input");

    // --------------------------------------------------------------------
    // Polyfill for MouseEvent in Internet Explorer 9 and above
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent#Polyfill
    // --------------------------------------------------------------------
    if (typeof MouseEvent !== "function") {
      (function (window) {
        // Polyfills DOM4 MouseEvent

        var MouseEvent = function (eventType, params) {
          params = params || { bubbles: false, cancelable: false };
          var mouseEvent = document.createEvent('MouseEvent');
          mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

          return mouseEvent;
        };

        MouseEvent.prototype = Event.prototype;

        window.MouseEvent = MouseEvent;
      })(window);
    }

    // --------------------------------------------------------------------
    // --------------------------------------------------------------------
    // Position the modal dialog window for the shortcuts
    // --------------------------------------------------------------------
    // --------------------------------------------------------------------
    /**
     * Positions the modal dialog window for the keyboard shortcuts by
     * calculating the width and height of the modal window and comparing
     * that to the viewport width and height. The top and left pixel
     * location is determined by comparing the two widths and heights.
     */
    function resizeKeyboardShortcutsModalWindow(){
      var keyboardShortcutsModal = document.querySelector(".js-keyboard-shortcuts-modal");
      keyboardShortcutsModal.setAttribute("style", "");

      if (/\/javascript\/3(\/jshelp)?\/index\.html/.test(document.location.pathname)) {
        if (!document.querySelector(".js-keyboard-mappings-second-div").classList.contains("hidden")) {
          document.querySelector(".js-keyboard-mappings-second-div").classList.toggle("hidden");
        }
        document.querySelector(".js-keyboard-mappings-first-div").classList.remove("column-12");
        document.querySelector(".js-keyboard-shortcuts-modal").setAttribute("style", "width:40%");
      }

      var modalWidth = keyboardShortcutsModal.clientWidth;
      var modalHeight = keyboardShortcutsModal.clientHeight;
      var modalWindowTop = (window.innerHeight - modalHeight) / 2 + "px";
      var modalWindowLeft = (window.innerWidth - modalWidth) / 2 + "px";
      keyboardShortcutsModal.style.top =  modalWindowTop;
      keyboardShortcutsModal.style.left = modalWindowLeft;
    }

    /**
     * Helper function to return the id of the element for the API Reference
     * summary table elements.
     *
     * @param keyValue The keyboard shortcut defining the summary section.
     */
    function navigateToAPIReferenceSummarySection(keyValue){
      "use strict";

      var apiReferenceSummarySectionsDict = {
        "c": "constructors",
        "p": "properties",
        "m": "methods",
        "e": "events"
      };
      var summaryElement = document.getElementById(apiReferenceSummarySectionsDict[keyValue]);
      if (summaryElement) {
        // scroll the given summary table into the window view
        summaryElement.scrollIntoView();
      }
    }

    // --------------------------------------------------------------------
    //
    // --------------------------------------------------------------------
    on(window, "resize", resizeKeyboardShortcutsModalWindow);

    if (key === "?") {
      // Show the help
      if (typeof MouseEvent === "function") {
        var modalOpenElementTarget = document.querySelector(".js-keyboard-shortcuts");
        var modalOpenMouseEvent = new MouseEvent("click", {bubbles: true, cancelable: false, view: window});
        if (modalOpenMouseEvent) {
          modalOpenElementTarget.dispatchEvent(modalOpenMouseEvent);
          resizeKeyboardShortcutsModalWindow();
        }
      }
    } else if (/(escape|esc)/i.test(key) && keyCombination === "esc") {
      if (typeof MouseEvent === "function") {
        var modalCloseElementTarget = document.querySelector(".js-modal-dismiss");
        var modalCloseMouseEvent = new MouseEvent("click", {bubbles: true, cancelable: false, view: window});
        if (modalCloseMouseEvent) {
          modalCloseElementTarget.dispatchEvent(modalCloseMouseEvent);
        }
      }
    } else if (key === "t" && keyCombination === "g t") {
      // Go to the top of the page
      // window.scrollTo(0,0);
      document.querySelector(".js-scroll-to-top").scrollIntoView();
    } else if (key === "b" && keyCombination === "g b") {
      // Go to the bottom of the page
      document.getElementById("wh_footer").scrollIntoView();
    } else if (key === "h" && keyCombination === "g h") {
      // Go to the Home page
      document.location = navigation.h;
    } else if (key === "g" && keyCombination === "g g") {
      // Go to the Guide page
      document.location = navigation.g;
    } else if (key === "a" && keyCombination === "g a") {
      // Go to the API Reference page
      document.location = navigation.a;
    } else if (key === "s" && keyCombination === "g s") {
      // Go to the Sample Code page
      document.location = navigation.s;
    } else if (key === "/") {
      // Focus the search input for API Reference or Sample Code
      // prevent the keyboard action from populating the search input with the forward slash (/)
      options.event.preventDefault();
      if (siteSearchElement) {
        siteSearchElement.value = "";
        siteSearchElement.focus();
      }
    } else if (key === "c") {
      // Go the API Reference Constructors summary section
      navigateToAPIReferenceSummarySection(key);
    } else if (key === "p") {
      // Go the API Reference Properties summary section
      navigateToAPIReferenceSummarySection(key);
    } else if (key === "m") {
      // Go the API Reference Methods summary section
      navigateToAPIReferenceSummarySection(key);
    } else if (key === "e") {
      // Go the API Reference Events summary section
      navigateToAPIReferenceSummarySection(key);
    } else if (key === "s" && keyCombination === "e s") {
      // Launch the Sandbox in another window
      var sandboxTargetURL = document.querySelector(".js-btn-sample-code-sandbox").href;
      if (sandboxTargetURL) {
        document.location = sandboxTargetURL;
      }
    } else if (key === "s") {
      // Open the sample in CodePen or JS Bin in another window
      if (typeof MouseEvent === "function") {
        var sampleCodeShareMouseEvent = new MouseEvent("click", { bubbles: true, cancelable: false, view: window });
        var sampleCodeShareElementTarget = document.querySelector(".js-btn-jsshare");
        if (sampleCodeShareMouseEvent) {
          sampleCodeShareElementTarget.dispatchEvent(sampleCodeShareMouseEvent);
        }
      }
    } else if (key === "l" && keyCombination === "v l") {
      // View the live sample in another window
      var viewLiveTarget = document.querySelector(".js-btn-sample-code-view-live").href;
      window.open(viewLiveTarget);
    } else if (key === "d" && keyCombination === "d") {
      var downloadTarget = document.querySelector(".js-btn-sample-code-download").href;
      window.open(downloadTarget);
    }
  });
});
