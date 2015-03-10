<?php

  $user = json_decode(urldecode($_GET["user"]));
  

/*

echo "<pre>";
print_r($user);
echo "</pre>";
*/

 
header('Content-type: image/svg+xml');

?>
<!-- Generator: Adobe Illustrator 16.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="man" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="607.321px" height="603.316px" viewBox="0 32.316 607.321 603.316" enable-background="new 0 32.316 607.321 603.316"
	 xml:space="preserve">
<g id="field_skin_tone">
	<rect x="255.321" y="42.316" fill="<?=$user->field_skin_tone->und[0]->rgb?>" width="92" height="103"/>
	<rect y="144.316" fill="<?=$user->field_skin_tone->und[0]->rgb?>" width="607.321" height="26"/>
	<rect x="32.321" y="137.316" fill="<?=$user->field_skin_tone->und[0]->rgb?>" width="14" height="11"/>
	<rect x="564.321" y="137.316" fill="<?=$user->field_skin_tone->und[0]->rgb?>" width="14" height="11"/>
</g>
<polygon id="field_pants_color" fill="<?=$user->field_pants_color->und[0]->rgb?>" points="233.407,354.916 233.407,635.633 301.029,635.633 301.029,425.391 
	311.28,425.391 311.28,635.633 372.134,635.633 372.134,355.105 "/>
<g id="field_shoe_color">
	<polygon points="387.278,610.834 311.185,610.834 311.185,635.633 387.321,635.633 	"/>
	<polygon points="300.278,610.834 220.185,610.834 220.185,635.633 300.321,635.633 	"/>
</g>
<rect id="field_hair_color" x="254.321" y="32.316" fill="<?=$user->field_hair_color->und[0]->rgb?>" width="94" height="35"/>
<polygon id="field_shirt_color" fill="<?=$user->field_hair_color->und[0]->rgb?>" points="440.842,144.316 164.842,144.316 164.842,183.316 233.801,183.316 
	233.801,365.691 371.884,365.691 371.884,183.316 440.842,183.316 "/>
</svg>
