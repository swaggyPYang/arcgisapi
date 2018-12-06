require([
  "dojo/on",
  "dojo/dom",
  "dojo/query",
  "js/esri-toc",
  "js/esri-content-manager",
  "js/esri-kidney",
  "dojo/domReady!"
], function(
  on, dom, query, TOC, ContentManager, Kidney
) {
  // prettify any code snippets
  prettyPrint();

  var toc = new TOC({
    defaultContent: ".",
    node: dom.byId("toggleToc")
  });
  toc.highlightTopic();

  var manager = new ContentManager({
    toc: toc,
    tocId: "apiToc",
    topicBasePath: "",
    topicPaneId: "topicPane"
  });
  manager.start();

  // auto-complete box for API class
  // will also search entire API ref once the search index is built
  //
  // only create the auto-complete box is classList is available
  // console.log("input", query("#primarySearch input[type=search]")[0]);
  if ( typeof classList !== "undefined" && query(".site-search-form")[0]) {
    var kidney = new Kidney({
      baseUrl: "",
      // classList is defined in classList.js
      // and it is an array of strings, one string for each class in the API
      classList: classList,
      form: query(".site-search-form")[0],
      input: query(".site-search form input[type=search]")[0]
    });
  }

  // look for relative link in the page
  // usually the browser would handle this for us...
  // but since the Content Manager explicitly sets the height
  // for the TOC and content areas, the page gets scrolled to the top
  //
  // find the node with the page referenced in the URL
  // and scroll to it
  //
  // should explore hiding the entire page until after this JS runs
  // to avoid the content bouncing around while the page loads
  var hash = window.location.href.split("#");
  if ( hash.length > 1 ) {
    hash = hash[1];
    var selector = "a#" + hash;
    var node = query(selector);
    if ( node.length ) {
      node[0].scrollIntoView();
    }
  }

  // resize toc and content sections as the window resizes
  on(window, "resize", manager.setContentHeight);

  // tailcoat, handles "drawer" on narrow screens and
  // expanding/shrinking of the search box
  T.init();
});
