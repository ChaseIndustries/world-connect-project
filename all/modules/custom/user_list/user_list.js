var UserList = function($){

	/* vars */
	var map,
	self = this,
	classes = {
		list:".view-list-users",
		inner:".view-inner",
		node:".views-row"
	},
	footerHeight = $("#map").height(),
	$container = $(classes.list),
	scrollPane,
	width = $(window).width();
	initmap();
	initUserNodes();
	


	/* functions */
	self.goToCurrentUser = function(){
	  $user = $(".current-user");
	  if($user.length){
	    setTimeout(function(){
  	    scrollPane.scrollTo($user.offset().left+(.5*$user.width())-(.5*width));
       },300);
  	}
  	return false;
	}
	function adjustScreen(){
		var h2 = $("window").height();
		$(".main-container").height(h2-footerHeight);
		width = $(window).width();
	}
	function initmap(){
		/* 365,222 feet in 1 degree of latitude */
		var style = [
    {
      "featureType": "landscape.man_made",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "poi",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "water",
      "stylers": [
        { "color": "#26B65F" }
      ]
    },{
      "featureType": "landscape.natural",
      "stylers": [
        { "saturation": 16 },
        { "color": "#95E2E5" },
        { "lightness": 24 }
      ]
    },{
      "featureType": "administrative",
      "stylers": [
        { "visibility": "off" }
      ]
    }];
    	var mapOptions = {
		  center: new google.maps.LatLng(0,0),
		  zoom: 4,
		 /* mapTypeId: google.maps.MapTypeId.SATELLITE,*/
		  navigationControl: false,
		  mapTypeControl: false,
		  styles: style,
		  /*disableDefaultUI: true,*/
		 scrollwheel: false
		};
		map = new google.maps.Map(document.getElementById("map"),mapOptions);
		defaultZoom = map.getZoom();
		var userLines = [];
		/*map.addListener("zoom_changed",hideOverlays);
		map.addListener("drag",hideOverlays);*/
		var lineOpts=[],userMarkers=[];
		var c = 0;
		/*var equator = new google.maps.Polyline({zIndex:1,path:[new google.maps.LatLng(0, -180),new google.maps.LatLng(0, 0),new google.maps.LatLng(0, 180)],"map":map,strokeColor:"#ff0000",strokeWeight:2,strokeOpacity:.3});*/
		/*var pm = new google.maps.Polyline({zIndex:1,path:[new google.maps.LatLng(-180, 0),new google.maps.LatLng(0, 0),new google.maps.LatLng(180, 0)],"map":map,strokeColor:"#ff0000",strokeWeight:2,strokeOpacity:.3});*/
	}
	
	function positionUsers(){
		var w = parseInt($(classes.list).find(classes.node).outerWidth());
		var n = $(classes.list).find(classes.node).length;
		var totalWidth = w*n + + parseInt($(classes.list).css("padding-left"));
		$(classes.list).find(classes.inner+":first").width(totalWidth);
		scrollPane = $(classes.list).jScrollPane({verticalGutter:8,animateScroll:true}).data('jsp');	
	}
	
	function colorUsers(){
  	$.each(user_data,function(i,v){
    	var uid = v.uid, 
    	attributes = {};
    	//loop through fields
      $.each(v, function(key,field){
        if(key.indexOf("field_") != -1){
          if(typeof(field["und"]) == "object"){
            if(typeof(field["und"][0]["rgb"]) == "string"){
              attributes[key] = field["und"][0]["rgb"];
            }
          }
        }
      });
    	var el = $(".person[rel='"+uid+"']"),
    	image = el.find(".person__svg").get(0);
    	el.addClass("visible");
    	image.addEventListener("load", function(){
/*
    	  var svgDoc = image.contentDocument;
    	  $.each(attributes, function(i, attribute){
    	    if(attribute){
    	      var sect = svgDoc.getElementById(i);
            $(sect).attr("fill",attribute).children().attr("fill",attribute);
          }
    	  });
*/
    	  el.addClass("visible");
    	});
  	});
	} 
	 
	function initUserNodes(){
		//  find width of the nodes
		adjustScreen();
		positionUsers();
		colorUsers();
		
		var armSpan = 5.5 /* in feet */, userLines = [],startPoint=0,endPoint=0;
		var armSpanMiles = armSpan/365222;
		
		if(typeof(user_data) == "undefined" || !$("#map").length || typeof(google) == "undefined"){ 
		  console.log("Something went wrong"); 
		  return false;
		}
		var geocoder = new google.maps.Geocoder();
		for(var i in user_data){
		 //stopgap because of google maps api request limit
		  //if(i > 5){ continue; }
		  //
			var user = user_data[i];
      function drawConnectingLine(latlng){
  			//draw connecting line
					var lon = latlng.lng();
					var lineSymbol = {
					  path: 'M 0,-1 0,1',
					  strokeOpacity: 1,
					  strokeWeight:1,
					  scale: 3
					};
					var connectLineCap = new google.maps.Marker({position:latlng,map:map,icon:theme_dir+"/images/dot.png"});
					var lineCoordinates = [latlng,new google.maps.LatLng(0,endPoint)];
					var connectLine = new google.maps.Polyline({
						  path: lineCoordinates,
						  strokeOpacity: 0,
						  strokeColor:"#fff",
						  zIndex:2,
						  icons: [{
							icon: lineSymbol,
							offset: '0',
							repeat: '10px'
						  }],
						  map: map
					});
			}
      if(!user["location_latitude"] || !user["location_longitude"]){
        continue;
        var city = user["field_field_city"][0]["raw"]["value"];
        var country = user["field_field_country"][0]["raw"]["value"];
        var address = city+ " , " + country;
        //geocode to find coords
        geocoder.geocode({location:c},function(coords,status){
				  //if any results
				  if (status == google.maps.GeocoderStatus.OK) {
					  var latlng = coords[0].geometry.location;
					  drawConnectingLine(latlng);
          }
        }) /* geocoder  */
      } else {
        var latlng = new google.maps.LatLng(user["location_latitude"],user["location_longitude"]);
        drawConnectingLine(latlng);
      }
			endPoint += armSpanMiles;
		} /* for i in user_data */
		var startLatlng = new google.maps.LatLng(0,startPoint);
		var endLatlng = new google.maps.LatLng(0,endPoint);
		var lineOpts =  {zIndex:2,geodesic:true,lineLength:endPoint,path:[startLatlng,endLatlng],strokeColor:"#ff0000",map:map,strokeWeight:1,strokeOpacity:1};
		var line = new google.maps.Polyline(lineOpts);
		//var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(-9/365220,startPoint),new google.maps.LatLng((-9+h)/365220,endPoint));
		//create an options object
		//create line from origin to center of equator line (ie connection)	
	} /* initUserNodes */
}
window.onload = function(){
	var $ = jQuery.noConflict();
	if(typeof(user_data)=="undefined"){
  	console.log("Did not get user data!");
  	return false;
	}
	var user_list = new UserList($);
	user_list.goToCurrentUser();
}

