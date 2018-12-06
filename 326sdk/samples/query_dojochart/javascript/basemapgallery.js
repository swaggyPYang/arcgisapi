 dojo.require("esri.dijit.BasemapGallery");
 dojo.require("dijit.TitlePane");
/*
<div style="position:absolute; right:20px; top:10px; z-Index:999;">
  <div dojoType="dijit.TitlePane" title="Switch Basemap" closable="false"  open="false">
  <div dojoType="dijit.layout.ContentPane" style="width:380px; height:280px; overflow:auto;">
  <div id="basemapGallery" ></div></div>
  </div>
</div>

*/
function addBasemapGallery(map) {


   var cp = new dijit.layout.ContentPane({
      style:"width:380px;height:280px;overflow:auto;",
      id:'basemapGallery'
    });

    //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
    var basemapGallery = new esri.dijit.BasemapGallery({
      showArcGISBasemaps: true,
      bingMapsKey: 'Ah29HpXlpKwqVbjHzm6mlwMwgw69CYjaMIiW_YOdfTEMFvMr5SNiltLpYAcIocsi',
      map: map
    },"basemapGallery");
    cp.setContent(basemapGallery.domNode);
    
    var titlePane = new dijit.TitlePane({
      title:'Switch Basemap',
      closeable:false,
      open:false,
      style:"position:absolute;right:20px;top:10px;z-index:999;"
    });

    titlePane.setContent(cp);
    
    titlePane.placeAt(map.root,"last");
    basemapGallery.startup();
    
    dojo.connect(basemapGallery, "onError", function(msg) {console.log(msg);});
  }
