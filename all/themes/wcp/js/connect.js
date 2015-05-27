(function($){

  // Variables
  var vars = {};
  
  if($(".field-type-color-field-rgb input").length){
    $(".field-type-color-field-rgb input").each(function(i){
      var self = this,
      index = i;
      $self = $(this);
      $self.before("<div class='colorpicker-placeholder'></div>");
      var picker = $self.colorpicker().on("changeColor.colorpicker", function(event){
        var color = event.color.toHex();
        $(".colorpicker-placeholder").eq(i).css({"background-color":color});
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
  }
  $(".js__login-register__toggle").on("click", function(){
      toggleModal();
  });

  
  Drupal.behaviors.wcp = {
  attach: function (context, settings) {
    function initPage(){
      setVariables();
      setPositions();
    }
    function setVariables(){
      vars.footerHeight  = $(".footer").height();
      vars.winHeight     = $(window).height(),
      vars.winWidth      = $(window).width();
      vars.contentHeight = $('.content-wrapper').height();
    }
    function setPositions(){
      $(".push, .footer").css({ height : vars.footerHeight });
      $(".content-wrapper, .not-front .wrapper").css({marginBottom: - vars.footerHeight });
     // $(".front-map").height(vars.contentHeight - vars.footerHeight);
      //$(".region-content").css({minHeight: $(".content-wrapper").height() - $(".front-map").height()});
    }
    $(window, context).resize(function(){
      initPage();
    });
    
    $(window, context).on('load', function(){
      initPage();
    })
  }
};
  
})(jQuery);