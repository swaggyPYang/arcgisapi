require([
  "dojo/on", 
  "dojo/dom", 
  "js/esri-toc", 
  "js/esri-content-manager",
  "dojo/domReady!"
], function(
  on, dom, TOC, ContentManager
) {
  // prettify any code snippets
  prettyPrint();
  
  // create the TOC content pane
  var toc = new TOC({
    defaultContent: ".",
    node: dom.byId("toggleToc")
  });
  toc.highlightTopic();

  var manager = new ContentManager({
    toc: toc,
    tocId: "conceptsToc",
    topicBasePath: "",
    topicPaneId: "topicPane",
    defaultTopic: "overview_api"
  });
  manager.start();

  // resize toc and content sections as the window resizes
  on(window, "resize", manager.setContentHeight);
  
  // tailcoat, handles "drawer" on narrow screens and 
  // expanding/shrinking of the search box
  T.init();
});