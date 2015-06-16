<?php

if(!$user){ die('no user'); }

$skin_tone = count($user->field_skin_tone) ? $user->field_skin_tone[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
$hair_color = count($user->field_hair_color) ? $user->field_hair_color[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
$shirt_color = count($user->field_shirt_color) ? $user->field_shirt_color[LANGUAGE_NONE][0]["rgb"] : '#95E2E5';
?>
<svg version="1.1" id="woman" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
	 y="0px" width="609.643px" height="635.633px" viewBox="0 0 609.643 635.633" enable-background="new 0 0 609.643 635.633"
	 xml:space="preserve">
<g id="woman">
	<polygon fill="<?php print $hair_color ?>" points="348.321,143.997 348.321,33.316 254.321,33.316 254.321,144.316 254.346,144.316 254.346,165.613 
		276.938,147.296 276.835,144.316 326.004,144.316 325.901,147.296 348.493,165.613 348.493,143.999 	"/>
	<g id="skin">
		<polygon fill="<?php print $skin_tone ?>" points="267.321,67.316 335.321,67.316 325.833,145.316 276.809,145.316 		"/>
		<rect y="144.316" fill="<?php print $skin_tone ?>" width="607.321" height="19"/>
		<rect x="34.946" y="137.316" fill="<?php print $skin_tone ?>" width="8.75" height="11"/>
		<rect x="566.946" y="137.316" fill="<?php print $skin_tone ?>" width="8.75" height="11"/>
		<polygon id="field_pants_color" fill="<?php print $skin_tone ?>" points="254.103,353.623 266.292,634.34 301.969,634.34 301.969,424.098 309.226,424.098 
			309.226,634.34 345.622,634.34 352.302,353.812"/>
	</g>
	<polygon fill="<?php print $shirt_color ?>" points="419.842,144.316 192.842,144.316 192.842,183.316 245.598,183.316 259.763,270.747 
		214.572,445.607 391.113,445.607 348.427,270.316 360.086,183.316 419.842,183.316" />
	<g id="shoes">
		<polygon points="375.644,621.613 308.001,621.613 308.001,635.633 375.68,635.633" />
		<polygon points="303.352,621.613 229.239,621.613 229.239,635.633 303.39,635.633" />
	</g>
</g>
</svg>