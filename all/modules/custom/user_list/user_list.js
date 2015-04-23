var UserList = function($, user_data){

	/* properties */
	self = this;
  
  /* vars */
  var map,
	classes = {
		list:".view-list-users",
		inner:".view-inner",
		node:".person",
	},
	markers = [],
	footerHeight,
	personWidth,
	$container = $(classes.list),
	slickSettings = {
  		swipeToSlide   : true,
  		focusOnSelect  : true,
  		infinite       : false,
  		centerMode     : true,
  		arrows         : false,
      slidesToScroll : 1
  },
  mapSettings = {
		  zoom: 4,
		 /* mapTypeId: google.maps.MapTypeId.SATELLITE,*/
		  navigationControl: false,
		  mapTypeControl: false,
		  /*disableDefaultUI: true,*/
		 scrollwheel: false
		},
  width,
  scrollPane,
	requests = {},
	mapCenter,
  origSettings,
  user_data = user_data || false;
  self.pageNum = 1;
  
  setVariables();
	initmap();
	initUserNodes(user_data);
	
  $('.view-more').on('click', function(){
    if(!$(this).hasClass("disabled")){
      self.fetchNextUsers(self.itemsPerPage, self.pageNum);
    }
  });
  
  /* methods */
  
  self.fetchNextUsers = function(itemsPerPage, pageNum){
    if(requests.fetchNextUsers){ requests.fetchNextUsers = false; }
      if(scrollPane){
        //go to last slide before doing anyhthing
        scrollPane.slick("slickGoTo", $(classes.node).length - 1);
      }
      //stagger load (for visual cue)
      var delay = 100;
      $(".view-more").addClass("faded").css("margin-left",itemsPerPage * personWidth);        
        //create dummy rows to indicate the ajax call has started
        for(var i = 0; i < itemsPerPage; i++){
          var removeFade = function(index){
            setTimeout(function(){ 
              scrollPane.slick('slickAdd','<div class="views-row"><div class="fade person new"><img src="sites/all/themes/wcp/images/loader.svg" class="person__loader"></div></div>', $(classes.node).length - 1);
              scrollPane.on('reInit', function(){
                $(".person.new:eq("+index+")").removeClass('fade');
              })
            }, index * delay);
          }
          removeFade(i);
        }
        
        var curPage = pageNum;
        //increment pagenum
        self.pageNum++;
        setTimeout(function(){
          requests.fetchNextUsers = $.get('/ajax/nextusers/' + curPage + "/" + itemsPerPage, function(result){
            if(result.accounts.length) {
              var accounts = result.accounts;
              if(result.totalItems - $(classes.node).length <= 0){
                $(".view-more").addClass("disabled");
              }
              if(user_data){
                //merge old user_data with this one
                user_data = $.extend(user_data,accounts);
              } else {
                user_data = accounts;
              }
              var count = 0;
              var initial = $(".person.inital").length ? 0 : $(".person.new:first").parent().index(".views-row");
  
              for(var i = initial; count < accounts.length ; i++){ //-1 to account for view-more button
                account = accounts[count];
                var slide = $('.slick-slide[data-slick-index='+i+']');
                slide.empty().append(account.html).find(".person").removeClass("new").addClass("visible");
                count++;
              }
              
              $(".view-more").css("margin-left","").removeClass("faded");
              initUserNodes(accounts);
            }
          }, 'json');
      }, itemsPerPage * delay);
      return false;
  }

  self.fetchPrevUsers = function(itemsPerPage, pageNum){
    
    if(requests.fetchPrevUsers){ requests.fetchPrevUsers = false; }
      $(".view-more").addClass("faded").css("margin-left",itemsPerPage * personWidth);
      setTimeout(function(){  
        
        //create dummy rows to indicate the ajax call has started
        for(var i = 0; i < itemsPerPage; i++){
          scrollPane.slick('slickAdd','<div class="views-row person"><img src="sites/all/themes/wcp/images/loader.svg" class="person__loader"></div>', true);
        }
        
        var curPage = pageNum;
        
        //incriment pagenum
        self.pageNum++;
        
        requests.fetchPrevUsers = $.get('/ajax/prevusers/' + curPage + "/" + itemsPerPage, function(result){
          if(result.accounts.length){
            var accounts = result.accounts;    
            //merge old user_data with this one
            if(user_data){
              //merge old user_data with this one
              user_data = $.extend(user_data,accounts);
            } else {
              user_data = accounts;
            }
            
            var count = 0;
            for(var i = 0; count < accounts.length ; i++){ //-1 to account for view-more button
              account = accounts[count];
              $('.views-row[data-slick-index='+i+']').empty().append(account.html).find(".person").addClass("visible");
              count++;
            }
            $(".view-more").css("margin-left","").removeClass("faded");
            initUserNodes(accounts);
          }
        }, 'json');
      },1000);
      return false;
  }

  
  self.goToUser = function($user){
    if($user.length && scrollPane){
	    setTimeout(function(){
  	    scrollPane.slick("slickGoTo", $user.attr("data-slick-index"));
  	      $(".person").addClass("zoomed");          
  	      setTimeout(function(){
    	     $(classes.list).height($(".person").height());
    	     var personWidth = $(".person").width();
  	      },500)
  	   },300);
  	}
  	return false;
	}
  self.goToCurrentUser = function(){
	  $user = $(".current-user");
	  if($user.length){
	    self.goToUser($user);
	  }
	}
	
	/* functions */
	function adjustScreen(){
		var h2 = $("window").height();
		$(".main-container").height(h2 - footerHeight);
		width = $(window).width();
	}
	function initmap(){
		/* 365,222 feet in 1 degree of latitude */
		mapSettings.styles = [
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
    mapSettings.center = new google.maps.LatLng(0,0),
    map = new google.maps.Map(document.getElementById("map"),mapSettings);
		defaultZoom = map.getZoom();
		var userLines = [];
		map.addListener("zoom_changed",function(){
		  mapSettings.zoom = map.getZoom();
		  changeIcons();		
		});
		//map.addListener("drag",hideOverlays);
		var lineOpts=[],userMarkers=[];
		var c = 0;
		/*var equator = new google.maps.Polyline({zIndex:1,path:[new google.maps.LatLng(0, -180),new google.maps.LatLng(0, 0),new google.maps.LatLng(0, 180)],"map":map,strokeColor:"#ff0000",strokeWeight:2,strokeOpacity:.3});*/
		/*var pm = new google.maps.Polyline({zIndex:1,path:[new google.maps.LatLng(-180, 0),new google.maps.LatLng(0, 0),new google.maps.LatLng(180, 0)],"map":map,strokeColor:"#ff0000",strokeWeight:2,strokeOpacity:.3});*/
	}
	
	function setVariables(){
	  width         = $(window).width()
    personWidth   = $(".person").width();
    footerHeight  = $("#map").height();
    personWidth   = $(".person").width();
    self.itemsPerPage = Math.round(width/personWidth);   
  }
	
	function positionUsers(){
		var w = parseInt($(classes.list).find(classes.node).outerWidth());
		var n = $(classes.list).find(classes.node).length;
		setVariables();
		if(!scrollPane){
		  slickSettings.initialSlide = $(".current-user").length ? $(".current-user").index(".views-row") : 1;
		  slickSettings.slidesToShow = self.itemsPerPage;
  		scrollPane = $(classes.list).find(".view-content").slick(slickSettings);
  		scrollPane.on('afterChange', function(slick, currentSlide){
  		  var curSlide = scrollPane.slick("slickCurrentSlide");
    		if(scrollPane.slick("slickCurrentSlide") + 1 == $(classes.node).length){
      		//ajax
      		if(!requests.fetchNextUsers && !requests.fetchPrevUsers){
        		self.fetchNextUsers(self.itemsPerPage, self.pageNum);
      		}
    		}
  		});
		}
	}
	
	function changeIcons(){
  	if(prevZoom == mapSettings.zoom){
    	return false;
  	}
  	var prevZoom = mapSettings.zoom;
  	if(mapSettings.zoom > 12){
    	//show more stuff
      if(!origSettings){
        origSettings = mapSettings;
      }
      
      var newSettings = mapSettings;
      mapSettings.zoom = origSettings.zoom = mapSettings.zoom;
      mapSettings.center = map.getCenter();
      mapSettings.styles = [
      {
        "featureType": "landscape.man_made",
        "stylers": [
          { "visibility": "on" }
        ]
      },{
        "featureType": "poi",
        "stylers": [
          { "visibility": "on" }
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
          { "visibility": "on" }
        ]
      }];
      map.setOptions(newSettings);
  	} else {
    	map.setOptions(origSettings);
  	}
  	if(mapSettings.zoom == 21){
    	//change the icons
    	for(i=0;i<markers.length;i++){
    	  markers[i].setIcon(theme_dir+"/images/marker_person_1.png");
      }
      
  	} else if(prevZoom == 21){
  	      	for(i=0;i<markers.length;i++){
      	markers[i].setIcon(theme_dir+"/images/dot_"+Math.ceil(Math.random()*4)+".png");
    	};
  	}
	}
	
	function colorUsers(accounts){
  	$.each(accounts,function(i,v){
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
    	var el = $(".person[rel='"+uid+"']");
    	if(el.length){
      	image = el.find(".person__svg");
      	el.addClass("visible");
      	image.on("load", function(){
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
    	}
  	});
	} 
	 
	function initUserNodes(accounts){
		//  find width of the nodes
		adjustScreen();
		positionUsers();
		
		if(!accounts && typeof(user_data) != "undefined"){
  		accounts = user_data;
		}
		//show the users
		colorUsers(accounts);
		
		if(!accounts){
  		return false;
		}
		//remove the initial dummy row used for measuring width
    if($(".initial").length){
      $(".initial").remove();
    }
		var armSpan = 5.5 //in feet,
		userLines = [],
		startPoint=0,
		endPoint=0;
		var armSpanMiles = armSpan/365222;
		
		if(!$("#map").length || typeof(google) == "undefined"){ 
		  console.log("Something went wrong"); 
		  return false;
		}
		var geocoder = new google.maps.Geocoder();
		for(var i in accounts){
		 
		 //stopgap because of google maps api requests limit
		  //if(i > 5){ continue; }
		  //
			var user = accounts[i];
      function drawConnectingLine(latlng){
  			//draw connecting line
					var lon = latlng.lng();
					var lineSymbol = {
					  path: 'M 0,-1 0,1',
					  strokeOpacity: 1,
					  strokeWeight:1,
					  scale: 3
					};
					var connectLineCap = new google.maps.Marker({position:latlng,map:map,icon:theme_dir+"/images/dot_"+Math.ceil(Math.random()*4)+".png"});
						google.maps.event.addListener(connectLineCap, 'click', function(){
						  mapCenter = connectLineCap.getPosition();
  						if(mapSettings.zoom == 21){
  						  mapSettings.zoom = 4
              } else {
                mapSettings.zoom = 21;
                
              }
              map.setZoom(mapSettings.zoom);
              map.setCenter(mapCenter);
          });
					markers.push(connectLineCap);
					var lineCoordinates = [latlng,new google.maps.LatLng(0,endPoint)],
					infowindow =  new google.maps.InfoWindow({ content: '' });
					var connectLine = new google.maps.Polyline({
						  path          : lineCoordinates,
						  strokeOpacity : 0,
						  strokeColor   : "#fff",
						  zIndex        : 2,
						  map : map,
						  icons         : [{
							  icon   : lineSymbol,
							  offset : '0',
							  repeat : '10px'
						    }]
					});
			}
			
      if(typeof(user["field_location"]["latitude"]) !== "undefined" || typeof(user["field_location"]["longitude"]) !== "undefined"){
        var latlng = new google.maps.LatLng(user["location"]["latitude"],user["location"]["longitude"]);
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
	
	return self;
}
window.onload = function(){
	var $ = jQuery.noConflict();
	if(typeof(user_data)=="undefined"){
  	console.log("Did not get user data!");
  	return false;
	}
	var user_list = new UserList($, user_data);  
  //fetch users
  if(user_list.itemsPerPage > $(".person").length){
    
    var itemsToFetch = ( user_list.itemsPerPage - $(".person").length );
  	if($(".logged-in").length){
  	
  	  itemsToFetch = itemsToFetch / 2;
  	  
  	  if( totalRows.uids_less > itemsToFetch ){
  	    var prevToFetch = itemsToFetch;
  	    var rem = 0;
  	  } else {
    	  var prevToFetch = itemsToFetch  - ( itemsToFetch + parseInt(totalRows.uids_less) );
    	  var rem = itemsToFetch - totalRows.uids_less;
  	  }
  	  if(totalRows.uids_greater < ( itemsToFetch ) + rem){
    	  var nextToFetch = itemsToFetch- ( itemsToFetch + totalRows.uids_greater );
    	  var rem = itemsToFetch - totalRows.uids_greater;
  	  } else {
    	  var nextToFetch = itemsToFetch + rem;
    	  var rem = 0;
  	  }
  	  if(prevToFetch){
  	    user_list.fetchPrevUsers(prevToFetch,user_list.pageNum);
  	  }
  	  if(nextToFetch){
  	    user_list.fetchNextUsers(nextToFetch,user_list.pageNum);
  	  }
  	} else {
    	user_list.fetchNextUsers(itemsToFetch, user_list.pageNum);
  	}
	}
}

