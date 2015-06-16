<?php
if(!$user){ die('no user'); }

$skin_tone   = count($user->field_skin_tone) ? $user->field_skin_tone[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
$pants_color = count($user->field_pants_color) ?  $user->field_pants_color[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
$hair_color  = count($user->field_hair_color) ? $user->field_hair_color[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
$shirt_color = count($user->field_shirt_color) ? $user->field_shirt_color[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
$shoe_color  = count($user->field_shoe_color) ? $user->field_shoe_color[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
?>
<svg version="1.1" id="man" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="607.321px" height="603.316px" viewBox="0 0 609.643 635.633" enable-background="new 0 0 609.643 635.633" xml:space="preserve">
<g id="field_skin_tone">
	<rect x="255.321" y="42.316" fill="<?=$skin_tone?>" width="92" height="103"/>
	<rect y="144.316" fill="<?=$skin_tone?>" width="607.321" height="26"/>
	<rect x="32.321" y="137.316" fill="<?=$skin_tone?>" width="14" height="11"/>
	<rect x="564.321" y="137.316" fill="<?=$skin_tone?>" width="14" height="11"/>
</g>
<polygon id="field_pants_color" fill="<?=$pants_color?>" points="233.407,354.916 233.407,635.633 301.029,635.633 301.029,425.391 
	311.28,425.391 311.28,635.633 372.134,635.633 372.134,355.105 "/>
<g id="field_shoe_color">
	<polygon fill="<?=$shoe_color ?>" points="387.278,610.834 311.185,610.834 311.185,635.633 387.321,635.633 	"/>
	<polygon fill="<?=$shoe_color ?>" points="300.278,610.834 220.185,610.834 220.185,635.633 300.321,635.633 	"/>
</g>
<rect id="field_hair_color" x="254.321" y="32.316" fill="<?=$hair_color ?>" width="94" height="35"/>
<polygon id="field_shirt_color" fill="<?=$shirt_color?>" points="440.842,144.316 164.842,144.316 164.842,183.316 233.801,183.316 
	233.801,365.691 371.884,365.691 371.884,183.316 440.842,183.316 "/>
</svg>