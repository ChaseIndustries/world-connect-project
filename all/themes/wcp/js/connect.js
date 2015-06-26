var people = {};

function loadSvg(svg) {
  var svgObj = svg.contentDocument;
  people[svg.id] = svgObj;
}

(function($){

  // Variables
  var vars = {};

  
  Drupal.behaviors.wcp = {
  
  attach: function (context, settings) {
  

  
  if($(".field-type-color-field-rgb input").length){
    $(".field-type-color-field-rgb input").each(function(i){
      var self = this,
      index = i;
      $self = $(this);
      $self.before("<div class='colorpicker-placeholder'></div>");
      var picker = $self.colorpicker().on("changeColor.colorpicker", function(event){
        var color = event.color.toHex();
        $(".colorpicker-placeholder").eq(i).css({"background-color":color});
        var svgObj = people[$('.person-form.visible').attr('id')];
        fillPerson(svgObj);
      });
      $self.on("keypress", function(e){
        e.preventDefault()
        return false;
      });
      
      $self.siblings(".colorpicker-placeholder").on('click',function(){
        $(this).siblings(".colorpicker-element").trigger('focus');
      });

    })

    var modalPane = false;
  }
  
  
  
  if($(".modal .error").length){
    toggleModal();
  }
  
  function toggleModal(){
    $(".login-register").toggleClass("visible");
      $("body").toggleClass("freeze");
      if(!modalPane){ 
        //modalPane = $(".login-register.modal .modal__inner").jScrollPane({autoReinitialise:true, autoReinitialiseDelay:200});
      }
      setTimeout(function(){
        $(".login-register").toggleClass("fade");
      },1);
      
      //set the url to #join-the-chain
      window.location.href = '#join-the-chain';
  }
  $(".js__login-register__toggle").on("click", function(){
      toggleModal();
  });
  
  
    function initPage(){
      setVariables();
      setPositions();
    }
    function setVariables(){
      vars.footerHeight  = $(".footer__top").height() + $(".footer__bottom").height();
      vars.winHeight     = $(window).height(),
      vars.winWidth      = $(window).width();
      vars.contentHeight = $('.content-wrapper').height();
    }
    function setPositions(){
      $(".footer, .push, .front-map").css({'height' : '', 'margin-bottom' : ''});
      $(".push, .footer").css({ height : vars.footerHeight });
      $(".content-wrapper, .not-front .wrapper").css({marginBottom: -vars.footerHeight });
      $(".front-map").height(vars.contentHeight - vars.footerHeight);
      //$(".region-content").css({minHeight: $(".content-wrapper").height() - $(".front-map").height()});
    }
    
    
          
      function fillPlaceholders() {
        skin  = $('#edit-field-skin-tone-und-0-rgb').val(),
        shirt = $('#edit-field-shirt-color-und-0-rgb').val(),
        pants = $('#edit-field-pants-color-und-0-rgb').val(),
        shoes = $('#edit-field-shoe-color-und-0-rgb').val();
        
        $('.form-item-field-skin-tone-und-0-rgb').find('.colorpicker-placeholder').css({ 
          'background-color' : skin
        });
        $('.form-item-field-shirt-color-und-0-rgb').find('.colorpicker-placeholder').css({ 
          'background-color' : shirt
        })
        $('.form-item-field-pants-color-und-0-rgb').find('.colorpicker-placeholder').css({ 
          'background-color' : pants
        })
        $('.form-item-field-shoe-color-und-0-rgb').find('.colorpicker-placeholder').css({ 
          'background-color' : shoes
        });
      }
      
      function fillPerson(svgObj) {
        svgObj = $(svgObj.documentElement);
        
        skin  = $('#edit-field-skin-tone-und-0-rgb').val(),
        shirt = $('#edit-field-shirt-color-und-0-rgb').val(),
        pants = $('#edit-field-pants-color-und-0-rgb').val(),
        shoes = $('#edit-field-shoe-color-und-0-rgb').val();
        
        svgObj.find('#skin *').attr('fill', skin);
        svgObj.find('#shirt *').attr('fill', shirt);
        svgObj.find('#pants *').attr('fill', pants);
        svgObj.find('#shoes *').attr('fill', shoes);
      }
    
    $(window, context).resize(function() {
      initPage();
    });
    
    $(window, context).on('load', function() {
      initPage();
      window.onhashchange();
      fillPlaceholders();
      //Êon load show the peopel in the register form depending on what is filled out
      if ($('#edit-field-gender-und-male').prop('checked')) {
        $('.login-register.modal .person-form.male').addClass('visible');
      } else {
        $('.login-register.modal .person-form.female').addClass('visible');
      }
      
      $('#edit-field-gender-und-male').change(function() {        
        var el = $('.login-register.modal .person-form.male');
        el.addClass('visible');
        $('.login-register.modal .person-form.female').removeClass('visible'); 
        $('.form-item-field-pants-color-und-0-rgb').show();
        var svgObj = people[el.attr('id')];
        if(svgObj) {
          fillPerson(svgObj);
        }
      });
    
      $('#edit-field-gender-und-female').change(function() {
        var el = $('.login-register.modal .person-form.female');
        el.addClass('visible');
        $('.form-item-field-pants-color-und-0-rgb').hide();
        $('.login-register.modal .person-form.male').removeClass('visible'); 
        
        var svgObj = people[el.attr('id')];
        if(svgObj) {
          fillPerson(svgObj);
        }
      });
      
      var svgObj = people[$('.person-form.visible').attr('id')];
      if(svgObj) {
        fillPerson(svgObj);
      }
      
    });
    
    // listeners for the register form
    
    window.onhashchange  = function() {
      var hash = window.location.hash;
      switch(hash) {
        case '#join-the-chain':
          toggleModal();
        break;
      }
    }
  }
};
  
})(jQuery);