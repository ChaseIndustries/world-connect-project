var UserList = function($){

	/* vars */
	var map,
	classes = {
		list:($(".view-list-users.view-display-id-logged_in").length ? ".view-list-users.view-display-id-logged_in":".view-list-users.view-display-id-logged_out"),
		inner:".view-inner",
		node:".views-row"
	},
	footerHeight = $("#map").height(),
	$container = $(classes.list),
	scrollPane,
	width = $(window).width();
	initmap();
	initUserNodes();
	
	/* listeners */
	$(classes.node).hover(function(){
  	$(this).find(".person-wrapper").addClass("active");
	}, function(){
	  if(!$(this).hasClass("current-user")){
  	  $(this).find(".person-wrapper").removeClass("active");
	  }
	})
	/**
	 * Scroll the main list sideways instead of vertical
	 **/
	 $container.mousewheel(function(e,delta){
 	   //scrollPane.scrollByX(-delta*100);
		 scrollPane.scrollByX(-delta*8);
		 e.preventDefault();
	 })
	 $(".fields").mousewheel(function(e){
  	 e.stopPropagation();
	 })

	/* functions */
	this.goToCurrentUser = function(){
	  $user = $(".current-user");
	  if($user.length){
	  setTimeout(function(){
  	   scrollPane.scrollTo($user.offset().left+(.5*$user.width())-(.5*width));
	  },300)
  	 
  	}
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
		    featureType: "all",
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },
		  {
		    featureType: "road",
		    elementType: "all",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },
		  {featureType:"landscape",
		  elementType:"all",
		  stylers:[{hue:70}]
		  }  ,
		  {featureType:"all",
		  elementType:"all",
		  stylers:[{lightness:-20}]
		  },
		    {featureType:"water",
		  elementType:"all",
		  stylers:[{lightness:80}]
		  }
		]
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
		var w = parseInt($(classes.list).find(classes.node).outerWidth())// + parseInt($(classes.node).css("margin-left"));
		var n = $(classes.list).find(classes.node).length;
		var totalWidth = w*n;
		$(classes.list).find(classes.inner+":first").width(totalWidth);
		scrollPane = $(classes.list).jScrollPane({verticalGutter:8,animateScroll:true}).data('jsp');	
	}
	function initUserNodes(){
		/*  find width of the nodes */
		adjustScreen();
		positionUsers();
		
		var armSpan = 6 /* in feet */, userLines = [],startPoint=0,endPoint=0;
		var armSpanMiles = armSpan/365222;
		
		if(typeof(user_data) == "undefined"){ return false; }
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
  	//console.log(user_data);
  	throw("Did not get user data!")
	}
	var user_list = new UserList($);
	user_list.goToCurrentUser();
}

