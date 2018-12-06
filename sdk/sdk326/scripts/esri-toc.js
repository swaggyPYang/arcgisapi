define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/on",
  "dojo/query"
], function (declare, lang, domClass, domConstruct, domStyle, on, domQuery){
  var toc = declare([], {
    // defaultContent is the name of the topic to highlight by default
    defaultContent: null,
    toggle: null,

    constructor: function (args){
      this.defaultContent = args.defaultContent,
        this.toggle = args.node;

      on(this.toggle, "click", lang.hitch(this, function (e){
        var current = this.toggle.innerHTML;
        // tocNode is the node to show/hide
        var tocNode = domQuery(".container_12 .grid_3")[0];
        if (current.indexOf("Hide") > -1) {
          this.hideTableOfContents(this.toggle, tocNode);
          domStyle.set(this.toggle, "marginBottom", "15px");
        }
        else if (current.indexOf("Show") > -1) {
          this.showTableOfContents(this.toggle, tocNode);
          domStyle.set(this.toggle, "marginBottom", "0px");
        }
      }));
    },

    hideTableOfContents: function (node, tocNode){
      var contentNode = domQuery(".container_12 .grid_9")[0];

      // move the node that is clicked to show/hide the TOC
      domConstruct.place(node, contentNode, "first");
      node.innerHTML = "<img src=\"../graphics/treenodeplus.gif\" alt=\"\"> Show Table of Contents";

      // modify CSS to hide the TOC and make the content div wider
      domStyle.set(tocNode, "display", "none");
      domClass.remove(contentNode, "grid_9");
      domClass.add(contentNode, "grid_12");
    },

    showTableOfContents: function (node, tocNode){
      var contentNode = domQuery(".container_12 .grid_12")[0];

      // make the content section narrow again
      domClass.add(contentNode, "grid_9");
      domClass.remove(contentNode, "grid_12");
      domStyle.set(tocNode, "display", "block");

      // move the show/hide back above the TOC
      domConstruct.place(node, tocNode, "first");
      node.innerHTML = "<img src=\"../graphics/tochide.gif\" alt=\"\"> Hide Table of Contents";
    },

    // this function should only run when the page initially loads
    highlightTopic: function (){
      // find the node in the TOC that needs to be highlighted
      var urlPieces = window.location.href.split("/");
      // check if "-amd" is in the current file name
      // if not, add it as all href's in the TOC have "-amd" at 3.6
      var className;
      if (urlPieces[urlPieces.length - 2] === "jsapi" &&
        urlPieces[urlPieces.length - 1] && !urlPieces[urlPieces.length - 1].match("-amd")) {
        className = urlPieces[urlPieces.length - 1].split(".")[0] + "-amd.html";
      }
      else {
        className = urlPieces[urlPieces.length - 1] || this.defaultContent;
      }
      // console.log("toc, class name: '", className, "'");
      var selectorString = "a[href='" + className.split("#")[0] + "']";
      // limit query to the TOC
      var tocItemNode = domQuery(selectorString, domQuery(".container_12 .grid_3")[0])[0];
      // console.log("tocItemNode from toc: ", tocItemNode, selectorString);
      if (tocItemNode) {
        // console.log("toc item node: ", tocItemNode);
        var parent = tocItemNode.parentNode.parentNode.parentNode;
        var grandParent = parent.parentNode.parentNode;
        expandCollapse(parent);
        expandCollapse(grandParent);
        // clickAnchor is defined in tree.js
        clickAnchor(tocItemNode);
        tocItemNode.scrollIntoView();
      }
    }
  });
  return toc;
});