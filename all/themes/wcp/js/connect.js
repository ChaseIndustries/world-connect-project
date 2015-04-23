(function($){
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

    
    
  }
  $(".js__login-register__toggle").on("click", function(){
      $(".login-register").toggleClass("visible");
      setTimeout(function(){
        $(".login-register").toggleClass("fade");
      },1);
  });
  
})(jQuery);