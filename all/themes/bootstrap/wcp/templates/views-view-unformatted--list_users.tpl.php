<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>
<?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
<?php 
endif;
foreach ($rows as $id => $row): 
?>
  <div<?php if ($classes_array[$id]) { print ' class="' . $classes_array[$id] .'"';  } ?>>
    <div class="fields"><?php print $row; ?></div>
    <div class="body"><img src="<?=path_to_theme()?>/images/people/man/man.svg" class="person man" width="222.391px" height="240.886px"  />
    </div>
  </div>
<?php endforeach; ?>