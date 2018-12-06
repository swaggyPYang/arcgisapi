define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/dom-geometry",
  "dojo/query",
  "dojo/string",
  "dojo/_base/array",
  "dojo/has"
], function (declare, lang, on, dom, domStyle, domClass, domConstruct, domGeom, domQuery, string, arr, has){
  return declare([], {
    // instance properties
    rootNode: null,
    openCategory: null,
    toggle: null,
    top: null,
    router: null,

    constructor: function (args){
      this.rootNode = args.rootNode;
      this.toggle = args.toggle;
      this.router = args.router;

      // make sure that "this" references the instance of this class
      // when these methods run using lang.hitch
      this.categoryClick = lang.hitch(this, this.categoryClick);
      this.configure = lang.hitch(this, this.configure);

      // set up event listener to hide the TOC
      // use hitch to ensure "this" refers to the TOC
      // and not the toggle element
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
      if (isSamplesDebug) {
        console.log("hideTableOfContents");
      }
      var contentNode = domQuery(".container_12 .grid_9")[0];

      // move the node that is clicked to show/hide the TOC
      domConstruct.place(node, contentNode, "first");
      node.innerHTML = "<img src=\"../graphics/treenodeplus.gif\" alt=\"\"> Show Table of Contents";

      // modify CSS to hide the TOC and make the content div wider
      domStyle.set(tocNode, "display", "none");
      domClass.add(contentNode, "grid_12");
      domClass.remove(contentNode, "grid_9");
    },

    showTableOfContents: function (node, tocNode){
      if (isSamplesDebug) {
        console.log("showTableOfContents");
      }
      var contentNode = domQuery(".container_12 .grid_12")[2];

      // make the content section narrow again
      domClass.add(contentNode, "grid_9");
      domClass.remove(contentNode, "grid_12");
      domStyle.set(tocNode, "display", "block");

      // move the show/hide back above the TOC
      domConstruct.place(node, tocNode, "first");
      node.innerHTML = "<img src=\"../graphics/tochide.gif\" alt=\"\"> Hide Table of Contents";
    },

    // this function only runs when the page initially loads
    configure: function (){
      // expand/collapse the TOC categories as appropriate
      on(this.rootNode, "click", this.categoryClick);

      // check if we need to open a category
      var hash = window.location.hash;
      if (hash.length > 1) {
        if (isSamplesDebug) {
          console.log("hash present...select a category");
        }
      }
      else {
        return;
      }

      // find the node that needs to be opened
      var category = hash.split("#")[1].toLowerCase();
      var categoryNode = this.findCategoryNode(category);
      if (isSamplesDebug) {
        console.log("cat node: ", categoryNode);
      }
      if (categoryNode) {
        // var parent = categoryNode.parentNode.parentNode.parentNode;
        // var grandParent = parent.parentNode.parentNode;
        if (isSamplesDebug) {
          console.log("parent, gp: ", parent, grandParent);
        }
        expandCollapse(categoryNode);
        // expandCollapse(grandParent);
        // clickAnchor is defined in tree.js
        clickAnchor(categoryNode);

        categoryNode.scrollIntoView();

        // look for span.category nodes in the categoryNode
        // if there's only one, the categoryNode is a category in the TOC
        var parentIsCategory = domQuery("span.category", categoryNode);
        if (parentIsCategory.length === 1) {
          this._setOpenCategory(categoryNode);
        }
      }

      // keep track of top position to respond to scrolling
      var node = this.rootNode.parentNode;
      this.top = domGeom.getMarginBox(node).t;
      // firefox returning zero for top for some reason...
      if (has("ff")) {
        this.top += 140;
      }
    },

    categoryClick: function (e){
      if (isSamplesDebug) {
        console.log("cat click, open category: ", this.openCategory);
      }
      // check that a category name or an arrow 
      // next to a category name was clicked
      var isCategory = domClass.contains(e.target, "category");
      var isCategoryIcon = domClass.contains(e.target, "treeLinkImage");
      if (!isCategory && !isCategoryIcon) {
        return;
      }

      if (isCategoryIcon) {
        // clicked an icon, find the closest span.category
        // and set that to the event's target
        var catNode = domQuery("span.category", e.target.parentNode)[0];
        delete e.target;
        e.target = catNode;
      }

      // e.target is now the <span> with the category name

      // expand or collapse the node
      this.selectCategory(e.target.parentNode);

      // only change the URL when a new category is clicked
      var cat = this.formatCategory(e.target.innerHTML);
      var current = window.location.hash;
      var next = "#" + cat;
      if (isSamplesDebug) {
        console.log("cur and next: ", current, next);
      }
      if (current !== next) {
        // this.router.go("category/" + cat);
        window.location.hash = next;
        if (isSamplesDebug) {
          console.log("updated hash to: ", next);
        }
      }
    },

    clearSelection: function (){
      if (isSamplesDebug) {
        console.log("clearSelection");
      }
      // remove highlight from selected element
      var sel = domQuery(".treeSelected", dom.byId("samplesToc"));
      if (sel.length > 0) {
        domClass.remove(sel[0], "treeSelected");
        domClass.add(sel[0], "treeUnselected");
      }
    },

    findCategoryNode: function (category){
      if (isSamplesDebug) {
        console.log("findCategoryNode", category);
      }
      category = string.trim(category);
      var categoryNodes = domQuery("span.category", this.rootNode);
      var node = arr.filter(categoryNodes, function (n){
        // console.log("compare: ", this.formatCategory(n.innerHTML), category)
        return this.formatCategory(n.innerHTML) === category;
      }, this);
      return node[0].parentNode;
    },

    // remove leading and trailing whitespace
    // replace all spaces between words with underscores
    // string is dojo/string
    formatCategory: function (c){
      var formatted = string.trim(c).toLowerCase().replace(/ /g, "_").replace(/\./g, "_");
      return formatted;
    },

    // change window position to show the category name at the top
    // ...not currently used, kind of a wonky UX
    scrollToCategory: function (){
      // var mb = domGeom.getMarginBox(this.openCategory);
      // // console.log("geom: ", mb);
      // window.scrollTo(0, mb.t);
      this.openCategory.scrollIntoView();
    },

    // name can be a dom node or a string representing a category
    selectCategory: function (category){
      if (isSamplesDebug) {
        console.log("select cat: ", category);
      }
      this.clearSelection();
      if (typeof category === "string") {
        // find the category's node then expand it
        var categoryNode = this.findCategoryNode(category);
        if (isSamplesDebug) {
          console.log("\tselect, catNode, this.open: ", categoryNode, this.openCategory);
        }
        if (categoryNode === this.openCategory) {
          // appropriate node is already selected
          return;
        }
        expandCollapse(this.openCategory);
        this._setOpenCategory(categoryNode);
        expandCollapse(this.openCategory);
        return;
      }

      // if there isn't an open category
      // set the clicked category as the open category
      // and open it then return
      if (!this.openCategory) {
        this._setOpenCategory(category);
        expandCollapse(this.openCategory);
        // this.scrollToCategory();
        return;
      }

      if (this.openCategory && this.openCategory !== category) {
        if (isSamplesDebug) {
          console.log("new category, not the same category");
        }
        // new category clicked
        // collapse the previously selected category
        expandCollapse(this.openCategory);
        this._setOpenCategory(category);
        expandCollapse(this.openCategory);
        // this.scrollToCategory();
      }
      else if (this.openCategory === category) {
        // clicked the same category
        // close it and set the open category to null
        expandCollapse(this.openCategory);
        this._setOpenCategory(null);
      }
    },

    _setOpenCategory: function (node){
      if (isSamplesDebug) {
        console.log("_setOpenCategory", node);
      }
      this.openCategory = node;
    }
  });
});