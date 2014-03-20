$(document).ready(function() {
    //Button Function Bindings
    var updateMarkerBtn = $("#updateMarkerBtn");
    updateMarkerBtn.click(function() {
        var lonVal = parseFloat($("#lonId").val());
        var latVal = parseFloat($("#latId").val());
        updateMarker(lonVal, latVal, true);
    });
    
    var clearMarkersBtn = $("#clearMarkersBtn");
    clearMarkersBtn.click(function() {
       clearMarkers(); 
    });

    //Open Layers implementation
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },
    
        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            ); 
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            );
        }, 
    
        trigger: function(e) {
            var lonlat = map.getLonLatFromPixel(e.xy);
            /*alert("You clicked near " + lonlat.lat + " N, " +
                                      + lonlat.lon + " E");*/
            updateMarker(lonlat.lon, lonlat.lat, false);
            
        }
    
    });
    
    var map = new OpenLayers.Map("demoMap");
    map.addLayer(new OpenLayers.Layer.OSM());
    map.zoomToMaxExtent();
    map.addControl(new OpenLayers.Control.PanZoomBar);
    map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
    map.addControl(new OpenLayers.Control.MousePosition({
        prefix: '<a target="_blank" ' +
        'href="http://spatialreference.org/ref/epsg/4326/">' +
        'EPSG:4326</a> coordinates: '
        }
    ));
    //TODO: below can be consolidated
    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

    var mapMarkers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(mapMarkers);

    updateMarker = function(lon, lat, transform) {
        
        var size = new OpenLayers.Size(21.25);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon('js/img/marker.png', size, offset); 
        var lonLat;
        
        if (typeof(transform) !== "boolean") {
            throw "Transform argument must be typeof boolean."
        }
        else {
            if (transform) {
                lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")); // to Spherical Mercator
            }
            else {
                lonLat = new OpenLayers.LonLat(lon, lat);
            }    
        }
        
        var marker = new OpenLayers.Marker(lonLat, icon);
        
        console.log(lon, lat);
        console.log(lonLat);
        console.log(marker);
        mapMarkers.addMarker(marker);
    }
    
    clearMarkers = function() {
        var totalMarkers = mapMarkers.markers.length;
        var i = mapMarkers.markers.length;
        while (i--) {
            mapMarkers.removeMarker(mapMarkers.markers[i]);
        }
    }
});
