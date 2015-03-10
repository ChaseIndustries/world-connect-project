(function($){
  if($(".field-type-color-field-rgb input").length){
    $(".field-type-color-field-rgb input").colorpicker();
    $(".field-type-color-field-rgb input").on("keypress", function(e){
      e.preventDefault()
      return false;
    });
  }
})(jQuery);