
/**
  * Helper function to delay firing resize events until the user actually
  * stops resizing their browser.
  */
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

var UserList = function(){
  
	/* properties */
	self = this;
	self.footerHeight = 0;
  
  /* vars */
  var map,
	classes = {
		list:".view-list-users",
		inner:".view-inner",
		node:".person",
	},
	$,
	markers = [],
	centerMarker = false,
	line = false,
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
  scrollPane,
	requests = {},
	mapCenter,
  origSettings,
  width,
  personWidth;
  
/* functions */
	
	function adjustScreen(){
		var h2 = $("window").height();
		$(".main-container").height(h2 - self.footerHeight);
		width = $(window).width();
	}
	
	function initMap(){
		/* 365,222 feet in 1 degree of latitude */
		// Set initial styles
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
    // Set the center to 0,0
    mapSettings.center = new google.maps.LatLng(0,0);
    map = new google.maps.Map(document.getElementById("map"), mapSettings);
		defaultZoom = map.getZoom();
		google.maps.event.addListenerOnce(map, 'idle', function(){
		  $('.map-loader').fadeOut(500);
		  self.fillUsers();
		  initUserNodes(user_data);
		  self.callback(self);
		});
		map.addListener("zoom_changed",function(){
		  changeIcons();		
		});
		//map.addListener("drag",hideOverlays);
		markers=[],
		c = 0;
		map.hideFeatures = function(){
  		map.setOptions({ styles : mapSettings.styles });
		} 
		map.showFeatures = function(){
		  
      map.setOptions({ styles : [
        {
          "featureType": "landscape.man_made",
          "stylers": [
            { "visibility": "on" }
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
            { "visibility": "on" }
          ]
        }]
    	}); 
  	}
	}
  
  function logged_in(){
    return $(".current-user").length;
  }
  	
	function initSlick(){
	  if(!scrollPane){
  	  slickSettings.initialSlide = logged_in() ? $(".current-user").index(".views-row") : 1;
  		  slickSettings.slidesToShow = self.slidesToShow;
        if(totalRows.uids_greater - $(classes.node).length <= 0){
          $(".view-next").addClass("disabled");
        }
        
        if(totalRows.uids_less <= $(classes.node).length || !logged_in()){
          $(".view-prev").addClass("disabled");
        }
    		scrollPane = $(classes.list).find(".view-content").slick(slickSettings);
    		scrollPane.on('afterChange', function(slick, currentSlide){
    		  var curSlide = scrollPane.slick("slickCurrentSlide");
      		if(scrollPane.slick("slickCurrentSlide") + 1 == $(classes.node).length){
        		//ajax
        		if(!requests.fetchNextUsers && !requests.fetchPrevUsers){
          		self.fetchNextUsers(self.slidesToShow);
        		}
      		}
    		});
        
        // On initialization
        scrollPane.on('reInit', function(slick){
          // Add the ground layer
          $('.slick-ground').remove();
          $('.slick-track').append('<div class="slick-ground" />');
          $('.slick-ground').width($('.slick-track').width() + $(window).width() * 2);
        });

    }
	}
	
	function changeIcons(){
	// when zoomed in, this changes the icons of the markers on the maps, depending
	// on zoom level.  It's just a neat little feature.
	  	
  	var curZoom = map.getZoom();
  	
  	// Show features if zoom is past a certain amount
  	if(curZoom > 12){
      map.showFeatures();
  	} else {
      map.hideFeatures();
    }
    
  	if(curZoom == 21){
    	//change the icons
    	for(i=0;i<markers.length;i++){
    	  markers[i].setIcon(theme_dir+"/images/marker_person_1.png");
      }
      
  	} else if(curZoom < 21){
  	
  	  for(i=0;i < markers.length;i++){
  	  console.log(self.user_data[i]);
      	markers[i].setIcon(self.user_data[markers[i].index].icon);
      }
  	}
	}
	
	function drawUserLine(accounts){
    
		self.line = { 
		  startPoint  : 0,
		  endPoint    : 0,
		  line : false,
    }
    
    var armSpan  = 5.5, //in feet,
		armSpanMiles = armSpan/365222,
		amount = 0;
		
		if(!$("#map").length || typeof(google) == "undefined"){ 
		  console.log("Something went wrong"); 
		  return false;
		}
		
		if(logged_in()){
		  amount = totalRows["uids_less"] + totalRows["uids_greater"] + totalRows["logged_in"];
		} else {
		  amount = totalRows["list_users"]
		}
		for(var i=0;i<amount;i++){
			self.line.endPoint += armSpanMiles;
		}
		
		self.line.startLatLng = new google.maps.LatLng(0, self.line.startPoint);
		self.line.endLatLng = new google.maps.LatLng(0, self.line.endPoint);
    
    self.line.options =  {
      zIndex        : 2,
      geodesic      : true,
      lineLength    : self.line.endPoint,
      path          : [self.line.startLatLng, self.line.endLatLng],
      strokeColor   : "#ff0000",
      map           : map,
      strokeWeight  : 1,
      strokeOpacity : 1
    };
    
		if(self.line.line){
		  self.line.line.setMap(null);
		}
		// Draw the line
		self.line.line = new google.maps.Polyline(self.line.options);
    
    // Set the center to the beginning of the line, as to also center the
    // marker on the screen
    map.setCenter(self.line.startLatLng);
    
    //add a marker there
    //remove center marker if it exists (since this may be a new line)
    if(centerMarker){
      centerMarker.setMap(null);
    }
    centerMarker = new google.maps.Marker({ 
      position : self.line.startLatLng, 
      map      : map, 
      cursor   :'pointer', 
      icon : theme_dir+"/images/start_arrow.png"
    });
    var zoomLine = function(){
      // If the user has clicked the line to get to the startpoint, 
      // fit the bounds to the start and endpoint of the line
      // unless they are within 2 zoom levels of the startpoint
      if(map.getCenter() == self.line.startLatLng || map.getZoom() <= parseInt(self.lineZoom) - 2 && map.getZoom() >= parseInt(self.lineZoom) + 2){
        if(map.getCenter() == self.line.startLatLng) {
          // If the zoom is set to the linezoom, set the zoom to 4,
          // the default zoom
          // else, fit the map within the start and endpoint of the line
          var bounds = new google.maps.LatLngBounds(self.line.startLatLng, self.line.endLatLng);
          map.fitBounds(bounds);
          if(!self.lineZoom){
            self.lineZoom = map.getZoom();
          }
    		} else {
    		  map.setZoom(4);
    		}	
  		} else {
    	  self.panToStart();
      }
    }
    // Make the marker zoom/center on click
    google.maps.event.addListener(centerMarker, 'click', zoomLine);
		
		// Also make the line do that
		google.maps.event.addListener(self.line, 'click', zoomLine);
		
		// Draw dotted lines from the main line to every user on the page's lat/lng
		endPoint = 0;
		for(var i in accounts){
			var user = accounts[i];	
			user.index = i;
      user.drawConnectingLine = function(latlng){
  			//draw connecting line
  			  var user = this;
					var lon = latlng.lng();
					var lineSymbol = {
					  path: 'M 0,-1 0,1',
					  strokeOpacity: 1,
					  strokeWeight:1,
					  scale: 3
					};
					//  
					var idx = $(".person[rel='"+user.uid+"']").parents(".views-row").find(".views-field-counter .field-content").html();
					
					// Create a clickable 'cap' at the end of each user's line
					user.icon = theme_dir+"/images/dot_"+Math.ceil(Math.random()*4)+".png";
					user.connectLineCap = new google.maps.Marker({
					  position : latlng,
					  map      : map,
					  icon     : user.icon
				  });
				  // Make the cap zoom into the user on click
					google.maps.event.addListener(user.connectLineCap, 'click', function(){
					  
					  // Center the map on the user
					  mapCenter = user.connectLineCap.getPosition();
					  map.setCenter(mapCenter);
					  
					  // Zoom into the user
					  // If the zoom is maxed, zoom back to the default (4)
						if(mapSettings.zoom == 21){
						  map.setZoom(4);
            } else {
              mapSettings.zoom = 21;
              map.setZoom(21);
            }
        });
        user.connectLineCap.index = user.index; 
				markers.push(user.connectLineCap);
				var lineCoordinates = [latlng , new google.maps.LatLng(0, armSpanMiles * idx)],
				infowindow =  new google.maps.InfoWindow({ content: '' });
				user.connectLine = new google.maps.Polyline({
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
				google.maps.event.addListener(user.connectLine, 'click', function(){
				  if(map.getZoom() < 13){ 
				    map.panTo(latlng);
				    map.setCenter(latlng);
				  }
				});
				
				return user;
			}
      if(typeof(user.field_location.und) == 'object'){

       var latlng = new google.maps.LatLng(user.field_location.und[0].lat, user.field_location.und[0].lng);
       
       if(typeof(user.connectLine) == "undefined"){
         user.drawConnectingLine(latlng);
       }  
      }
     if(i == accounts.length - 1){
      return accounts;
     }
		} /* for i in accounts */
	}
	 
	function initUserNodes(accounts){
	  // If data is not supplied, fail
		if(!accounts){
  		return false;
		}
		
		adjustScreen();
		self.setPositions();

		// Remove the initial dummy row used for measuring width
    if($(".initial").length){
      $(".initial").remove();
    }
    
    // Draw the line on the map connecting the users
    if (drawUserLine(accounts)) {
      return accounts;
    }
		
		//create an options object
		//create line from origin to center of equator line (ie connection)	
	} /* initUserNodes */
	
	function getOffset(numItems){
	  return $(classes.node).length;
	}
  
  /* methods */
  
  self.setVariables = function(){
	
	  width              = $(window).width()
    personWidth        = $(".person").width();
    personWidth        = $(".person").width();
    self.slidesToShow  = Math.floor(width/personWidth);
    self.contentHeight = $(".content-wrapper").height();
    self.footerHeight  = $(".footer__top").height() + $(".footer__bottom").height();
    self.lineZoom      = false;
    self.line          = {};
    
  }
	
	self.setPositions = function(){
		var w = parseInt($(classes.list).find(classes.node).outerWidth());
		var n = $(classes.list).find(classes.node).length;
		
		self.setVariables();
		
		//set height of view-next and view-prev
		$(".view-next, .view-prev").css("height",$(classes.node).height());
		
    // Initialize the slick carousel
		initSlick();
		
		$(".front-map").height(self.contentHeight - self.footerHeight);
	}

  
  self.init = function(user_data, callback){
    self.callback = callback || function(){};
    self.user_data = user_data;
    $ = jQuery.noConflict();
    self.setVariables();
    self.setPositions();
    initMap();

    /* Init Listeners */
      
    $('.view-next').on('click', function(){
      if(!$(this).hasClass("disabled")){
        self.fetchNextUsers(self.slidesToShow);
      }
    });
    
    $('.view-prev').on('click', function(){
      if(!$(this).hasClass("disabled")){
        self.fetchPrevUsers(self.slidesToShow);
      }
    });
    
    $('.views-row').on('mouseover', function(){
      $('.current-user .person').removeClass('active');
    });
    
    $('.views-row').on('mouseout', function(){
      $('.current-user .person').addClass('active');
    });
    
    $(window).resize(function(){
       waitForFinalEvent(function () {
          self.setVariables();
          self.fillUsers();
      		//show items depending on screen width
      		slickSettings.slidesToShow = self.slidesToShow;
          scrollPane.slick('slickSetOption', 'slidesToShow', slickSettings.slidesToShow, true);
          
       }, 200, "global");
    });
  }
  
  self.panToStart = function(){
    map.panTo(self.line.startLatLng);
		map.setCenter(self.line.startLatLng);
  }
  
  // Called immediately after an svg loads, embedded
  // in the <img /> tag
  self.showUser = function(user){
    var par = user.parentNode.parentNode;
    par.setAttribute('class', par.className + " visible");
  }
  
  self.fillUsers = function(){
    // Fills the screen with user nodes as to not have any blank space
    if(self.slidesToShow > $(classes.node).length){
        var itemsToFetch = ( self.slidesToShow - $(".person").length );
      	if($(".logged-in").length){
      	  
      	  itemsToFetch = Math.round(itemsToFetch / 2);
      	  var nextToFetch = itemsToFetch;
      	  var prevToFetch = itemsToFetch;
      	  
      	  totalRows.uids_greater = parseInt(totalRows.uids_greater);
      	  totalRows.uids_less = parseInt(totalRows.uids_less);
      	  var rem = {};
      	  
      	  if( totalRows.uids_less < itemsToFetch ){
        	  prevToFetch = itemsToFetch  - ( itemsToFetch + totalRows.uids_less );
        	  rem.prev = itemsToFetch - totalRows.uids_less;
      	  }
      	  if(totalRows.uids_greater < itemsToFetch){
        	  nextToFetch = itemsToFetch - ( itemsToFetch + totalRows.uids_greater );
        	  rem.next = itemsToFetch - totalRows.uids_greater;
      	  }
      	  
      	  if(rem.next){
        	  prevToFetch = itemsToFetch + rem.next;
      	  }
      	  if(rem.prev){
        	  nextToFetch = itemsToFetch + rem.prev;
      	  }
      	  
      	  if(prevToFetch){
      	    self.fetchPrevUsers(prevToFetch);
      	  }
      	  if(nextToFetch){
      	    self.fetchNextUsers(nextToFetch);
      	  }
      	} else {
        	self.fetchNextUsers(itemsToFetch);
      	}
      }
  }
  
  self.fetchNextUsers = function(numItems){
    if(requests.fetchNextUsers){ requests.fetchNextUsers = false; }
      var offset = getOffset();
      var delay = 100;   
      //create dummy rows to indicate the ajax call has started
      for(var i = 0; i < numItems; i++){
          scrollPane.slick('slickAdd','<div class="views-row"><div class="person new"><img src="sites/all/themes/wcp/images/loader.svg" class="person__loader"></div></div>', $(classes.node).length);
      }
        
      setTimeout(function(){
        requests.fetchNextUsers = $.get('/ajax/nextusers/' + numItems + '/' + offset, function(result){
          if(result.accounts.length) {
            var accounts = result.accounts;
            if(self.user_data){
              //merge old user_data with this one
              self.user_data = self.user_data.concat(self.accounts);
            } else {
              self.user_data = accounts;
            }
            var initial = $(".person.initial").length ? 1 : $(".person.new:first").closest(".slick-slide").attr("data-slick-index");
            //if accounts length isn't numItems per page, disable show more
            if(accounts.length < numItems){
              $(".view-next").addClass("disabled");
              //remove excess rows
              for(var i=0;i < numItems - accounts.length; i++){
                scrollPane.slick('slickRemove', $(classes.node).length - 1); 
              }
            }
            
            var count = 0;
            for(var i = initial; count < accounts.length ; i++){ //-1 to account for view-next button
              account = accounts[count];
              var slide = $('.slick-slide[data-slick-index='+i+']');
              slide.empty().append(account.html).find(".person").removeClass("new");
              count++;
            }
            
            $(".view-next").css("margin-left","").removeClass("faded");
            initUserNodes(self.user_data);
          }
        }, 'json');
    }, numItems * delay);
  
    return false;
  
  }

  self.fetchPrevUsers = function(numItems){
    if(requests.fetchPrevUsers){ requests.fetchPrevUsers = false; }
      
      //get offset before adding more rows
      var offset = getOffset();
      var delay = 100;
      $(".view-prev").addClass("faded");

      //create dummy rows to indicate the ajax call has started
      for(var i = 0; i < numItems; i++){
        scrollPane.slick('slickAdd','<div class="views-row person"><img src="sites/all/themes/wcp/images/loader.svg" class="person__loader"></div>', 1);
      }
      setTimeout(function(){     
        requests.fetchPrevUsers = $.get('/ajax/prevusers/' + numItems + '/' + offset, function(result){
          if(result.accounts.length){
            var accounts = result.accounts;    
            //merge old user_data with this one
            if(self.user_data){
              //merge old user_data with this one
              self.user_data = accounts.concat(self.user_data);
            } else {
              self.user_data = accounts;
            }
            
            var count = 0;
            for(var i = 0; count < accounts.length ; i++){ //-1 to account for view-next button
              account = accounts[count];
              $('.views-row[data-slick-index='+i+']').empty().append(account.html).find(".person");
              count++;
            }
            $(".view-next").css("margin-left","").removeClass("faded");
            initUserNodes(self.user_data);
          }
        }, 'json');
      },numItems * delay);
      
      return false;
  
  }

  
  self.goToUser = function($user){
    if($user.length && scrollPane){
	    setTimeout(function(){
  	    scrollPane.slick("slickGoTo", $user.attr("data-slick-index"));         
  	   },300);
  	}
  	return false;
	}
  self.goToCurrentUser = function(){
	  $user = $(".current-user");
	  if($user.length){
	    self.goToUser($user);
	    $user.find('.person').addClass('active');
	  } 
	}
	
	return self;
}

var user_list = new UserList();

window.onload = function(){
	var $ = jQuery.noConflict();
	if(typeof(user_data)=="undefined"){
  	console.log("Did not get user data!");
  	return false;
	}
	user_list.init(user_data, function(){
    //fetch users
    user_list.setPositions();
    user_list.goToCurrentUser();
	});
}

